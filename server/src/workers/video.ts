import { basename, dirname } from "node:path";
import { logger } from "@/middlewares/log";
import { exiftool } from "exiftool-vendored";
import ffmpeg from "fluent-ffmpeg";

export function getVideoThumbnail(
	videoPath: string,
	thumbnailPath: string,
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
				size: "320x240",
			});
	});
}

export function getVideoMetadata(
	videoPath: string,
): Promise<{
	duration: number | undefined;
	width: number | undefined;
	height: number | undefined;
}> {
	return new Promise((resolve) => {
		ffmpeg.ffprobe(videoPath, (err, metadata) => {
			if (err) {
				resolve({ duration: undefined, width: undefined, height: undefined });
			} else {
				const duration = metadata.format.duration;
				const stream = metadata.streams[0];
				resolve({
					duration,
					width: stream?.width,
					height: stream?.height,
				});
			}
		});
	});
}

export function getVideoLocation(videoPath: string) {
	exiftool.read(videoPath, { geolocation: true }).then((data) => {
		console.log(data);
	});
}
