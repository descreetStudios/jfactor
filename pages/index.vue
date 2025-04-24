<template>
	<!-- Particles -->
	<div>
		<div class="rain front-row">
			<div v-for="(drop, index) in drops" :key="index" v-html="drop"></div>
		</div>
		<div class="rain back-row">
			<div v-for="(backDrop, index) in backDrops" :key="index" v-html="backDrop"></div>
		</div>
	</div>

	<!-- Transition -->
	<div ref="left" class="left">
		<img src="@/assets/images/portone.jpg">
	</div>
	<div ref="right" class="right">
		<img src="@/assets/images/portone.jpg">
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
		this.transitionOpen();
		this.makeItRain();
	},
	data() {
		return {
			page: '',
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
		transitionOpen() {
			this.$refs.left.style.animation = 'leftOut 1s forwards';
			this.$refs.right.style.animation = 'rightOut 1s forwards';
		},
		transitionClose(page) {
			document.body.style.pointerEvents = "none";
			this.$refs.left.style.animation = "leftIn 1s forwards";
			this.$refs.right.style.animation = "rightIn 1s forwards";
			setTimeout(() => {
				switch (page) {
					case 1:
						navigateTo('./game');
						break;
					case 2:
						navigateTo('./tutorial');
						break;
					case 3:
						navigateTo('./credits');
						break;
				}
				document.body.style.pointerEvents = "all";
			}, 1500)
		},
	}
};
</script>

<style lang="scss">
@import url('@/styles/title.scss');
@import url('@/styles/bg.scss');
@import url('@/styles/transition.scss');
// @import url('@/styles/bat.scss');

/* DEBUG
@import url('@/styles/debug.scss');
*/
</style>