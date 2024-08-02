// 扫描文件夹
import { readdir } from 'node:fs/promises'
import { extname, join } from 'node:path';

import { logger } from '@/middlewares/log';
import type { CreateMediaModel } from '@/models';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tif', '.svg', '.webp', '.ico', '.apng'])
const VIDEO_EXTENSIONS = new Set(['.mp4', '.mov', '.avi', '.mkv', '.flv', '.wmv', '.webm', '.vob', '.m4v'])

export async function scanDirectory(dir: string): Promise<CreateMediaModel[]> {
  const result: CreateMediaModel[] = []
  // 递归扫描所有文件
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        result.push(...await scanDirectory(fullPath))
      } else if (entry.isFile()) {
        const ext = extname(entry.name).toLowerCase();
        const isImage = IMAGE_EXTENSIONS.has(ext);
        const isVideo = VIDEO_EXTENSIONS.has(ext);
        if (isImage || isVideo) {
          result.push({ path: fullPath, mediaType: isImage? 'photo' : 'video' })
        }
      }
    }
  } catch (error) {
    logger.error(`Error scanning directory ${dir}: ${error}`)
  }
  return result
}

