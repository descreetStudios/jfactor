<template>
    <div class="spiral-grid">
      <div 
        v-for="(button, index) in spiral" 
        :key="index" 
        :class="['button', button === null ? 'button-null' : 'button-' + button]"
        @click="handleClick(button)"
      >
        {{ button !== null ? button : '' }}
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "SpiralButtons",
    data() {
      return {
        // Genera la spirale
        spiral: this.generateSpiral(63, 8), // 63 numeri in una griglia 8x8
      };
    },
    methods: {
      generateSpiral(count, size) {
        const grid = Array(size * size).fill(null);  // Inizializza tutta la griglia con null
        let x = 0, y = 0;
        let dx = 1, dy = 0;
        let bounds = { left: 0, right: size - 1, top: 0, bottom: size - 1 };
  
        for (let i = 1; i <= count; i++) {
          grid[y * size + x] = i;
  
          // Verifica la possibilità di cambiamento direzionale
          if (dx === 1 && x === bounds.right) {
            bounds.top++;
            [dx, dy] = [0, 1];
          } else if (dy === 1 && y === bounds.bottom) {
            bounds.right--;
            [dx, dy] = [-1, 0];
          } else if (dx === -1 && x === bounds.left) {
            bounds.bottom--;
            [dx, dy] = [0, -1];
          } else if (dy === -1 && y === bounds.top) {
            bounds.left++;
            [dx, dy] = [1, 0];
          }
  
          x += dx;
          y += dy;
        }
  
        return grid;
      },
      handleClick(buttonNumber) {
        if (buttonNumber !== null) {
          alert(`Hai cliccato sul numero ${buttonNumber}`);
        }
      }
    },
  };
  </script>
  
  <style scoped>
  .spiral-grid {
    display: grid;
    grid-template-columns: repeat(8, 50px);  /* 8 colonne */
    grid-template-rows: repeat(8, 50px);     /* 8 righe */
    gap: 10px;
    position: relative;
  }
  
  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: lightgray;
    border: 1px solid #000;
    font-size: 12px;
    height: 50px;
    width: 50px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .button:hover {
    background-color: #ddd;
  }
  
  .button-null {
    background-color: rgb(0, 255, 89);
    cursor: default;
  }
  
  .button-1 {
    background-color: red;
  }
  </style>
  