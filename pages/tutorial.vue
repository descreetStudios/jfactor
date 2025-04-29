<template>
  <div ref="left" class="left">
		<img src="@/assets/images/portone.jpg">
	</div>
	<div ref="right" class="right">
		<img src="@/assets/images/portone.jpg">
	</div>

  
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
          The game loop essentially consists of throwing two dice, and moving forward as many times as the number the dice roll resulted in.
          If you land on a special cell, you might be set back or launched forward a certain number of steps, or something else might happen to your piece.
        </p>
      </section>

      <section id="cellTypes" class="section-block">
        <h2>Cell Types</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.transitionOpen();
  },
  methods: {
    transitionOpen() {
      this.$refs.left.style.animation="leftOut 1s forwards";
	    this.$refs.right.style.animation="rightOut 1s forwards";
    },
  }
}
</script>

<style lang="scss">
    @import url('../styles/transition.scss');
    @import url('../styles/tutorial.scss');
</style>