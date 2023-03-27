import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const defaultState = {
  mongoServer: {
    ip: "192.168.236.118",
    port: "3000"
  },
  gameID: "",
  currentUser: ""
}

export default new Vuex.Store({
  state: defaultState,
  getters: {
    getMongoServer: (state) => state.mongoServer,
    getGameID: (state) => state.gameID,
    getCurrentUser: (state) => state.currentUser,
  },
  mutations: {
    setGameID(state, gameID)
    {
      state.gameID = gameID
    },
    setCurrentUser(state, user)
    {
      state.currentUser = user
    }
  },
  actions: {
    setGameIDAction({commit}, gameID){
      commit("setGameID", gameID)
    },
    setCurrentUserAction({commit}, user){
      commit("setCurrentUser", user)
    }
  },
  modules: {
  }
})
