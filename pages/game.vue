<template>
	<title>Untitled Plague Game - Game</title>
	<!-- DebugMenu container -->
	<div v-show="showDebug" class="debugMenu">
		<div class="debugHead">
			<h1 class="debugTitle">DEBUG MENU</h1>
			<div class="debugExit" @click="toggleDebug">
				<span class="closeX">X</span>
			</div>
		</div>
		<div class="debugBody">
			<form>
				<div class="formRow">
					<span>Win game</span>
					<button type="button" class="winButton" @click="handleWin">Win Game</button>
				</div>
				<div class="formRow">
					<span>Teleport to</span>
					<input type="number" class="debugInput" v-model="tpCell" placeholder="Enter the number of cell">
					<button type="button" class="debugButton" @click="tp">Submit</button>
				</div>
			</form>
		</div>
	</div>

	<!-- Debug Button -->
	<button @click="debugClick">Debug</button>

	<!-- Quest Button -->
	<NuxtLink to="./quest">
		<button>Quest</button>
	</NuxtLink>

	<!-- Dice Container -->
	<div class="diceContainer">
		<img src="@/assets/images/diceBackground.png" alt="diceBackground">
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
		<!-- <div class="result" v-if="resultText">{{ resultText }}</div> -->
	</div>

	<!-- Grid -->
	<div class="grid-wrapper" ref="gridWrapper">
		<client-only>
			<div class="spiral-grid">
				<div v-for="(button, index) in spiral" :key="index"
					:class="['button', button === null ? 'button-null' : 'button-' + button]" :ref="'cell-' + button"
					@click="handleClick(button)" style="position: relative;">

					<!-- Cell number -->
					<h1 class="cellNumber">{{ button !== null ? button : '' }}</h1>

					<!-- Pawn -->
					<div v-if="button === position" class="pawnContainer">
						<img :src="pieceImg" alt="Pawn" class="pawnImg" />
					</div>

					<!-- Effects -->
					<template v-if="button && effects[button]">
						<!-- Normal -->
						<img v-if="effects[button].type == 'empty'" :src="normalImg" alt="normal"
							style="visibility: visible; width: 100%; height: 100%; position: absolute; pointer-events: none;">

						<!-- Final -->
						<img v-if="effects[button].type == 'final'" :src="finalImg" alt="final"
							style="visibility: visible; width: 100%; height: 100%; position: absolute; pointer-events: none;">

						<img v-if="effects[button].move > 0" :src="buffImg" alt="Buff"
							style="visibility: visible; width: 100%; height: 100%; position: absolute; pointer-events: none;" />
						<img v-else-if="effects[button].move < 0" :src="debuffImg" alt="Debuff"
							style="visibility: visible; width: 100%; height: 100%; position: absolute; pointer-events: none;" />
						<!-- <img v-else-if="Array.isArray(effects[button])" :src="questionImg" alt="Question"
							style="width: 20px; height: 20px; position: absolute; top: 5px; right: 5px; pointer-events: none;" /> -->
						<img v-else-if="effects[button].type == 'question'" :src="questionImg" alt="Question"
							style="visibility: visible; width: 100%; height: 100%; position: absolute; pointer-events: none;" />
						<img v-else-if="effects[button].type == 'death'" :src="deathImg" alt="Death"
							style="visibility: visible; width: 100%; height: 100%; position: absolute; pointer-events: none;" />
						<img v-else-if="effects[button].type == 'bonus'" :src="bonusImg" alt="Bonus"
							style="visibility: visible; width: 100%; height: 100%; position: absolute; pointer-events: none;" />
					</template>

				</div>
			</div>
		</client-only>
	</div>

	<!-- Questions -->
	<div class="question-wrapper" v-if="showQuest">
		<div class="carousel" v-if="!showResult">
			<div class="question-text">
				{{ currentQuestion.question }}
			</div>

			<div class="options">
				<button v-for="(option, index) in currentQuestion.options" :key="index"
					:disabled="selectedOption !== null" @click="selectOption(option)">
					{{ option }}
				</button>
			</div>

			<div class="feedback" v-if="selectedOption !== null">
				<span v-if="isCorrect" class="rightAns">Corretto!</span>
				<span v-else class="wrongAns">Sbagliato. Risposta corretta: {{ currentQuestion.answer }}</span>
			</div>

			<div class="nav-buttons">
				<button @click="nextQuestion" :disabled="selectedOption === null">
					{{ currentQuestIndex === questionsLength - 1 ? 'Vedi Risultato' : 'Avanti' }}
				</button>
				<p class="questIndex">
					{{ currentQuestIndex + 1 }} / {{ questionsLength }}
				</p>
			</div>
		</div>

		<div class="result" v-else>
			Hai risposto correttamente a {{ correctCount }} su {{ questionsLength }} domande!
		</div>
	</div>
