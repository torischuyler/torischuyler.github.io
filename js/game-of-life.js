const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startStopButton = document.getElementById('startStopButton');

// --- START: Responsive Sizing Logic ---

// Set the size of each cell in pixels
const cellSize = 12;

// Calculate how many cells can fit on the screen
// It takes 90% of the window's width or height (whichever is smaller),
// and divides by the cell size to get the number of cells.
const minViewportSize = Math.min(window.innerWidth, window.innerHeight);
const gridSize = Math.floor((minViewportSize * 0.9) / cellSize);

// Set the canvas dimensions to be a perfect multiple of the cell size
canvas.width = gridSize * cellSize;
canvas.height = gridSize * cellSize;

// --- END: Responsive Sizing Logic ---


let grid = createGrid();
let animationId;
let isRunning = false;

function createGrid() {
  let arr = new Array(gridSize);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(gridSize);
    for (let j = 0; j < arr[i].length; j++) {
      arr[i][j] = Math.random() > 0.8 ? 1 : 0; // Randomly populate the grid
    }
  }
  return arr;
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      ctx.beginPath();
      ctx.rect(i * cellSize, j * cellSize, cellSize, cellSize);
      ctx.fillStyle = grid[i][j] ? 'black' : 'white';
      ctx.fill();
      ctx.stroke();
    }
  }
}

function updateGrid() {
  let nextGrid = new Array(gridSize);
  for (let i = 0; i < nextGrid.length; i++) {
    nextGrid[i] = new Array(gridSize).fill(0);
  }

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let neighbors = countNeighbors(grid, i, j);
      let state = grid[i][j];

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
      let col = (x + i + gridSize) % gridSize;
      let row = (y + j + gridSize) % gridSize;
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

// Initial drawing of the grid
drawGrid();
