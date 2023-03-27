import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const defaultState = {
  mongoServer: {
    ip: "192.168.236.118",
    port: "3000"
  },
  gameID: "",
  joinCode: "",
  currentUser: ""
}

export default new Vuex.Store({
  state: defaultState,
  getters: {
    getMongoServer: (state) => state.mongoServer,
    getGameID: (state) => state.gameID,
    getJoinCode: (state) => state.joinCode,
    getCurrentUser: (state) => state.currentUser,
  },
  mutations: {
    setGameID(state, gameID)
    {
      state.gameID = gameID
    },
    setJoinCode(state, joinCode)
    {
      state.joinCode = joinCode
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
    setJoinCodeAction({commit}, joinCode){
      commit("setJoinCode", joinCode)
    },
    setCurrentUserAction({commit}, user){
      commit("setCurrentUser", user)
    }
  },
  modules: {
  }
})
