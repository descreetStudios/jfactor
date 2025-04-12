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
		</ul>
	</div>

	<!-- Buttons and Title -->
	<div class="title">
		<img class="titleImage" src="../assets/images/title.png" alt="UPG">
		<div class="buttons">
			<!-- manda alla pagina di gioco -->
			<NuxtLink to="./game">
				<button type="button" class="playButton">
					<span>PLAY</span>
				</button>
			</NuxtLink>

			<button type="button">
				<span>TUTORIAL</span>
			</button>
			<button type="button">
				<span>CREDITS</span>
			</button>
		</div>
	</div>

	<!--
	<div class="bat"></div>
	-->
</template>

<script>

</script>

<style lang="scss">
@import url('../styles/title.scss');
@import url('../styles/bg.scss');
//@import url('../styles/bat.scss');

// DEBUG
//@import url('../styles/debug.scss');
</style>
