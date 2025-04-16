<template>
  <div ref="left" class="left">
		<img src="@/assets/images/portone.jpg">
	</div>
	<div ref="right" class="right">
		<img src="@/assets/images/portone.jpg">
	</div>

  <div style="text-align: center;">
      <h1>Tutorial</h1>
  </div>
</template>

<script>
export default {
  mounted() {
    this.transitionOpen();
  },
  methods: {
    transitionOpen() {
      this.$refs.left.style.animation="leftOut 1s forwards";
	    this.$refs.right.style.animation="rightOut 1s forwards";
    },
  }
}
</script>

<style lang="scss">
    @import url('../styles/transition.scss');
</style>