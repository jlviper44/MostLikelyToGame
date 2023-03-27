<template>
  <div>
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
    doesGameExist(joinCode)
    {
      axios.post("http://"+this.getMongoServer.ip+":"+this.getMongoServer.port+"/findGame", 
      {
        JoinCode: joinCode
      })
      .then((response) => {
        // invalid join code
        if(response.data.length == 0)
        {
          response
        }
        // game is over
        else if(response.data[0].IsGameRunning == false)
        {
          response
        }
        // joined game
        else
        {
          let game = response.data[0];
          this.setGameIDAction(game._id);
          this.setJoinCodeAction(game.JoinCode);
        }
      });
    }
  },
  created()
  {
    this.doesGameExist(this.$route.params.joinCode);
  },
  watch: {
  }
}
</script>
<style scoped>
</style>