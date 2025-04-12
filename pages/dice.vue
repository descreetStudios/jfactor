<template>
	<div class="diceContainer">
		<!-- Contenitore dei dadi con effetto 3D -->
		<div class="dice-container clickable" @click="handleRoll" :disabled="rolling">
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
import { ref } from 'vue';
import { rollDice } from '@/scripts/dice.js';

const dice1Transform = ref('rotateX(0deg) rotateY(0deg)');
const dice2Transform = ref('rotateX(0deg) rotateY(0deg)');
const resultText = ref('');
const rolling = ref(false);

function setDiceTransforms({ dice1, dice2 }) {
  dice1Transform.value = dice1;
  dice2Transform.value = dice2;
}

function setResultText(text) {
  resultText.value = text;
}

function handleRoll() {
  rollDice(rolling, setResultText, setDiceTransforms);
}
</script>

<style lang="scss">
@import url('@/styles/dice.scss');

/* Debug
@import url('@/styles/debug.scss');
*/
</style>