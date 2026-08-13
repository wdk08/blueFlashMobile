import { initPuzzleGame } from "./puzzle.js";

export const GameState = {
    LIBRARY: "library",
    CREATE: "create",
    PUZZLE: "puzzle"
};

let currentState = GameState.LIBRARY;

export function getGameState() {
    return currentState;
}

export function setGameState(state) {

    currentState = state;

    const screens = {
        library: document.getElementById("libraryScreen"),
        create: document.getElementById("createScreen"),
        puzzle: document.getElementById("playingScreen")
    };


    Object.entries(screens).forEach(([key, element]) => {

        if (!element) return;

        element.hidden =
            key !== state;

    });
    switch (state) {
        case GameState.PUZZLE:
            console.log("RUN PUZZLE");
            initPuzzleGame();
            break;
    }
}