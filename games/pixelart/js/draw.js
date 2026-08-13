export function drawParsedImage(puzzle) {

    const displaySize = 500;

    const canvas = document.createElement("canvas");
    canvas.width = displaySize;
    canvas.height = displaySize;

    const ctx = canvas.getContext("2d");

    ctx.imageSmoothingEnabled = false;

    const pixelSize = Math.min(
        displaySize / puzzle.width,
        displaySize / puzzle.height
    );

    const imageWidth = puzzle.width * pixelSize;
    const imageHeight = puzzle.height * pixelSize;

    const offsetX = (displaySize - imageWidth) / 2;
    const offsetY = (displaySize - imageHeight) / 2;


    for (let y = 0; y < puzzle.height; y++) {

        for (let x = 0; x < puzzle.width; x++) {

            const pixel = puzzle.pixels[y][x];

            ctx.fillStyle = `rgba(
                ${pixel.r},
                ${pixel.g},
                ${pixel.b},
                ${pixel.a / 255}
            )`;

            ctx.fillRect(
                offsetX + x * pixelSize,
                offsetY + y * pixelSize,
                pixelSize,
                pixelSize
            );

        }

    }

    document.body.appendChild(canvas);

}