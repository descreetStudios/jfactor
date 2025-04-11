<template>
  <div>
    <div class="navbar" ref="navbar" @mouseover="navbarOver" @mouseleave="navbarLeave">
            <div class="firstCell">
                <img class="navbarImage" src="../assets/images/homeButton.png" alt="Home">
                <transition name="fade">
                    <h2 v-if="showTitle" class="navbarTitle" ref="navbarTitle">HOME</h2>
                </transition>
            </div>
            <div class="cell">
                <img class="navbarImage" src="../assets/images/playButton.png" alt="Home">
                <transition name="fade">
                    <h2 v-if="showTitle" class="navbarTitle" ref="navbarTitle">PLAY</h2>
                </transition>
            </div>
            <div class="cell">
                <img class="navbarImage" src="../assets/images/teamButton.png" alt="Home">
                <transition name="fade">
                    <h2 v-if="showTitle" class="navbarTitle" ref="navbarTitle">ABOUT US</h2>
                </transition>
            </div> 
            <div class="cell">
                <img class="navbarImage" src="../assets/images/newsButton.png" alt="Home">
                <transition name="fade">
                    <h2 v-if="showTitle" class="navbarTitle" ref="navbarTitle">NEWS AND <br> UPDATES</h2>
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
            this.$refs.navbar.style.animation="navbarOver 1s forwards";
            const checkWidth = setInterval(()=>{
                this.width=this.$refs.navbar.scrollWidth;
                if (this.width>=200) {
                    this.showTitle=true;
                    clearInterval(checkWidth);
                }
            },100)
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
            },100)
        },
    },
};
</script>

<style>
    @import url('../styles/menu.css');
    
    /* 
    Debug
    @import url('../styles/debug.css');
    */
</style>