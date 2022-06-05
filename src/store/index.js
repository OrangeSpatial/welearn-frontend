import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    userId: ''
  },
  mutations: {
    getCurrentUser(state, user){
      // console.log(state, user)
      state.user = user
      state.userId = user.userId
    }
  },
  actions: {
  },
  getters:{},
  modules: {
  }
})
