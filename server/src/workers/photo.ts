import sharp from "sharp";

export async function getPhotoThumbnail(
	photoPath: string,
	thumbnailPath: string,
) {
	await sharp(photoPath)
		.resize({
			width: 320,
			height: 320,
			fit: sharp.fit.inside,
			withoutEnlargement: true,
		})
		.webp({ quality: 80 })
		.toFile(thumbnailPath);
}

export function getPhotoMetadata(photoPath: string): Promise<{
	width: number | undefined;
	height: number | undefined;
}> {
  return sharp(photoPath).metadata().then(metadata => {
    return {
      width: metadata.width,
      height: metadata.height,
    }
  }).catch(() => ({ width: undefined, height: undefined }))
}
