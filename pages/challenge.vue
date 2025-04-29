<template>
    <div class="page-wrapper">
      <div class="carousel" v-if="!showResult">
        <div class="question-text">
          {{ currentQuestion.question }}
        </div>
  
        <div class="options">
          <button
            v-for="(option, idx) in currentQuestion.options"
            :key="idx"
            :disabled="selectedOption !== null"
            @click="selectOption(option)"
          >
            {{ option }}
          </button>
        </div>
  
        <div class="feedback" v-if="selectedOption !== null">
          <span v-if="isCorrect">✅ Corretto!</span>
          <span v-else>❌ Sbagliato. Risposta corretta: {{ currentQuestion.answer }}</span>
        </div>
  
        <div class="nav-buttons">
          <button @click="prevQuestion" :disabled="currentIndex === 0">Indietro</button>
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
  
  <style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

html {
  overflow-y: scroll;
}

.page-wrapper {
  font-family: 'Poppins', sans-serif;
  min-height: 100vh;
  background: #3e0d32;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  overflow-x: hidden;
}

.carousel {
  position: relative;
  max-width: 600px;
  width: 100%;
  background: rgba(255, 255, 255, 0.06);
  padding: 30px;
  border-radius: 16px;
  backdrop-filter: blur(6px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  color: #fff;
  text-align: center;
}

.question-text {
  font-size: 1.5rem;
  color: #fbb6ce;
  margin-bottom: 20px;
}

.options button {
  background: transparent;
  border: 2px solid #fbb6ce;
  color: #fbb6ce;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  margin: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.options button:hover:not(:disabled) {
  background: #fbb6ce;
  color: #3e0d32;
}

.options button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.feedback {
  margin-top: 10px;
  font-weight: 600;
}

.result {
  font-size: 1.8rem;
  color: #ffb8d1;
  margin-top: 30px;
  animation: flicker 2s infinite ease-in-out;
}

.nav-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.nav-buttons button {
  background: #fbb6ce;
  border: none;
  color: #3e0d32;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.nav-buttons button:hover {
  background: #ffffff;
}

@keyframes flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}

  </style>
  