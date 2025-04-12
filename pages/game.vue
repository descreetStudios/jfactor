<template>
	<div ref="left" class="left"></div>
	<div ref="right" class="right"></div>

	<!-- Menu link -->
	<div class="navbar" ref="navbar" @mouseenter="navbarOver" @mouseleave="navbarLeave">
		<NuxtLink to="./">
			<div class="firstCell">
				<img class="navbarImage" src="@/assets/images/homeButton.png" alt="Home">
				<transition name="fade">
					<h2 v-if="showTitle" class="navbarTitle" ref="navbarTitle">HOME</h2>
				</transition>
			</div>
		</NuxtLink>
		<div class="cell">
			<img class="navbarImage" src="@/assets/images/playButton.png" alt="Home">
			<transition name="fade">
				<h2 v-if="showTitle" class="navbarTitle" ref="navbarTitle">PLAY</h2>
			</transition>
		</div>
		<div class="cell">
			<img class="navbarImage" src="@/assets/images/teamButton.png" alt="Home">
			<transition name="fade">
				<h2 v-if="showTitle" class="navbarTitle" ref="navbarTitle">ABOUT US</h2>
			</transition>
		</div>
		<div class="lastCell">
			<img class="navbarImage" src="@/assets/images/newsButton.png" alt="Home">
			<transition name="fade">
				<h2 v-if="showTitle" class="navbarTitle" ref="navbarTitle">NEWS AND <br> UPDATES</h2>
			</transition>
		</div>
	</div>

	<!-- Dices container -->
	<div class="diceContainer">
		<div class="dice-container clickable" @click="handleRoll" :disabled="rolling">
			<!-- First dice -->
			<div class="scene">
				<div class="cube" :style="{ transform: dice1Transform }">
					<!-- Face 1 (Front): 1 pip -->
					<div class="cube__face cube__face--front">
						<div class="pip center"></div>
					</div>
					<!-- Face 6 (Back): 6 pips in 2 cols -->
					<div class="cube__face cube__face--back">
						<div class="pip top-left"></div>
						<div class="pip top-right"></div>
						<div class="pip middle-left"></div>
						<div class="pip middle-right"></div>
						<div class="pip bottom-left"></div>
						<div class="pip bottom-right"></div>
					</div>
					<!-- Face 3 (Right): 3 pips -->
					<div class="cube__face cube__face--right">
						<div class="pip top-left"></div>
						<div class="pip center"></div>
						<div class="pip bottom-right"></div>
					</div>
					<!-- Face 4 (Left): 4 pips at angles -->
					<div class="cube__face cube__face--left">
						<div class="pip top-left"></div>
						<div class="pip top-right"></div>
						<div class="pip bottom-left"></div>
						<div class="pip bottom-right"></div>
					</div>
					<!-- Face 2 (Top): 2 pips in diagonal -->
					<div class="cube__face cube__face--top">
						<div class="pip top-left"></div>
						<div class="pip bottom-right"></div>
					</div>
					<!-- Face 5 (Bottom): 5 pips -->
					<div class="cube__face cube__face--bottom">
						<div class="pip top-left"></div>
						<div class="pip top-right"></div>
						<div class="pip center"></div>
						<div class="pip bottom-left"></div>
						<div class="pip bottom-right"></div>
					</div>
				</div>
			</div>
			<!-- Second dice -->
			<div class="scene">
				<div class="cube" :style="{ transform: dice2Transform }">
					<!-- Face 1 (Front) -->
					<div class="cube__face cube__face--front">
						<div class="pip center"></div>
					</div>
					<!-- Face 6 (Back) -->
					<div class="cube__face cube__face--back">
						<div class="pip top-left"></div>
						<div class="pip top-right"></div>
						<div class="pip middle-left"></div>
						<div class="pip middle-right"></div>
						<div class="pip bottom-left"></div>
						<div class="pip bottom-right"></div>
					</div>
					<!-- Face 3 (Right) -->
					<div class="cube__face cube__face--right">
						<div class="pip top-left"></div>
						<div class="pip center"></div>
						<div class="pip bottom-right"></div>
					</div>
					<!-- Face 4 (Left) -->
					<div class="cube__face cube__face--left">
						<div class="pip top-left"></div>
						<div class="pip top-right"></div>
						<div class="pip bottom-left"></div>
						<div class="pip bottom-right"></div>
					</div>
					<!-- Face 2 (Top) -->
					<div class="cube__face cube__face--top">
						<div class="pip top-left"></div>
						<div class="pip bottom-right"></div>
					</div>
					<!-- Face 5 (Bottom) -->
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

	<!-- Random button (unused) -->
	<button class="randBtn" @click="handleMove">Genera numero</button>
	

	<div class="grid-wrapper">
		<div class="spiral-grid">
			<div v-for="(button, index) in spiral" :key="index"
				:class="['button', button === null ? 'button-null' : 'button-' + button]" :ref="'cell' + button"
				@click="handleClick(button)">
				{{ button !== null ? button : '' }}
			</div>
		</div>
	</div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { generateSpiral } from "@/scripts/grid.js";
import { createImageAtPosition, numGen, movePlayer } from "@/scripts/game.js";
import { rollDice } from '@/scripts/dice.js';

const dice1Transform = ref('rotateX(0deg) rotateY(0deg)');
const dice2Transform = ref('rotateX(0deg) rotateY(0deg)');
const resultText = ref('');
const rolling = ref(false);

const pieceImg = new URL('@/assets/images/piece.jpg', import.meta.url).href;

const spiral = ref(generateSpiral(63, 8));
const width = ref(0);
const showTitle = ref(false);

// Refs for DOM elements
const navbar = ref(null);
const left = ref(null);
const right = ref(null);

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

const transitionOpen = () => {
	left.value.style.animation = "leftOut 1s forwards";
	right.value.style.animation = "rightOut 1s forwards";
};

const handleMove = () => {
	movePlayer(spiral.value, numGen, createImageAtPosition, pieceImg, {
		navbar: navbar.value,
		left: left.value,
		right: right.value,
	});
};

const handleClick = (buttonNumber) => {
	if (buttonNumber !== null) {
		alert(`Hai cliccato sul numero ${buttonNumber}`);
	}
};

const navbarOver = () => {
	width.value = navbar.value.scrollWidth;
	navbar.value.style.setProperty('--target-width', `${width.value}px`);
	navbar.value.style.animation = "navbarOver 1s forwards";

	const checkWidth = setInterval(() => {
		width.value = navbar.value.scrollWidth;
		if (width.value >= 200) {
			showTitle.value = true;
			clearInterval(checkWidth);
		}
	}, 100);
};

const navbarLeave = () => {
	width.value = navbar.value.scrollWidth;
	navbar.value.style.setProperty('--target-width', `${width.value}px`);
	navbar.value.style.animation = "navbarLeave 1s forwards";

	const checkWidth = setInterval(() => {
		width.value = navbar.value.scrollWidth;
		if (width.value <= 400) {
			showTitle.value = false;
			clearInterval(checkWidth);
		}
	}, 100);
};

onMounted(() => {
	transitionOpen();
	width.value = navbar.value.scrollWidth;
	navbar.value.style.setProperty('--fitcontent-width', `${width.value}px`);
});
</script>

<style lang="scss">
@import url('@/styles/grid.scss');
@import url('@/styles/transition.scss');
@import url('@/styles/menuBar.scss');

@import url('@/styles/dice.scss');

/* DEBUG
@import url('@/styles/debug.scss');
*/
</style>
