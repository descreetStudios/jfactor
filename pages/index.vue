<template>
	<!-- Particles -->
	<div class="box">
		<ul>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
		</ul>
	</div>

	<div ref="left" class="left"></div>
	<div ref="right" class="right"></div>

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
	},
	data() {
		return {
			page: ''
		};
	},
	methods: {
		transitionOpen() {
			this.$refs.left.style.animation = 'leftOut 1s forwards';
			this.$refs.right.style.animation = 'rightOut 1s forwards';
		},
		transitionClose(page) {
			document.body.style.pointerEvents = "none";
			this.$refs.left.style.animation = "leftIn 1s forwards";
			this.$refs.right.style.animation = "rightIn 1s forwards";
			setTimeout(()=>{
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
				document.body.style.pointerEvents="all";
			},1500)
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