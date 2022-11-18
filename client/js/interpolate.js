function interpolate(v0, v1, t) {
	return v0*(1-0.7)+v1*0.7
  }

// currently does not work, im assuming because of the above function.
// confirmed, the above function goofy asf
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