<template>
  <div class="page-wrapper">
    <div class="carousel" v-if="!showResult">
      <div class="question-text">
        {{ currentQuestion.question }}
      </div>

      <div class="options">
        <button v-for="(option, index) in currentQuestion.options" :key="index" :disabled="selectedOption !== null"
          @click="selectOption(option)">
          {{ option }}
        </button>
      </div>

      <div class="feedback" v-if="selectedOption !== null">
        <span v-if="isCorrect" class="rightAns">Corretto!</span>
        <span v-else class="wrongAns">Sbagliato. Risposta corretta: {{ currentQuestion.answer }}</span>
      </div>

      <div class="nav-buttons">
        <button @click="prevQuestion" :disabled="currentIndex == 0">Indietro</button>
        <button @click="nextQuestion" :disabled="selectedOption === null">
          {{ currentIndex === questions.length - 1 ? 'Vedi Risultato' : 'Avanti' }}
        </button>
      </div>
    </div>

    <div class="result" v-else>
      Hai risposto correttamente a {{ correctCount }} su {{ questions.length }} domande!
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// TODO: Inserire domande vere
const questions = [
  {
    question: 'Qual è la capitale della Francia?',
    options: ['Parigi', 'Roma', 'Madrid', 'Berlino'],
    answer: 'Parigi',
  },
  {
    question: 'Quanto fa 5 + 3?',
    options: ['6', '7', '8', '9'],
    answer: '8',
  },
  {
    question: 'In che continente si trova il Brasile?',
    options: ['Africa', 'Asia', 'America del Sud', 'Europa'],
    answer: 'America del Sud',
  },
]

const currentIndex = ref(0)
const selectedOption = ref(null)
const correctCount = ref(0)
const showResult = ref(false)

const currentQuestion = computed(() => questions[currentIndex.value])

const isCorrect = computed(() => selectedOption.value === currentQuestion.value.answer)

function selectOption(option) {
  selectedOption.value = option
  // Se la risposta scelta è uguale a quella corretta
  if (option === currentQuestion.value.answer) {
    correctCount.value++
  }
}

function nextQuestion() {
  if (currentIndex.value < questions.length - 1) {
    currentIndex.value++
    selectedOption.value = null
  } else {
    showResult.value = true
  }
}

function prevQuestion() {
  if (currentIndex.value > 0) {
    currentIndex.value--
    selectedOption.value = null
  }
}
</script>

<style>
@import url('@/styles/quest.scss');
</style>