import { gameState } from "./gameStates.js";

function saveGame() {
  const saveData = {
    gridData: gameState.gridData,
    score: gameState.score,
    highScore: gameState.highScore,
    blocks: gameState.blocks,
  };

  localStorage.setItem("gemBlastSave", JSON.stringify(saveData));
}

function loadGame() {
  const saved = localStorage.getItem("gemBlastSave");

  if (!saved) return false;

  const data = JSON.parse(saved);

  gameState.gridData.splice(
    0,
    gameState.gridData.length,
    ...data.gridData.map(row => [...row])
  );

  gameState.score = data.score;
  gameState.highScore = data.highScore;
  gameState.blocks = data.blocks;

  return true;
}

function clearSave() {
  localStorage.removeItem("gemBlastSave");
}

export { saveGame, loadGame, clearSave };