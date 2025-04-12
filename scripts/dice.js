// Mappatura per "fissare" l'orientamento del dado in base al numero
export const diceMapping = {
	1: { x: 0, y: 0 },
	2: { x: -90, y: 0 },
	3: { x: 0, y: -90 },
	4: { x: 0, y: 90 },
	5: { x: 90, y: 0 },
	6: { x: 180, y: 0 },
};

export function rollDice(rolling, setResultText, setDiceTransforms) {
	if (rolling.value) return;
	rolling.value = true;
	setResultText("");

	const scenes = document.querySelectorAll(".scene");
	scenes.forEach((scene) => {
		scene.classList.add("bounce");
		// Rimuovere la classe dopo che l'animazione è completata
		setTimeout(() => scene.classList.remove("bounce"), 400);
	});

	const r1 = Math.floor(Math.random() * 6) + 1;
	const r2 = Math.floor(Math.random() * 6) + 1;

	// Extra full spins (3-6 rotazioni)
	const spinX1 = Math.floor(Math.random() * 4 + 3) * 360;
	const spinY1 = Math.floor(Math.random() * 4 + 3) * 360;
	const spinX2 = Math.floor(Math.random() * 4 + 3) * 360;
	const spinY2 = Math.floor(Math.random() * 4 + 3) * 360;

	// Angoli finali: rotazioni extra + angolo mappato (devono essere multipli di 90°)
	const finalX1 = spinX1 + diceMapping[r1].x;
	const finalY1 = spinY1 + diceMapping[r1].y;
	const finalX2 = spinX2 + diceMapping[r2].x;
	const finalY2 = spinY2 + diceMapping[r2].y;

	// Impostare le trasformazioni dei dadi
	setDiceTransforms({
		dice1: `rotateX(${finalX1}deg) rotateY(${finalY1}deg)`,
		dice2: `rotateX(${finalX2}deg) rotateY(${finalY2}deg)`,
	});

	setTimeout(() => {
		setResultText(`Hai ottenuto ${r1} e ${r2} (Somma: ${r1 + r2})`);

		// Applicare l'effetto di rimbalzo
		scenes.forEach((scene) => {
			scene.classList.add("bounce");
			setTimeout(() => scene.classList.remove("bounce"), 400);
		});

		rolling.value = false;
	}, 2000);
}