</template>

<script setup>
// Settings
const DEBUG = true;
const MAXCELLS = 63; // Available cells

// Utils
const getLength = (proxy) => {
	return Object.keys(proxy).length;
};

//#region Imports
import { ref, computed, onMounted, watch, nextTick, getCurrentInstance } from 'vue';
import { rollDice, diceResults } from '@/scripts/dice.js';
import { generateEffects } from '@/scripts/game.js';
import { generateSpiral } from '@/scripts/grid.js';

import pieceImg from '@/assets/images/piece.png';
import finalImg from '@/assets/images/cells/finalCell.png';
import normalImg from '@/assets/images/cells/cell1.png';
import buffImg from '@/assets/images/cells/buffCell.png';
import debuffImg from '@/assets/images/cells/debuffCell.png';
import questionImg from '@/assets/images/cells/questionCell.png';
import deathImg from '@/assets/images/cells/deathCell.png';
import bonusImg from '@/assets/images/cells/bonusCell.png';

const { proxy } = getCurrentInstance();
//#endregion

//#region References
// Dice refs
const dice1Transform = ref('rotateX(0deg) rotateY(0deg)');
const dice2Transform = ref('rotateX(0deg) rotateY(0deg)');
const resultText = ref('');
const rolling = ref(false);

// Spiral refs
const spiral = ref(generateSpiral(MAXCELLS - 1, 8));
const gridWrapper = ref(null);
const effects = ref(generateEffects(MAXCELLS));

// Movement refs
const position = ref(0);

// Question refs
const questions = ref(effects);
let questionsLength = ref(0);
let showQuest = ref(false);
let currentQuestIndex = ref(0);
const selectedOption = ref(null);
const correctCount = ref(0);
const showResult = ref(false);
const currentQuestion = computed(() => questions.value[position.value].quests[[currentQuestIndex.value]])
const isCorrect = computed(() => selectedOption.value === currentQuestion.value.answer)

// Debug refs
let showDebug = ref(true);
const clickCount = ref(0);
let clickTimeout = null;
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
function getEventType(pos) {
	return effects.value[pos].type;
}

function getEffect(pos) {
	if (getEventType(pos) === 'cell') {
		return effects.value[pos].move || 0;
	}
	else if (getEventType(pos) === 'question') {
		return effects.value[pos].quests || 0;
	}
	else if (getEventType(pos) === 'bonus') {

	}
	else {
		return 0;
	}
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

	const maxReach = Math.min(target, MAXCELLS);
	await moveToTarget(maxReach);

	if (target > MAXCELLS) {
		await handleOvershoot(target);
	}

	do {
		await applyCellEffect();
	} while (!showQuest && getEventType(position.value) !== 'empty');

	if (position.value === MAXCELLS) {
		handleWin();
	}

	updatePawnPosition(position.value);
	rolling.value = false;
}

async function moveToTarget(target) {
	while (position.value < target) {
		await delay(500);
		position.value++;
	}
}

async function handleOvershoot(target) {
	const overshot = target - MAXCELLS;
	const reboundTarget = MAXCELLS - overshot;

	DEBUG && console.log(`Overshot! Went to ${MAXCELLS}, now bouncing back ${overshot} → to ${reboundTarget}`);

	while (position.value > reboundTarget) {
		await delay(500);
		position.value--;
	}
}

