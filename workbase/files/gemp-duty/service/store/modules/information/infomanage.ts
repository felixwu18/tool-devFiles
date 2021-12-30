export default {
    namespaced: true,
    state: {
        infomanage_search: {}, // 信息呈报搜索条件
        detailoffice_search: {},// 相关公文搜索条件
        transfer_search: {}, // 转办督办搜索条件
        reportment_search: {}, // 已报信息搜索条件
        sharePage_search: {}, // 已共享信息搜索条件
    },
    getters: {
        getInfomanage: (state: any) => state.infomanage_search,
        getDetailoffice: (state: any) => state.detailoffice_search,
        getTransfer: (state: any) => state.transfer_search,
        getReportment: (state: any) => state.reportment_search,
        getSharePageParams: (state: any) => state.sharePage_search,
    },
    mutations: {
        // 改变信息呈报搜索条件
        setInfomanage: (state: any, payload: object) => {
            state.infomanage_search = Object.assign({}, state.infomanage_search, { ...payload })
        },
        // 改变相关公文搜索条件
        setDetailoffice: (state: any, payload: object) => {
            state.detailoffice_search = Object.assign({}, state.detailoffice_search, { ...payload })
        },
        // 改变转办督办搜索条件
        setTransfer: (state: any, payload: object) => {
            state.transfer_search = Object.assign({}, state.transfer_search, { ...payload })
        },
        // 改变已报信息搜索条件
        setReportment: (state: any, payload: Object) => {
            state.reportment_search = Object.assign({}, state.reportment_search, { ...payload })
        },
        // 改变已共享信息搜索条件
        setSharePageParams: (state: any, payload: object) => {
            state.sharePage_search = Object.assign({}, state.sharePage_search, { ...payload })
        },
    },
    actions: {
        // 改变信息呈报搜索条件
        setInfomanage: ({ commit }, state) => commit('setInfomanage', state),
        // 改变相关公文搜索条件
        setDetailoffice: ({ commit }, state) => commit('setDetailoffice', state),
        // 改变转办督办搜索条件
        setTransfer: ({ commit }, state) => commit('setTransfer', state),
        // 改变已报信息搜索条件
        setReportment: ({ commit }, state) => commit('setReportment', state),
        // 改变已共享信息搜索条件
        setSharePageParams: ({ commit }, state) => commit('setSharePageParams', state),
    }
}