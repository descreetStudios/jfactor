<template>
  <div>
    <div class="navbar" ref="navbar" @mouseover="navbarOver" @mouseleave="navbarLeave">
            <div class="cell">
                <img class="navbarImage" src="../Assets/Images/homeButton.png" alt="Home">
                <transition name="fade">
                    <h2 v-if="showTitle" class="navbarTitle" ref="navbarTitle">HOME</h2>
                </transition>
            </div>
            <div class="cell">
                <img class="navbarImage" src="../Assets/Images/playButton.png" alt="Home">
                <transition name="fade">
                    <h2 v-if="showTitle" class="navbarTitle" ref="navbarTitle">PLAY</h2>
                </transition>
            </div>
            <div class="cell">
                <img class="navbarImage" src="../Assets/Images/teamButton.png" alt="Home">
                <transition name="fade">
                    <h2 v-if="showTitle" class="navbarTitle" ref="navbarTitle">ABOUT US</h2>
                </transition>
            </div> 
            <div class="cell">
                <img class="navbarImage" src="../Assets/Images/newsButton.png" alt="Home">
                <transition name="fade">
                    <h2 v-if="showTitle" class="navbarTitle" ref="navbarTitle">NEWS AND UPDATES</h2>
                </transition>
            </div>
    </div>
  </div>
</template>

<script>
export default {
	data() {
		return {
			width: 0,
            showTitle: false,
		};
	},
    methods: {
        navbarOver(){
            this.width=this.$refs.navbar.scrollWidth;
            this.$refs.navbar.style.setProperty('--target-width', `${this.width}px`);
            this.$refs.navbar.style.animation="navbarOver 2s forwards";
            setTimeout(() => {
                this.showTitle=true;
            }, 1000); 
        },
        navbarLeave(){
            this.width=this.$refs.navbar.scrollWidth;
            this.$refs.navbar.style.setProperty('--target-width', `${this.width}px`);
            this.$refs.navbar.style.animation="navbarLeave 2s forwards";
            this.showTitle=false;
        },
    },
};
</script>

<style>
    @import url('../styles/menu.css');
</style>