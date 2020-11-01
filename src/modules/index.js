import Vue from "vue";
import Vuex from "vuex";
import config from "./config.js";
import report from "./report";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    config,
    report
  }
});
