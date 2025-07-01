/*
  🐍 Kepler's Krawl: This script creates a simple snake game using Kepler triangles as food.
*/

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const restartButton = document.getElementById('restartButton');
const messageBox = document.getElementById('messageBox');
const messageTitle = document.getElementById('messageTitle');
const messageText = document.getElementById('messageText');
const messageButton = document.getElementById('messageButton');
const controlsBar = document.getElementById('controlsBar');
const gameTitleDisplay = document.getElementById('gameTitle');

const touchUpButton = document.getElementById('touchUp');
const touchDownButton = document.getElementById('touchDown');
const touchLeftButton = document.getElementById('touchLeft');
const touchRightButton = document.getElementById('touchRight');

const gridSize = 20;
let tileCountX, tileCountY;

let snake, food, dx, dy, score, gameLoopTimeout, changingDirection, gameSpeed, gameHasStarted;

const PHI = (1 + Math.sqrt(5)) / 2;
const SQRT_PHI = Math.sqrt(PHI);

function resizeCanvas() {
    const gameContainerPadding = 40;
    const availableWidth = document.querySelector('.game-container').clientWidth - gameContainerPadding;
    const maxWidth = Math.min(500, availableWidth);
    const maxHeight = Math.min(500, window.innerHeight * 0.6);
    let canvasSize = Math.min(maxWidth, maxHeight);
    canvasSize = Math.floor(canvasSize / gridSize) * gridSize;
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    controlsBar.style.maxWidth = `${canvasSize}px`;
    tileCountX = canvas.width / gridSize;
    tileCountY = canvas.height / gridSize;
}

function initializeGame() {
    snake = [
        { x: Math.floor(tileCountX / 2) * gridSize, y: Math.floor(tileCountY / 2) * gridSize },
        { x: (Math.floor(tileCountX / 2) - 1) * gridSize, y: Math.floor(tileCountY / 2) * gridSize },
        { x: (Math.floor(tileCountX / 2) - 2) * gridSize, y: Math.floor(tileCountY / 2) * gridSize }
    ];
    dx = 0;
    dy = 0;
    gameHasStarted = false;
    score = 0;
    gameSpeed = 150;
    changingDirection = false;
    scoreDisplay.textContent = 'Score: 0';
    createFood();
    if (gameLoopTimeout) clearTimeout(gameLoopTimeout);
    gameLoop();
    messageBox.style.display = 'none';
}

function gameLoop() {
    if (isGameOver()) {
        showGameOverMessage();
        return;
    }
    changingDirection = false;
    gameLoopTimeout = setTimeout(() => {
        clearCanvas();
        moveSnake();
        drawFood();
        drawSnake();
        gameLoop();
    }, gameSpeed);
}

function clearCanvas() {
    ctx.fillStyle = '#101010';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.forEach((segment, index) => {
        if (index === 0) {
            ctx.fillStyle = '#68d391';
        } else {
            ctx.fillStyle = '#48bb78';
        }
        ctx.strokeStyle = '#101010';
        ctx.fillRect(segment.x, segment.y, gridSize -1, gridSize -1);
    });
}

function moveSnake() {
    if (!gameHasStarted) {
        return;
    }

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score += 10;
        scoreDisplay.textContent = 'Score: ' + score;
        createFood();
        if (gameSpeed > 50) {
            gameSpeed -= 3;
        }
    } else {
        snake.pop();
    }
}

function createFood() {
    food = {
        x: Math.floor(Math.random() * tileCountX) * gridSize,
        y: Math.floor(Math.random() * tileCountY) * gridSize
    };
    snake.forEach(segment => {
        if (segment.x === food.x && segment.y === food.y) {
            createFood();
        }
    });
}

function drawFood() {
    ctx.fillStyle = '#FF69B4';
    ctx.strokeStyle = '#FF1493';
    const cellCenterX = food.x + gridSize / 2;
    const cellCenterY = food.y + gridSize / 2;
    const hypotenuseLength = gridSize * 0.85;
    const side1 = hypotenuseLength / PHI;
    const side2 = hypotenuseLength / SQRT_PHI;
    const altitude = (side1 * side2) / hypotenuseLength;
    const segmentP = (side1 * side1) / hypotenuseLength;
    const v1x = cellCenterX - hypotenuseLength / 2;
    const v1y = cellCenterY + altitude / 2;
    const v2x = cellCenterX + hypotenuseLength / 2;
    const v2y = cellCenterY + altitude / 2;
    const v3x = v1x + segmentP;
    const v3y = cellCenterY - altitude / 2;
    ctx.beginPath();
    ctx.moveTo(v1x, v1y);
    ctx.lineTo(v2x, v2y);
    ctx.lineTo(v3x, v3y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function changeDirection(event) {
    if (changingDirection) return;
    changingDirection = true;
    const keyPressed = event.key;
    handleDirectionChange(keyPressed);
}

function handleTouch(directionKey) {
    if (changingDirection) return;
    changingDirection = true;
    handleDirectionChange(directionKey);
}

function handleDirectionChange(key) {
    const goingUp = dy === -gridSize;
    const goingDown = dy === gridSize;
    const goingRight = dx === gridSize;
    const goingLeft = dx === -gridSize;

    const prevDx = dx;
    const prevDy = dy;

    if ((key === 'ArrowLeft' || key === 'a' || key === 'left') && (gameHasStarted ? !goingRight : true)) {
        dx = -gridSize; dy = 0;
    } else if ((key === 'ArrowUp' || key === 'w' || key === 'up') && (gameHasStarted ? !goingDown : true)) {
        dx = 0; dy = -gridSize;
    } else if ((key === 'ArrowRight' || key === 'd' || key === 'right') && (gameHasStarted ? !goingLeft : true)) {
        dx = gridSize; dy = 0;
    } else if ((key === 'ArrowDown' || key === 's' || key === 'down') && (gameHasStarted ? !goingUp : true)) {
        dx = 0; dy = gridSize;
    } else {
        return;
    }

    if ((dx !== prevDx || dy !== prevDy) && (dx !== 0 || dy !== 0)) {
        if (!gameHasStarted) {
            gameHasStarted = true;
        }
    }
}

function isGameOver() {
    if (!gameHasStarted && snake.length > 0) return false;
    if (!snake || snake.length === 0) return false;

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= canvas.width;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= canvas.height;
    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function showGameOverMessage() {
    clearTimeout(gameLoopTimeout);
    messageTitle.textContent = 'Game Over!';
    messageText.textContent = 'Your final score: ' + score;
    messageBox.style.display = 'flex';
    messageBox.style.flexDirection = 'column';
}

document.addEventListener('keydown', changeDirection);
restartButton.addEventListener('click', () => {
    resizeCanvas();
    initializeGame();
});
messageButton.addEventListener('click', () => {
    resizeCanvas();
    initializeGame();
});

touchUpButton.addEventListener('click', () => handleTouch('up'));
touchDownButton.addEventListener('click', () => handleTouch('down'));
touchLeftButton.addEventListener('click', () => handleTouch('left'));
touchRightButton.addEventListener('click', () => handleTouch('right'));

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (gameLoopTimeout) clearTimeout(gameLoopTimeout);
        resizeCanvas();
        initializeGame();
    }, 250);
});

resizeCanvas();
initializeGame();
