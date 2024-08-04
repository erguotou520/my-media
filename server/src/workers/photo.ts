import type { CreateMediaModel } from "@/models";
import { calcGPSLocation } from "@/utils/geo";
import reader from "exif-reader";
import sharp from "sharp";

export async function getPhotoThumbnail(
	photoPath: string,
	thumbnailPath: string,
) {
	await sharp(photoPath)
		.resize({
			width: 240,
			height: 240,
			fit: sharp.fit.inside,
			withoutEnlargement: true,
		})
		.webp({ quality: 80 })
		.toFile(thumbnailPath);
}

export async function getPhotoMetadata(
	photoPath: string,
): Promise<Partial<CreateMediaModel>> {
	let latitude: number | undefined;
	let longitude: number | undefined;
	let altitude: number | undefined;
	try {
		const metadata = await sharp(photoPath).metadata();
		if (metadata.exif) {
			try {
				const gps = (await reader(metadata.exif)).GPSInfo;
				if (gps?.GPSLatitude) {
					latitude = calcGPSLocation(
						gps.GPSLatitude as [number, number, number],
						gps.GPSLatitudeRef,
					);
					longitude = calcGPSLocation(
						gps.GPSLongitude as [number, number, number],
						gps.GPSLongitudeRef,
					);
					altitude = gps.GPSAltitude;
				}
			} catch (error) {
				// ignore error
			}
		}
		return {
			width: metadata.width,
			height: metadata.height,
			latitude,
			longitude,
			altitude,
		};
	} catch (error) {
		return { width: undefined, height: undefined, latitude, longitude, altitude }
	}
}
