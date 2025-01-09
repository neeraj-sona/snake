const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game setup
const gridSize = 20;
const canvasSize = 400;
let gameSpeed = 100; // Speed in milliseconds
let score = 0;
let snake = [{ x: 160, y: 160 }];
let food = { x: 0, y: 0 };
let direction = 'RIGHT';
let gameInterval;
let isGameOver = false;

// Difficulty levels
// by make change in below count difficulty incrs
const difficulty = {
    'Easy': 150,
    'Medium': 100,
    'Hard': 50
};

// Sounds
const eatSound = new Audio('https://www.soundjay.com/button/beep-07.wav');
const gameOverSound = new Audio('https://www.soundjay.com/button/beep-10.wav');

// Draw the snake
function drawSnake() {
    snake.forEach(segment => {
        ctx.fillStyle = 'green';
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
}

// Draw the food
function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

// Draw the score
function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

// Draw the walls (border)
function drawWalls() {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvasSize, canvasSize); // Draw outer walls
}

// Draw the start screen
function drawStartScreen() {
    const startScreen = document.createElement('div');
    startScreen.id = 'start-screen';
    startScreen.innerText = 'Press any key to Start!';

    document.body.appendChild(startScreen);
    startScreen.style.display = 'flex';
}

// Game over function
function gameOver() {
    clearInterval(gameInterval);
    gameOverSound.play();
    alert(`Game Over! Your score was ${score}`);
    resetGame();
}

// Reset the game
function resetGame() {
    snake = [{ x: 160, y: 160 }];
    score = 0;
    direction = 'RIGHT';
    isGameOver = false;
    placeFood();
    gameSpeed = difficulty['Medium']; // Default to medium difficulty
    gameInterval = setInterval(gameLoop, gameSpeed);
    document.getElementById('start-screen').style.display = 'none'; // Hide start screen
}

// Place the food at a random location
function placeFood() {
    food.x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
}

// Update the game state
function update() {
    const head = { ...snake[0] };

    head.x += directions[direction].x;
    head.y += directions[direction].y;

    // Check if the snake hits the wall (border)
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        gameOver();
        return;
    }

    // Check if the snake collides with itself
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    // Check if the snake eats the food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        eatSound.play();
        placeFood();
    } else {
        snake.pop(); // Remove the last segment of the snake if it didn't eat food
    }

    snake.unshift(head); // Add the new head to the snake array
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvasSize, canvasSize); // Clear the canvas
    drawWalls(); // Draw the game area border
    drawSnake();
    drawFood();
    drawScore();
}

// Main game loop
function gameLoop() {
    update();
    draw();
}

// Handle user input
function changeDirection(event) {
    const key = event.keyCode;
    if (key === 37 && direction !== 'RIGHT') direction = 'LEFT';
    if (key === 38 && direction !== 'DOWN') direction = 'UP';
    if (key === 39 && direction !== 'LEFT') direction = 'RIGHT';
    if (key === 40 && direction !== 'UP') direction = 'DOWN';
}

// Set up event listener for keyboard input
window.addEventListener('keydown', (event) => {
    if (isGameOver) return;
    changeDirection(event);
});

// Start the game when any key is pressed
window.addEventListener('keydown', () => {
    if (document.getElementById('start-screen')) {
        document.body.removeChild(document.getElementById('start-screen')); // Remove start screen
        resetGame();
    }
});

// Directions mapping
const directions = {
    'LEFT': { x: -gridSize, y: 0 },
    'RIGHT': { x: gridSize, y: 0 },
    'UP': { x: 0, y: -gridSize },
    'DOWN': { x: 0, y: gridSize }
};

// Start the game
drawStartScreen();
