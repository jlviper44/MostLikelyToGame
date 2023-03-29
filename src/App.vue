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
      <div class="d-flex align-center" v-if="getJoinCode != '' ">
        <h3 class="black--text" v-if="isDarkText(currentColor)">
          Join Code: {{getJoinCode}}
        </h3>
        <h3 class="white--text" v-else>
          Join Code: {{getJoinCode}}
        </h3>
      </div>
    </v-app-bar>

    <v-main>
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
        "green",
        "red"
      ],
      currentColor: ""
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
  methods: {
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
    this.generateRandomColor();
    // if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    //   this.$vuetify.theme.dark = true;
    // }
    // this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
  },
  watch: {
    // "window.matchMedia"()
    // {
    //   if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    //     this.$vuetify.theme.dark = true;
    //   }
    //   else
    //   {
    //     this.$vuetify.theme.dark = false;
    //   }
    // }
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
