import { parseImage } from "./imageParser.js";
import { drawParsedImage } from "./draw.js";
import { createSquareCropper, updateCropPreview } from "./cropper.js";
import { GameState, setGameState } from "./gameState.js";

setGameState(GameState.LIBRARY);

document.getElementById("createButton").onclick = () => {
    setGameState(GameState.CREATE);
};

document.getElementById("imageInput").addEventListener("change", async (event) => {

    const file = event.target.files[0];

    if (!file) return;


    const croppedFile = await createSquareCropper(file);

    document.getElementById("showImage").src = URL.createObjectURL(croppedFile);

    /*const difficulty = 64;
    const colorStep = 16;

    const puzzle = await parseImage(
        croppedFile,
        difficulty,
        colorStep
    );

    drawParsedImage(puzzle);
    */

});

document.getElementById("difficultySlider").oninput = () => {

    const value =
        document.getElementById("difficultySlider").value;

    document.getElementById("difficultyValue").textContent =
        `${value} x ${value}`;

    updateCropPreview();

};

document.getElementById("cropButton").onclick = () => {
    setGameState(GameState.CREATE);
};