const board = document.getElementById("board");
const scoreText = document.getElementById("score");
const bestText = document.getElementById("best");
const message = document.getElementById("message");
const messageText = document.getElementById("messageText");

let gameEnded = false;
const restart = document.getElementById("restart");

let grid;
let score = 0;

let best = Number(localStorage.getItem("2048Best")) || 0;


bestText.textContent = best;
function checkGameStatus() {

    // Win condition
    for (let row of grid) {

        if (row.includes(2048)) {

            gameEnded = true;

            messageText.textContent = "You Win! 🎉";

            message.classList.remove("hidden");

            return;

        }

    }


    // Lose condition

    for (let r = 0; r < 4; r++) {

        for (let c = 0; c < 4; c++) {

            if (grid[r][c] === 0)
                return;


            if (c < 3 && grid[r][c] === grid[r][c + 1])
                return;


            if (r < 3 && grid[r][c] === grid[r + 1][c])
                return;

        }

    }


    gameEnded = true;

    messageText.textContent = "Game Over 😢";

    message.classList.remove("hidden");

}

function startGame() {
    gameEnded = false;
    message.classList.add("hidden");
    grid = Array(4)
        .fill()
        .map(() => Array(4).fill(0));

    score = 0;

    addTile();
    addTile();

    update();

}


function addTile() {

    let empty = [];

    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {

            if (grid[r][c] === 0)
                empty.push([r, c]);

        }
    }


    if (empty.length === 0)
        return;


    let spot = empty[Math.floor(Math.random() * empty.length)];

    grid[spot[0]][spot[1]] =
        Math.random() < 0.9 ? 2 : 4;

}



function update() {

    board.innerHTML = "";


    grid.forEach(row => {

        row.forEach(value => {

            let tile = document.createElement("div");

            tile.className = "tile";


            if (value) {

                tile.textContent = value;

                tile.classList.add(
                    `tile-${value}`
                );

            }


            board.appendChild(tile);

        });

    });


    updateScore();

    scoreText.textContent = score;

    bestText.textContent = best;

}

function slide(row) {

    let newRow = row.filter(x => x !== 0);


    for (let i = 0; i < newRow.length - 1; i++) {

        if (newRow[i] === newRow[i + 1]) {

            newRow[i] *= 2;

            newRow.splice(i + 1, 1);

        }

    }


    while (newRow.length < 4) {

        newRow.push(0);

    }


    return newRow;

}

function updateScore() {

    let highest = 0;


    grid.forEach(row => {

        row.forEach(tile => {

            if (tile > highest) {

                highest = tile;

            }

        });

    });


    score = highest;


    if (score > best) {

        best = score;

        localStorage.setItem(
            "2048Best",
            best
        );

    }

}

function move(direction) {
    if (gameEnded) return;
    let old = JSON.stringify(grid);


    if (direction === "left") {

        for (let r = 0; r < 4; r++) {
            grid[r] = slide(grid[r]);
        }

    }


    if (direction === "right") {

        for (let r = 0; r < 4; r++) {

            grid[r] = slide([...grid[r]].reverse()).reverse();

        }

    }


    if (direction === "up") {

        for (let c = 0; c < 4; c++) {

            let col = [];

            for (let r = 0; r < 4; r++) {
                col.push(grid[r][c]);
            }


            col = slide(col);


            for (let r = 0; r < 4; r++) {
                grid[r][c] = col[r];
            }

        }

    }


    if (direction === "down") {

        for (let c = 0; c < 4; c++) {

            let col = [];

            for (let r = 0; r < 4; r++) {
                col.push(grid[r][c]);
            }


            col = slide([...col].reverse()).reverse();


            for (let r = 0; r < 4; r++) {
                grid[r][c] = col[r];
            }

        }

    }


    if (old !== JSON.stringify(grid)) {

        addTile();

    }


    update();
    checkGameStatus();

}



document.addEventListener(
    "keydown",
    e => {

        if (e.key === "ArrowLeft")
            move("left");

        if (e.key === "ArrowRight")
            move("right");

        if (e.key === "ArrowUp")
            move("up");

        if (e.key === "ArrowDown")
            move("down");

    });


let startX;
let startY;


board.addEventListener(
    "touchstart",
    e => {

        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;

    });


board.addEventListener(
    "touchend",
    e => {

        let dx = e.changedTouches[0].clientX - startX;
        let dy = e.changedTouches[0].clientY - startY;


        if (Math.abs(dx) > Math.abs(dy)) {

            move(dx > 0 ? "right" : "left");

        } else {

            move(dy > 0 ? "down" : "up");

        }

    });


restart.onclick = startGame;


document.getElementById("homeBtn").onclick = () => {

    window.location.href = "../../index.html";

};


startGame();