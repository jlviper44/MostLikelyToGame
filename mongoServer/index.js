const express = require('express');
const bodyParser = require("body-parser");
const requestIp = require("request-ip");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");

const { GameModel, QuestionModel } = require("./schema");

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/MostLikelyTo", {});

var db = mongoose.connection;
db.on("open", () => {
  console.log("Connected to mongoDB");
});
db.on("error", (error) => {
  console.log(error);
});

function createGame(req, res){
  var game = new GameModel({
    JoinCode: req.body.JoinCode,
    IsGameRunning: true
  });
  game.save()
  .then((Game) => {
    res.send(Game._id);
  })
  .catch((err) => {
    console.error(err);
  });
}

function findGame(req, res)
{
  var query = req.body;
  GameModel.find(query)
  .then((Game) => {
    res.send(Game)
  })
  .catch((err) => {
    console.error(err);
  });
}


app.post("/createGame", (req, res) => {
  createGame(req, res);
});

app.post("/findGame", (req, res) => {
  findGame(req, res);
});

app.get("/getIP", (req, res) => {
  var clientIP = requestIp.getClientIp(req);
  res.send(clientIP);
});

app.listen(3000, () => console.log("Server started on port 3000"));