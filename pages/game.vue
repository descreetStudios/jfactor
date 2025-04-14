<template>
	<div ref="left" class="left"></div>
	<div ref="right" class="right"></div>

	<!-- Navbar -->
	<div class="navbar" ref="navbar" @mouseenter="navbarOver" @mouseleave="navbarLeave">
		<div class="firstCell" @click="transitionClose(1)">
			<img class="navbarImage" src="@/assets/images/homeButton.png" alt="Home">
			<transition name="fade">
				<h2 v-if="showTitle" class="navbarTitle" ref="navbarTitle">HOME</h2>
			</transition>
		</div>
		<div class="cell"  @click="transitionClose(2)">
			<img class="navbarImage" src="@/assets/images/teamButton.png" alt="Home">
			<transition name="fade">
				<h2 v-if="showTitle" class="navbarTitle" ref="navbarTitle">ABOUT US</h2>
			</transition>
		</div>
		<div class="lastCell"  @click="transitionClose(3)">
			<img class="navbarImage" src="@/assets/images/newsButton.png" alt="Home">
			<transition name="fade">
				<h2 v-if="showTitle" class="navbarTitle" ref="navbarTitle">NEWS AND <br> UPDATES</h2>
			</transition>
		</div>
	</div>

	<!-- Dice Container -->
	<div class="diceContainer">
		<div class="dice-container clickable" @click="handleRoll" :disabled="rolling">
			<!-- Dice 1 and 2 scenes -->
			<div class="scene" v-for="(transform, index) in [dice1Transform, dice2Transform]" :key="index">
				<div class="cube" :style="{ transform }">
					<div class="cube__face cube__face--front">
						<div class="pip center"></div>
					</div>
					<div class="cube__face cube__face--back">
						<div class="pip top-left"></div>
						<div class="pip top-right"></div>
						<div class="pip middle-left"></div>
						<div class="pip middle-right"></div>
						<div class="pip bottom-left"></div>
						<div class="pip bottom-right"></div>
					</div>
					<div class="cube__face cube__face--right">
						<div class="pip top-left"></div>
						<div class="pip center"></div>
						<div class="pip bottom-right"></div>
					</div>
					<div class="cube__face cube__face--left">
						<div class="pip top-left"></div>
						<div class="pip top-right"></div>
						<div class="pip bottom-left"></div>
						<div class="pip bottom-right"></div>
					</div>
					<div class="cube__face cube__face--top">
						<div class="pip top-left"></div>
						<div class="pip bottom-right"></div>
					</div>
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
		<div class="result" v-if="resultText">{{ resultText }}</div>
	</div>

	<!-- Win Button (temporary) -->
	<button class="winButton" @click="winGame">Win Game</button>

	<!-- Grid -->
	<div class="grid-wrapper" ref="gridWrapper">
		<client-only>
			<div class="spiral-grid">
				<div v-for="(button, index) in spiral" :key="index"
					:class="['button', button === null ? 'button-null' : 'button-' + button]" :ref="'cell-' + button"
					@click="handleClick(button)" style="position: relative;">

					{{ button !== null ? button : '' }}

					<!-- Pawn -->
					<div v-if="button === pawnPosition" ref="pawnContainer"
						style="width: 25px; height: 25px; position: absolute; z-index: 10; top: 0; left: 0;">
						<img :src="pieceImg" alt="Pawn" style="width: 25px; height: 25px;" />
					</div>

					<!-- Effects -->
					<template v-if="button && cellEffects[button]">
						<img v-if="cellEffects[button] > 0" :src="buffImg" alt="Buff"
							style="width: 20px; height: 20px; position: absolute; top: 5px; right: 5px; pointer-events: none;" />
						<img v-else-if="cellEffects[button] < 0" :src="debuffImg" alt="Debuff"
							style="width: 20px; height: 20px; position: absolute; top: 5px; right: 5px; pointer-events: none;" />
					</template>

				</div>
			</div>
		</client-only>
	</div>
</template>

<script setup>
// Settings
const DEBUG = true;
const MAXCELLS = 64; // Av. cells + 1

//#region Imports
import { ref, onMounted, watch, nextTick, getCurrentInstance } from 'vue';
import { rollDice, diceResults } from '@/scripts/dice.js';
import { generateCellEffects } from '@/scripts/game.js';
import { generateSpiral } from '@/scripts/grid.js';

import pieceImg from '@/assets/images/piece.jpg';
import buffImg from '@/assets/images/buff.png';
import debuffImg from '@/assets/images/debuff.png';

const { proxy } = getCurrentInstance();
//#endregion

//#region References
// Dice refs
const dice1Transform = ref('rotateX(0deg) rotateY(0deg)');
const dice2Transform = ref('rotateX(0deg) rotateY(0deg)');
const resultText = ref('');
const rolling = ref(false);

