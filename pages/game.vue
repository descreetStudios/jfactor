<template>
<!-- Collegamento al menu -->
<NuxtLink to="./">
  <button class="menuBtn">Torna al Menu</button>
</NuxtLink>

	<div class="grid-wrapper">
		<div class="spiral-grid">
			<div 
				v-for="(button, index) in spiral"
				:key="index"
				:class="['button', button === null ? 'button-null' : 'button-' + button]"
				@click="handleClick(button)"
			>
				{{ button !== null ? button : '' }}
			</div>
		</div>
	</div>
</template>

<script>
import { generateSpiral } from "@/scripts/grid";

export default {
	name: "SpiralButtons",
	data() {
		return {
			spiral: generateSpiral(63, 8), // 63 numeri in una griglia 8x8
		};
	},
	methods: {
		handleClick(buttonNumber) {
			if (buttonNumber !== null) {
				alert(`Hai cliccato sul numero ${buttonNumber}`);
			}
		}
	},
};
</script>

<style lang="scss">
	@import url('../styles/grid.scss');

	// DEBUG
	//@import url('../styles/debug.css');
</style>
