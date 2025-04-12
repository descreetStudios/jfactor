<template>
	<!-- Collegamento al menu -->
	<NuxtLink to="./">
		<button class="menuBtn">Torna al Menu</button>
	</NuxtLink>
	<button class="randBtn" @click="movePlayer">Genera numero</button>

	<br><br><br><br><br><br>
	
	<div class="grid-wrapper">
		<div class="spiral-grid">
			<div v-for="(button, index) in spiral" :key="index"
				:class="['button', button === null ? 'button-null' : 'button-' + button]" 
				:ref="'cell' + index"
				@click="handleClick(button)">
				{{ button !== null ? button : '' }}
			</div>
		</div>
	</div>

	

</template>

<script>
import { generateSpiral } from "@/scripts/grid";
const pieceImg = new URL('@/assets/images/piece.jpg', import.meta.url).href;

export default {
	name: "SpiralButtons",
	data() {
		return {
			spiral: generateSpiral(63, 8), // 63 numeri in una griglia 8x8
		};
	},
	methods: {
		// Creating piece
		createImageAtPosition(src, x, y) {
			// Crea un nuovo elemento immagine
			const img = document.createElement('img');
			
			// Imposta la sorgente dell'immagine
			img.src = src;
			img.style.width = '40px';
			img.style.height = '40px';
			
			// Imposta le proprietà di stile per posizionare l'immagine
			img.style.position = 'absolute'; // Assicurati che l'immagine sia posizionata in modo assoluto
			img.style.left = `${x}px`; // Imposta la coordinata x
			img.style.top = `${y}px`; // Imposta la coordinata y
			
			// Aggiungi l'immagine al body o a un contenitore specifico
			document.body.appendChild(img);
		},

		// Dice RNG
		numGen(min, max) {
			return Math.floor(Math.random() * max) + min;
		},

		movePlayer() {
			const die1 = this.numGen(1, 6);
			const die2 = this.numGen(1, 6);
			const movement = die1 + die2;

			alert("Movement: " + movement);	

			for(let i = 0; i < movement; i++) {
				// Finding the element
				const element = this.$refs['cell' + i][0]; // Prendo il primo elemento soltanto dato che 
														   // Restituisce un array

				if (element) {
					console.log(element); // Questo dovrebbe stampare l'elemento corretto

					// Ottieni la posizione dell'elemento
					const rect = element.getBoundingClientRect();
					console.log(`Posizione dell'elemento ${i}:`, {
						top: rect.top,
						left: rect.left,
						width: rect.width,
						height: rect.height
					});
					
					this.createImageAtPosition(pieceImg, rect.left, rect.top); //TODO: Non trova l'immagine
				} else {
						console.log(`Elemento non trovato per index: ${i}`);
				}

				
			}
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
@import url('../styles/grid.scss');

// DEBUG
//@import url('../styles/debug.scss');
</style>