// Navbar refs
const navbar = ref(null);
const width = ref(0);
const showTitle = ref(false);

// Transition refs
const left = ref(null);
const right = ref(null);

// Movement refs
const moves = ref(0);
const position = ref(0);
const targetPosition = ref(1);
const pawnPosition = ref(0); // for parenting

// Spiral refs
const spiral = ref(generateSpiral(MAXCELLS-1, 8));
const gridWrapper = ref(null);
const cellEffects = ref(generateCellEffects());
//#endregion

//#region Dice system
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
//#endregion

//#region Movement system
function checkEvents(pos) {
	return cellEffects.value[pos] || 0;
}

async function updatePawnPosition(pos) {
	await nextTick();
	const cellEl = proxy.$refs[`cell-${pos}`]?.[0] || proxy.$refs[`cell-${pos}`];
	if (!cellEl) return;

	const rect = cellEl.getBoundingClientRect();
	const parentRect = proxy.$refs.gridWrapper.getBoundingClientRect();
	const x = rect.left - parentRect.left + rect.width / 2 - 20;
	const y = rect.top - parentRect.top + rect.height / 2 - 20;
	const pawnEl = proxy.$refs.pawn;

	if (pawnEl) {
		pawnEl.style.left = `${x}px`;
		pawnEl.style.top = `${y}px`;
	}
}

async function updateValues() {
	await nextTick();
	let target = position.value + (moves.value = diceResults.r1 + diceResults.r2);
	if (target > MAXCELLS) target = MAXCELLS * 2 - target;
	let effect = checkEvents(target);
	DEBUG && console.log(`Cell Effect: ${effect}`);
	target += effect;
	targetPosition.value = pawnPosition.value = target;
	updatePawnPosition(target);
}

function resetGame() {
	moves.value = 0;
	position.value = 0;
	targetPosition.value = 1;
	resultText.value = '';
	diceResults.r1 = null;
	diceResults.r2 = null;
	setDiceTransforms({ dice1: 'rotateX(0deg) rotateY(0deg)', dice2: 'rotateX(0deg) rotateY(0deg)' });
	cellEffects.value = generateCellEffects();
	updatePawnPosition(position.value);
}

function winGame() {
	position.value = MAXCELLS;
	targetPosition.value = MAXCELLS;
	setTimeout(() => {
		alert('🎉 You won! Resetting the game...');
		resetGame();
	}, 500);
}

watch(resultText, () => {
	if (!rolling.value && diceResults.r1 && diceResults.r2) {
		updateValues().then(() => {
			position.value = targetPosition.value;
			updatePawnPosition(position.value);
			if (position.value === MAXCELLS) {
				setTimeout(() => {
					alert('🎉 You won! Resetting the game...');
					resetGame();
				}, 500);
			}
		});
	}
});

watch(pawnPosition, (newPos) => {
	updatePawnPosition(newPos);
});

const handleClick = (button) => {
	if (button !== null) alert(`Hai cliccato sul numero ${button}`);
};
//#endregion

//#region Navbar system
const navbarOver = () => {
	width.value = navbar.value.scrollWidth;
	navbar.value.style.setProperty('--target-width', `${width.value}px`);
	navbar.value.style.animation = 'navbarOver 1s forwards';
	const check = setInterval(() => {
		width.value = navbar.value.scrollWidth;
		if (width.value >= 200) {
			showTitle.value = true;
			clearInterval(check);
		}
	}, 100);
};

const navbarLeave = () => {
	width.value = navbar.value.scrollWidth;
	navbar.value.style.setProperty('--target-width', `${width.value}px`);
	navbar.value.style.animation = 'navbarLeave 1s forwards';
	const check = setInterval(() => {
		width.value = navbar.value.scrollWidth;
		if (width.value <= 400) {
			showTitle.value = false;
			clearInterval(check);
		}
	}, 100);
};
//#endregion

//#region Transitions
const transitionOpen = () => {
	left.value.style.animation = 'leftOut 1s forwards';
	right.value.style.animation = 'rightOut 1s forwards';
};

const transitionClose = (page) => {
	document.body.style.pointerEvents = "none";
	left.value.style.animation = "leftIn 1s forwards";
	right.value.style.animation = "rightIn 1s forwards";
	setTimeout(() => {
		switch (page) {
			case 1:
				this.$router.push('./index');
				break;
			case 2:
				this.$router.push('./credits');
				break;
			case 3:
				this.$router.push('./tutorial');
				break;
		}
		document.body.style.pointerEvents = "all";
	}, 1500)
};
//#endregion

onMounted(() => {
	transitionOpen();
	updatePawnPosition(pawnPosition.value);
	width.value = navbar.value.scrollWidth;
	navbar.value.style.setProperty('--fitcontent-width', `${width.value}px`);
	window.addEventListener('resize', () => updatePawnPosition(pawnPosition.value));
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