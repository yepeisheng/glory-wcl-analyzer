import Vue from "vue";
import Vuetify from "vuetify";
import App from "./App.vue";
import Vuex from "vuex";
import store from "./modules";
import "vuetify/dist/vuetify.min.css";
import colors from "vuetify/lib/util/colors";

Vue.config.productionTip = false;
Vue.use(Vuetify);
Vue.use(Vuex);

new Vue({
  store,
  vuetify: new Vuetify({
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.yellow.darken3,
          accent: colors.red.darken3
        }
      }
    }
  }),
  render: h => h(App)
}).$mount("#app");
