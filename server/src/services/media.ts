import { join } from "node:path";
import { db } from "@/db";
import { medias } from "@/db/schema";
import type { SelectMediaModelType } from "@/models";
import {
	scanDirectory,
	thumbnailDir,
	thumbnailRoutePrefix,
} from "@/utils/path";
import { inArray } from "drizzle-orm";

type MediaItem = {
	fileName: string;
} & ({ type: "dir" } | ({ type: "file" } & Partial<SelectMediaModelType>));

export async function findMediaByPath(
	dir: string,
	path?: string,
): Promise<MediaItem[]> {
	const _dir = join(dir, path || "");
	const result: MediaItem[] = [];
	const dbFiles: string[] = [];
	const dbIndexArr: number[] = [];
	let index = 0;
	await scanDirectory(_dir, {
		onDir(dir) {
			result.push({
				type: "dir",
				fileName: dir.name,
			});
			index += 1;
		},
		onFile(file, filePath) {
			dbIndexArr.push(index);
			result.push({
				type: "file",
				fileName: file.name,
			});
			dbFiles.push(filePath);
			index += 1;
		},
	});
	if (dbFiles.length > 0) {
		const files = await db.query.medias.findMany({
			where: inArray(medias.path, dbFiles),
		});
		for (const [index, file] of files.entries()) {
      Object.assign(result[dbIndexArr[index]], file);
			(result[dbIndexArr[index]] as { type: "file" } & Partial<SelectMediaModelType>).thumbnailPath =
				file.thumbnailPath?.replace(thumbnailDir, thumbnailRoutePrefix);
		}
	}
	return result.sort((a, b) => a.fileName.localeCompare(b.fileName));
}
