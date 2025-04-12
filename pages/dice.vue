<template>
	<div class="container">
		<!-- Contenitore dei dadi con effetto 3D -->
		<div class="dice-container">
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
		<!-- Pulsante per lanciare i dadi -->
		<button class="roll-button" @click="rollDice" :disabled="rolling">
			Lancia i Dadi
		</button>
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

	// Genera un numero casuale (da 1 a 6) per ciascun dado
	const r1 = Math.floor(Math.random() * 6) + 1
	const r2 = Math.floor(Math.random() * 6) + 1

	// Rotazioni extra (multipli di 360°) per un effetto dinamico
	const extra1 = (Math.floor(Math.random() * 4) + 3) * 360
	const extra2 = (Math.floor(Math.random() * 4) + 3) * 360

	// Calcola gli angoli finali sommando la rotazione extra alla mappatura base
	const finalX1 = extra1 + diceMapping[r1].x
	const finalY1 = extra1 + diceMapping[r1].y
	const finalX2 = extra2 + diceMapping[r2].x
	const finalY2 = extra2 + diceMapping[r2].y

	dice1Transform.value = `rotateX(${finalX1}deg) rotateY(${finalY1}deg)`
	dice2Transform.value = `rotateX(${finalX2}deg) rotateY(${finalY2}deg)`

	setTimeout(() => {
		resultText.value = `Hai ottenuto ${r1} e ${r2} (Somma: ${r1 + r2})`
		rolling.value = false
	}, 2000)
}
</script>

<style>
@import url('../styles/dice.scss');
</style>