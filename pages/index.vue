<template>
	<title>Untitled Plague Game - Homepage</title>

	<!-- Particles -->
	<div>
		<div class="rain front-row">
			<div v-for="(drop, index) in drops" :key="index" v-html="drop"></div>
		</div>
		<div class="rain back-row">
			<div v-for="(backDrop, index) in backDrops" :key="index" v-html="backDrop"></div>
		</div>
	</div>

	<!-- Buttons and Title -->
	<div class="title">
		<img class="titleImage" src="@/assets/images/logo.png" alt="UPG">
		<div class="buttons">

			<button type="button" class="playButton" ref="button" @click="transitionClose(1)">
				<span>PLAY</span>
			</button>

			<button type="button" ref="button" @click="transitionClose(2)">
				<span>TUTORIAL</span>
			</button>

			<button type="button" ref="button" @click="transitionClose(3)">
				<span>CREDITS</span>
			</button>
		</div>
	</div>

	<!--
	<div class="bat"></div>
	-->
</template>

<script>
export default {
	mounted() {
		this.makeItRain();
	},
	data() {
		return {
			drops: [],
			backDrops: []
		};
	},
	methods: {
		makeItRain() {
			let increment = 0;

			while (increment < 100) {
				const randoHundo = Math.floor(Math.random() * (98 - 1 + 1) + 1);
				const randoFiver = Math.floor(Math.random() * (5 - 2 + 1) + 2);
				increment += randoFiver;

				const drop = `
					<div class="drop" style="left: ${increment}%; bottom: ${randoFiver + randoFiver - 1 + 90}%; animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;">
						<div class="stem" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
						<div class="splat" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
					</div>
				`;
				const backDrop = `
					<div class="drop" style="right: ${increment}%; bottom: ${randoFiver + randoFiver - 1 + 90}%; animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;">
						<div class="stem" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
						<div class="splat" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
					</div>
				`;

				this.drops.push(drop);
				this.backDrops.push(backDrop);
			}
		},
	}
};
</script>

<style lang="scss">
@import url('@/styles/title.scss');
@import url('@/styles/bg.scss');
// @import url('@/styles/bat.scss');

/* DEBUG
@import url('@/styles/debug.scss');
*/
</style>