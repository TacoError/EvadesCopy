function interpolate(start, end, delta = 0.5) {
	let lerpto = delta / (1000 / 30);
	let dx = end - start;
	return start + dx * lerpto;
}

// currently does not work, im assuming because of the above function.
function interpolateArrays(arr1, arr2) {
	const newArray = [];
	for (const i in arr1) {
		if (i > arr2.length) break;
		const start = arr1[i];
		const end = arr2[i];
		end.x = interpolate(start.x, end.x);
		end.y = interpolate(start.y, end.y);
		newArray.push(end);
	}
	return newArray;
}