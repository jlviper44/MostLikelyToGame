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
    IsGameRunning: true,
    GameState: "WaitingForPlayers"
  });
  game.save()
  .then((Game) => {
    res.send(Game._id);
  })
  .catch((err) => {
    console.error(err);
    res.send("Error");
  });
}

function findGame(req, res)
{
  var query = req.body;
  if(Object.keys(query).includes("_id"))
  {
    GameModel.findById(query["_id"])
    .then((Game) => {
      res.send(Game)
    })
    .catch((err) => {
      console.error(err);
      res.send("Error");
    });
  }
  else
  {
    GameModel.findOne(query)
    .then((Game) => {
      res.send(Game)
    })
    .catch((err) => {
      console.error(err);
      res.send("Error");
    });
  }
}

function updateGame(req, res)
{
  var id = req.body._id;
  var update = req.body.update;
  GameModel.findById(id)
  .then((Game) => {
    for (const [key, value] of Object.entries(update)) {
      Game[key] = value;
    }
    Game.save();
    res.send("Successfully Updated!");
  })
  .catch((err) => {
    console.error(err);
    res.send("Error");
  });
}

function addPlayerToGame(req, res)
{
  const ObjectId = mongoose.Types.ObjectId;
  let gameID = req.body.gameID;
  let player = req.body.player;
  GameModel.findOne({_id:new ObjectId(gameID)})
  .then((Game) => {
    if(!Game.Players.includes(player))
    {
      Game.Players.push(player)
    }
    Game.save();
    res.send("Success");
  })
  .catch((err) => {
    console.error(err);
    res.send("Error");
  });
}

app.post("/createGame", (req, res) => {
  createGame(req, res);
});

app.post("/findGame", (req, res) => {
  findGame(req, res);
});

app.post("/updateGame", (req, res) => {
  updateGame(req, res);
});

app.post("/addPlayerToGame", (req, res) => {
  addPlayerToGame(req, res);
});

app.get("/getIP", (req, res) => {
  var clientIP = requestIp.getClientIp(req);
  res.send(clientIP);
});

app.listen(3000, () => console.log("Server started on port 3000"));