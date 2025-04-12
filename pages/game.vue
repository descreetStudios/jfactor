<template>
	<!-- Collegamento al menu -->
	<div class="navbar" ref="navbar" @mouseenter="navbarOver" @mouseleave="navbarLeave">
		<NuxtLink to="./">
			<div class="firstCell">
				<img class="navbarImage" src="@/assets/images/homeButton.png" alt="Home">
				<transition name="fade">
					<h2 v-if="showTitle" class="navbarTitle" ref="navbarTitle">HOME</h2>
				</transition>
			</div>
		</NuxtLink>
		<div class="cell">
			<img class="navbarImage" src="@/assets/images/playButton.png" alt="Home">
			<transition name="fade">
				<h2 v-if="showTitle" class="navbarTitle" ref="navbarTitle">PLAY</h2>
			</transition>
		</div>
		<div class="cell">
			<img class="navbarImage" src="@/assets/images/teamButton.png" alt="Home">
			<transition name="fade">
				<h2 v-if="showTitle" class="navbarTitle" ref="navbarTitle">ABOUT US</h2>
			</transition>
		</div> 
		<div class="lastCell">
			<img class="navbarImage" src="@/assets/images/newsButton.png" alt="Home">
			<transition name="fade">
				<h2 v-if="showTitle" class="navbarTitle" ref="navbarTitle">NEWS AND <br> UPDATES</h2>
			</transition>
		</div>
	</div>
	<button class="randBtn" @click="handleMove">Genera numero</button>

	<div class="grid-wrapper">
		<div class="spiral-grid">
			<div v-for="(button, index) in spiral" :key="index"
				:class="['button', button === null ? 'button-null' : 'button-' + button]" :ref="'cell' + index"
				@click="handleClick(button)">
				{{ button !== null ? button : '' }}
			</div>
		</div>
	</div>

</template>

<script>
import { generateSpiral } from "@/scripts/grid.js";
import { createImageAtPosition, numGen, movePlayer } from "@/scripts/game.js";

const pieceImg = new URL('@/assets/images/piece.jpg', import.meta.url).href;

export default {
	name: "SpiralButtons",
	data() {
		return {
			spiral: generateSpiral(63, 8), // 63 numeri in una griglia 8x8
			width: 0,
			showTitle: false,
		};
	},
	mounted(){
		this.width=this.$refs.navbar.scrollWidth;
		this.$refs.navbar.style.setProperty('--fitcontent-width', `${this.width}px`);
	},
	methods: {
		handleMove() {
			movePlayer(this.spiral, numGen, createImageAtPosition, pieceImg, this.$refs);
		},

		handleClick(buttonNumber) {
			if (buttonNumber !== null) {
				alert(`Hai cliccato sul numero ${buttonNumber}`);
			}
		},
		navbarOver(){
			this.width=this.$refs.navbar.scrollWidth;
			this.$refs.navbar.style.setProperty('--target-width', `${this.width}px`);
			this.$refs.navbar.style.animation="navbarOver 1s forwards";
			const checkWidth = setInterval(()=>{
				this.width=this.$refs.navbar.scrollWidth;
				if (this.width>=200) {
					this.showTitle=true;
					clearInterval(checkWidth);
				}
			}, 100)
		},
		navbarLeave(){
			this.width=this.$refs.navbar.scrollWidth;
			this.$refs.navbar.style.setProperty('--target-width', `${this.width}px`);
			this.$refs.navbar.style.animation="navbarLeave 1s forwards";
			const checkWidth = setInterval(()=>{
			this.width=this.$refs.navbar.scrollWidth;
			if (this.width<=400) {
				this.showTitle=false;
				clearInterval(checkWidth);
			}
			}, 100)
		},
	},
};
</script>

<style lang="scss">
@import url('@/styles/grid.scss');
@import url('../styles/menuBar.scss');

/* DEBUG
@import url('@/styles/debug.scss');
*/
</style>
