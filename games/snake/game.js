const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
const tapText = document.getElementById("tapText");
const homeBtn = document.getElementById("homeBtn");

const GRID_SIZE = 20;
const TILE_SIZE = 20;

canvas.width = 400;
canvas.height = 400;

let snake;
let food;

let direction;
let nextDirection;

let score = 0;
let highScore = Number(localStorage.getItem("snakeHighScore")) || 0;

let gameRunning = false;
let gameOver = false;

let gameInterval;


/* =========================
   INITIAL SCORE
========================= */

highScoreText.textContent = `Best: ${highScore}`;


/* =========================
   START GAME
========================= */

function startGame() {

    clearInterval(gameInterval);

    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];

    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };

    score = 0;

    gameOver = false;
    gameRunning = true;

    scoreText.textContent = score;

    tapText.style.display = "none";

    spawnFood();

    draw();

    // Slower than before
    gameInterval = setInterval(gameLoop, 250);
}


/* =========================
   GAME LOOP
========================= */

function gameLoop() {

    direction = nextDirection;

    const head = snake[0];

    const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y
    };

    if (
        checkWallCollision(newHead) ||
        checkSelfCollision(newHead)
    ) {
        endGame();
        return;
    }

    snake.unshift(newHead);

    if (
        newHead.x === food.x &&
        newHead.y === food.y
    ) {

        score++;

        scoreText.textContent = score;

        if (score > highScore) {

            highScore = score;

            localStorage.setItem(
                "snakeHighScore",
                highScore
            );

            highScoreText.textContent =
                `Best: ${highScore}`;
        }

        spawnFood();

    } else {

        snake.pop();
    }

    draw();
}


/* =========================
   COLLISION
========================= */

function checkWallCollision(head) {

    return (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE
    );
}


function checkSelfCollision(head) {

    return snake.some(segment =>
        segment.x === head.x &&
        segment.y === head.y
    );
}


/* =========================
   FOOD
========================= */

function spawnFood() {

    let newFood;

    do {

        newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };

    } while (
        snake.some(segment =>
            segment.x === newFood.x &&
            segment.y === newFood.y
        )
    );

    food = newFood;
}


/* =========================
   DRAW
========================= */

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawBackground();
    drawFood();
    drawSnake();
}


/* =========================
   BACKGROUND
========================= */

function drawBackground() {

    const gradient = ctx.createLinearGradient(
        0,
        0,
        0,
        canvas.height
    );

    gradient.addColorStop(0, "#171717");
    gradient.addColorStop(1, "#0d0d0d");

    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Subtle grid
    ctx.strokeStyle = "rgba(255,255,255,.035)";
    ctx.lineWidth = 1;

    for (let i = 0; i <= GRID_SIZE; i++) {

        const position = i * TILE_SIZE;

        ctx.beginPath();
        ctx.moveTo(position, 0);
        ctx.lineTo(position, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, position);
        ctx.lineTo(canvas.width, position);
        ctx.stroke();
    }
}


/* =========================
   SNAKE
========================= */

function drawSnake() {

    snake.forEach((segment, index) => {

        const x = segment.x * TILE_SIZE;
        const y = segment.y * TILE_SIZE;

        const padding = 2;

        ctx.fillStyle =
            index === 0
                ? "#8be35f"
                : "#55b83e";

        roundRect(
            x + padding,
            y + padding,
            TILE_SIZE - padding * 2,
            TILE_SIZE - padding * 2,
            5
        );

        ctx.fill();
    });

    drawSnakeHead();
}


/* =========================
   SNAKE HEAD
========================= */

