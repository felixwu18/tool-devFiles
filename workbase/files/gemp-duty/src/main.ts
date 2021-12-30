import { App, Router } from 'prism-web'
import Vue from 'vue'
// import ExTableColumn from 'ex-table-column'
let app = new App()

const ElementUI = require('element-ui')
require('../assets/themes/default.css')
require('../assets/common/common.css')
require('../assets/common/el_button.css')
require('../assets/common/init.css')
require('../assets/common/titleinit.css')
import '../assets/libs/fixible'
import '../assets/libs/getToken'
import '../service/config/develop'
require('../assets/fonts/emoticon/iconfont')
// 加转自定义指令
import '../assets/libs/directives'
import http from '../service/main' // http请求工具类
import { timeFormat, downloadFuncs } from '../assets/libs/commonUtils'
import Store from '../service/store/index' // store状态管理
import searchData from '../assets/libs/searchData' // session缓存服务

const Result = require('../service/interfaces/Result') // 返回数据DTO(公共)
const ResultMap = require('../service/interfaces/ResultMap') // 返回数据DTO(公共)
const PageResult = require('../service/interfaces/PageResult') // 返回列表数据DTO(公共)
const TreeNode = require('../service/interfaces/TreeNode') // 返回列表数据DTO(公共)

const BaseModule = require('./base/baseModule')
const InformationModule = require('./Information/InformationModule') //信息上报
const BriefReportModule = require('./briefReport/briefReportModule') //信息简报
const StatisticalReportModule = require('./statistical/statisticalReportModule') //统计报表
const ReportpinganReportModule = require('./reportPingan/reportpinganModule') //上报平安
const ComponentModule = require('./component/componentModule')
const AccidentModule = require('./accident/accidentModule')
const DutyManagement = require('./dutyManagement/dutyManagementModule')
const WorkforceMangement = require('./workforceManagement/workforceManagementModule')
const AddressBookManageModule = require('./addressBookManage/addressBookManageModule')
const WeekPlanModule = require('./weekPlan/weekPlanModule')
const InformationStatisticModule = require('./InformationStatistic/InformationStatisticModule')
const CurrentSpecialModule = require('./currentSpecial/currentSpecialModule')
const SpecialCampaignModule = require('./specialCampaign/specialCampaignModule')
const ConferenceRoomModule = require('./conferenceroom/conferenceroomModule')

app.addPlugin(ElementUI)
// Vue.component(ExTableColumn.name,ExTableColumn)
const modules = [BaseModule, InformationModule, BriefReportModule, ComponentModule, AccidentModule, DutyManagement, WorkforceMangement, AddressBookManageModule, WeekPlanModule,InformationStatisticModule,StatisticalReportModule,ReportpinganReportModule,CurrentSpecialModule, SpecialCampaignModule,ConferenceRoomModule]

modules.forEach((item) => {
  app.addModule(item)
})

app.registerGlobal('http', http)
app.registerGlobal('timeFormat', timeFormat)
app.registerGlobal('downloadFunc', downloadFuncs)
app.registerGlobal('sourceurl', process.env.sourceurl)
app.registerGlobal('store', new Store(app).init()) // 全局状态管理


window['shadeVisible'] = null

// 全局路由守卫
let router = new Router()
router.get().beforeEach((to, form, next) => {
  let token = sessionStorage.getItem('token')
  if (token && to.path !== '/login') {
    window['shadeVisible'] = null
    next()
  } else if (to.path == '/login') {
    if (!!to.query.error) {
      if (!window['shadeVisible']) {
        window['shadeVisible'] = ElementUI.Message({ type: 'error', message: '您已登录超时,请重新登录' })
      }
    }
    searchData.clear()
    next()
  } else {
    next('/login')
  }
})

app.start('#app', process.env.baseurl + 'base/app.html')

