var startNewGameContainer = document.getElementById("startNewGameContainer");
var joinGameContainer = document.getElementById("joinGameContainer");
var lobbyContainer = document.getElementById("lobbyContainer");
var initScreenContainer = document.getElementById("initScreen");
var nullNameError = document.getElementById("nullNameError");

let GAME_ACTIVE = false;

function init() {
    startNewGameContainer.style.display = "none";
    joinGameContainer.style.display = "none";
    nullNameError.style.display = "none";
    lobbyContainer.style.display = "none";
}

init();

function setupNewGame() {
    startNewGameContainer.style.display = "block";
    joinGameContainer.style.display = "none";

    gameCode = Math.floor(Math.random() * 1000);
    document.getElementById("gameCode").innerHTML = gameCode;
}

async function startNewGame() {
    gameCode = document.getElementById("gameCode").innerHTML;
    playerName = document.getElementById("playerNameStart").value;

    if (gameCode != "" && playerName != "") {
        res = await fetch("http://localhost:3000/startNewGame", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            mode: "cors",
            body: JSON.stringify({
                gameCode: gameCode,
                playerName: playerName
            })
        });

        if (res.status == 200) {
            GAME_ACTIVE = true;
            lobbyContainer.style.display = "block";
            initScreenContainer.style.display = "none";
            startNewGameContainer.style.display = "none";
            joinGameContainer.style.display = "none";

            lobbyContainer.appendChild(document.createElement("p")).innerHTML = playerName + " has joined the game!";
        }
    } else {
        nullNameError.style.display = "block";
    }
}



function joinExistingGame() {
    startNewGameContainer.style.display = "none";
    joinGameContainer.style.display = "block";
}

async function joinGame() {
    existingGameCode = document.getElementById("existingGameCode").value;
    playerName = document.getElementById("playerNameJoin").value;

    res = await fetch("http://localhost:3000/joinGame", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            mode: "cors",
            body: JSON.stringify({
                gameCode: existingGameCode,
                playerName: playerName
            })
        });

    if (res.status == 200) {
        lobbyContainer.style.display = "block";
        initScreenContainer.style.display = "none";
        startNewGameContainer.style.display = "none";
        joinGameContainer.style.display = "none";

        data = await res.json();
        for (let i = 0; i < data.players.length; i++) {
            lobbyContainer.appendChild(document.createElement("p")).innerHTML = data.players[i] + " has joined the game!";
        }
    }
}

function handleInit(data) {
    console.log(data);
}