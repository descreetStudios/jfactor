<template>
	<div class="container">
		<!-- Contenitore dei dadi con effetto 3D -->
		<div class="dice-container clickable" @click="rollDice" :disabled="rolling">
			<!-- Primo dado -->
			<div class="scene">
				<div class="cube" :style="{ transform: dice1Transform }">
					<!-- Faccia 1 (Front): Solo il pip centrale -->
					<div class="cube__face cube__face--front">
						<div class="pip center"></div>
					</div>
					<!-- Faccia 6 (Back): Sei pips in due colonne -->
					<div class="cube__face cube__face--back">
						<div class="pip top-left"></div>
						<div class="pip top-right"></div>
						<div class="pip middle-left"></div>
						<div class="pip middle-right"></div>
						<div class="pip bottom-left"></div>
						<div class="pip bottom-right"></div>
					</div>
					<!-- Faccia 3 (Right): Tre pips -->
					<div class="cube__face cube__face--right">
						<div class="pip top-left"></div>
						<div class="pip center"></div>
						<div class="pip bottom-right"></div>
					</div>
					<!-- Faccia 4 (Left): Quattro pips agli angoli -->
					<div class="cube__face cube__face--left">
						<div class="pip top-left"></div>
						<div class="pip top-right"></div>
						<div class="pip bottom-left"></div>
						<div class="pip bottom-right"></div>
					</div>
					<!-- Faccia 2 (Top): Due pips in diagonale -->
					<div class="cube__face cube__face--top">
						<div class="pip top-left"></div>
						<div class="pip bottom-right"></div>
					</div>
					<!-- Faccia 5 (Bottom): Cinque pips -->
					<div class="cube__face cube__face--bottom">
						<div class="pip top-left"></div>
						<div class="pip top-right"></div>
						<div class="pip center"></div>
						<div class="pip bottom-left"></div>
						<div class="pip bottom-right"></div>
					</div>
				</div>
			</div>
			<!-- Secondo dado -->
			<div class="scene">
				<div class="cube" :style="{ transform: dice2Transform }">
					<!-- Faccia 1 (Front) -->
					<div class="cube__face cube__face--front">
						<div class="pip center"></div>
					</div>
					<!-- Faccia 6 (Back) -->
					<div class="cube__face cube__face--back">
						<div class="pip top-left"></div>
						<div class="pip top-right"></div>
						<div class="pip middle-left"></div>
						<div class="pip middle-right"></div>
						<div class="pip bottom-left"></div>
						<div class="pip bottom-right"></div>
					</div>
					<!-- Faccia 3 (Right) -->
					<div class="cube__face cube__face--right">
						<div class="pip top-left"></div>
						<div class="pip center"></div>
						<div class="pip bottom-right"></div>
					</div>
					<!-- Faccia 4 (Left) -->
					<div class="cube__face cube__face--left">
						<div class="pip top-left"></div>
						<div class="pip top-right"></div>
						<div class="pip bottom-left"></div>
						<div class="pip bottom-right"></div>
					</div>
					<!-- Faccia 2 (Top) -->
					<div class="cube__face cube__face--top">
						<div class="pip top-left"></div>
						<div class="pip bottom-right"></div>
					</div>
					<!-- Faccia 5 (Bottom) -->
					<div class="cube__face cube__face--bottom">
						<div class="pip top-left"></div>
						<div class="pip top-right"></div>
						<div class="pip center"></div>
						<div class="pip bottom-left"></div>
						<div class="pip bottom-right"></div>
					</div>
				</div>
			</div>
		</div>
		<!-- Pulsante per lanciare i dadi 
		<button class="roll-button" @click="rollDice" :disabled="rolling">
			Lancia i Dadi
		</button>
		-->
		<!-- Visualizzazione del risultato -->
		<div class="result" v-if="resultText">{{ resultText }}</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'

// Variabili reattive per le trasformazioni dei dadi e per gestire lo stato
const dice1Transform = ref('rotateX(0deg) rotateY(0deg)')
const dice2Transform = ref('rotateX(0deg) rotateY(0deg)')
const resultText = ref('')
const rolling = ref(false)

/*
  Mappatura per "fissare" l'orientamento del dado in base al numero:
  • Faccia Front: 1
  • Faccia Top: 2
  • Faccia Right: 3
  • Faccia Left: 4
  • Faccia Bottom: 5
  • Faccia Back: 6
*/
const diceMapping = {
  1: { x: 0, y: 0 },
  2: { x: -90, y: 0 },
  3: { x: 0, y: -90 },
  4: { x: 0, y: 90 },
  5: { x: 90, y: 0 },
  6: { x: 180, y: 0 }
}

function rollDice() {
	if (rolling.value) return
	rolling.value = true
	resultText.value = ''

	const scenes = document.querySelectorAll('.scene');
	scenes.forEach(scene => {
		scene.classList.add('bounce');
		// Remove the class after animation completes
		setTimeout(() => scene.classList.remove('bounce'), 400);
	});

	const r1 = Math.floor(Math.random() * 6) + 1
	const r2 = Math.floor(Math.random() * 6) + 1

	// Extra full spins (still 3 to 6 rotations)
	const spinX1 = Math.floor(Math.random() * 4 + 3) * 360
	const spinY1 = Math.floor(Math.random() * 4 + 3) * 360
	const spinX2 = Math.floor(Math.random() * 4 + 3) * 360
	const spinY2 = Math.floor(Math.random() * 4 + 3) * 360

	// Final angles: extra spin + mapped angle (must be clean 90° steps)
	const finalX1 = spinX1 + diceMapping[r1].x
	const finalY1 = spinY1 + diceMapping[r1].y
	const finalX2 = spinX2 + diceMapping[r2].x
	const finalY2 = spinY2 + diceMapping[r2].y

	dice1Transform.value = `rotateX(${finalX1}deg) rotateY(${finalY1}deg)`
	dice2Transform.value = `rotateX(${finalX2}deg) rotateY(${finalY2}deg)`

	setTimeout(() => {
		resultText.value = `Hai ottenuto ${r1} e ${r2} (Somma: ${r1 + r2})`

		// Apply bounce effect
		const scenes = document.querySelectorAll('.scene');
		scenes.forEach(scene => {
			scene.classList.add('bounce');
			// Remove the class after animation completes
			setTimeout(() => scene.classList.remove('bounce'), 400);
		});

		rolling.value = false
	}, 2000);
}
</script>

<style lang="scss">
@import url('../styles/dice.scss');

// Debug
//@import url('../styles/debug.scss');
</style>