import { join } from "node:path";
import { env } from "@/env";
import type { CreateMediaModel } from "@/models";
import { generateRandomUUID } from "@/utils";
import { getPhotoMetadata, getPhotoThumbnail } from "./photo";
import { getVideoMetadata, getVideoThumbnail } from "./video";

export async function getMediaInfo(
	media: Pick<CreateMediaModel, "path" | "mediaType">,
): Promise<Partial<CreateMediaModel>> {
	const hash = getFileHash(media.path);
	const thumbnailPath = join(env.DATA_PATH, "thumbnails", `${generateRandomUUID()}.jpg`);
	if (media.mediaType === "video") {
		// 导出第一帧为缩略图
		await getVideoThumbnail(media.path, thumbnailPath);
		// 获取视频时长、分辨率等信息
		const { duration, width, height } = await getVideoMetadata(media.path);
		return {
			...media,
			fileHash: hash,
			duration,
			width,
			height,
			thumbnailPath,
		};
  }
	// 生成缩略图
	await getPhotoThumbnail(media.path, thumbnailPath);
	const { width, height } = await getPhotoMetadata(media.path);
	return {
		...media,
		fileHash: hash,
		width,
		height,
		thumbnailPath,
	}
}

// 计算文件hash值，对于大文件，可以采用分块计算hash值
function getFileHash(filePath: string) {
	const file = Bun.file(filePath);
	const hasher = new Bun.CryptoHasher("md5");
	hasher.update(file);
	return hasher.digest("hex");
}
