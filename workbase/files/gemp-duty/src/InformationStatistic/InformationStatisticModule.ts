import { SimpleModule } from 'prism-web'

class InformationStatisticModule extends SimpleModule {

  constructor() {
    super()
  }
  configureRouter() {
    this.addRouter('/InformationStatistic', process.env.baseurl + 'InformationStatistic/template/baseView.html', resolve => require(['./controller/baseViewControll'], resolve), true, 'weekplan')
    this.addRouter('/InformationStatistic/list', process.env.baseurl + 'InformationStatistic/template/InformationStatisticList.html', resolve => require(['./controller/InformationStatisticListControll'], resolve), false, 'weekplan-list')
    // this.addRouter('/weekPlan/templatemanager', process.env.baseurl + 'weekPlan/template/weekplanTemplate.html', resolve => require(['./controller/weekplanTemplateController'], resolve), false, 'template-manager')
  }
  configureView() {
  }
}
module.exports = new InformationStatisticModule()