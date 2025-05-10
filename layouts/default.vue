<template>
    
    <!-- Transition -->
    <div ref="left" class="left">
        <img src="@/assets/images/left.png">
    </div>
    <div ref="right" class="right">
        <img src="@/assets/images/right.png">
    </div>
    
    
    <div v-if="error && !bypass">
        <!-- Particles -->
        <div>
            <div class="rain front-row">
                <div v-for="(drop, index) in drops" :key="index" v-html="drop"></div>
            </div>
            <div class="rain back-row">
                <div v-for="(backDrop, index) in backDrops" :key="index" v-html="backDrop"></div>
            </div>
        </div>
        
        <div class="title">
            <img class="titleImage" src="@/assets/images/logo.png" alt="UPG">
            <div class="buttons">
                <span class="pixelText">
                    <img src="@/assets/images/alert.png" alt="ALERT!" class="alert" style="height: 4rem;">
                    You are launching the game on an unsupported resolution
                    <img src="@/assets/images/alert.png" alt="ALERT!" class="alert" style="height: 4rem; ">
                </span>
                <button type="button" class="playButton" ref="button" @click="transitionClose(5)">
                    <span>OK</span>
                </button>
            </div>
        </div>
    </div>
    <div v-else>
        
        
        
        <NuxtPage />
        <!-- Buttons and Title -->
        <div v-if="!navbarVisible && !error" class="title">
            <img class="titleImage" src="@/assets/images/logo.png" alt="UPG">
            <div class="buttons">
                <button type="button" class="playButton" ref="button" @click="transitionClose(2)">
                    <span>PLAY</span>
                </button>
                
                <button type="button" ref="button" @click="transitionClose(3)">
                    <span>TUTORIAL</span>
                </button>
                
                <button type="button" ref="button" @click="transitionClose(4)">
                    <span>CREDITS</span>
                </button>
            </div>
        </div>
        <!-- Navbar -->
        <div v-if="navbarVisible && !error" class="navbar" ref="navbar" @mouseenter="navbarOver"
        @mouseleave="navbarLeave">
        <div class="firstCell" @click="transitionClose(1)" :class="{ disabled: currentPage === 1 }">
            <img class="navbarImage" src="@/assets/images/homeButton.png" alt="Home">
            <transition name="fade">
                <h2 v-if="showTitle" class="navbarTitle" ref="navbarTitle">HOME</h2>
            </transition>
        </div>
        <div class="cell" @click="transitionClose(3)" :class="{ disabled: currentPage === 3 }">
            <img class="navbarImage" src="@/assets/images/newsButton.png" alt="Tutorial">
            <transition name="fade">
                <h2 v-if="showTitle" class="navbarTitle" ref="navbarTitle">TUTORIAL</h2>
            </transition>
        </div>
        <div class="lastCell" @click="transitionClose(4)" :class="{ disabled: currentPage === 4 }">
            <img class="navbarImage" src="@/assets/images/teamButton.png" alt="Credits">
            <transition name="fade">
                <h2 v-if="showTitle" class="navbarTitle" ref="navbarTitle">CREDITS</h2>
            </transition>
        </div>
    </div>
</div>
<!-- Background Music -->
<bgMusic />
</template>

<script setup>
// for background music
import bgMusic from '../components/bgMusic.vue';

let clickSound

import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router'

const currentPage = ref(1);
const route = useRoute();
const error = ref(false);
const bypass = ref(false);
const left = ref(null);
const right = ref(null);
const drops = ref([]);
const backDrops = ref([]);

// Navbar refs
const navbar = ref(null);
const widthNavbar = ref(0);
const showTitle = ref(false);
const navbarVisible = ref(false);

//#region Navbar system
function navbarOver() {
    widthNavbar.value = navbar.value.scrollWidth;
    navbar.value.style.setProperty('--target-width', `${widthNavbar.value}px`);
    navbar.value.style.animation = 'navbarOver 1s forwards';
    const check = setInterval(() => {
        if (navbar.value) {
            widthNavbar.value = navbar.value.scrollWidth;
            widthNavbar.value = navbar.value.scrollWidth;
            if (widthNavbar.value >= 100) {
                showTitle.value = true;
                clearInterval(check);
            }
        }
    }, 100);
};

