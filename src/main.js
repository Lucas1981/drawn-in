import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue';
import './plugins/bootstrap-vue'
import App from './App.vue';
import router from './router';
import store from './store';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
