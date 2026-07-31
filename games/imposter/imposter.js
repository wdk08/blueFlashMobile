let data;
let roles = [];
let currentPlayer = 0;

fetch("data.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    const select = document.getElementById("category");
    Object.keys(data).forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      select.appendChild(option);
    });
  });

function resetGame() {
  roles = [];
  currentPlayer = 0;

  hideAll();
  document.getElementById("setup").classList.remove("hidden");

  // Optional: clear inputs
  playersInput.value = "";
  impostersInput.value = "";
}


function startGame() {
  const players = +playersInput.value;
  const imposters = +impostersInput.value;
  const category = categorySelect.value;

  if (players < 3 || imposters < 1 || imposters >= players) {
    alert("Check your numbers!");
    return;
  }

  const words = data[category];
  const chosenWord = words[Math.floor(Math.random() * words.length)];

  roles = [];

  for (let i = 0; i < imposters; i++) {
    roles.push({ role: "Imposter" });
  }

  for (let i = 0; i < players - imposters; i++) {
    roles.push({ role: "Crewmate", word: chosenWord });
  }

  roles.sort(() => Math.random() - 0.5);
  currentPlayer = 0;
  showPass();
}

const playersInput = document.getElementById("players");
const impostersInput = document.getElementById("imposters");
const categorySelect = document.getElementById("category");

function showPass() {
  hideAll();
  document.getElementById("pass").classList.remove("hidden");
  document.getElementById("playerNum").textContent = currentPlayer + 1;
}

function showRole() {
  hideAll();
  const role = roles[currentPlayer];
  const categoryText = document.getElementById("categoryText");
  const roleText = document.getElementById("roleText");
  const wordText = document.getElementById("wordText");

  // Add categorySelect.value here:
  categoryText.textContent = `Category: ${categorySelect.value}`;

  roleText.textContent = role.role;
  roleText.className = role.role === "Imposter" ? "role imposter" : "role";

  wordText.textContent =
    role.role === "Crewmate" ? role.word : "No word for you 😈";

  document.getElementById("reveal").classList.remove("hidden");
}

function nextPlayer() {
  currentPlayer++;
  if (currentPlayer >= roles.length) {
    hideAll();
    document.getElementById("end").classList.remove("hidden");
  } else {
    showPass();
  }
}

function hideAll() {
  document.querySelectorAll(".card").forEach(c => c.classList.add("hidden"));
}

const homeBtn = document.getElementById("homeBtn");

homeBtn.addEventListener("click", () => {
    window.location.href = "../../index.html";
});

document.querySelectorAll("input, select").forEach(input => {
    input.addEventListener("focus", () => {
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
    });
});