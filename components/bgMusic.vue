<template>
</template>
  
<script setup>
  let bgMusic
  
  onMounted(() => {
    if (!window.__bgMusicPlayed) {
      bgMusic = new Audio('/audio/background.mp3')
      bgMusic.loop = true
      bgMusic.play().then(() => {
        window.__bgMusicPlayed = true
      }).catch(err => {
        console.warn('Autoplay blocked:', err)
      })
    }
  
    // Stop only on page unload (full refresh or close)
    window.addEventListener('beforeunload', () => {
      bgMusic?.pause()
      bgMusic.currentTime = 0
    })
  })
</script>
  