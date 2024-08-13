import { env } from "@/env";
import { join } from "node:path";
import { Dirent } from "node:fs";

export const thumbnailDir = join(env.DATA_PATH, 'thumbnails')
export const thumbnailRoutePrefix = '/_thumbnails'

export const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tif', '.svg', '.webp', '.ico', '.apng'])
export const VIDEO_EXTENSIONS = new Set(['.mp4', '.mov', '.avi', '.mkv', '.flv', '.wmv', '.webm', '.vob', '.m4v'])

// 扫描文件夹
import { readdir } from 'node:fs/promises'
import { extname } from 'node:path';
import type { PromiseOr } from "@/types";

export async function scanDirectory(dir: string, {
  onDir, onFile
}: { onDir: (dir: Dirent) => PromiseOr<void>, onFile: (file: Dirent, filePath: string, mediaType: 'photo' | 'video') => PromiseOr<void> }): Promise<void> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      await onDir(entry)
    } else if (entry.isFile()) {
      const ext = extname(entry.name).toLowerCase();
      const isImage = IMAGE_EXTENSIONS.has(ext);
      const isVideo = VIDEO_EXTENSIONS.has(ext);
      if (isImage || isVideo) {
        await onFile(entry, fullPath, isImage? 'photo' : 'video')
      }
    }
  }
}

