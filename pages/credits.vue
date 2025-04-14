<template>
  <!-- for transition -->
  <div ref="left" class="left"></div>
  <div ref="right" class="right"></div>

  <div class="page-wrapper">
    <div class="box">
      <ul>
        <li v-for="n in 35" :key="n"></li>
      </ul>
    </div>

    <div class="content">
      <img :src="creditsTitle" alt="Credits" class="credits-img" />
      <div class="credits-grid">
        <div v-for="person in people" :key="person.name" class="credit-card">
            <NuxtLink :to="person.link">
              <img :src="person.icon" alt="no pfp :(" class="icon-img" />
            <h2>{{ person.name }}</h2>
            </NuxtLink>
          </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

import creditsTitle from '@/assets/images/creditsTitle.png';

// for transition
const left = ref(null);
const right = ref(null);

const people = [
  { name: 'Brambilla Luca', icon: 'https://avatars.githubusercontent.com/u/82886061?v=4', link: 'https://github.com/ImLuCz' },
  { name: 'Bruschi Nicolas', icon: 'https://avatars.githubusercontent.com/u/199809797?s=64&v=4', link: 'https://github.com/NullSteam600395' },
  { name: 'Bruschi Thomas', icon: 'https://avatars.githubusercontent.com/u/199808687?v=4', link: 'https://github.com/ScalierBullet63' },
  { name: 'Mizzi Marco', icon: 'https://avatars.githubusercontent.com/u/133532352?s=64&v=4', link: 'https://github.com/descreetStudios' },
  { name: 'Zanellati Stefano', icon: 'https://avatars.githubusercontent.com/u/206925270?s=64&v=4', link: 'https://github.com/SteZane' },
]

const transitionOpen = () => {
  left.value.style.animation = 'leftOut 1s forwards';
  right.value.style.animation = 'rightOut 1s forwards';
};

onMounted(() => {
  transitionOpen();
});
</script>

<style lang="scss">
    @import url('../styles/transition.scss');
    @import url('../styles/credits.scss');
</style>