<template>
  <div class="childContainer">
    <v-container fluid>
      <v-expand-transition>
        <div v-show="isNewGame" class="newGameScreen" align="center" align-self="center">
          <v-btn
            width="20vw"
            height="10vh"
            color="primary"
            @click="createNewGame()"
          >
            New Game
          </v-btn>
        </div>
      </v-expand-transition>
      <v-expand-transition>
        <div 
          v-show="!isNewGame && gameState == 'WaitingForPlayers'" 
          class="joinGameScreen"
        >
          <h2 class="centerElement">
            Scan QR Code or use 
            <span class="red--text">{{getJoinCode}}</span> 
            to Join!
          </h2>
          <qrcode-vue :value="getLocalHost" :size="getQRCodeSize" level="H" render-as="svg" class="QRDiv"/>
          <v-expand-transition>
            <div class="centerElement" v-show="players.length != 0">
              <v-btn 
                color="primary"
                @click="startGame()"
              > Start </v-btn>
            </div>
          </v-expand-transition>
          <br>
          <h2 class="centerElement">Current Players: {{players.length}}</h2>
          <v-row no-gutters>
            <v-col v-for="player in players" :key="players.indexOf(player)" cols="12" sm="3">
              <v-scale-transition>
                <v-card
                  v-show="player.Expand"
                  class="pa-2"
                  outlined
                  rounded
                >{{player.Name}}</v-card>
              </v-scale-transition>
            </v-col>
          </v-row>
        </div>
      </v-expand-transition>
      
      <v-expand-transition>
        <div 
          v-show="!isNewGame && gameState == 'Question'" 
          class="questionScreen"
        >
          <center>
            <span class="defaultPromptText">
              Select the person whos is Most Likely To:
            </span>
            <transition name="showFromBottom">
              <ul class="flashcard-list" v-show="isShowQuestionCard" v-bind:key="isShowQuestionCard">
                <li v-on:click="card.flipped = !card.flipped" v-for="(card, index) in cards" :key="index">
                  <transition name="flip">
                    <div v-bind:key="card.flipped" class="card">
                      <p v-if="card.flipped">
                        {{ card.text }}
                      </p>
                    </div>
                  </transition>
                </li>
              </ul>
            </transition>
          </center>
          
        </div>
      </v-expand-transition>
    </v-container>
  </div>
</template>

<script>
import axios from "axios"
import QrcodeVue from 'qrcode.vue'
import { mapGetters, mapActions } from "vuex";

