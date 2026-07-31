const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const birdImg = new Image();
const highScoreText = document.getElementById("highScore");
let canStartG = 3;

birdImg.src = "assets/bird.png";
const pipeTopImg = new Image();
pipeTopImg.src = "assets/pipe.png";

let highScore = Number(localStorage.getItem("flappyHighScore")) || 0;
highScoreText.textContent = `Best: ${highScore}`;

const pipeBottomImg = new Image();
pipeBottomImg.src = "assets/pipebottom.png";

const scoreText = document.getElementById("score");

canvas.width = 400;
canvas.height = 600;


// Game variables
let bird;
let pipes;
let score;
let gameRunning;
let gameOver;
let animationId;

// Physics
const gravity = 0.5;
const jumpPower = -6;


// Start game
function startGame() {

    bird = {
        x: 80,
        y: 300,
        width: 60,
        height: 60,
        hitbox: 28,
        velocity: 0,
        rotation: 0
    };

    pipes = [];

    score = 0;

    gameRunning = true;
    gameOver = false;

    document.getElementById("tapText").style.display = "none";

    cancelAnimationFrame(animationId);
    gameLoop();
}

function canStartGame() {
    if (canStartG == 0) {
        return "yes";
    } else {
        return "no";
    }
}


// Bird jump
function jump() {
    if (canStartGame() == "yes") {
        return;
    }


    if (!gameRunning) {
        startGame();
        return;
    }

    bird.velocity = jumpPower;

}


// Create pipes
function createPipe() {

    const gap = 160;

    const topHeight = Math.random() * 250 + 50;


    pipes.push({

        x: canvas.width,

        width: 60,

        top: topHeight,

        bottom: canvas.height - topHeight - gap,

        passed: false

    });

}


// Update game
function update() {


    // Bird physics
    bird.velocity += gravity;

    bird.y += bird.velocity;
    bird.rotation = Math.min(
        Math.max(bird.velocity * 0.04, -0.25),
        0.5
    );



    // Pipes movement
    pipes.forEach(pipe => {

        pipe.x -= 3;


        if (!pipe.passed && pipe.x + pipe.width < bird.x) {

            score++;

            if (score > highScore) {

                highScore = score;

                localStorage.setItem(
                    "flappyHighScore",
                    highScore
                );

            }

            pipe.passed = true;

        }

    });


    // Remove old pipes

    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);



    // Spawn pipes

    if (pipes.length === 0 || pipes[pipes.length - 1].x < 200) {

        createPipe();

    }


    scoreText.textContent = score;
    highScoreText.textContent = `Best: ${highScore}`;


    checkCollision();

}


// Draw everything
function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Bird

    ctx.save();

    ctx.translate(
        bird.x + bird.width / 2,
        bird.y + bird.height / 2
    );

    ctx.rotate(bird.rotation);

    ctx.drawImage(
        birdImg,
        -bird.width / 2,
        -bird.height / 2,
        bird.width,
        bird.height
    );

    ctx.restore();


    // Pipes

    pipes.forEach(pipe => {

        ctx.drawImage(
            pipeTopImg,
            pipe.x,
            0,
            pipe.width,
            pipe.top
        );


        ctx.drawImage(
            pipeBottomImg,
            pipe.x,
            canvas.height - pipe.bottom,
            pipe.width,
            pipe.bottom
        );

    });

}


// Collision
function checkCollision() {


    // Ground / ceiling

    if (
        bird.y <= 0 ||
        bird.y + bird.height >= canvas.height
    ) {

        endGame();

    }



    pipes.forEach(pipe => {


        const birdLeft = bird.x + (bird.width - bird.hitbox) / 2;
        const birdRight = birdLeft + bird.hitbox;

        const birdTop = bird.y + (bird.height - bird.hitbox) / 2;
        const birdBottom = birdTop + bird.hitbox;


        const hitPipe =
            birdRight > pipe.x &&
            birdLeft < pipe.x + pipe.width &&
            (
                birdTop < pipe.top ||
                birdBottom > canvas.height - pipe.bottom
            );


        if (hitPipe) {

            endGame();

        }

    });

}

function allowstart() {
    setTimeout(() => {
        canStartG = 0;
    }, 3000)
}


// End game
function endGame() {

    if (gameOver) return;

    gameRunning = false;
    canStartG = 3;
    gameOver = true;

    setTimeout(() => {
        allowstart();
        document.getElementById("tapText").textContent = "Tap to Restart";
        document.getElementById("tapText").style.display = "block";
    }, 500);

}


// Main loop
function gameLoop() {

    if (!gameOver) {
        update();
    } else {
        bird.velocity += gravity;
        bird.y += bird.velocity;
    }

    draw();

    animationId = requestAnimationFrame(gameLoop);

}


// Controls

document.addEventListener("keydown", (event) => {

    if (event.code === "Space") {

        jump();

    }

});


canvas.addEventListener("pointerdown", jump);


// Start button

const homeBtn = document.getElementById("homeBtn");

homeBtn.addEventListener("click", () => {
    window.location.href = "../../index.html";
});

