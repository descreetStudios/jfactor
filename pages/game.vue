<template>
	<!-- DebugMenu -->
	<div v-show="showDebug" class="debugMenu">
		<div class="debugHead">
			<h1 class="debugTitle">DEBUG MENU</h1>
			<div class="debugExit">
				<img src="@/assets/images/debugClose.png" @click="toggleDebug">
			</div>
		</div>
		<div class="debugBody">
			<form>
			Win game
			<!-- Win Button (temporary) -->
			<button type="button" class="winButton" @click="winGame">Win Game</button>

			Teleport to
			<input type="number" v-model="tpCell" placeholder="Enter the number of cell">
			cell
			<!-- TP Button (temporary) -->
			<button type="button" class="tpButton" @click="tp">Submit</button>

			Forward movement: 
			<input type="number" v-model="forward" placeholder="Enter the number of cells">
			<button type="button" class="moveButton" @click="debugMove">Submit</button>
			
			Backward movement:
			<input type="number" v-model="backward" placeholder="Enter the number of cells">
			<button type="button" class="moveButton" @click="debugMove">Submit</button>
			</form>
		</div>
	 </div>

	<!-- Debug Button -->
	 <button @click="debugClick">Debug</button>

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

	<!-- Grid -->
	<div class="grid-wrapper" ref="gridWrapper">
		<client-only>
			<div class="spiral-grid">
				<div v-for="(button, index) in spiral" :key="index"
					:class="['button', button === null ? 'button-null' : 'button-' + button]" :ref="'cell-' + button"
					@click="handleClick(button)" style="position: relative;">

					{{ button !== null ? button : '' }}

					<!-- Pawn -->
					<div v-if="button === position" class="pawnContainer">
						<img :src="pieceImg" alt="Pawn" class="pawnImg" />
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
const MAXCELLS = 63; // Av. cells

//#region Imports
import { ref, onMounted, watch, nextTick, getCurrentInstance } from 'vue';
import { rollDice, diceResults } from '@/scripts/dice.js';
import { generateCellEffects } from '@/scripts/game.js';
import { generateSpiral } from '@/scripts/grid.js';

import pieceImg from '@/assets/images/piece.png';
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

// Movement refs
const position = ref(0);

// Spiral refs
const spiral = ref(generateSpiral(MAXCELLS-1, 8));
const gridWrapper = ref(null);
const cellEffects = ref(generateCellEffects(MAXCELLS));

// Debug refs
let showDebug = ref(false);
const clickCount = ref(0);
let clickTimeout = null;
const forward = ref(0);
const backward = ref(0);
const tpCell = ref(0);
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
	rolling.value = true;

	let target = position.value + diceResults.r1 + diceResults.r2;

	// Step 1: Go to cell 63 or target cell
	let maxReach = Math.min(target, MAXCELLS);
	while (position.value < maxReach) {
		await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms
		position.value++; // Step increment
	}

	// Step 2: Overshoot if target is too high
	if (target > MAXCELLS) {
		let overshot = target - MAXCELLS;
		let reboundTarget = MAXCELLS - overshot; // Final target with overshot calculation
		DEBUG && console.log(`Overshot! Went to ${MAXCELLS}, now bouncing back ${overshot} → to ${reboundTarget}`);

		while (position.value > reboundTarget) {
			await new Promise(resolve => setTimeout(resolve, 500));
			position.value--;
		}
	}

	// Step 3: Calculate cell effect
	let effect = checkEvents(position.value);
	DEBUG && console.log(`Cell Effect @${position.value}: ${effect}`);

	let effectTarget = position.value + effect;
	while (position.value !== effectTarget) {
		await new Promise(resolve => setTimeout(resolve, 500));
		position.value += (position.value < effectTarget) ? 1 : -1;
	}

	// Step 4: Win game
	if (position.value === MAXCELLS) {
		setTimeout(() => {
			alert('🎉 You won! Resetting the game...');
			resetGame();
		}, 500);
	}

	updatePawnPosition(position.value);

	rolling.value = false;
}

function resetGame() {
	position.value = 0;
	resultText.value = '';
	diceResults.r1 = null;
	diceResults.r2 = null;
	setDiceTransforms({ dice1: 'rotateX(0deg) rotateY(0deg)', dice2: 'rotateX(0deg) rotateY(0deg)' });
	cellEffects.value = generateCellEffects();
	updatePawnPosition(position.value);
}

watch(resultText, () => {
	if (!rolling.value && diceResults.r1 && diceResults.r2) {
		updateValues().then(() => {
			updatePawnPosition(position.value);
		});
	}
});
//#endregion

//#region Debug menu
const debugClick = () => {
  clickCount.value++;

  if (clickTimeout) {
    clearTimeout(clickTimeout);
  }

  clickTimeout = setTimeout(() => {
    clickCount.value = 0;
  }, 500);

  if (clickCount.value === 5) {
    toggleDebug();
    clickCount.value = 0;
  }
};

const toggleDebug = () => {
  showDebug.value = !showDebug.value;
};

async function debugMove() {
	await nextTick();
	rolling.value = true;

	let target = position.value + forward.value - backward.value;

	// Step 1: Go to cell 63 or target cell
	let maxReach = Math.min(target, MAXCELLS);
	while (position.value < maxReach) {
		await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms
		position.value++; // Step increment
	}

	// Step 2: Overshoot if target is too high
	if (target > MAXCELLS) {
		let overshot = target - MAXCELLS;
		let reboundTarget = MAXCELLS - overshot; // Final target with overshot calculation
		DEBUG && console.log(`Overshot! Went to ${MAXCELLS}, now bouncing back ${overshot} → to ${reboundTarget}`);

		while (position.value > reboundTarget) {
			await new Promise(resolve => setTimeout(resolve, 500));
			position.value--;
		}
	}

	// Step 3: Calculate cell effect
	let effect = checkEvents(position.value);
	DEBUG && console.log(`Cell Effect @${position.value}: ${effect}`);

	let effectTarget = position.value + effect;
	while (position.value !== effectTarget) {
		await new Promise(resolve => setTimeout(resolve, 500));
		position.value += (position.value < effectTarget) ? 1 : -1;
	}

	// Step 4: Win game
	if (position.value === MAXCELLS) {
		setTimeout(() => {
			alert('🎉 You won! Resetting the game...');
			resetGame();
		}, 500);
	}

	updatePawnPosition(position.value);

	rolling.value = false;

	forward.value = 0;
	backward.value = 0;
}

function winGame() {
	position.value = MAXCELLS;
	setTimeout(() => {
		alert('🎉 You won! Resetting the game...');
		resetGame();
	}, 500);
}

function tp() {
	position.value = tpCell.value;
}

const handleClick = (button) => {
	if (button !== null) alert(`Hai cliccato sul numero ${button}`);
};
//#endregion

onMounted(() => {
	updatePawnPosition(position.value);
	window.addEventListener('resize', () => updatePawnPosition(position.value));
	let debug = false;
});
</script>

<style lang="scss">
@import url('@/styles/grid.scss');
@import url('@/styles/pawn.scss');
@import url('@/styles/dice.scss');
@import url('@/styles/debug.scss');

/* DEBUG
@import url('@/styles/debug.scss');
*/
</style>
