import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueParticles from 'vue-particles'
import routePremission from './premission.js'
import VueCookie from 'vue-cookie'

import store from './store'

import axios from 'axios';

Vue.prototype.$http=axios;

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VueParticles);
Vue.use(VueCookie) // 挂载全局


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