async function applyCellEffect() {
	// Get effect in current position
	const eventType = getEventType(position.value);
	const effect = getEffect(position.value);
	DEBUG && console.log(`Event type @${position.value}: ${eventType}`);
	DEBUG && console.log(`Effect @${position.value}:`, effect);

	if (eventType === 'cell') {
		const effectTarget = position.value + effect;
		for (let i = 0; i < Math.abs(effect); i++) {
			await delay(500);
			if (position.value > 0) {
				position.value += (position.value < effectTarget) ? 1 : -1;
			}
			else {
				position.value = 0;
			}
		}
	}
	else if (eventType === 'question') {
		showQuest.value = true;
		questionsLength = getLength(effect);
		const question = effect[currentQuestIndex.value];

		DEBUG && console.log('Length:', getLength(effect));
		DEBUG && console.log(`Question:`, question);
		DEBUG && console.log(`Correct questions:`, correctCount.value);
	}
	else if (eventType === 'death') {
		console.log("Sei morto");
		position.value = 0;
	}
}

function handleWin() {
	setTimeout(() => {
		alert('🎉 You won! Resetting the game...');
		resetGame();
	}, 500);
}

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function resetGame() {
	position.value = 0;
	resultText.value = '';
	diceResults.r1 = null;
	diceResults.r2 = null;
	setDiceTransforms({ dice1: 'rotateX(0deg) rotateY(0deg)', dice2: 'rotateX(0deg) rotateY(0deg)' });
	effects.value = generateEffects();
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

//#region Questions
function selectOption(option) {
	selectedOption.value = option
	if (option === currentQuestion.value.answer) {
		correctCount.value++
	}
}

async function nextQuestion() {
	if (currentQuestIndex.value < questionsLength - 1) {
		currentQuestIndex.value++;
		selectedOption.value = null;
	} else {
		showResult.value = true;

		let movement = correctCount.value * 2 - questionsLength;
		let target = position.value + movement;

		DEBUG && console.log(`Target movement:`, movement);
		DEBUG && console.log(`Target cell:`, target);

		// Wait 5 seconds to show the result
		setTimeout(async () => {
			showQuest.value = false;

			// Delay before starting movement
			await delay(100);

			// Handle overshoot
			if (target > MAXCELLS) {
				await handleOvershoot(target);
			}

			// Animate movement
			for (let i = 0; i < Math.abs(movement); i++) {
				await delay(500);
				if (position.value > 0) {
					position.value += (position.value < target) ? 1 : -1;
				} else {
					position.value = 0;
				}
			}

			// Reset state
			correctCount.value = 0;
			currentQuestIndex.value = 0;
			selectedOption.value = null;
			showResult.value = false;
		}, 5000); // Delay for result visibility
	}
}
//#endregion

//#region Debug
// Debug menu 5 consecutive clicks
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

// Debug menu on/off
const toggleDebug = () => {
	showDebug.value = !showDebug.value;
};

// Teleport pawn
async function tp() {
	if (tpCell.value >= 1 && tpCell.value <= 63) {
		position.value = tpCell.value;

		do {
			console.log("skdgj:", showQuest.value);
			await applyCellEffect();
		} while (!showQuest.value && getEventType(position.value) !== 'empty');

		if (position.value == MAXCELLS) {
			handleWin();
		}
	}
}

// Debug cells number
const handleClick = (button) => {
	if (button !== null) alert(`Hai cliccato sul numero ${button}`);
};
//#endregion

onMounted(() => {
	updatePawnPosition(position.value);
	window.addEventListener('resize', () => updatePawnPosition(position.value));
});
</script>

<style lang="scss">
@import url('@/styles/grid.scss');
@import url('@/styles/pawn.scss');
@import url('@/styles/dice.scss');
@import url('@/styles/quest.scss');
@import url('@/styles/debugMenu.scss');
/* DEBUG
@import url('@/styles/debug.scss');
*/
</style>