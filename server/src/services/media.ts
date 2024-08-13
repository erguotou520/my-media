import { join } from 'node:path'
import { scanDirectory, thumbnailDir, thumbnailRoutePrefix } from '@/utils/path'
import { db } from '@/db'
import { medias } from '@/db/schema'
import { inArray } from 'drizzle-orm'

type MediaItem = {
  type: 'file' | 'dir'
  fileName: string
  mediaType?: string
  thumbnailPath?: string | null
}

export async function findMediaByPath(dir: string, path?: string): Promise<MediaItem[]> {
  const _dir = join(dir, path || "")
  const result: MediaItem[] = []
  const thumbnailFiles: string[] = []
  const thumbnailIndexArr: number[] = []
  let index = 0
  await scanDirectory(_dir, {
    onDir(dir) {
      result.push({
        type: 'dir',
        fileName: dir.name,
      })
      index += 1
    },
    onFile(file, filePath, mediaType) {
      thumbnailIndexArr.push(index)
      result.push({
        type: 'file',
        fileName: file.name,
        mediaType,
      })
      thumbnailFiles.push(filePath)
      index += 1
    },
  })
  if (thumbnailFiles.length > 0) {
    const thumbnails = await db.query.medias.findMany({ where: inArray(medias.path, thumbnailFiles)})
    for (const [index, thumbnail] of thumbnails.entries()) {
      result[thumbnailIndexArr[index]].thumbnailPath = thumbnail.thumbnailPath?.replace(thumbnailDir, thumbnailRoutePrefix)
    }
  }
  return result.sort((a, b) => a.fileName.localeCompare(b.fileName))
}