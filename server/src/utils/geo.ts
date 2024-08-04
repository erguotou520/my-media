// 要将 GPS 坐标从 Array(3) [degrees, minutes, seconds] 格式转换为浮点型数据
export function calcGPSLocation(coordArray: [number, number, number], ref?: string) {
	const degrees = coordArray[0];
	const minutes = coordArray[1];
	const seconds = coordArray[2];

	// 转换为十进制格式
	const decimal = degrees + minutes / 60 + seconds / 3600;

	// 根据参考方向调整符号
	if (ref === "S" || ref === "W") {
		return -decimal;
	}
	return decimal;
}
