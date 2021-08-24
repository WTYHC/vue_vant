import Vue from 'vue'
import Router from 'vue-router'
const files = require.context('../components', true, /\.vue$/)

let routes = []
files.keys().forEach(key => {
  let path = key.slice(1, -4).split('/')

  routes.push({
    path: path.join('/'),
    name: path.pop(),
    component: files(key).default
  })
})
Vue.use(Router)
const router = new Router({
  routes
})
router.beforeEach((to, from, next) => {
  next()
})
export default router
