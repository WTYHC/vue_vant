import Vue from 'vue'
import Vuex from 'vuex'
import { getMeauList } from "../common/api/meau.js";
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    meauList:[],

  },
  mutations: {
 getMeau(state,meau){
      // console.log(meau);
      // // state.meauList = meau
      state.meauList = meau;
      console.log( state.meauList);

    }
  },
  actions: {
    // getData(context){
    //   getMeauList().then(res=>{
    //     console.log(res.data);
    //     context.commit('getMeau',res.data) 
    //   })
    // }
  
  },
  modules: {
  },
  getters:{
    
  }
})
