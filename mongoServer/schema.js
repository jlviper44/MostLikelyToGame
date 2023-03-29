const mongoose = require("mongoose");

// Schema for Users
const Game = mongoose.Schema(
  {
    IsGameRunning:{
      type: Boolean,
      required: true
    },
    // WaitingForPlayers, Question, Answer, FinalResults
    GameState: {
      type: String,
      required: true
    },
    CurrentQuestion: {
      type: String,
    },
    JoinCode: {
      type: String,
      required: true
    },
    Responses: [],
    Players: [],
  },
  { collection: "Games", versionKey: false }
);

const Question = mongoose.Schema(
  {
    Question: {
      type: String,
      required: true,
    },
  },
  { collection: "Questions", versionKey: false }
);

const gameModel = mongoose.model("game", Game);
const questionModel = mongoose.model("question", Question);

module.exports = {
  GameModel: gameModel,
  QuestionModel: questionModel,
};