function drawSnakeHead() {

    const head = snake[0];

    const x = head.x * TILE_SIZE;
    const y = head.y * TILE_SIZE;

    ctx.fillStyle = "#8be35f";

    roundRect(
        x + 1,
        y + 1,
        TILE_SIZE - 2,
        TILE_SIZE - 2,
        6
    );

    ctx.fill();

    // Eyes
    ctx.fillStyle = "#111";

    let eye1;
    let eye2;

    if (direction.x === 1) {

        eye1 = {
            x: x + 14,
            y: y + 5
        };

        eye2 = {
            x: x + 14,
            y: y + 13
        };

    } else if (direction.x === -1) {

        eye1 = {
            x: x + 6,
            y: y + 5
        };

        eye2 = {
            x: x + 6,
            y: y + 13
        };

    } else if (direction.y === -1) {

        eye1 = {
            x: x + 5,
            y: y + 6
        };

        eye2 = {
            x: x + 13,
            y: y + 6
        };

    } else {

        eye1 = {
            x: x + 5,
            y: y + 14
        };

        eye2 = {
            x: x + 13,
            y: y + 14
        };
    }

    ctx.beginPath();
    ctx.arc(eye1.x, eye1.y, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(eye2.x, eye2.y, 2, 0, Math.PI * 2);
    ctx.fill();
}


/* =========================
   FOOD
========================= */

function drawFood() {

    const centerX =
        food.x * TILE_SIZE + TILE_SIZE / 2;

    const centerY =
        food.y * TILE_SIZE + TILE_SIZE / 2;

    // Glow
    ctx.shadowColor = "#ff4b4b";
    ctx.shadowBlur = 8;

    ctx.fillStyle = "#ff4b4b";

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY + 1,
        6,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.shadowBlur = 0;

    // Stem
    ctx.strokeStyle = "#6d4620";
    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(centerX, centerY - 5);
    ctx.lineTo(centerX + 2, centerY - 9);

    ctx.stroke();
}


/* =========================
   ROUNDED RECTANGLE
========================= */

function roundRect(x, y, width, height, radius) {

    ctx.beginPath();

    ctx.roundRect(
        x,
        y,
        width,
        height,
        radius
    );
}


/* =========================
   GAME OVER
========================= */

function endGame() {

    clearInterval(gameInterval);

    gameRunning = false;
    gameOver = true;

    draw();

    // Dark overlay
    ctx.fillStyle = "rgba(0,0,0,.45)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    tapText.textContent =
        `Game Over\nScore: ${score}\nTap to Restart`;

    tapText.style.display = "block";
}


/* =========================
   KEYBOARD CONTROLS
========================= */

document.addEventListener("keydown", event => {

    if (!gameRunning) {

        if (
            event.key === " " ||
            event.key === "Enter"
        ) {
            startGame();
        }

        return;
    }

    switch (event.key) {

        case "ArrowUp":

            if (direction.y !== 1) {
                nextDirection = {
                    x: 0,
                    y: -1
                };
            }

            break;

        case "ArrowDown":

            if (direction.y !== -1) {
                nextDirection = {
                    x: 0,
                    y: 1
                };
            }

            break;

        case "ArrowLeft":

            if (direction.x !== 1) {
                nextDirection = {
                    x: -1,
                    y: 0
                };
            }

            break;

        case "ArrowRight":

            if (direction.x !== -1) {
                nextDirection = {
                    x: 1,
                    y: 0
                };
            }

            break;
    }
});


/* =========================
   TOUCH CONTROLS
========================= */

let touchStartX = 0;
let touchStartY = 0;


canvas.addEventListener("touchstart", event => {

    const touch = event.touches[0];

    touchStartX = touch.clientX;
    touchStartY = touch.clientY;

}, { passive: true });


canvas.addEventListener("touchend", event => {

    if (!gameRunning) {

        startGame();

        return;
    }

    const touch = event.changedTouches[0];

    const deltaX =
        touch.clientX - touchStartX;

    const deltaY =
        touch.clientY - touchStartY;

    if (
        Math.abs(deltaX) < 20 &&
        Math.abs(deltaY) < 20
    ) {
        return;
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {

        if (
            deltaX > 0 &&
            direction.x !== -1
        ) {
            nextDirection = {
                x: 1,
                y: 0
            };
        }

        else if (
            deltaX < 0 &&
            direction.x !== 1
        ) {
            nextDirection = {
                x: -1,
                y: 0
            };
        }

    } else {

        if (
            deltaY > 0 &&
            direction.y !== -1
        ) {
            nextDirection = {
                x: 0,
                y: 1
            };
        }

        else if (
            deltaY < 0 &&
            direction.y !== 1
        ) {
            nextDirection = {
                x: 0,
                y: -1
            };
        }
    }

}, { passive: true });


/* =========================
   TAP TO PLAY
========================= */

canvas.addEventListener("click", () => {

    if (!gameRunning) {
        startGame();
    }
});


/* =========================
   HOME BUTTON
========================= */

homeBtn.addEventListener("click", () => {

    window.location.href =
        "../../index.html";
});


/* =========================
   INITIAL SCREEN
========================= */

draw();

tapText.style.display = "block";