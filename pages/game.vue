<template>
	<title>Untitled Plague Game - Game</title>

	<!-- DebugMenu container -->
	<div v-show="showDebug" class="debugMenu">
		<div class="debugHead">
			<h1 class="debugTitle">DEBUG MENU</h1>
			<div class="debugExit" @click="deactivateDebug">
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

	<!-- Debug Button (Bat) -->
	<div class="batButton" @click="debugClick">
		<div class="bat"></div>
	</div>

	<!-- Language buttons -->
	<div class="languageButtonsGame">
		<button ref="uk" class="language-button" @click="changeLanguage(1)">
			<img src="@/assets/images/UK.png" alt="UK">
		</button>
		<button ref="italy" class="language-button" @click="changeLanguage(2)">
			<img src="@/assets/images/Italy.png" alt="Italy">
		</button>
	</div>

	<!-- Sidebar -->
	<div class="sidebar">
		<!-- Cell Info English -->
		<div class="cellInfoWrapper" v-if="!italian">
			<img class="cellInfoWrapperImg" src="@/assets/images/diceBackground.png" alt="background">
			<div class="cellInfo">Cell Info</div>
			<p v-if="!isCellSelected" class="startInfoParagraph">Click a cell to view its infos!</p>
			<div class="cellInfos" v-if="isCellSelected">
				<img class="cellImg" :src="currentButtonImg" alt="infoCellImage">
				<div class="cellInfoText">
					<label class="infoLabel"><span>Number:</span>&nbsp; {{ currentButton }}</label><br>
					<label class="infoLabel"><span>Type:</span>&nbsp; {{ currentButtonType }}</label><br>
					<label class="infoLabel"><span>Description:</span><br>{{ currentButtonDescription }}</label>
				</div>
			</div>
		</div>

		<!-- Cell Info Italian -->
		<div class="cellInfoWrapper" v-if="italian">
			<img class="cellInfoWrapperImg" src="@/assets/images/diceBackground.png" alt="background">
			<div class="cellInfo">Informazioni Cella</div>
			<p v-if="!isCellSelected" class="startInfoParagraph">Clicca su una cella per vedere <br> le sue
				informazioni!</p>
			<div class="cellInfos" v-if="isCellSelected">
				<img class="cellImg" :src="currentButtonImg" alt="infoCellImage">
				<div class="cellInfoText">
					<label class="infoLabel"><span>Numero:</span>&nbsp; {{ currentButton }}</label><br>
					<label class="infoLabel"><span>Tipo:</span>&nbsp; {{ currentButtonType }}</label><br>
					<label class="infoLabel"><span>Descrizione:</span><br>{{ currentButtonDescription }}</label>
				</div>
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

			<!-- Results -->
			<div class="diceResult" v-if="resultText">{{ resultText }}</div>

			<!-- English Results -->
			<div class="diceResult" v-if="!italian">
				<div v-if="!resultText && roll">Roll the dice!</div>
				<div v-if="!resultText && !roll">Rolling...</div>
			</div>

			<!-- Italian Results -->
			<div class="diceResult" v-if="italian">
				<div v-if="!resultText && roll">Lancia i dadi!</div>
				<div v-if="!resultText && !roll">Lanciando...</div>
			</div>
		</div>
	</div>

	<!-- Grid -->
	<div class="grid-wrapper" ref="gridWrapper">
		<client-only>
			<div class="spiral-grid">
				<div v-for="(button, index) in spiral" :key="index"
					:class="['button', button === null ? 'button-null' : 'button-' + button]" :ref="'cell-' + button"
					@click="handleClick(button)">

					<!-- Cell number -->
					<h1 class="cellNumber" v-if="button !== null && button !== 0">{{ button }}</h1>

					<!-- Pawn -->
					<div v-if="button === position" class="pawnContainer">
						<img :src="pieceImg" alt="Pawn" class="pawnImg" />
					</div>

					<!-- Effects -->
					<template v-if="button && effects[button]">



						<!-- Normal  -->
						<img v-if="effects[button].type == 'empty' && button != 1"
							:src="getCellImageSrc(button, 'empty')" alt="normal"
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
						<img v-if="effects[button].type === 'question'" :src="getCellImageSrc(button, 'question')"
							alt="Question"
							style="visibility: visible; width: 100%; height: 100%; position: absolute; pointer-events: none;" />

						<!-- Show Death Image if there's a death effect -->
						<img v-if="effects[button].type === 'death'" :src="getCellImageSrc(button, 'death')" alt="Death"
							style="visibility: visible; width: 100%; height: 100%; position: absolute; pointer-events: none;" />

						<!-- Show Bonus Image if there's a bonus effect -->
						<img v-if="effects[button].type === 'bonus'" :src="getCellImageSrc(button, 'bonus')" alt="Bonus"
							style="visibility: visible; width: 100%; height: 100%; position: absolute; pointer-events: none;" />

						<!-- Cell One -->
						<img v-if="button === 1" src="@/assets/images/cells/cell2.png" alt="Cell 1 Special"
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

			<div class="feedback" v-if="(selectedOption !== null) && !italian">
				<span v-if="isCorrect" class="rightAns">Correct!</span>
				<span v-else class="wrongAns">Wrong. Correct answer: {{ currentQuestion.answer }}</span>
			</div>

			<div class="feedback" v-if="(selectedOption !== null) && italian">
				<span v-if="isCorrect" class="rightAns">Corretto!</span>
				<span v-else class="wrongAns">Sbagliato. Risposta corretta: {{ currentQuestion.answer }}</span>
			</div>

			<div class="nav-buttons-wrapper">
				<div class="nav-buttons" v-if="!italian">
					<button @click="nextQuestion" :disabled="selectedOption === null">
						{{ currentQuestIndex === questionsLength - 1 ? 'Show Result' : 'Next' }}
					</button>
				</div>

				<div class="nav-buttons" v-if="italian">
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
		<div v-else>
			<div class="result" v-if="italian">
				Hai risposto correttamente a {{ correctCount }} su {{ questionsLength }} domande!
			</div>
			<div class="result" v-if="!italian">
				You answered correctly {{ correctCount }} out of {{ questionsLength }} questions!
			</div>
		</div>

	</div>

	<!-- Notification Box -->
	<div v-if="notificationVisible" class="notification-wrapper">
		<div class="notification-box">
			<span class="notification-text">{{ notificationMessage }}</span>
			<span class="notification-alt-text">{{ notificationAltMessage }}</span>
		</div>
	</div>
