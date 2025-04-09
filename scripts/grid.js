export function generateSpiral(count, size)
{
	const grid = Array(size * size).fill(null);
	let x = 0, y = 0;
	let dx = 1, dy = 0;
	let bounds = { left: 0, right: size - 1, top: 0, bottom: size - 1 };

	for (let i = 1; i <= count; i++) {
		grid[y * size + x] = i;

		// Verifica la possibilità di cambiamento direzionale
		if (dx === 1 && x === bounds.right) {
			bounds.top++;
			[dx, dy] = [0, 1];
		} else if (dy === 1 && y === bounds.bottom) {
			bounds.right--;
			[dx, dy] = [-1, 0];
		} else if (dx === -1 && x === bounds.left) {
			bounds.bottom--;
			[dx, dy] = [0, -1];
		} else if (dy === -1 && y === bounds.top) {
			bounds.left++;
			[dx, dy] = [1, 0];
		}

		x += dx;
		y += dy;
	}

	return grid;
}