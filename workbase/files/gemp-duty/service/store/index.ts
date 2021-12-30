import Vuex from 'vuex'
import actions from './actions'
import state from './state'
import mutations from './mutations'
import infomanage from './modules/information/infomanage'
import brief from './modules/brief/brief'
import reportsafety from './modules/reportSafety/reportsafety'
import dutymanage from './modules/dutyManage/dutymanage'

export default class Store {
  constructor(target) {
    target.addPlugin(Vuex)
  }

  init() {
    return  new Vuex.Store({
      state,
      actions,
      mutations,
      modules: {
        infomanage,
        brief,
        reportsafety,
        dutymanage
      }
    })
  }
} 