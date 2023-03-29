<template>
  <div class="playerContainter">
    <div 
      class="PlayerNameInput"
      v-if="this.getGameID == ''"
    >
      <v-text-field
        outlined
        dense
        label="Input Join Code"
        v-model="joinCodeInput"
      >
      </v-text-field>
      <v-btn
        color="primary"
        width="100%"
        @click="joinGame(joinCodeInput)"
      >
        Connect
      </v-btn>
    </div>
    <div 
      class="PlayerNameInput"
      v-else-if="this.getCurrentUser == ''"
    >
      <v-text-field
        outlined
        dense
        label="Input Your Name"
        v-model="playerNameInput"
      >
      </v-text-field>
      <v-btn
        color="primary"
        width="100%"
        :disabled="playerNameInput == ''"
        @click="setPlayerName(playerNameInput)"
      >
        Join
      </v-btn>
    </div>
    <div 
      class="PlayerNameInput"
      v-else-if="gameState == 'WaitingForPlayers' && this.getCurrentUser != ''"
    >
      <center>
        <h4>Joined! Waiting for other players...</h4>
        <br>
        <v-progress-linear indeterminate :color="currentColor"></v-progress-linear>
      </center>
    </div>
    <div
      class="PlayerNameInput"
      v-else-if="gameState == 'Question' && this.getCurrentUser != ''"
    >
      <h4>
        Select a person:
      </h4>
      <br>
      <v-autocomplete
        dense
        outlined
        hide-details
        :items="players.filter((player)=>{return player !== this.getCurrentUser})"
      >
      </v-autocomplete>
      <br>
      <v-btn
        color="primary"
        width="100%"
        
      >
        Submit
      </v-btn>
    </div>
  </div>
</template>

<script>

import axios from "axios"
import { mapGetters, mapActions } from "vuex";

export default {
  name: 'PlayerView',
  components: { },
  data() {
    return {
      gameState: "",
      windowState: "",
      joinCodeInput: "PQ075",
      playerNameInput: "",
      colors: [
        "purple",
        "pink",
        "yellow",
        "blue",
        "green",
        "red"
      ],
      currentColor: "",
      gameStateTimer: null,
      players: []
    }
  },
  computed: {
    ...mapGetters([
      "getMongoServer",
      "getGameID",
      "getJoinCode",
      "getCurrentUser"
    ]),
  },
  methods:
  {
    ...mapActions([
      "setGameIDAction", 
      "setJoinCodeAction", 
      "setCurrentUserAction"
    ]),
    generateRandomColor()
    {
      this.currentColor =  this.colors[this.getRandomInt(this.colors.length)];
    },
    getRandomInt(max) {
      return Math.floor(Math.random() * max);
    },
    doesGameExist(joinCode)
    {
      axios.post("http://"+this.getMongoServer.ip+":"+this.getMongoServer.port+"/findGame", 
      {
        JoinCode: joinCode,
        IsGameRunning: true
      })
      .then((response) => {
        // invalid join code
        if(response.data.length == 0)
        {
          response
        }
        // joined game
        else
        {
          let game = response.data;
          this.gameState = game.GameState;
          this.setGameIDAction(game._id);
          this.setJoinCodeAction(game.JoinCode);
        }
      });
    },
    joinGame(joinCode)
    {
      this.$router.push({path: "/PlayerView/"+joinCode});
      this.doesGameExist(this.$route.params.joinCode);
    },
    setPlayerName(playerName)
    {
      axios.post("http://"+this.getMongoServer.ip+":"+this.getMongoServer.port+"/addPlayerToGame", 
        {
          gameID: this.getGameID,
          player: playerName
        }
      )
      .then((response) => {
        console.log(response.data);
        if(response.data == "Success")
        {
          this.setCurrentUserAction(playerName);
          this.gameStateTimer = setInterval(() => this.getGameUpdate(), 1000);
        }
      });
    },
    getGameUpdate()
    {
      axios.post("http://"+this.getMongoServer.ip+":"+this.getMongoServer.port+"/findGame", 
      {
        _id: this.getGameID
      })
      .then((response) => {
        this.gameState = response.data.GameState;
        this.players = response.data.Players;
      });
    }
  },
  created()
  {
    this.generateRandomColor();
    this.doesGameExist(this.$route.params.joinCode);
  },
  beforeDestroy()
  {
    clearInterval(this.gameStateTimer);
  },
  watch: {

  }
}
</script>
<style scoped>
.playerContainter
{
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
.PlayerNameInput
{
  padding: 10%;
}
</style>