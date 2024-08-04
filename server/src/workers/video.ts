import { basename, dirname } from "node:path";
import { logger } from "@/middlewares/log";
import type { CreateMediaModel } from "@/models";
import ffmpeg from "fluent-ffmpeg";

export function getVideoThumbnail(
	videoPath: string,
	thumbnailPath: string,
	width: number,
	height: number,
): Promise<string> {
	const thumbnailDir = dirname(thumbnailPath);
	const thumbnailName = basename(thumbnailPath);
	return new Promise((resolve, reject) => {
		ffmpeg(videoPath)
			.on("end", () => {
				resolve(thumbnailPath);
			})
			.on("error", (err) => {
				logger.error("创建缩略图失败: %s", err.message);
				reject(err);
			})
			.takeScreenshots({
				timestamps: [1],
				filename: thumbnailName,
				folder: thumbnailDir,
				size: width > height ? '240x?' : "?x240",
			})
	})
}

export function getVideoMetadata(
	videoPath: string,
): Promise<Partial<CreateMediaModel>> {
	return new Promise((resolve) => {
		ffmpeg.ffprobe(videoPath, (err, metadata) => {
			if (err) {
				resolve({ duration: undefined, width: undefined, height: undefined });
			} else {
				const duration = metadata.format.duration;
				const location = metadata.format.tags?.location as string | undefined;
				let latitude: number | undefined;
				let longitude: number | undefined;
				if (location) {
					const match = location.match(/^\+([\d.]+)\+([\d.]+)\//)
					if (match) {
						latitude = Number.parseFloat(match[1]);
						longitude = Number.parseFloat(match[2]);
					}
				}
				const stream = metadata.streams[0];
				resolve({
					duration,
					width: stream?.width,
					height: stream?.height,
					latitude,
					longitude,
				});
			}
		});
	});
}

