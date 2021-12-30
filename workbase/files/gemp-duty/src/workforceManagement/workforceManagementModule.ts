import { SimpleModule } from 'prism-web'

class WorkforceMangementModule extends SimpleModule {

  constructor() {
    super()
  }

  configureRouter() {
    this.addRouter('/workforceManagement', process.env.baseurl + 'workforceManagement/template/baseView.html', resolve => require(['./controller/baseViewController'], resolve), true, 'workforce-management')
    this.addRouter('/workforceManagement/festivalList', process.env.baseurl + 'workforceManagement/template/leadershift/festival/festivalList.html', resolve => require(['./controller/leadershift/festival/festivalListController'], resolve), false, 'leader-list')//节假日带班表
    this.addRouter('/workforceManagement/festival', process.env.baseurl + 'workforceManagement/template/leadershift/festival/festival.html', resolve => require(['./controller/leadershift/festival/festivalController'], resolve), false, 'leader-festival')//节假日带班表详情
    this.addRouter('/workforceManagement/festivalEdit', process.env.baseurl + 'workforceManagement/template/leadershift/festival/festivalEdit.html', resolve => require(['./controller/leadershift/festival/festivalEditController'], resolve), false, 'leader-festivaledit')//节假日带班表编辑

    this.addRouter('/workforceManagement/majorList', process.env.baseurl + 'workforceManagement/template/leadershift/major/majorList.html', resolve => require(['./controller/leadershift/major/majorListController'], resolve), false, 'leader-majorlist')//重要时段带班表
    this.addRouter('/workforceManagement/major', process.env.baseurl + 'workforceManagement/template/leadershift/major/major.html', resolve => require(['./controller/leadershift/major/majorController'], resolve), false, 'leader-major')//重要时段带班表详情
    this.addRouter('/workforceManagement/majorEdit', process.env.baseurl + 'workforceManagement/template/leadershift/major/majorEdit.html', resolve => require(['./controller/leadershift/major/majorEditController'], resolve), false, 'leader-majoredit')//重要时段带班表编辑
    

    // 政务值班
    this.addRouter('/workforceManagement/govermentBaseview', process.env.baseurl + 'workforceManagement/template/govermentduty/govermentBaseview.html', resolve => require(['./controller/govermentduty/govermentBaseviewController'], resolve), false, 'goverment-baseview')
  //   // 政务值班week
  //   this.addRouter('/workforceManagement/govermenttable', process.env.baseurl + 'workforceManagement/template/govermentduty/govermentdutyTable.html', resolve => require(['./controller/govermentduty/govermentdutyTableController'], resolve), false, 'goverment-duty-table')

  //  // 政务值班day
  //   this.addRouter('/workforceManagement/govermentduty', process.env.baseurl + 'workforceManagement/template/govermentduty/govermentdutyList.html', resolve => require(['./controller/govermentduty/govermentdutyListController'], resolve), false, 'goverment-duty-list')
     


    // 值班设置
    this.addRouter('/workforceManagement/setonduty', process.env.baseurl + 'workforceManagement/template/setonduty/setondutyList.html', resolve => require(['./controller/setonduty/setondutyListController'], resolve), false, 'set-on-only')

    this.addRouter('/workforceManagement/group', process.env.baseurl + 'workforceManagement/template/setonduty/group.html', resolve => require(['./controller/setonduty/groupController'], resolve), false, 'set-group')//分组人员设置

    this.addRouter('/workforceManagement/restTime', process.env.baseurl + 'workforceManagement/template/setonduty/restTime.html', resolve => require(['./controller/setonduty/restTimeController'], resolve), false, 'set-resttime')//节假日

    this.addRouter('/workforceManagement/majorTime', process.env.baseurl + 'workforceManagement/template/setonduty/majorTime.html', resolve => require(['./controller/setonduty/majorTimeContrller'], resolve), false, 'set-majortime')//重要时段
    //换班替班
    this.addRouter('/workforceManagement/substitute', process.env.baseurl + 'workforceManagement/template/substitute/changeduty/substituteList.html', resolve => require(['./controller/substitute/changeduty/substituteListController'], resolve), false, 'substitute')//换班
    this.addRouter('/workforceManagement/substituteAdd', process.env.baseurl + 'workforceManagement/template/substitute/changeduty/substituteAdd.html', resolve => require(['./controller/substitute/changeduty/substituteAddController'], resolve), false, 'substitute-add')//换班新增
    this.addRouter('/workforceManagement/substituteEdit', process.env.baseurl + 'workforceManagement/template/substitute/changeduty/substituteEdit.html', resolve => require(['./controller/substitute/changeduty/substituteEditController'], resolve), false, 'substitute-edit')//换班编辑
    this.addRouter('/workforceManagement/replacement', process.env.baseurl + 'workforceManagement/template/substitute/replacement/replacement.html', resolve => require(['./controller/substitute/replacement/replacementController'], resolve), false, 'replacement')//替班
    this.addRouter('/workforceManagement/replacementAdd', process.env.baseurl + 'workforceManagement/template/substitute/replacement/replacementAdd.html', resolve => require(['./controller/substitute/replacement/replacementAddController'], resolve), false, 'replacement-add')//替班新增
    this.addRouter('/workforceManagement/replacementEdit', process.env.baseurl + 'workforceManagement/template/substitute/replacement/replacementEdit.html', resolve => require(['./controller/substitute/replacement/replacementEditController'], resolve), false, 'replacement-edit')//替班编辑
  }

  configureView() {
    this.addView(process.env.baseurl + 'workforceManagement/template/govermentduty/govermentDetails.html', resolve => require(['./controller/govermentduty/govermentDetailsController'], resolve), 'goverment-detail') //替换班详情展示公共组件
    
    this.addView(process.env.baseurl + 'workforceManagement/template/govermentduty/govermentdutyList.html', resolve => require(['./controller/govermentduty/govermentdutyListController'], resolve), 'goverment-dutylist') //

    this.addView(process.env.baseurl + 'workforceManagement/template/govermentduty/govermentdutyTable.html', resolve => require(['./controller/govermentduty/govermentdutyTableController'], resolve), 'goverment-dutytable')
  }

}

module.exports = new WorkforceMangementModule()