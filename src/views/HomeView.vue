<template>
  <div class="childContainer">
    <div v-if="isNewGame" class="newGameScreen">
      <v-btn
        width="200"
        height="100"
        color="primary"
        @click="createNewGame()"
      >
        New Game
      </v-btn>
    </div>
    <v-expand-transition>
      <div v-show="!isNewGame" class="joinGameScreen">
        <h2 class="centerElement">Scan QR Code to Join!</h2>
        <qrcode-vue :value="getLocalHost" :size="getQRCodeSize" level="H" render-as="svg" class="QRDiv"/>
        <v-expand-transition>
          <div class="centerElement" v-show="players.length != 0">
            <v-btn color="primary"> Start </v-btn>
          </div>
        </v-expand-transition>
        <h2 class="centerElement">Current Players: {{players.length}}</h2>
    </div>
    </v-expand-transition>
  </div>
</template>

<script>
import axios from "axios"
import QrcodeVue from 'qrcode.vue'
import { mapGetters, mapActions } from "vuex";

export default {
  components: {QrcodeVue },
  data() {
    return {
      players: []
    }
  },
  computed: {
    ...mapGetters([
      "getMongoServer",
      "getGameID",
      "getCurrentUser"
    ]),
    isNewGame(){
      if(this.getGameID == "")
        return true
      return false
    },
    getLocalHost() {
      return "http://" + window.location.host;
    },
    getQRCodeSize() {
      return parseInt(window.innerHeight * .25);
    },
  },
  methods: {
    ...mapActions(["setGameIDAction", "setCurrentUserAction"]),
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
          this.$router.push({path: "/PlayerView"});
        }
      })
      .catch(err => console.log(err));
    },
    createNewGame()
    {
      this.setGameIDAction("e")
    }
  },
  created()
  {
    this.isDeviceHost();
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
.QRDiv
{
  text-align: center;
}
.centerElement
{
  text-align: center;
}
</style>