<template>
    <div v-if="error && !bypass">
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

        <div class="title">
            <img class="titleImage" src="@/assets/images/logo.png" alt="UPG">
            <div class="buttons">
                <button type="button" class="playButton" ref="button" @click="transitionClose(1)">
                    <span>PLAY</span>
                </button>
            </div>
        </div>
    </div>
    <div v-else>
        <slot />
    </div>
</template>

<script>
    export default {
        data(){
            return{
                error:false,
                bypass:false,
                width:0,
                height:0
            };
        },
        mounted(){
            this.width=window.innerWidth;
            this.height=screen.height;
            if (this.width!=1920||this.height!=1080) {
                this.error=true;
            }
        },
        methods: {
            transitionClose(page) {
                document.body.style.pointerEvents="none";
                this.$refs.left.style.animation="leftIn 1s forwards"
                this.$refs.right.style.animation="rightIn 1s forwards"
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
                    this.error=false;
                    this.bypass=true;
                },1000);
            },
        }
    }
</script>

<style lang="scss">
    @import url('@/styles/title.scss');
    @import url('@/styles/bg.scss');
    @import url('@/styles/transition.scss');
    
    /*Debug*/
    //@import url('@/styles/debug.scss');
</style>