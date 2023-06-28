import {createStore} from 'vuex'
import user from './modules/user'
import post from './modules/post'


export default createStore({
  state: {
  },
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    user,
    post
  }
})


