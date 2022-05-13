export class GameState {
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