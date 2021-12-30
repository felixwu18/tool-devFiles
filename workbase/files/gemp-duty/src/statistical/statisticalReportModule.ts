import { SimpleModule } from 'prism-web'
import { PreviewControler } from './controller/viewPreviewControler'; //续报页面


class StatisticalReportModule extends SimpleModule {

  constructor() {
    super()
  }
  configureRouter() {
    this.addRouter('/statistical', process.env.baseurl + 'statistical/template/baseView.html', resolve => require(['./controller/baseViewController'], resolve), true, 'weekplan')
    this.addRouter('/statistical/statisticalReport', process.env.baseurl + 'statistical/template/statisticalReport.html', resolve => require(['./controller/statisticalReportControler'], resolve), false, 'weekplan-list')
    this.addRouter('/statistical/businessStatistic', process.env.baseurl + 'statistical/template/businessStatistic.html', resolve => require(['./controller/businessStatisticControler'], resolve), false, 'business-statistic')
    this.addRouter('/statistical/statisticalSummaryList', process.env.baseurl + 'statistical/template/statisticalSummaryList.html', resolve => require(['./controller/statisticalSummaryListControler'], resolve), false, 'summary-list')

  }
  configureView() {
    this.addView(
      process.env.baseurl + 'statistical/template/viewPreview.html',
      PreviewControler,
      'viewpreview',
    ); //预览页面
    this.addView(
      process.env.baseurl + 'statistical/template/statisticalWord.html',
      resolve => require(['./controller/statisticalWordController'], resolve),'statisticalWord')
  }
}
module.exports = new StatisticalReportModule()