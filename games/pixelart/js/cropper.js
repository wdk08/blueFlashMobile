import { parseCanvas, parseImage } from "./imageParser.js";
import { GameState, setGameState } from "./gameState.js"
let refreshPreview = null;


export function createSquareCropper(file) {

    return new Promise((resolve) => {

        const img = new Image();

        img.onload = () => {

            const canvas = document.getElementById("previewCanvas"); const ctx = canvas.getContext("2d");

            const size = 400;

            canvas.width = size;
            canvas.height = size;
            canvas.style.cursor = "grab";


            let scale = Math.max(
                size / img.width,
                size / img.height
            );

            let offsetX = 0;
            let offsetY = 0;

            let dragging = false;
            let startX;
            let startY;


            function getBounds() {

                const width = img.width * scale;
                const height = img.height * scale;

                return {
                    minX: size - width,
                    maxX: 0,
                    minY: size - height,
                    maxY: 0
                };

            }


            function clamp() {

                const bounds = getBounds();

                offsetX = Math.min(
                    bounds.maxX,
                    Math.max(bounds.minX, offsetX)
                );

                offsetY = Math.min(
                    bounds.maxY,
                    Math.max(bounds.minY, offsetY)
                );

            }


            function draw(target = ctx) {

                target.clearRect(0, 0, size, size);

                target.save();

                target.translate(
                    offsetX,
                    offsetY
                );

                target.scale(
                    scale,
                    scale
                );

                target.drawImage(
                    img,
                    0,
                    0
                );

                target.restore();

            }

            function updatePreview() {

                const tempCanvas = document.createElement("canvas");

                tempCanvas.width = 400;
                tempCanvas.height = 400;

                const tempCtx = tempCanvas.getContext("2d");

                tempCtx.imageSmoothingEnabled = false;

                tempCtx.save();

                tempCtx.translate(
                    offsetX,
                    offsetY
                );

                tempCtx.scale(
                    scale,
                    scale
                );

                tempCtx.drawImage(
                    img,
                    0,
                    0
                );

                tempCtx.restore();


                const difficulty =
                    Number(document.getElementById("difficultySlider").value);


                parseCanvas(
                    tempCanvas,
                    difficulty
                );

            }

            refreshPreview = updatePreview;

            canvas.onmousedown = (e) => {

                dragging = true;

                startX = e.clientX - offsetX;
                startY = e.clientY - offsetY;

            };


            window.onmouseup = () => {

                dragging = false;

            };


            canvas.onmousemove = (e) => {

                if (!dragging) return;

                offsetX = e.clientX - startX;
                offsetY = e.clientY - startY;

                clamp();
                updatePreview();

            };


            canvas.onwheel = (e) => {

                e.preventDefault();

                const oldScale = scale;

                scale *= e.deltaY < 0 ? 1.1 : 0.9;


                scale = Math.max(
                    size / Math.min(img.width, img.height),
                    scale
                );


                // keep zoom centered
                const ratio = scale / oldScale;

                offsetX = size / 2 - (size / 2 - offsetX) * ratio;
                offsetY = size / 2 - (size / 2 - offsetY) * ratio;


                clamp();
                updatePreview();

            };

            document.getElementById("cropContainer").style.display = "block";
            updatePreview();


            document.getElementById("cropButton").onclick = async () => {

                const output = document.createElement("canvas");

                output.width = 500;
                output.height = 500;

                const outCtx = output.getContext("2d");


                outCtx.save();

                outCtx.scale(
                    500 / size,
                    500 / size
                );

                outCtx.translate(
                    offsetX,
                    offsetY
                );

                outCtx.scale(
                    scale,
                    scale
                );

                outCtx.drawImage(
                    img,
                    0,
                    0
                );

                outCtx.restore();


                output.toBlob(async (blob) => {

                    const file = new File(
                        [blob],
                        "puzzle.png",
                        {
                            type: "image/png"
                        }
                    );


                    const difficulty =
                        Number(
                            document.getElementById("difficultySlider").value
                        );


                    function getColorStep(width, height) {
                        const pixels = width * height;

                        if (pixels <= 64) return 32;      // 8x8
                        if (pixels <= 1024) return 32;     // 32x32
                        if (pixels <= 4096) return 24;     // 64x64
                        if (pixels <= 16384) return 24;     // 128x128

                        return 4;
                    }

                    const puzzle = await parseImage(
                        file,
                        difficulty,
                        getColorStep(difficulty, difficulty)
                    );

                    const puzzleId = new Date()
                        .toISOString()
                        .replace(/[-:.]/g, "");

                    const colors = {};

                    let colorId = 1;


                    for (const row of puzzle.pixels) {

                        for (const pixel of row) {

                            const key =
                                `${pixel.r},${pixel.g},${pixel.b},${pixel.a}`;


                            if (!Object.values(colors).some(color =>
                                `${color.r},${color.g},${color.b},${color.a}` === key
                            )) {

                                colors[colorId] = {
                                    r: pixel.r,
                                    g: pixel.g,
                                    b: pixel.b,
                                    a: pixel.a
                                };

                                colorId++;

                            }

                        }

                    }

                    const savedPuzzle = {
                        id: puzzleId,
                        difficulty: difficulty,
                        pixels: puzzle.pixels,
                        colors: colors,
                        completed: false,
                        progress: 0,
                        filledPixels: {}
                    };

                    localStorage.setItem(
                        `puzzle_${puzzleId}`,
                        JSON.stringify(savedPuzzle)
                    );

                    sessionStorage.setItem(
                        "currentPuzzle",
                        String(puzzleId)
                    )

                    setGameState(GameState.PUZZLE);
                });

            };

        };

        img.src = URL.createObjectURL(file);

    });

}

export function updateCropPreview() {

    if (refreshPreview) {
        refreshPreview();
    }

}