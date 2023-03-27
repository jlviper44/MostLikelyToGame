import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: { customProperties: true },
    themes: {
        light: {
            // primary: '#003366',
            // secondary: '#1564BF',
            // accent: '#cce5ff',
            // border: "#ffffff",
            purple: "#9B5DE5",
            pink: "#F15BB5",
            yellow: "#FEE440",
            blue: "#00BBF9",
            green: "#00E3C5"
        }
    }
}
});
