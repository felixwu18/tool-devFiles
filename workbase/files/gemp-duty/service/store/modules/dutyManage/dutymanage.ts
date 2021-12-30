export default {
    namespaced: true,
    state: {
        receipt_search: {}, // 接收公文
    },
    getters: {
        getReceipt: (state:any) => state.receipt_search
    },
    mutations: {
        setReceipt: (state,payload) => {
            state.receipt_search = {...state.receipt_search,...payload}
        }
    },
    actions: {
        setReceipt: ({commit}, state) => commit("setReceipt", state)
    }
}