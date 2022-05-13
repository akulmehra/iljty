const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors({
    origin: '*'
}));

activeGames   = {};
gameStates    = {};
questionsGame = {}

class GameState {
    constructor(players) {
        this.index = 0;
        this.players = players;
        this.scores  = {}
    }

    increaseScore(player) {
        if (player in this.scores) {
            this.scores[player] += 1;
        } else {
            this.scores[player] = 0;
        }
    }

    activePlayer() {
        return this.players[this.index++];
    }

    scores() {
        return this.scores;
    }
}

class QuestionAnswer {
    constructor(question, answer) {
        this.question = question;
        this.answer = answer;
    }

    isCorrect(guess) {
        return guess === this.answer;
    }
}

app.post("/playGame", (req, res) => {
    const { gameCode } = req.body;
    gameStates[gameCode] = new GameState(activeGames[gameCode]);
    questionsGame[gameCode] = {};
    res.json({"game code": gameCode});
})

app.post("/addQA", (req, res) => {
    const { gameCode, playerName, questions, answers } = req.body;
    questionsGame[gameCode][playerName] = [new QuestionAnswer(questions[0], answers[0]), 
                                           new QuestionAnswer(questions[1], answers[1]),
                                           new QuestionAnswer(questions[2], answers[2]),
                                           new QuestionAnswer(questions[3], answers[3])
                                        ];

    res.json({"game code": gameCode});
    console.log(questionsGame[gameCode]);
})


app.get("/getactiveplayer/:gameCode", (req, res) => {
    const gameCode = req.params.gameCode;
    res.json(gameStates[gameCode].activePlayer());
})

app.get("/getscores/:gameCode", (req, res) => {
    const gameCode = req.params.gameCode;
    res.json(gameStates[gameCode].scores());
})

app.post('/startNewGame', (req, res) => {
    console.log("Start new game is called");
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

app.get("/getPlayers/:gameCode", (req, res) => {
    res.json({"players": activeGames[req.params.gameCode]});
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

app.listen(8000);