</template>

<script setup>
// Settings
const DEBUG = false;
const MAXCELLS = 63; // Available cells
const globalDelay = 3500;

// Utils
const getLength = (proxy) => {
	return Object.keys(proxy).length;
};

const capitalizeFirstLetter = (str) => {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1);
}

//#region Imports
import { ref, computed, onMounted, watch, nextTick, getCurrentInstance } from 'vue';
import { rollDice, diceResults } from '@/scripts/dice.js';
import { generateEffects } from '@/scripts/game.js';
import { generateSpiral } from '@/scripts/grid.js';

import pieceImg from '@/assets/images/piece.png';

import finalImg from '@/assets/images/cells/finalCell.png';
import buffImg from '@/assets/images/cells/buffCell.png';
import debuffImg from '@/assets/images/cells/debuffCell.png';
import questionImg from '@/assets/images/cells/questionCell.png';
import deathImg from '@/assets/images/cells/deathCell.png';
import bonusImg from '@/assets/images/cells/bonusCell.png';
import cell1 from '@/assets/images/cells/cell1.png';
import cell2 from '@/assets/images/cells/cell2.png';
import cell3 from '@/assets/images/cells/cell3.png';
import cell4 from '@/assets/images/cells/cell4.png';
import cell5 from '@/assets/images/cells/cell5.png';

