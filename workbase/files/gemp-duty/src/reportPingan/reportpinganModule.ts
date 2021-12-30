import { SimpleModule } from 'prism-web'

class reportpinganModule extends SimpleModule {

  constructor() {
    super()
  }
  configureRouter() {
    this.addRouter('/reportPingan', process.env.baseurl + 'reportPingan/template/baseView.html', resolve => require(['./controller/baseViewController'], resolve), true, 'reportpingan')
    this.addRouter('/reportPingan/reportPinganList', process.env.baseurl + 'reportPingan/template/reportPinganList.html', resolve => require(['./controller/reportPinganListControler'], resolve), false, 'reportpingan-list')
    this.addRouter('/reportPingan/detailsManage',process.env.baseurl +'reportPingan/template/detailsManage.html',resolve =>require(['./controller/detailsManageController',], resolve),false,'reportpingan-manage',)
    this.addRouter('/reportPingan/addReportPa',process.env.baseurl +'reportPingan/template/addReportPa.html',resolve =>require(['./controller/addReportPaController',], resolve),false,'add-reportpa',)
  }
  configureView() {
  }
}
module.exports = new reportpinganModule()