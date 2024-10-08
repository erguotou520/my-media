import crypto from 'node:crypto'
import { sql } from 'drizzle-orm'
import { index, integer, real, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

function commonColumns() {
  return {
    id: text('id').primaryKey().default(crypto.randomUUID()),
    createdAt: text('created_at').default(sql`(datetime('now', 'localtime'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now', 'localtime'))`)
  }
}

export const users = sqliteTable('users', {
  ...commonColumns(),
  username: text('username').unique().notNull(),
  nickname: text('nickname'),
  avatar: text('avatar'),
  hashedPassword: text('hashed_password').notNull()
})

export const medias = sqliteTable('medias', {
  ...commonColumns(),
  path: text('path').notNull().unique(),
  thumbnailPath: text('thumbnail_path'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  // gps高度
  altitude: real('altitude'),
  // 地址信息是否已读取
  gpsInfoRead: integer('gps_info_read', { mode: 'boolean' }).default(false),
  width: integer('width'),
  height: integer('height'),
  fileSize: integer('file_size'),
  mediaType: text('media_type', { enum: ['photo', 'video'] }),
  // 视频时长，单位ms
  duration: integer('duration'),
  // 文件hash值，用于重复文件校验
  fileHash: text('file_hash'),
  // 上传者id
  userId: text('user_id'),
  // 上传者名称
  userName: text('user_name')
}, (table) => {
  return {
    pathIdx: uniqueIndex("path_idx").on(table.path),
    createAtIndex: index("create_at_idx").on(table.createdAt),
  }
})