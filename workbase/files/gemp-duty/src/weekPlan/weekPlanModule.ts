import { SimpleModule } from 'prism-web'

class WeekPlanModule extends SimpleModule {

  constructor() {
    super()
  }
  configureRouter() {
    this.addRouter('/weekPlan', process.env.baseurl + 'weekPlan/template/baseView.html', resolve => require(['./controller/baseViewControll'], resolve), true, 'weekplan')
    this.addRouter('/weekPlan/list', process.env.baseurl + 'weekPlan/template/weekplanList.html', resolve => require(['./controller/weekplanListControll'], resolve), false, 'weekplan-list')
    this.addRouter('/weekPlan/templatemanager', process.env.baseurl + 'weekPlan/template/weekplanTemplate.html', resolve => require(['./controller/weekplanTemplateController'], resolve), false, 'template-manager')
  }
  configureView() {
    // this.addView(process.env.baseurl + 'weekPlan/template/govermentduty/govermentDetails.html', resolve => require(['./controller/govermentduty/govermentDetailsController'], resolve), 'goverment-detail') //替换班详情展示公共组件
  }
}
module.exports = new WeekPlanModule()