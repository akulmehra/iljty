const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors({
    origin: '*'
}));

activeGames = {};

app.post('/startNewGame', (req, res) => {
    const { gameCode, playerName } = req.body;
    if (gameCode == "") {
        res.send("Invalid game code!");
        return;
    }

    if (playerName == "") {
        res.send("Invalid player name!");
        return;
    }

    activeGames[gameCode] = [];
    activeGames[gameCode].push(playerName);
    res.json({"players": activeGames[gameCode]});
});

app.post('/joinGame', (req, res) => {
    console.log(req.body);
    const { gameCode, playerName } = req.body;
    if (gameCode == "") {
        res.send("Invalid game code!");
        return;
    }

    if (playerName == "") {
        res.send("Invalid player name!");
        return;
    }

    if (activeGames[gameCode] == undefined) {
        res.send("Game does not exist!");
        return;
    }

    if (activeGames[gameCode].includes(playerName)) {
        res.send("Player already exists!");
        return;
    }

    activeGames[gameCode].push(playerName);
    res.json({"players": activeGames[gameCode]});
});

app.get('/lobby.html*', (req, res) => {
    let codeIndex = 21;

    while (Number.isInteger(Number(req.url[codeIndex]))) {
        codeIndex++;
    }
    const gameCode = req.url.substring(21, codeIndex);
    const playerName = req.url.substring(35, req.url.length);
    res.json(activeGames[gameCode]);
});

app.listen(3000);
