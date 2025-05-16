<template>
  <title>Untitled Plague Game - Tutorial</title>
  <div class="page-wrapper">
    <div class="content">
      <img src="@/assets/images/logo.png" alt="logo" class="logo-img" />

      <h1 class="tutorial-title">TUTORIAL</h1>

      <!-- Language buttons -->
      <div>
        <button ref="uk" class="language-button" @click="changeLanguage(1)">
          <img src="@/assets/images/UK.png" alt="UK">
        </button>
        <button ref="italy" class="language-button" @click="changeLanguage(2)">
          <img src="@/assets/images/Italy.png" alt="Italy">
        </button>
      </div>

      <!-- Section Buttons -->
      <nav class="section-nav" v-if="!italian">
        <a href="#lore">Lore</a>
        <a href="#mechanics">Mechanics</a>
        <a href="#cellTypes">Cell Types</a>
      </nav>
      <nav class="section-nav" v-if="italian">
        <a href="#lore">Storia</a>
        <a href="#mechanics">Meccaniche</a>
        <a href="#cellTypes">Tipologie di Caselle</a>
      </nav>

      <!-- English Tutorial -->
      <section id="lore" class="section-block" v-if="!italian">
        <h2>Lore</h2>
        <p>
          In this game, the player takes on the role of a medieval peasant living in a bustling town.
        </p>
        <p><em>During the black plague.</em></p>
        <p>
          As such, you are trying to escape the hellhole that this once flourishing town has turned into, and find
          safety in the outer countryside,
          where other people (and possible plague bearers) are few and scattered.
        </p>
        <p><em>Easier said than done.</em></p>
        <p>
          Making your way from the dark core of this village to the green plains beyond won't be an easy feat:
          you'll face many obstacles, some of which could set you back significantly on your journey.
          Fortunately, there are many ways to overcome them—and who knows, if your fate isn't sealed by the raging
          plague along the way,
          you might just manage to build a new, more isolated life for yourself amidst the grassy fields that living in
          a death-reeking town made you long for.
        </p>
      </section>

      <section id="mechanics" class="section-block" v-if="!italian">
        <h2>Mechanics</h2>
        <p>
          As much as you want to get out of here, taking a look at what you can expect to find on your way is seldom a
          bad decision.
        </p>
        <p>
          This game works similarly to the classic Goose Game: a spiral of cells with a pawn that has to move from cell
          one to cell sixty-three,
          encountering bonuses and maluses along its way. The key difference here is that instead of starting at the
          outer end of the spiral and moving to the center,
          you start in the middle of the board (plague-afflicted town) and have to get to the exit of the spiral
          (countryside).
        </p>
        <p>
          The game loop essentially consists of throwing the dice, and moving forward as many times as the number the
          dice roll resulted in.
          If you land on a special cell, you might be set back or moved forward a certain number of steps, or something
          else might happen to your piece.
        </p>
      </section>

      <section id="cellTypes" class="section-block" v-if="!italian">
        <h2>Cell Types</h2>
        <p>
          On your journey through the town, these are the different kinds of cells you can find:
        </p>
        <p>
          <strong> - Movement Cells</strong>
          <br>
          Either move you forward or back by a certain number of cells. Simple enough.
          <br>
          <strong> - Question Cells</strong>
          <br>
          When landing on a question cell, you are tasked with answering a set of questions about the game's themes:
          If manage to prove your knowledge, you'll move forward by how many questions you got right.
          If you're just a gullible peasant, you'll be set back.
          Make sure to brush up on your medieval knowledge.
          <br>
          <strong> - Death Cells</strong>
          <br>
          Pretty self-explanatory, brings you back to the starting cell.
          <br>
          <strong> - Bonus Cells</strong>
          <br>
          These cells can cancel a set back or death effect, allowing you to stay firmly in place and keep on moving
          forward.
          <br>
        </p>
      </section>

      <!-- Italian Tutorial -->
      <section id="lore" class="section-block" v-if="italian">
        <h2>Storia</h2>
        <p> In questo gioco, il giocatore assume il ruolo di un contadino medievale che vive in una città vivace. </p>
        <p><em>Durante la peste nera.</em></p>
        <p> Di conseguenza, stai cercando di fuggire dall'inferno in cui si è trasformata questa città un tempo fiorente
          e trovare sicurezza nella campagna circostante,
          dove le persone (e i potenziali portatori di peste) sono poche e sparse. </p>
        <p><em>Più facile a dirsi che a farsi.</em></p>
        <p> Il viaggio dal cuore oscuro di questo villaggio alle verdi pianure oltre non sarà un'impresa facile:
          affronterai molti ostacoli, alcuni dei quali potrebbero rallentare significativamente il tuo cammino.
          Fortunatamente, ci sono molti modi per superarli—e chissà, se il tuo destino non sarà segnato dalla peste
          dilagante lungo il percorso,
          potresti riuscire a costruire una nuova vita più isolata tra i campi erbosi, che vivere in una città
          impregnata di morte ti ha fatto desiderare. </p>
      </section>

      <section id="mechanics" class="section-block" v-if="italian">
        <h2>Meccaniche</h2>
        <p> Per quanto tu voglia uscire da qui, dare un'occhiata a ciò che ti aspetta lungo il cammino potrebbe non
          essere una cattiva idea. </p>
        <p> Questo gioco funziona in modo simile al classico Gioco dell'Oca: una spirale di caselle con una pedina che
          deve muoversi dalla casella uno alla sessantatré,
          incontrando bonus e malus lungo il percorso. La differenza chiave qui è che, invece di partire dall'esterno
          della spirale e muoversi verso il centro,
          inizi nel mezzo della plancia (città afflitta dalla peste) e devi raggiungere l'uscita della spirale
          (campagna). </p>
        <p> Il loop di gioco consiste essenzialmente nel lanciare i dadi e avanzare tante caselle quante indicate dal
          numero ottenuto.
          Se atterri su una casella speciale, potresti essere spostato indietro o avanti di un certo numero di passi,
          oppure potrebbe accadere qualcos'altro alla tua pedina. </p>
      </section>

      <section id="cellTypes" class="section-block" v-if="italian">
        <h2>Tipologie di Caselle</h2>
        <p> Nel tuo viaggio attraverso la città, queste sono le diverse tipologie di caselle che puoi incontrare: </p>
        <p>
          <strong>- Caselle di Movimento</strong> <br>
          Ti spostano avanti o indietro di un certo numero di caselle. Semplice.
          <br>
          <strong>- Caselle Domanda</strong> <br>
          Quando atterri su una casella domanda, devi rispondere a una serie di domande sui temi del gioco:
          se riesci a dimostrare la tua conoscenza, avanzerai di tante caselle quanti sono i punti guadagnati.
          Se sei solo un credulone medievale, sarai riportato indietro.
          Assicurati di approfondire la tua conoscenza medievale.
          <br>
          <strong>- Caselle Morte</strong> <br>
          Abbastanza autoesplicativo, ti riportano alla casella iniziale.
          <br>
          <strong>- Caselle Bonus</strong> <br>
          Queste caselle possono annullare un effetto di arretramento o morte, permettendoti di rimanere fermo e
          continuare ad avanzare.
          <br>
        </p>
      </section>

      <!-- Italian Canva Slides -->
      <div class="slidesContainer" v-if="italian">
        <iframe class="slides" loading="lazy"
          src="https://www.canva.com/design/DAGlSPe64ks/iE2VhdL-8mJ7dlPPUyGJIA/view?embed"
          allowfullscreen="allowfullscreen" allow="fullscreen" frameborder="0">
        </iframe>
      </div>
      <!-- English Canva Slides -->
      <div class="slidesContainer" v-if="!italian">
        <iframe class="slides" loading="lazy"
          src= "https://www.canva.com/design/DAGnniZVmQU/YsMm_4FVDsSjlTTzsBBxHg/view?embed"
          allowfullscreen="allowfullscreen" allow="fullscreen" frameborder="0">
        </iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

let italian = ref(false);
const uk = ref(null);
const italy = ref(null)

onMounted(() => {
  italy.value.style.opacity = 0.5;
})

function changeLanguage(languageId) {
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
}

</script>

<style lang="scss">
@import url('../styles/tutorial.scss');
@import url('../styles/translation.scss');
</style>