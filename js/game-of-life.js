/* Conway's Game of Life: grid-based cellular automaton */

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startStopButton = document.getElementById('startStopButton');
const board = document.getElementById('gol-board');

const cellSize = 12;
let gridSize = 0;
let grid = [];
let animationId;
let isRunning = false;

function getThemeColors() {
  const styles = getComputedStyle(document.documentElement);
  return {
    alive: styles.getPropertyValue('--header-color').trim() || '#9CBB80',
    dead: styles.getPropertyValue('--primary-color').trim() || '#0D1B2A',
    grid: styles.getPropertyValue('--secondary-color').trim() || '#2A3F54',
  };
}

function setupCanvas() {
  const boardWidth = board ? board.clientWidth : Math.min(window.innerWidth * 0.9, 520);
  const available = Math.min(boardWidth, window.innerHeight * 0.45, 520);

  gridSize = Math.max(10, Math.floor((available * 0.95) / cellSize));
  canvas.width = gridSize * cellSize;
  canvas.height = gridSize * cellSize;
  grid = createGrid();
  drawGrid();
}

function createGrid() {
  const arr = new Array(gridSize);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(gridSize);
    for (let j = 0; j < arr[i].length; j++) {
      arr[i][j] = Math.random() > 0.8 ? 1 : 0;
    }
  }
  return arr;
}

function drawGrid() {
  const colors = getThemeColors();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      ctx.beginPath();
      ctx.rect(i * cellSize, j * cellSize, cellSize, cellSize);
      ctx.fillStyle = grid[i][j] ? colors.alive : colors.dead;
      ctx.fill();
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }
}

function updateGrid() {
  const nextGrid = new Array(gridSize);
  for (let i = 0; i < nextGrid.length; i++) {
    nextGrid[i] = new Array(gridSize).fill(0);
  }

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const neighbors = countNeighbors(grid, i, j);
      const state = grid[i][j];

      if (state === 0 && neighbors === 3) {
        nextGrid[i][j] = 1;
      } else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
        nextGrid[i][j] = 0;
      } else {
        nextGrid[i][j] = state;
      }
    }
  }
  grid = nextGrid;
}

function countNeighbors(grid, x, y) {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      const col = (x + i + gridSize) % gridSize;
      const row = (y + j + gridSize) % gridSize;
      sum += grid[col][row];
    }
  }
  sum -= grid[x][y];
  return sum;
}

function gameLoop() {
  updateGrid();
  drawGrid();
  animationId = requestAnimationFrame(gameLoop);
}

startStopButton.addEventListener('click', () => {
  if (isRunning) {
    cancelAnimationFrame(animationId);
    startStopButton.textContent = 'Start';
  } else {
    requestAnimationFrame(gameLoop);
    startStopButton.textContent = 'Stop';
  }
  isRunning = !isRunning;
});

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (isRunning) {
      cancelAnimationFrame(animationId);
      isRunning = false;
      startStopButton.textContent = 'Start';
    }
    setupCanvas();
  }, 200);
});

setupCanvas();