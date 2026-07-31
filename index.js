let games = [];
const search = document.getElementById("search");

async function initApp() {

    try {

        const response = await fetch('./JSON/games.json');

        if (!response.ok) {
            throw new Error("Failed to load games");
        }

        games = await response.json();

        addGames();

    } catch(error) {

        console.error("Error loading games:", error);

    }

}

initApp();


function addGames() {

    const gameBox = document.getElementById("games");

    if (!gameBox) return;

    games.forEach(game => {

        gameBox.insertAdjacentHTML(
            "beforeend",
            createGameCard(game)
        );

    });

}


function createGameCard(game) {

    return `
        <div class="game" data-game="${game.id}" onclick="viewGame('${game.id}')">

            <img class="gameimg" src="${game.image}" alt="${game.name}">

            <h4 class="gametitle">
                ${game.name}
            </h4>

            <button class="gamebtn" onclick="event.stopPropagation(); playGame('${game.id}')">
                Play
            </button>

        </div>
    `;

}


function playGame(gameId) {

    const game = getGame(gameId);

    if (game) {
        window.location.href = game.path;
    }

}


function viewGame(gameId) {

    window.location.href = `gameDesc.html?game=${gameId}`;

}


function getGame(id) {

    return games.find(game => game.id === id);

}

search.addEventListener("input", () => {

    const query = search.value
        .toLowerCase()
        .trim();

    const gameBox = document.getElementById("games");

    gameBox.innerHTML = "";

    if (!query) {
        addGames();
        return;
    }


    const filteredGames = games
        .map(game => {

            const name = game.name.toLowerCase();

            let score = 0;


            // Exact match
            if (name === query) {
                score += 100;
            }


            // Starts with search
            if (name.startsWith(query)) {
                score += 50;
            }


            // Whole word match
            if (name.split(" ").includes(query)) {
                score += 30;
            }


            // Contains search
            if (name.includes(query)) {
                score += 10;
            }


            return {
                game,
                score
            };

        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.game);



    filteredGames.forEach(game => {

        gameBox.insertAdjacentHTML(
            "beforeend",
            createGameCard(game)
        );

    });

});

if ("serviceWorker" in navigator) {

    navigator.serviceWorker.register("./service-worker.js");

}