export async function parseImage(file, difficulty, colorStep) {
    function quantize(value, step = colorStep) {
        return Math.round(value / step) * step;
    }

    const bitmap = await createImageBitmap(file);

    let width;
    let height;

    if (bitmap.width >= bitmap.height) {

        width = difficulty;
        height = Math.round(bitmap.height / bitmap.width * difficulty);

    } else {

        height = difficulty;
        width = Math.round(bitmap.width / bitmap.height * difficulty);

    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(bitmap, 0, 0, width, height);

    const { data } = ctx.getImageData(0, 0, width, height);

    const pixels = [];

    for (let y = 0; y < height; y++) {

        const row = [];

        for (let x = 0; x < width; x++) {

            const i = (y * width + x) * 4;

            const r = quantize(data[i], colorStep);
            const g = quantize(data[i + 1], colorStep);
            const b = quantize(data[i + 2], colorStep);
            const a = data[i + 3];

            row.push({
                r,
                g,
                b,
                a
            });

        }

        pixels.push(row);

    }

    return {
        width,
        height,
        pixels
    };

}
export function parseCanvas(canvas, difficulty, colorStep = 16) {

    const small = document.createElement("canvas");

    small.width = difficulty;
    small.height = difficulty;


    const smallCtx = small.getContext("2d");

    smallCtx.imageSmoothingEnabled = false;

    smallCtx.drawImage(
        canvas,
        0,
        0,
        canvas.width,
        canvas.height,
        0,
        0,
        difficulty,
        difficulty
    );


    const preview = document.getElementById("previewCanvas");

    preview.width = 400;
    preview.height = 400;


    const previewCtx = preview.getContext("2d");

    previewCtx.imageSmoothingEnabled = false;

    previewCtx.clearRect(
        0,
        0,
        400,
        400
    );


    previewCtx.drawImage(
        small,
        0,
        0,
        difficulty,
        difficulty,
        0,
        0,
        400,
        400
    );

}