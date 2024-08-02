import { stat } from 'node:fs/promises'

import { db } from "./db";
import { medias } from "./db/schema";
import { deleteMany, insertMany, updateMany } from './db/seq';
import { env } from "./env";
import { logger } from './middlewares/log';
import type { CreateMediaModel } from "./models";
import { createCalculateRunTimeHelper } from './performance';
import { generateRandomUUID } from './utils';
import { scanDirectory } from "./workers/scanner";

/**
 * 1. 扫描所有媒体目录，找到所有的媒体文件
 * 2. 数据库中查询所有的媒体文件
 * 3. 2份数据对比，对于不存在的媒体文件，插入数据库，对于已移除的媒体文件，从数据库中删除
 * 4. 后台任务计算存在的媒体文件是否发生变更，如果发生变更，更新数据库
 */
export async function setup() {
  const currentMedias: CreateMediaModel[] = []
  const finishScan = createCalculateRunTimeHelper(time => {
    logger.info('媒体目录扫描完成，耗时: %sms', time)
  })
  for (const dir of env.MEDIA_SCAN_PATHS) {
    currentMedias.push(...await scanDirectory(dir))
  }
  finishScan()

  const finishQuery = createCalculateRunTimeHelper(time => {
    logger.info('数据库查询完成，耗时: %sms', time)
  })
  
  const dbMedias = await db.select().from(medias)
  finishQuery()
  logger.info('数据库中共有 %d 个媒体文件，当前目录中共 %d 个媒体文件', dbMedias.length, currentMedias.length)

  const finishDiff = createCalculateRunTimeHelper(time => {
    logger.info('媒体数据对比完成，耗时: %sms', time)
  })
  // 大数组对比，需要考虑性能问题
  const dbMediaMap = new Map(dbMedias.map(m => [m.path, m]))
  const insertMedias: CreateMediaModel[] = []
  const updateMedias: CreateMediaModel[] = []
  for (const media of currentMedias) {
    // 数据库中不存在
    if (!dbMediaMap.has(media.path)) {
      const stats = await stat(media.path)
      insertMedias.push({ ...media, id: generateRandomUUID(), createdAt: stats.ctime.toISOString(), updatedAt: stats.mtime.toISOString(), fileSize: stats.size })
    } else {
      // 数据库中已存在
      // 创建时间、更新时间是否相同
      const dbMedia = dbMediaMap.get(media.path) as CreateMediaModel
      const stats = await stat(media.path)
      if (!dbMedia.updatedAt || +stats.mtime !== +new Date(dbMedia.updatedAt)) {
        updateMedias.push({...media, createdAt: stats.ctime.toISOString(), updatedAt: stats.mtime.toISOString(), fileSize: stats.size })
      }
      dbMediaMap.delete(media.path)
    }
  }
  // 剩余的db里的就是已经不存在的，需要删除
  const deleteMedias = Array.from(dbMediaMap.keys())
  finishDiff()

  const finishDBSync = createCalculateRunTimeHelper(time => {
    logger.info('数据库同步完成，耗时: %sms', time)
  })
  if (deleteMedias.length) {
    logger.info('开始删除 %d 个媒体文件', deleteMedias.length)
    await deleteMany(medias, 'path', deleteMedias)
  }
  if (insertMedias.length) {
    logger.info('开始插入 %d 个媒体文件', insertMedias.length)
    await insertMany(medias, insertMedias)
  }
  if (updateMedias.length) {
    logger.info('开始更新 %d 个媒体文件', updateMedias.length)
    await updateMany(medias, 'path', updateMedias.map(m => ({ key: m.path, data: m })))
  }
  finishDBSync()
}