<template>
  <v-app>
    <v-app-bar
      app
      :color="currentColor"
      dark
    >
      <div class="d-flex align-center">
        <h2 class="black--text" v-if="isDarkText(currentColor)">
          Most Likely To
        </h2>
        <h2 class="white--text" v-else>
          Most Likely To
        </h2>
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <!-- <v-tabs> -->
        
      <!-- </v-tabs> -->
      <div class="container">

        <router-view/>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios"
import { mapGetters, mapActions } from "vuex";

export default {
  name: 'MostLikelyTo',
  data() {
    return {
      colors: [
        "purple",
        "pink",
        "yellow",
        "blue",
        "green"
      ],
      currentColor: ""
    }
  },
  computed: {
    ...mapGetters([
      "getMongoServer",
      "getGameID",
      "getCurrentUser"
    ])
  },
  methods: {
    ...mapActions(["setGameIDAction", "setCurrentUserAction"]),
    generateRandomColor()
    {
      this.currentColor =  this.colors[this.getRandomInt(this.colors.length)];
    },
    getRandomInt(max) {
      return Math.floor(Math.random() * max);
    },
    
    isDarkText(bgColor) {
      let c = this.$vuetify.theme.themes.light[bgColor]
      var color = (c.charAt(0) === '#') ? c.substring(1, 7) : c;
      var r = parseInt(color.substring(0, 2), 16);
      var g = parseInt(color.substring(2, 4), 16);
      var b = parseInt(color.substring(4, 6), 16);
      return (((r * 0.299) + (g * 0.587) + (b * 0.114)) > 186) ?
      true : false;
    },
  },
  created()
  {
    // console.log(window.location.host)
    // this.getIpAddress();
    this.generateRandomColor();
    // this.isDeviceHost();
  }
};
</script>

<style scoped>
.container
{
  width: 100vw;
  height:calc(100vh - 85px);
}
</style>
