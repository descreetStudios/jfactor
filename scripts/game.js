export function generateCellEffects(totalCells = 64, maxEffects = 15, effectRange = 6) {
	const effects = {}, excluded = new Set([1, totalCells]);

	while (Object.keys(effects).length < maxEffects) {
		const cell = Math.floor(Math.random() * (totalCells - 2)) + 2;
		if (excluded.has(cell)) continue;

		const move = Math.floor(Math.random() * (effectRange * 2 + 1)) - effectRange;
		if (!move) continue;

		const target = cell + move;
		if (target <= 1 || target >= totalCells || excluded.has(target)) continue;

		effects[cell] = move;
		excluded.add(cell).add(target);
	}

	return effects;
}