// Import horizontal and vertical cells
import buffCellHorizontal from '@/assets/images/cells/buffCellHorizontal.png';
import buffCellVertical from '@/assets/images/cells/buffCellVertical.png';
import debuffCellHorizontal from '@/assets/images/cells/debuffCellHorizontal.png';
import debuffCellVertical from '@/assets/images/cells/debuffCellVertical.png';
import deathCellHorizontal from '@/assets/images/cells/deathCellHorizontal.png';
import deathCellVertical from '@/assets/images/cells/deathCellVertical.png';
import bonusCellVertical from '@/assets/images/cells/bonusCellVertical.png';
import bonusCellHorizontal from '@/assets/images/cells/bonusCellHorizontal.png';
import questionCellVertical from '@/assets/images/cells/questionCellVertical.png';
import questionCellHorizontal from '@/assets/images/cells/questionCellHorizontal.png';

import cell1Vertical from '@/assets/images/cells/cell1Vertical.png';
import cell1Horizontal from '@/assets/images/cells/cell1Horizontal.png';
import cell2Vertical from '@/assets/images/cells/cell2Vertical.png';
import cell2Horizontal from '@/assets/images/cells/cell2Horizontal.png';
import cell3Vertical from '@/assets/images/cells/cell3Vertical.png';
import cell3Horizontal from '@/assets/images/cells/cell3Horizontal.png';
import cell4Vertical from '@/assets/images/cells/cell4Vertical.png';
import cell4Horizontal from '@/assets/images/cells/cell4Horizontal.png';
import cell5Vertical from '@/assets/images/cells/cell5Vertical.png';
import cell5Horizontal from '@/assets/images/cells/cell5Horizontal.png';

const { proxy } = getCurrentInstance();
//#endregion

//#region References
// Dice refs
const dice1Transform = ref('rotateX(0deg) rotateY(0deg)');
const dice2Transform = ref('rotateX(0deg) rotateY(0deg)');
const resultText = ref('');
const resultTextBackup = ref('');
const rolling = ref(false);
const roll = ref(true);

// Spiral refs
const spiral = ref(generateSpiral(MAXCELLS - 1, 8));
const gridWrapper = ref(null);
const effects = ref(generateEffects(MAXCELLS));

// Movement refs
const position = ref(0);

// Question refs
const lastIsQuestion = ref(false);
const questions = ref(effects);
let questionsLength = ref(0);
let showQuest = ref(false);
let currentQuestIndex = ref(0);
const selectedOption = ref(null);
const correctCount = ref(0);
const showResult = ref(false);
const currentQuestion = computed(() => {
	if (italian.value) {
		return questions.value[position.value].questsIta[[currentQuestIndex.value]];
	} else {
		return questions.value[position.value].questsEng[[currentQuestIndex.value]];
	}
});
const isCorrect = computed(() => selectedOption.value === currentQuestion.value.answer)

// Bonus refs
let playerBonusCount = ref(0);
let hasPlayerAlreadyTakenBonus = ref(false);
let hasPlayerAlreadyTriedDeath = ref(false);

// Cell notifier refs
let notificationMessage = ref("You're now walking in the city (Undefined behaviour or undefined cell)");
let notificationAltMessage = ref("You've hit a cell (Undefined behaviour or undefined cell)");
let notificationVisible = ref(false);

// Info refs
const isCellSelected = ref(false);
const currentButton = ref(0);
const currentButtonType = ref('Empty');
const currentButtonDescription = ref("Description");
const currentButtonImg = ref(null);
let isShowingInfos = ref(false);
let imgName = ref(null);

// Translation refs
let italian = ref(false);
const uk = ref(null);
const italy = ref(null);

// Debug refs
let showDebug = ref(false);
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
	resultTextBackup.value = text;
}

