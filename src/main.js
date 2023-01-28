import Vue from "vue";

import App from "./App.vue";

import store from "./store";

import { GET_STATE_FROM_STORAGE } from "./store/mutation-types";

Vue.config.productionTip = false;

new Vue({
  store,
  beforeCreate() {
    this.$store.commit(GET_STATE_FROM_STORAGE);
  },
  render: h => h(App)
}).$mount("#app");
