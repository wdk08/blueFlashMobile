const gameName = document.getElementById("gameName");
const gameImg = document.getElementById("gameImg");
const playBtn = document.getElementById("playBtn");
const gameDesc = document.getElementById("gameDescription");
const stats = document.getElementById("stats");

let games = [];

async function initApp() {
    try {
        const response = await fetch('/JSON/games.json');
        if (!response.ok) throw new Error('Network response was not ok');

        games = await response.json();

        getGameData();
    } catch (error) {
        console.error('Error loading game database:', error);
    }
}

function getGame(id) {
    return games.find(game => game.id === id);
}

function getGameData() {
    const gameId = new URLSearchParams(window.location.search).get('game');
    const game = getGame(gameId);
    insertData(game);
}

function formatCamelCase(str) {
    return str
        .replace(/([A-Z])/g, " $1") // Add a space before every capital letter
        .replace(/^./, c => c.toUpperCase()); // Capitalize the first letter
}

function insertData(game) {
    gameName.innerHTML = game.name;
    gameImg.src = game.image;
    gameDesc.innerHTML = game.description
    playBtn.onclick = () => {
        window.location.href = game.path;
    };
}


initApp();