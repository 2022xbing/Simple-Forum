import store from "@/store";

const user = {
    namespaced: true,
    state: {
        username: null
    },
    getters: {
        getUsername(state) {
            return state.username
        }
    },
    mutations: {
        SetUsername(state, username) {
            state.username = username
        }
    },
    action: {
        login ({commit}, username) {
            commit('SetUsername', username)
        }
    }
}

export default user