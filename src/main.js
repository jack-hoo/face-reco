import Vue from 'vue';
import App from './App.vue';
import Router from 'vue-router'
import routers from './router/index'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'

Vue.use(Router)
Vue.use(MuseUI)

const RouterConfig = {
  mode: 'hash',
  routes: routers
};
const router = new Router(RouterConfig)
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
