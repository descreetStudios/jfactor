<template>
    <div v-if="error && !bypass">
        <div ref="left" class="left">
		    <img src="@/assets/images/portone.jpg">
	    </div>
	    <div ref="right" class="right">
	    	<img src="@/assets/images/portone.jpg">
	    </div>

        <!-- Particles -->
        <div class="box">
            <ul>
                <li v-for="n in 24" :key="n"></li>
            </ul>
        </div>

        <div class="title">
            <img class="titleImage" src="@/assets/images/logo.png" alt="UPG">
            <div class="buttons">
                <span class="pixelText">
                    <img src="@/assets/images/alert.png" alt="ALERT!" class="alert" style="height: 4rem;">
                    You are launching the game on an unsupported resolution
                    <img src="@/assets/images/alert.png" alt="ALERT!" class="alert" style="height: 4rem; " >
                </span>
                <button type="button" class="playButton" ref="button" @click="transitionClose(1)">
                    <span>OK</span>
                </button>
            </div>
        </div>
    </div>
    <div v-else>
        <slot />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const error = ref(false);
const bypass = ref(false);
const left = ref(null);
const right = ref(null);

onMounted(() => {
    const width = window.innerWidth;
    const height = window.screen.height;
    if (width !== 1920 || height !== 1080) {
        error.value = true;
        nextTick(() => {
            transitionOpen();
        });
    }
});

const transitionOpen = () => {
  if (left.value && right.value) {
      left.value.style.animation = 'leftOut 1s forwards';
      right.value.style.animation = 'rightOut 1s forwards';
  }
};

const transitionClose = (page) => {
    left.value.style.animation = "leftIn 1s forwards";
    right.value.style.animation = "rightIn 1s forwards";

    setTimeout(() => {
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
        error.value = false;
        bypass.value = true;
    }, 1500);
};
</script>

<style lang="scss">
    @import url('@/styles/title.scss');
    @import url('@/styles/bg.scss');
    @import url('@/styles/transition.scss');
    
    /*Debug*/
    //@import url('@/styles/debug.scss');
</style>