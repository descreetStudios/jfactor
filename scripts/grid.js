export function generateSpiral(size, gridSize) {
	const maxCells = gridSize * gridSize;
	const spiral = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));

	let x = Math.floor(gridSize / 2) - 1;
	let y = Math.floor(gridSize / 2) - 1;

	const directions = [
		[1, 0], [0, 1], [-1, 0], [0, -1]
	];

	let dir = 0;
	let steps = 1;
	let count = 0;

	spiral[y][x] = count++;
	while (count < maxCells) {
		for (let r = 0; r < 2; r++) {
			const [dx, dy] = directions[dir];
			for (let i = 0; i < steps; i++) {
				x += dx;
				y += dy;
				if (x >= 0 && x < gridSize && y >= 0 && y < gridSize && spiral[y][x] === null) {
					spiral[y][x] = count++;
					if (count >= maxCells) break;
				}
			}
			dir = (dir + 1) % 4;
		}
		steps++;
	}

	const flattened = spiral.flat();

	if (size >= maxCells) {
		flattened.push(count);
	}

	return flattened;
}
