import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import SecureLS from "secure-ls";
var ls = new SecureLS({ isCompression: false });

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  plugins: [
    createPersistedState({
      storage: {
        getItem: key => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: key => ls.remove(key)
      }
    })
  ],
  state: {
    employees: null,
  },
  mutations: {
    setEmployees(state, employees) {
      state.employees = employees
    }
  },
  actions: {
    setEmployees({ commit }, employees) {
      commit('setEmployees', employees)
    }
  }
})