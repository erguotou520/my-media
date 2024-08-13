import { join } from "node:path";
import { env } from "@/env";
import { logger } from "@/middlewares/log";
import type { CreateMediaModel } from "@/models";
import { createCalculateRunTimeHelper } from "@/performance";
import { generateRandomUUID } from "@/utils";
import { getPhotoMetadata, getPhotoThumbnail } from "./photo";
import { getVideoMetadata, getVideoThumbnail } from "./video";
import { thumbnailDir } from "@/utils/path";

export async function getMediaInfo(
	media: Pick<CreateMediaModel, "path" | "mediaType">,
): Promise<Partial<CreateMediaModel>> {
	const finishHash = createCalculateRunTimeHelper((time) => {
		logger.info("文件 %s 计算hash值耗时：%sms", media.path, time);
	});
	const hash = await getFileHash(media.path);
	finishHash();
	const thumbnailPath = join(thumbnailDir, `${generateRandomUUID()}.webp`);
	if (media.mediaType === "video") {
		// 获取视频时长、分辨率等信息
		const finishMetadata = createCalculateRunTimeHelper((time) => {
			logger.info("文件 %s 获取元数据耗时：%sms", media.path, time);
		});
		const { duration, width, height, latitude, longitude, altitude } = await getVideoMetadata(media.path);
		finishMetadata();
		const finishThumbnail = createCalculateRunTimeHelper((time) => {
			logger.info("文件 %s 生成缩略图耗时：%sms", media.path, time);
		});
		// 导出第一帧为缩略图
		await getVideoThumbnail(media.path, thumbnailPath, width || 0, height || 0);
		finishThumbnail();
		return {
			fileHash: hash,
			duration,
			width,
			height,
			thumbnailPath,
			latitude,
			longitude,
			altitude
		};
	}
	// 生成缩略图
	await getPhotoThumbnail(media.path, thumbnailPath);
	const { width, height, latitude, longitude, altitude } = await getPhotoMetadata(media.path);
	return {
		fileHash: hash,
		width,
		height,
		thumbnailPath,
		latitude,
		longitude,
		altitude
	};
}

// 计算文件hash值，对于大文件，可以采用分块计算hash值
async function getFileHash(filePath: string) {
	const file = Bun.file(filePath);
	const hasher = new Bun.CryptoHasher("md5");
	hasher.update(await file.arrayBuffer());
	return hasher.digest("hex");
}
