export default {
    namespaced: true,
    state: {
        safety_search: {}
    },
    getters: {
        getSearch: (state: any) => state.safety_search
    },
    mutations: {
        setSearch: (state: any, payload: any) => {
            state.safety_search = Object.assign({}, state.safety_search, { ...payload })
        }
    },
    actions: {
        setSearch: ({ commit }, state) => commit('setSearch', state)
    }
}