function handleRoll() {
	if (roll.value) {
		roll.value = false;
	}
	rollDice(rolling, setResultText, setDiceTransforms);
}
//#endregion

//#region Movement system

// Cell effect for consecutive cells
async function cellEffect() {
	await (delay(400));
	do {
		await applyCellEffect();

		// If question is not asked,
		// you are not in any of the listed cells,
		// you haven't already taken the bonus and
		// you haven't already tried dying,
		// cycle again
	} while (!showQuest.value &&
	!['empty', 'start', 'final'].includes(getEventType(position.value)) &&
	hasPlayerAlreadyTakenBonus.value === false && hasPlayerAlreadyTriedDeath.value == false);
}

function getEventType(pos) {
	return effects.value[pos].type;
}

function getEffect(pos) {
	if (getEventType(pos) === 'cell') {
		return effects.value[pos].move || 0;
	}
	else if (getEventType(pos) === 'question') {
		if (italian.value) {
			return effects.value[pos].questsIta || 0;
		}
		else if (!italian.value) {
			return effects.value[pos].questsEng || 0;
		}
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

	await cellEffect();

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

async function notifyCell(type, deathMessage = "", altDeathMessage = "", movement) {
	await delay(500);
	notificationMessage.value = "You're now walking in the city (Undefined behaviour or undefined cell)";
	notificationAltMessage.value = "You've hit a cell (Undefined behaviour or undefined cell)";
	if (type === undefined) return;

	if (!italian.value) {
		if (type === 'question') {
			notificationMessage.value = "A wanderer is asking you questions!";
			notificationAltMessage.value = "Answer the following questions:";
		}
		if (type === 'death') {
			if (deathMessage === "" && altDeathMessage === "") {
				notificationMessage.value = "The plague has won!";
				notificationAltMessage.value = "You have died, start over.";
			}
			else {
				notificationMessage.value = deathMessage;
				notificationAltMessage.value = altDeathMessage;
			}
		}
		if (type === 'bonus') {
			notificationMessage.value = "You have found healing herbs along the road!";
			if (playerBonusCount.value === 1) {
				notificationAltMessage.value = "You can avoid death once.";
			}
			else {
				notificationAltMessage.value = `You can avoid death ${playerBonusCount.value} times.`;
			}
		}
		if (type === 'cell') {
			if (movement > 0) {
				notificationMessage.value = "You have found other travelers fleeing from the plague! They offer you a ride on their cart!";
				notificationAltMessage.value = (movement === 1 ? "Move forward 1 space" : `Move forward ${movement} spaces`);
			}
			else {
				notificationMessage.value = "You have ended up in a mercenary camp! They force you to retrace your steps.";
				notificationAltMessage.value = (movement === -1 ? "Move back 1 space" : `Move back ${movement * -1} spaces`);
			}
		}
		if (type === 'win') {
			notificationMessage.value = "You have escaped the lazaret!";
			notificationAltMessage.value = "You have won!";
		}
	}

	else if (italian.value) {
		if (type === 'question') {
			notificationMessage.value = "Un viandante ti pone delle domande!";
			notificationAltMessage.value = "Rispondi alle seguenti domande:";
		}
		if (type === 'death') {
			if (deathMessage === "" && altDeathMessage === "") {
				notificationMessage.value = "La peste ha avuto la meglio!";
				notificationAltMessage.value = "Sei morto, ricomincia da capo.";
			}
			else {
				notificationMessage.value = deathMessage;
				notificationAltMessage.value = altDeathMessage;
			}
		}
		if (type === 'bonus') {
			notificationMessage.value = "Hai trovato delle erbe curative per strada!";
			if (playerBonusCount.value === 1) {
				notificationAltMessage.value = `Puoi evitare la morte per 1 volta.`;
			}
			else {
				notificationAltMessage.value = `Puoi evitare la morte per ${playerBonusCount.value} volte.`;
			}
		}
		if (type === 'cell') {
			if (movement > 0) {
				notificationMessage.value = "Hai trovato altri viaggiatori in fuga dalla peste! Ti offrono un passaggio sul loro carro!";
				notificationAltMessage.value = (movement === 1 ? `Avanza di 1 casella` : `Avanza di ${movement} caselle`);
			}
			else {
				notificationMessage.value = "Sei finito in un accampamento di mercenari! Ti costringono a tornare sui tuoi passi.";
				notificationAltMessage.value = (movement === -1 ? `Retrocedi di 1 casella` : `Retrocedi di ${movement * -1} caselle`);
			}
		}
		if (type === 'win') {
			notificationMessage.value = "Sei uscito dal lazzaretto!";
			notificationAltMessage.value = "Hai vinto!";
		}
	}

	notificationVisible.value = true;
	await delay(globalDelay * 1.5);
	notificationVisible.value = false;
}

async function applyCellEffect() {
	// Reset this value
	hasPlayerAlreadyTakenBonus.value = false;
	hasPlayerAlreadyTriedDeath.value = false;

	// Get effect in current position
	const eventType = getEventType(position.value);
	const effect = getEffect(position.value);
	DEBUG && console.log(`Event type @${position.value}: ${eventType}`);
	DEBUG && console.log(`Effect @${position.value}:`, effect);

	if (eventType === 'cell') {
		const effectTarget = position.value + effect;
		await (notifyCell(eventType, "", "", effectTarget - position.value));

		for (let i = 0; i < Math.abs(effect); i++) {
			await delay(500);
			if (position.value > 0) {
				position.value += (position.value < effectTarget) ? 1 : -1;
			}
			else {
				position.value = 0;
			}
		}
		if (getEventType(position.value) === 'empty') {
			resultText.value = false;
			roll.value = true;
		}
	}
	else if (eventType === 'question') {
		await (notifyCell(eventType));

		showQuest.value = true;
		questionsLength = getLength(effect);
		const question = effect[currentQuestIndex.value];

		DEBUG && console.log('Length:', getLength(effect));
		DEBUG && console.log(`Question:`, question);
		DEBUG && console.log(`Correct questions:`, correctCount.value);
	}
	else if (eventType === 'death') {
		if (playerBonusCount.value > 0) {
			playerBonusCount.value -= 1;
			if (playerBonusCount.value === 1) {
				if (italian.value) {
					await (notifyCell(eventType, "Hai scampato la morte!", `Ti rimane 1 erba medicinale.`));
				}
				else if (!italian.value) {
					await (notifyCell(eventType, "You have escaped death!", 'You have 1 healing herb left.'));
				}
			}
			else {
				if (italian.value) {
					await (notifyCell(eventType, "Hai scampato la morte!", `Ti rimangono ${playerBonusCount.value} erbe medicinali.`));
				}
				else if (!italian.value) {
					await (notifyCell(eventType, "You have escaped death!", `You have ${playerBonusCount.value} healing herbs left.`));
				}
			}
		}
		else {
			await (notifyCell(eventType));
			position.value = 0;
		}
		hasPlayerAlreadyTriedDeath.value = true;
		resultText.value = false;
		roll.value = true;
	}
	else if (eventType === 'bonus') {
		playerBonusCount.value += 1;
		hasPlayerAlreadyTakenBonus.value = true;
		await (notifyCell(eventType));
		resultText.value = false;
		roll.value = true;
	}
	else if (eventType === 'empty') {
		resultText.value = false;
		roll.value = true;
	}
}

async function handleWin() {
	await delay(500);
	notifyCell('win');
	await delay(globalDelay);
	resetGame();
}

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function resetGame() {
	roll.value = true;
	position.value = 0;
	resultText.value = '';
	diceResults.r1 = null;
	diceResults.r2 = null;
	playerBonusCount.value = 0;
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

		await delay(globalDelay);

		// Wait 3.5 seconds to show the result
		showQuest.value = false;
		rolling.value = true;

		// Reset state
		showResult.value = false;
		selectedOption.value = null;
		correctCount.value = 0;
		currentQuestIndex.value = 0;

		// Delay before starting movement
		await delay(100);

		resultText.value = resultTextBackup.value;

		const maxReach = Math.min(target, MAXCELLS);

		for (let i = 0; i < Math.abs(movement); i++) {
			await delay(500);
			if (position.value > 0) {
				position.value += (position.value < maxReach) ? 1 : -1;
			}
			else {
				position.value = 0;
			}
		}

		if (target > MAXCELLS) {
			await handleOvershoot(target);
		}

		await cellEffect();

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
		activeDebug();
		clickCount.value = 0;
	}
};

// Debug menu on
const activeDebug = () => {
	showDebug.value = true;
};

// Debug menu off
const deactivateDebug = () => {
	showDebug.value = false;
}

// Teleport pawn
async function tp() {
	if (tpCell.value >= 1 && tpCell.value <= 63) {
		position.value = tpCell.value;

		await cellEffect();

		if (position.value == MAXCELLS) {
			handleWin();
		}
	}
}

const handleClick = (button) => {
	isShowingInfos.value = true;
	if (button !== null) {
		currentButton.value = button;
		const rawType = capitalizeFirstLetter(getEventType(button));
		let type = '';
		if (rawType !== undefined && rawType === 'Cell') {
			if (getEffect(button) > 0) {
				type = 'Buff';
			}
			else {
				type = 'Debuff';
			}
		}
		else {
			type = rawType;
		}
		currentButtonType.value = type;

		if (italian.value) {
			switch (currentButtonType.value) {
				case 'Empty':
					currentButtonType.value = "Vuoto";
					let buttonName = ".button-" + currentButton.value;
					let buttonDiv = document.querySelector(buttonName);
					let buttonImg = buttonDiv.querySelector("img");
					let imgSrc = buttonImg ? buttonImg.src : null;
					if (imgSrc) {
						imgName = imgSrc.replace(/Horizontal|Vertical/, "").split('/').pop().split('?')[0];
						imgName = imgName.replace(/\.[^.]+(?=\.)/, "");
					}
					switch (imgName) {
						case 'cell1.png':
							imgName = cell1;
							break;
						case 'cell2.png':
							imgName = cell2;
							break;
						case 'cell3.png':
							imgName = cell3;
							break;
						case 'cell4.png':
							imgName = cell4;
							break;
						case 'cell5.png':
							imgName = cell5;
							break;
						case 'piece.png':
							imgName = pieceImg;
							break;
						default:
							break;
					}
					currentButtonImg.value = imgName;
					currentButtonDescription.value = "Questa è una cella normale!";
					break;
				case 'Buff':
					currentButtonType.value = "Avanzamento";
					currentButtonImg.value = buffImg;
					currentButtonDescription.value = "Vai avanti!";
					break;
				case 'Debuff':
					currentButtonType.value = "Retrocessione";
					currentButtonImg.value = debuffImg;
					currentButtonDescription.value = "Vai indietro!";
					break;
				case 'Question':
					currentButtonType.value = "Domanda";
					currentButtonImg.value = questionImg;
					currentButtonDescription.value = "Rispondi alle domande per continuare!";
					break;
				case 'Bonus':
					currentButtonImg.value = bonusImg;
					currentButtonDescription.value = "Ricevi una pozione curativa!";
					break;
				case 'Death':
					currentButtonType.value = "Morte";
					currentButtonImg.value = deathImg;
					currentButtonDescription.value = "Sei morto, ricomincia da capo!";
					break;
				case 'Final':
					currentButtonType.value = "Finale";
					currentButtonImg.value = finalImg;
					currentButtonDescription.value = "Questa è la cella finale. Hai vinto!";
					break;
			}
		}
		else if (!italian.value) {
			switch (currentButtonType.value) {
				case 'Empty':
					let buttonName = ".button-" + currentButton.value;
					let buttonDiv = document.querySelector(buttonName);
					let buttonImg = buttonDiv.querySelector("img");
					let imgSrc = buttonImg ? buttonImg.src : null;
					if (imgSrc) {
						imgName = imgSrc.replace(/Horizontal|Vertical/, "").split('/').pop().split('?')[0];
						imgName = imgName.replace(/\.[^.]+(?=\.)/, "");
					}
					switch (imgName) {
						case 'cell1.png':
							imgName = cell1;
							break;
						case 'cell2.png':
							imgName = cell2;
							break;
						case 'cell3.png':
							imgName = cell3;
							break;
						case 'cell4.png':
							imgName = cell4;
							break;
						case 'cell5.png':
							imgName = cell5;
							break;
						case 'piece.png':
							imgName = pieceImg;
							break;
						default:
							break;
					}
					currentButtonImg.value = imgName;
					currentButtonDescription.value = "This is a normal cell!";
					break;
				case 'Buff':
					currentButtonImg.value = buffImg;
					currentButtonDescription.value = "Go forward!";
					break;
				case 'Debuff':
					currentButtonImg.value = debuffImg;
					currentButtonDescription.value = "Go back!";
					break;
				case 'Question':
					currentButtonImg.value = questionImg;
					currentButtonDescription.value = "Answer the questions to proceed!";
					break;
				case 'Bonus':
					currentButtonImg.value = bonusImg;
					currentButtonDescription.value = "Obtain a healing potion!";
					break;
				case 'Death':
					currentButtonImg.value = deathImg;
					currentButtonDescription.value = "You are dead, start over!";
					break;
				case 'Final':
					currentButtonImg.value = finalImg;
					currentButtonDescription.value = "This the final cell. You won!";
					break;
			}
		}
	}
	isCellSelected.value = true;
};
//#endregion

//#region traslation
const changeLanguage = (languageId) => {
	switch (languageId) {
		case 1:
			italian.value = false;
			italy.value.style.opacity = 0.5;
			uk.value.style.opacity = 1;
			break;
		case 2:
			italian.value = true;
			italy.value.style.opacity = 1;
			uk.value.style.opacity = 0.5;
			break;
		default:
			break;
	}
	if (isShowingInfos.value) {
		handleClick(currentButton.value);
	}
}
//#endregion

// Horizontal or Vertical or spanish
const horizontalCells = [
	3, 4, 7, 8, 9, 13, 14, 15, 16, 21,
	22, 23, 24, 25, 31, 32, 33, 34, 35,
	36, 43, 44, 45, 46, 47, 48, 49, 57,
	58, 59, 60, 61, 62
]

const isHorizontal = (index) => horizontalCells.includes(index);

// Stores the image chosen for the empty cell so that it isn't randomized on every render
const emptyCellImageMap = new Map();

const getCellImageSrc = (cellNumber, type) => {
	const horizontal = isHorizontal(cellNumber);

	// For random selection of normal cells, assign once and store
	if (type === 'empty') {
		// Only get a random image if the cell doesn't already have one
		if (!emptyCellImageMap.has(cellNumber)) {
			const randomCell = Math.floor(Math.random() * 5) + 1; // Random number between 1 and 5
			emptyCellImageMap.set(cellNumber, `cell${randomCell}`);
		}
		type = emptyCellImageMap.get(cellNumber);
	}

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
	italy.value.style.opacity = 0.5;
});
</script>

<style lang="scss">
@import url('@/styles/grid.scss');
@import url('@/styles/pawn.scss');
@import url('@/styles/dice.scss');
@import url('@/styles/quest.scss');
@import url('@/styles/bat.scss');
@import url('@/styles/cellInfo.scss');
@import url('@/styles/notification.scss');
@import url('../styles/translation.scss');
@import url('@/styles/debugMenu.scss');
</style>