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

	<!-- Static Info Cell -->
	<div class="staticInfoCellWrapper">
		<img src="@/assets/images/diceBackground.png" alt="background">
		<div class="staticInfoCell">
			Static Info Cell
		</div>
	</div>

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
						
						<!-- Normal 
							TODO: caricare l'immagine con getImageSrc()
							TODO: fare in modo che l'immagine possa essere cell1, cell2, ... casualmente 
						-->
						<img v-if="effects[button].type == 'empty'" :src="normalImg" alt="normal"
							style="visibility: visible; width: 100%; height: 100%; position: absolute; pointer-events: none;">

						<!-- Final -->
						<img v-if="effects[button].type == 'final'" :src="finalImg" alt="final"
							style="visibility: visible; width: 100%; height: 100%; position: absolute; pointer-events: none;">

						<!-- Show Buff Image if move is positive -->
						<img v-if="effects[button].move > 0" :src="getCellImageSrc(button, 'buff')" alt="Buff"
							style="visibility: visible; width: 100%; height: 100%; position: absolute; pointer-events: none;" />

						<!-- Show Debuff Image if move is negative -->
						<img v-if="effects[button].move < 0" :src="getCellImageSrc(button, 'debuff')" alt="Debuff"
							style="visibility: visible; width: 100%; height: 100%; position: absolute; pointer-events: none;" />

						<!-- Show Question Image if there's a question effect -->
						<img v-if="effects[button].type === 'question'" :src="getCellImageSrc(button, 'question')" alt="Question"
							style="visibility: visible; width: 100%; height: 100%; position: absolute; pointer-events: none;" />
							
						<!-- <img v-else-if="Array.isArray(effects[button])" :src="questionImg" alt="Question"
						style="width: 20px; height: 20px; position: absolute; top: 5px; right: 5px; pointer-events: none;" /> -->

						<!-- Show Death Image if there's a death effect -->
						<img v-if="effects[button].type === 'death'" :src="getCellImageSrc(button, 'death')" alt="Death"
							style="visibility: visible; width: 100%; height: 100%; position: absolute; pointer-events: none;" />

						<!-- Show Bonus Image if there are stars for bonus -->
						<img v-if="effects[button].type === 'bonus'" :src="getCellImageSrc(button, 'buff')" alt="Bonus"
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

			<div class="nav-buttons-wrapper">
				<div class="nav-buttons">
					<button @click="nextQuestion" :disabled="selectedOption === null">
						{{ currentQuestIndex === questionsLength - 1 ? 'Vedi Risultato' : 'Avanti' }}
					</button>
				</div>
				<div class="nav-buttons">
					<p class="questIndex">
						{{ currentQuestIndex + 1 }} / {{ questionsLength }}
					</p>
				</div>
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

// Import horizontal and vertical cells
import buffCellHorizontal from '@/assets/images/cells/buffCellHorizontal.png';
import buffCellVertical from '@/assets/images/cells/buffCellVertical.png';
import debuffCellHorizontal from '@/assets/images/cells/debuffCellHorizontal.png';
import debuffCellVertical from '@/assets/images/cells/debuffCellVertical.png';
import deathCellHorizontal from '@/assets/images/cells/deathCellHorizontal.png';
import deathCellVertical from '@/assets/images/cells/deathCellVertical.png';
import bonusCellVertical from '@/assets/images/cells/bonusCellVertical.png';
import bonusCellHorizontal from '@/assets/images/cells/buffCellHorizontal.png';
import questionCellVertical from '@/assets/images/cells/questionCellVertical.png';
import questionCellHorizontal from '@/assets/images/cells/questionCellHorizontal.png';

import Cell1Vertical from '@/assets/images/cells/Cell1Vertical.png';
import Cell1Horizontal from '@/assets/images/cells/Cell1Horizontal.png';
import Cell2Vertical from '@/assets/images/cells/Cell2Vertical.png';
import Cell2Horizontal from '@/assets/images/cells/Cell2Horizontal.png';
import Cell3Vertical from '@/assets/images/cells/Cell3Vertical.png';
import Cell3Horizontal from '@/assets/images/cells/Cell3Horizontal.png';
import Cell4Vertical from '@/assets/images/cells/Cell4Vertical.png';
import Cell4Horizontal from '@/assets/images/cells/Cell4Horizontal.png';
import Cell5Vertical from '@/assets/images/cells/Cell5Vertical.png';
import Cell5Horizontal from '@/assets/images/cells/Cell5Horizontal.png';

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
const showInfoCell = ref(false);

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

// Bonus refs
let playerBonusCount = ref(0);

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
	} while (!showQuest.value && !['empty', 'start', 'bonus', 'death'].includes(getEventType(position.value)));

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
		if (playerBonusCount.value > 0) {
			alert("Hai scampato la morte!");
			playerBonusCount.value -= 1;
		}
		else {
			alert("Sei morto!");
			position.value = 0;
		}
	}
	else if (eventType === 'bonus') {
		playerBonusCount.value += 1;
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

		await delay(3600);

		// Wait 5 seconds to show the result
		showQuest.value = false;
		rolling.value = true;

		// Reset state
		showResult.value = false;
		selectedOption.value = null;
		correctCount.value = 0;
		currentQuestIndex.value = 0;

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

		do {
			await applyCellEffect();
		} while (!showQuest.value && !['empty', 'start', 'bonus', 'death'].includes(getEventType(position.value)));

		if (position.value === MAXCELLS) {
			handleWin();
		}

		updatePawnPosition(position.value);
		rolling.value = false;

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
			await applyCellEffect();
		} while (!showQuest.value && !['empty', 'start', 'bonus', 'death'].includes(getEventType(position.value)));

		if (position.value == MAXCELLS) {
			handleWin();
		}
	}
}

// Debug cells number
const handleClick = (button) => {
	if (button !== null) alert(`Hai cliccato sul numero ${button}`);
	showInfoCell.value = true;
};
//#endregion


// Horizontal or Vertical or spanish
const horizontalCells = [
	3, 4, 7, 8, 9, 13, 14, 15, 16, 21, 22, 23, 24, 25, 31, 32, 33, 34, 35, 36, 43, 44, 45, 46, 47, 48, 49, 57, 58, 59, 60, 61, 62
]

const isHorizontal = (index) => horizontalCells.includes(index);

const getCellImageSrc = (cellNumber, type) => {
	const horizontal = isHorizontal(cellNumber);
	switch (type) {
		case 'buff':
			return horizontal ? buffCellHorizontal : buffCellVertical;
		case 'debuff':
			return horizontal ? debuffCellHorizontal : debuffCellVertical;
		case 'death':
			return horizontal ? deathCellHorizontal : deathCellVertical;
		case 'bonus':
			return horizontal ? bonusCellHorizontal : bonusCellVertical;
		case 'question':
			return horizontal ? questionCellHorizontal : questionCellVertical;
		case 'cell1':
			return horizontal ? cell1Horizontal : cell1Vertical;
		case 'cell2':
			return horizontal ? cell2Horizontal : cell2Vertical;
		case 'cell3':
			return horizontal ? cell3Horizontal : cell3Vertical;
		case 'cell4':
			return horizontal ? cell4Horizontal : cell4Vertical;
		case 'cell5':
			return horizontal ? cell5Horizontal : cell5Vertical;
		default:
			return '';
	}
};


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
@import url('@/styles/infoCell.scss');
@import url('@/styles/debugMenu.scss');
/* DEBUG
@import url('@/styles/debug.scss');
*/
</style>