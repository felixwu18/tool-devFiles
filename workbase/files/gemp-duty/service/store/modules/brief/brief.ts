export default {
    namespaced: true,
    state: {
        special_search: {}, // 专报搜索条件
        wallbulletin_search: {}, // 快报搜索条件
        report_searach: {}, // 报告搜索条件
        textfile_search: {} // 文本搜索条件
    },
    getters: {
        getSpecial: (state: any) => state.special_search,
        getWallbulletin: (state: any) => state.wallbulletin_search,
        getReport: (state: any) => state.report_searach,
        getTextfile: (state: any) => state.textfile_search
    },
    mutations: {
        setSpecial: (state: any, payload: object) => {
            state.special_search = Object.assign({}, state.special_search, { ...payload })
        },
        setWallbulletin: (state: any, payload: object) => {
            state.wallbulletin_search = Object.assign({}, state.wallbulletin_search, { ...payload })
        },
        setReport: (state: any, payload: object) => {
            state.report_searach = Object.assign({}, state.report_searach, { ...payload })
        },
        setTextfile: (state: any, payload: object) => {
            state.textfile_search = Object.assign({}, state.textfile_search, { ...payload })
        },
    },
    actions: {
        setSpecial: ({ commit }, state) => commit('setSpecial', state),
        setWallbulletin: ({ commit }, state) => commit('setWallbulletin', state),
        setReport: ({ commit }, state) => commit('setReport', state),
        setTextfile: ({ commit }, state) => commit('setTextfile', state)
    }
}