export default {
  name: 'HomeView',
  components: {QrcodeVue },
  data() {
    return {
      players: [],
      gameState: "",
      settings: {
        
      },
      cards: [
        {
          text: 'Ada Lovelace',
          flipped: false,
        },
        // {
        //   front: 'Invented the "Clarke Calculator"',
        //   back: 'Edith Clarke',
        //   flipped: false,
      
        // },
        // {
        //   front: 'Famous World War II Enigma code breaker',
        //   back: 'Alan Turing',
        //   flipped: false,
        // },
        // {
        //   front: 'Created satellite orbit analyzation software for NASA',
        //   back: 'Dr. Evelyn Boyd Granville',
        //   flipped: false,
        // },
      ],
      gameStateTimer: null,
      isShowQuestionCard: false
    }
  },
  computed: {
    ...mapGetters([
      "getMongoServer",
      "getGameID",
      "getJoinCode",
      "getCurrentUser"
    ]),
    isNewGame(){
      if(this.getGameID == "")
        return true
      return false
    },
    getLocalHost() {
      return "http://" + window.location.host + "/PlayerView/" + this.getJoinCode;
    },
    getQRCodeSize() {
      return parseInt(window.innerHeight * .25);
    },
  },
  methods: {
    ...mapActions([
      "setGameIDAction", 
      "setJoinCodeAction", 
      "setCurrentUserAction"
    ]),
    async getIpAddress()
    {
      return axios.get("http://"+this.getMongoServer.ip+":"+this.getMongoServer.port+"/getIP")
      .then(response => response.data)
    },
    isDeviceHost()
    {
      this.getIpAddress()
      .then(data => {
        let ip = data.replace("::ffff:", "");
        if(ip != this.getMongoServer.ip)
        {
          this.$router.push({path: "/PlayerView/0"});
        }
      })
      .catch(err => console.log(err));
    },
    createJoinCode(length) {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
      return result;
    },
    createNewGame()
    {
      // let joinCode = this.createJoinCode(5);
      let joinCode = "PQ075";

      // axios.post("http://"+this.getMongoServer.ip+":"+this.getMongoServer.port+"/createGame", 
      axios.post("http://"+this.getMongoServer.ip+":"+this.getMongoServer.port+"/findGame", 
      {
        JoinCode: joinCode
      })
      .then((response) => {
        this.setJoinCodeAction(joinCode);
        this.setGameIDAction(response.data);
        // this.getGameUpdate();
        this.gameState = "WaitingForPlayers"
        this.gameStateTimer = setInterval(() => this.getGameUpdate(), 1000);
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
        response.data.Players.forEach((player) => {
          if(this.players.find(x=> x.Name == player) == undefined)
          {
            this.players.unshift({Name:player, Expand: false});
            setTimeout(()=> {
              this.players.find(x=> x.Name == player).Expand = true;
            }, 25)
          }
        });
      });
      // setTimeout(()=>{this.getGameUpdate()}, 1000);
    },
    startGame()
    {
      this.showQuestion();
    },
    showQuestion()
    {
      axios.post("http://"+this.getMongoServer.ip+":"+this.getMongoServer.port+"/updateGame", 
      {
        _id: this.getGameID,
        update: {
          GameState: "Question"
        }
      })
      .then((response) => {
        this.gameState = "Question"
        setTimeout(()=> {
          this.isShowQuestionCard = true;
        }, 600)
        setTimeout(()=> {
          this.cards[0].flipped = true;
        }, 1150)
      });
    }
  },
  created()
  {
    this.isDeviceHost();
    axios.post("http://"+this.getMongoServer.ip+":"+this.getMongoServer.port+"/updateGame", 
      {
        _id: "6422fabb238c220dd51c5793",
        update: {
          GameState: "WaitingForPlayers"
        }
      })
      .then((response) => {
      });
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
.childContainer
{
  width: 100%;
  height: 100%;
  display: flex;
}

.newGameScreen
{
  margin: auto;
  vertical-align: middle;
  text-align: center;
  height: 100%;
  width: 100%;
}
.joinGameScreen
{
  margin: auto;
  vertical-align: middle;
  height: 100%;
  width: 100%;
  background-color: gainsboro;
  border-radius: 10px;
}
.questionScreen
{
  margin: auto;
  vertical-align: middle;
  height: 100%;
  width: 100%;
  background-color: gainsboro;
  border-radius: 10px;
}
.QRDiv
{
  text-align: center;
}
.centerElement
{
  text-align: center;
}
ul {
  padding-left: 0;
  display: flex;
  flex-flow: row wrap;
}

li {
  list-style-type: none;
  padding: 10px 10px;
  transition: all 0.3s ease;
}

.container {
  max-width: 100%;
  padding: 2em;
}

.flashcard-list
{
  width: 20vw;
  padding-top: 2vh;
  
}

.card {
  display: block;
  width: 20vw;
  height: 50vh;
  /* padding: 80px 45px; */
  background-color: #51aae5;
  border-radius: 7px;
  margin: 5px;
  text-align: center;
  line-height: 27px;
  cursor: pointer;
  position: relative;
  color: #fff;
  font-weight: 600;
  font-size: 20px;
  /* -webkit-box-shadow: 9px 10px 22px -8px rgba(209,193,209,.5);
  -moz-box-shadow: 9px 10px 22px -8px rgba(209,193,209,.5);
  box-shadow: 9px 10px 22px -8px rgba(209,193,209,.5); */
  will-change: transform;
}

.defaultPromptText
{
  font-weight: bold;
  font-size: 3vh;
}

li:hover{
  transform: scale(1.1);
}
.showFromBottom-enter, .showFromBottom-leave
{
  transition: 0.5s;
  transform: translateY(100%);
}
.showFromBottom-enter-active {
  transition: all 0.4s ease;
}
.showFromBottom-leave-active {
  transition: all 0.4s ease;
}

.flip-enter-active {
  transition: all 0.4s ease;
}
.flip-leave-active {
  display: none;
}
.flip-enter, .flip-leave {
  transform: rotateY(180deg) scale(1.1);
  opacity: 0;
  /* transform: scale(1.1); */
}
  
</style>
