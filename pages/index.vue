<template>
	<title>UPG - Home</title>
	<div class="overflow-auto">
	<table class="border-separate">
      <tbody>
        <tr v-for="(row, rowIndex) in spiralMatrix" :key="rowIndex">
          <td
            v-for="(cell, colIndex) in row"
            :key="colIndex"
            class="w-10 h-10 text-center border border-black"
          >
            {{ cell }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
	import { computed } from 'vue'

	const totalCells = 63
	const size = Math.ceil(Math.sqrt(totalCells))

	const spiralMatrix = computed(() => {
		const matrix = Array.from({ length: size }, () => Array(size).fill(''))
		let value = 1
		let top = 0, bottom = size - 1, left = 0, right = size - 1

		while (value <= totalCells) {
			for (let i = left; i <= right && value <= totalCells; i++) matrix[top][i] = value++
			top++
			for (let i = top; i <= bottom && value <= totalCells; i++) matrix[i][right] = value++
			right--
			for (let i = right; i >= left && value <= totalCells; i--) matrix[bottom][i] = value++
			bottom--
			for (let i = bottom; i >= top && value <= totalCells; i--) matrix[i][left] = value++
			left++
		}

		return matrix
	})
</script>

<style scoped>
	@import url("../styles/table.css");
</style>