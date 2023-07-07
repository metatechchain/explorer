import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import {apolloProvider, testApolloClient} from "@/plugins/apollo/apollo-provider.js";
// eslint-disable-next-line no-debugger
import "./assets/scss/main.scss";
// import apolloProvider from './apollo';
import './filters.js'
import './plugins/vue-timeago.js'
import './plugins/dayjs.js';
import { DeFi } from './plugins/defi/defi';

Vue.use(DeFi, {
//   // apolloClient,
apolloClient: testApolloClient,
//   // apolloProvider
//   // metatechApolloClient
});
import VueApexCharts from "vue-apexcharts";
Vue.use(VueApexCharts);

import { FFetch } from "./plugins/ffetch";
Vue.use( FFetch)

Vue.component("apex-chart", VueApexCharts);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  apolloProvider,
  render: (h) => h(App),
}).$mount("#app");
