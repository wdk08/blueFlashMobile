let puzzle = null;
let selectedColor = null;
let colorPage = 0;

const COLORS_PER_PAGE = 10;

let canvas;
let ctx;
let pixelSize = 0;


export function initPuzzleGame() {
    canvas = document.getElementById("gameCanvas");


    if (!canvas) {
        console.error("Missing gameCanvas");
        return;
    }

    ctx = canvas.getContext("2d");

    canvas.addEventListener("click", e => {

        if (!selectedColor === null || !puzzle)
            return;


        const rect = canvas.getBoundingClientRect();


        const x = Math.floor(
            (e.clientX - rect.left) / pixelSize
        );

        const y = Math.floor(
            (e.clientY - rect.top) / pixelSize
        );


        const correctColor =
            puzzle.pixels[y][x];


        if (correctColor === selectedColor) {

            puzzle.filledPixels[
                `${x},${y}`
            ] = true;


            savePuzzle();

            draw();

        }

    });

    loadPuzzle();
}


function loadPuzzle() {

    const puzzleId = sessionStorage.getItem("currentPuzzle");

    if (!puzzleId) {
        console.error("No current puzzle");
        return;
    }


    puzzle = JSON.parse(
        localStorage.getItem(`puzzle_${puzzleId}`)
    );


    if (!puzzle) {
        console.error("Puzzle not found");
        return;
    }


    if (!puzzle.filledPixels) {
        puzzle.filledPixels = {};
    }


    selectedColor = null;
    colorPage = 0;


    resizeCanvas();
    draw();
    createColorPicker();
}


// Resize canvas based on puzzle size
function resizeCanvas() {
    const size = puzzle.pixels.length;

    canvas.width = 500;
    canvas.height = 500;

    pixelSize = canvas.width / size;
}


// Draw puzzle
function draw() {
    if (!puzzle) return;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    for (let y = 0; y < puzzle.pixels.length; y++) {

        for (let x = 0; x < puzzle.pixels[y].length; x++) {

            const colorNumber = puzzle.pixels[y][x];
            const key = `${x},${y}`;

            if (puzzle.filledPixels[key]) {

                ctx.fillStyle = puzzle.colors[colorNumber];

            } else if (selectedColor === colorNumber) {

                // highlight matching pixels
                ctx.fillStyle = "#555";

            } else {

                // black and white puzzle
                ctx.fillStyle = "#111";

            }


            ctx.fillRect(
                x * pixelSize,
                y * pixelSize,
                pixelSize,
                pixelSize
            );


            ctx.strokeStyle = "#333";
            ctx.strokeRect(
                x * pixelSize,
                y * pixelSize,
                pixelSize,
                pixelSize
            );
        }
    }
}


// Create color selector
function createColorPicker() {

    const container = document.getElementById("colorPicker");

    if (!container) {
        console.error("Missing colorPicker element");
        return;
    }

    container.innerHTML = "";


    const colors = puzzle.colors;

    const start = colorPage * COLORS_PER_PAGE;
    const end = start + COLORS_PER_PAGE;


    const visibleColors = colors.slice(start, end);


    visibleColors.forEach(colorNumber => {

        const button = document.createElement("button");

        button.className = "colorButton";

        button.style.background =
            puzzle.colors[colorNumber];


        button.dataset.color =
            colorNumber;


        button.onclick = () => {

            selectedColor = Number(colorNumber);

            draw();
            updateSelectedColor();

        };


        container.appendChild(button);

    });


    updateSelectedColor();
}


// Highlight selected button
function updateSelectedColor() {

    document
        .querySelectorAll(".colorButton")
        .forEach(button => {

            button.classList.remove("selected");


            if (
                Number(button.dataset.color) === selectedColor
            ) {
                button.classList.add("selected");
            }

        });
}


// Next color page
function nextColors() {

    const totalPages = Math.ceil(
        Object.keys(puzzle.colors).length /
        COLORS_PER_PAGE
    );


    colorPage++;

    if (colorPage >= totalPages) {
        colorPage = 0;
    }

    createColorPicker();
}


// Previous color page
function previousColors() {

    const totalPages = Math.ceil(
        Object.keys(puzzle.colors).length /
        COLORS_PER_PAGE
    );


    colorPage--;

    if (colorPage < 0) {
        colorPage = totalPages - 1;
    }

    createColorPicker();
}


// Canvas click



// Save progress
function savePuzzle() {

    const total =
        puzzle.pixels.length *
        puzzle.pixels[0].length;


    const filled =
        Object.keys(
            puzzle.filledPixels
        ).length;


    puzzle.progress =
        Math.floor(
            (filled / total) * 100
        );


    puzzle.completed =
        filled === total;


    localStorage.setItem(
        `puzzle_${puzzle.id}`,
        JSON.stringify(puzzle)
    );

}

function handleCanvasClick(e) {

    if (selectedColor === null || !puzzle)
        return;


    const rect = canvas.getBoundingClientRect();


    const x = Math.floor(
        (e.clientX - rect.left) / pixelSize
    );

    const y = Math.floor(
        (e.clientY - rect.top) / pixelSize
    );


    const correctColor = puzzle.pixels[y][x];


    if (correctColor === selectedColor) {

        puzzle.filledPixels[`${x},${y}`] = true;

        savePuzzle();

        draw();
    }
}
// Swipe support for colors
let touchStartX = 0;


document.getElementById("colorControls").addEventListener(
    "touchstart",
    e => {

        touchStartX =
            e.changedTouches[0].screenX;

    }
);


document.getElementById("colorControls").addEventListener(
    "touchend",
    e => {

        const touchEndX =
            e.changedTouches[0].screenX;


        if (
            touchEndX - touchStartX > 50
        ) {
            previousColors();
        }


        if (
            touchStartX - touchEndX > 50
        ) {
            nextColors();
        }

    }
);
