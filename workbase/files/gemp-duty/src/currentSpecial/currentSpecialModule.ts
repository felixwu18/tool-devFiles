import { SimpleModule } from 'prism-web'

class CurrentSpecialModule extends SimpleModule {

  constructor() {
    super()
  }
  configureRouter() {
    this.addRouter('/currentSpecial', process.env.baseurl + 'currentSpecial/template/baseView.html', resolve => require(['./controller/baseViewController'], resolve), true, 'current-special')
    this.addRouter('/currentSpecial/currentSpecialList', process.env.baseurl + 'currentSpecial/template/currentSpecialList.html', resolve => require(['./controller/currentSpecialListController'], resolve), false, 'current-list') // 当前专项保存页面
    this.addRouter('/currentSpecial/specialData', process.env.baseurl + 'currentSpecial/template/currentSpecialData.html', resolve => require(['./controller/currentSpecialDataController'], resolve), false, 'current-data') // 当前专项保存页面
  }
  configureView() {
    this.addView(process.env.baseurl + 'currentSpecial/template/specialWork.html',resolve=>require(['./controller/specialWorkController'],resolve),'special-work')
    this.addView(process.env.baseurl + 'currentSpecial/template/supervisionObject.html',resolve=>require(['./controller/supervisionObjectController'],resolve),'supervision-object')
    this.addView(process.env.baseurl + 'currentSpecial/template/enterpriseProblem.html',resolve=>require(['./controller/enterpriseProblemController'],resolve),'enterprise-problem')
  }
}
module.exports = new CurrentSpecialModule()