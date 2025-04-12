<template>
	<!-- Collegamento al menu -->
	<NuxtLink to="./">
		<button class="menuBtn">Torna al Menu</button>
	</NuxtLink>
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
		};
	},
	methods: {
		handleMove() {
			movePlayer(this.spiral, numGen, createImageAtPosition, pieceImg, this.$refs);
		},

		handleClick(buttonNumber) {
			if (buttonNumber !== null) {
				alert(`Hai cliccato sul numero ${buttonNumber}`);
			}
		}
	},
};
</script>

<style lang="scss">
@import url('@/styles/grid.scss');

/* DEBUG
@import url('@/styles/debug.scss');
*/
</style>