function navbarLeave() {
    widthNavbar.value = navbar.value.scrollWidth;
    navbar.value.style.setProperty('--target-width', `${widthNavbar.value}px`);
    navbar.value.style.animation = 'navbarLeave 1s forwards';
    const check = setInterval(() => {
        if (navbar.value) {
            widthNavbar.value = navbar.value.scrollWidth;
            if (widthNavbar.value <= 200) {
                showTitle.value = false;
                clearInterval(check);
            }
        }
    }, 100);
};

function updateNavbarWidth() {
    if (navbar.value) {
        widthNavbar.value = navbar.value.scrollWidth;
        navbar.value.style.setProperty('--fitcontent-width', `${widthNavbar.value}px`);
    }
}
//#endregion

const makeItRain = () => {
    let increment = 0;

    while (increment < 100) {
        const randoHundo = Math.floor(Math.random() * (98 - 1 + 1) + 1);
        const randoFiver = Math.floor(Math.random() * (5 - 2 + 1) + 2);
        increment += randoFiver;

        const drop = `
      <div class="drop" style="left: ${increment}%; bottom: ${randoFiver + randoFiver - 1 + 90}%; animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;">
        <div class="stem" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
        <div class="splat" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
      </div>
    `;
        const backDrop = `
      <div class="drop" style="right: ${increment}%; bottom: ${randoFiver + randoFiver - 1 + 90}%; animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;">
        <div class="stem" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
        <div class="splat" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
      </div>
    `;

        drops.value.push(drop);
        backDrops.value.push(backDrop);
    }
};

const updateScrollBehavior = () => {
    nextTick(() => {
        if (typeof document !== "undefined") {
            const htmlElement = document.documentElement;
            htmlElement.style.overflowX = "hidden"; // Disable lo scroll
            if (route.name === "tutorial") {
                htmlElement.style.overflowY = "scroll"; // Enable scroll
            } else {
                htmlElement.style.overflowY = "hidden"; // Disable lo scroll
            }
        }
    });
};

watch(
    () => route.name,
    (newName) => {
        updateScrollBehavior();
        navbarVisible.value = newName !== 'index' && !error.value;
        nextTick(() => {
            setTimeout(() => {
                transitionOpen();
            }, 300);
            if (navbarVisible.value) {
                updateNavbarWidth();
            }
        });
        switch (newName) {
            case 'index':
                currentPage.value = 1;
                break;
            case 'game':
                currentPage.value = 2;
                break;
            case 'tutorial':
                currentPage.value = 3;
                break;
            case 'credits':
                currentPage.value = 4;
                break;
            default:
                currentPage.value = 1;
        }
    },
    { immediate: true }
);

//#region Transitions

const transitionOpen = () => {
    if (left.value && right.value) {
        left.value.style.animation = 'leftOut 1s forwards';
        right.value.style.animation = 'rightOut 1s forwards';
    }
};

const transitionClose = (page) => {
    // For click sound, a new audio instance is created for each call of the function
    // So the sound is played even if the buttons are clicked quickly
    const sound = new Audio('/audio/click.mp3');
    sound.play().catch(err => {
        console.warn('Autoplay blocked:', err);
    });
    
    left.value.style.animation = "leftIn 1s forwards";
    right.value.style.animation = "rightIn 1s forwards";

    setTimeout(() => {
        switch (page) {
            case 1:
                navigateTo('./');
                break;
            case 2:
                navigateTo('./game');
                break;
            case 3:
                navigateTo('./tutorial');
                break;
            case 4:
                navigateTo('./credits');
                break;
            case 5:
                transitionOpen();
                break;
        }
        error.value = false;
        bypass.value = true;
    }, 1700);
};
//#endregion

onMounted(() => {
    nextTick(() => {
        updateScrollBehavior();
        updateNavbarWidth();
    });
    transitionOpen();
    makeItRain();
    const width = window.innerWidth;
    const height = window.screen.height;
    if (width !== 1920 || height !== 1080) {
        error.value = true;
        nextTick(() => {
            transitionOpen();
        });
    }
});
</script>

<style lang="scss">
@import url('@/styles/title.scss');
@import url('@/styles/bg.scss');
@import url('@/styles/transition.scss');
@import url('@/styles/navbar.scss');

/*Debug*/
//@import url('@/styles/debug.scss');
::-webkit-scrollbar {
    width: 0px;
}

.disabled {
    pointer-events: none;
    opacity: 0.5;
}
</style>