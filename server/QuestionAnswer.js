export class QuestionAnswer {
    constructor(question, answer) {
        this.question = question;
        this.answer = answer;
    }

    isCorrect(guess) {
        return guess === this.answer;
    }
}