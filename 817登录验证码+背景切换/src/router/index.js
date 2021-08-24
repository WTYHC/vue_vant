import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from '../common/config/router.js';
Vue.use(VueRouter)


const originalPush = VueRouter.prototype.push;
// const originalReplace = VueRouter.prototype.replace;
//push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};

// export default router
//引用/comoon/config/router.js方法
export default new VueRouter({ routes})