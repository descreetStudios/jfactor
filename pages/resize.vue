<template>
	<div>
		<p>Width: {{ width }}px, Height: {{ height }}px</p>
	</div>
</template>

<script>
export default {
	data() {
		return {
			width: 0,
			height: 0,
		};
	},
	mounted() {
		this.updateDimensions();
		window.addEventListener('resize', this.updateDimensions);
	},
	destroyed() {
		window.removeEventListener('resize', this.updateDimensions);
	},
	methods: {
		updateDimensions() {
			this.width = window.innerWidth;
			this.height = window.innerHeight;
		},
	},
};
</script>

<style scoped>
	p {
		font-size: 18px;
		font-weight: bold;
	}
</style>
