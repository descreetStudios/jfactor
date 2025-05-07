<template>
  <title>Untitled Plague Game - Tutorial</title>
  <div class="page-wrapper">
    <div class="content">
      <!-- yap sesh -->
      <h1 class="credits-title">UNTITLED PLAGUE GAME</h1>

      <nav class="section-nav">
        <a href="#lore">Lore</a>
        <a href="#mechanics">Mechanics</a>
        <a href="#cellTypes">Cell Types</a>
      </nav>

      <section id="lore" class="section-block">
        <h2>Lore</h2>
        <p>
          In this game, the player takes on the role of a medieval peasant living in a bustling town. 
        </p>
        <p><em>During the black plague.</em></p>
        <p>
          As such, you are trying to escape the hellhole that this once flourishing town has turned into, and find safety in the outer countryside,
          where other people (and possible plague bearers) are few and scattered.
        </p>
        <p><em>Easier said than done.</em></p>
        <p>
          Making your way from the dark core of this village to the green plains beyond won't be an easy feat:
          you'll face many obstacles, some of which could set you back significantly on your journey.
          Fortunately, there are many ways to overcome them—and who knows, if your fate isn't sealed by the raging plague along the way,
          you might just manage to build a new, more isolated life for yourself amidst the grassy fields that living in a death-reeking town made you long for.
        </p>
      </section>

      <section id="mechanics" class="section-block">
        <h2>Mechanics</h2>
        <p>
          As much as you want to get out of here, taking a look at what you can expect to find on your way is seldom a bad decision.
        </p>
        <p>
          This game works similarly to the classic Goose Game: a spiral of cells with a pawn that has to move from cell one to cell sixty-three,
          encountering bonuses and maluses along its way. The key difference here is that instead of starting at the outer end of the spiral and moving to the center,
          you start in the middle of the board (plague-afflicted town) and have to get to the exit of the spiral (countryside).
        </p>
        <p>
          The game loop essentially consists of throwing the dice, and moving forward as many times as the number the dice roll resulted in.
          If you land on a special cell, you might be set back or moved forward a certain number of steps, or something else might happen to your piece.
        </p>
      </section>

      <section id="cellTypes" class="section-block">
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
            These cells can cancel a set back or death effect, allowing you to stay firmly in place and keep on moving forward.  
            <br>
        </p>
        <p>
          
        </p>
      </section>
    </div>
  </div>
</template>

<script>
</script>

<style lang="scss">
    @import url('../styles/tutorial.scss');
</style>