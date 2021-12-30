import { SimpleModule } from 'prism-web'

// 引入数据序列化DTO
const GempInfoDTO = require('../../service/interfaces/GempInfoDTO')
const GempInfoDisposeDTO = require('../../service/interfaces/GempInfoDisposeDTO')
const GempInfoEventLevelDTO = require('../../service/interfaces/GempInfoEventLevelDTO')
const GempInfoEventTypeDTO = require('../../service/interfaces/GempInfoEventTypeDTO')
const GempInfoProgressDTO = require('../../service/interfaces/GempInfoProgressDTO')
const GempInfoReceiptDTO = require('../../service/interfaces/GempInfoReceiptDTO')
const GempInfoTransactDTO = require('../../service/interfaces/GempInfoTransactDTO')
const GempInfoUserDTO = require('../../service/interfaces/GempInfoUserDTO')
const Result = require('../../service/interfaces/Result') // 返回数据DTO(公共)
const PageResult = require('../../service/interfaces/PageResult') // 返回列表数据DTO(公共)
const TreeNode = require('../../service/interfaces/TreeNode') // 返回列表数据DTO(公共)


import { DocumentProcessedComController } from './controller/documentProcessedCom/documentProcessedComController'//公文办理word公共组件
import { PreservationController } from './controller/preservation'//保存弹出框
import { examineController } from './controller/examineInfor' //内审公共组件
import { TextPreservationController } from './controller/textpreservation' //文本文件保存弹出框
import { modiftyIssueController } from './controller/modiftyIssue' //文本文件保存弹出框
import { deleteBriefController } from './controller/deleteBrief' //文本文件保存弹出框





class BriefReportModule extends SimpleModule {
  constructor() {
    super()

  }

  configureRouter() {
    this.addRouter('/briefReport', process.env.baseurl + 'briefReport/template/baseView.html', resolve => require(['./controller/baseViewController'], resolve), true, 'document-processed') // 根页面模块
    this.addRouter('/briefReport/specialReport', process.env.baseurl + 'briefReport/template/specialReport/specialReportList.html', resolve => require(['./controller/specialReport/specialReportListController'], resolve), false, 'special-report') // 公文办理页面
    this.addRouter('/briefReport/wallBulletin', process.env.baseurl + 'briefReport/template/wallBulletin/wallBulletinList.html', resolve => require(['./controller/wallBulletin/wallBulletinListController'], resolve), false, 'wall-bulletin') // 公文办理页面
    this.addRouter('/briefReport/informationReport', process.env.baseurl + 'briefReport/template/informationReport/informationReportList.html', resolve => require(['./controller/informationReport/informationReportListController'], resolve), false, 'information-reportlist') // 公文办理报告页面
    this.addRouter('/briefReport/reportAdd','reportAdd', process.env.baseurl + 'briefReport/template/informationReport/reportAdd.html', resolve => require(['./controller/informationReport/reportAddController'], resolve), false, 'report-add') // 公文办理报告新增页面
    this.addRouter('/briefReport/textFileAdd','textFileAdd', process.env.baseurl + 'briefReport/template/textFile/textFileAdd.html', resolve => require(['./controller/textFile/textFileAddController'], resolve), false, 'textfile-add') // 公文办理报告新增页面
    this.addRouter('/briefReport/textFile', 'textFileList',  process.env.baseurl + 'briefReport/template/textFile/textFileList.html', resolve => require(['./controller/textFile/textFileListController'], resolve), false, 'text-file') // 公文办理页面
    this.addRouter('/briefReport/specialReportAdd','specialReportAdd', process.env.baseurl + 'briefReport/template/specialReport/specialReportAdd.html', resolve => require(['./controller/specialReport/specialReportAddController'], resolve), false, 'specialreport-add') // 专报新增
    this.addRouter('/briefReport/wallBulletinAdd','wallBulletinAdd', process.env.baseurl + 'briefReport/template/wallBulletin/wallBulletinAdd.html', resolve => require(['./controller/wallBulletin/wallBulletinAddController'], resolve), false, 'wallbulletin-file') // 快报新增
    this.addRouter('/briefReport/specialReportDetail', process.env.baseurl + 'briefReport/template/specialReport/specialReportDetail.html', resolve => require(['./controller/specialReport/specialReportDetailController'], resolve), false, 'specialreport-detail') // 专报编辑
    this.addRouter('/briefReport/wallBulletinDetail', process.env.baseurl + 'briefReport/template/wallBulletin/wallBulletinDetail.html', resolve => require(['./controller/wallBulletin/wallBulletinDetailController'], resolve), false, 'wallbulletin-detail') // 快报新增
    this.addRouter('/briefReport/textFileEdit', process.env.baseurl + 'briefReport/template/textFile/textFileEdit.html', resolve => require(['./controller/textFile/textFileEditController'], resolve), false, 'textfile-edit') // 文本编辑页面
    this.addRouter('/briefReport/textFileDetail', process.env.baseurl + 'briefReport/template/textFile/textFileDetail.html', resolve => require(['./controller/textFile/textFileDetailController'], resolve), false, 'textfile-detail') // 文本详情页面
    this.addRouter('/briefReport/reportDetail', process.env.baseurl + 'briefReport/template/informationReport/reportDetail.html', resolve => require(['./controller/informationReport/reportDetailController'], resolve), false, 'report-detail') // 报告详情页面
    this.addRouter('/briefReport/reportEdit', process.env.baseurl + 'briefReport/template/informationReport/reportEdit.html', resolve => require(['./controller/informationReport/reportEditController'], resolve), false, 'report-edit') // 报告编辑页面
    this.addRouter('/briefReport/specialReportEdit', process.env.baseurl + 'briefReport/template/specialReport/specialReportEdit.html', resolve => require(['./controller/specialReport/specialReportEditController'], resolve), false, 'specialreport-edit') // 专报编辑
    this.addRouter('/briefReport/wallBulletinEdit', process.env.baseurl + 'briefReport/template/wallBulletin/wallBulletinEdit.html', resolve => require(['./controller/wallBulletin/wallBulletinEditController'], resolve), false, 'wallbulletin-edit') // 快报新增
  }

  configureView() {
    this.addView(process.env.baseurl + 'briefReport/template/documentProcessedCom/documentProcessedCom.html', DocumentProcessedComController, 'document-processedcom') //公文办理word公共组件
    this.addView(process.env.baseurl + 'briefReport/template/preservation.html', PreservationController, 'preservation') //保存弹出框
    this.addView(process.env.baseurl + 'briefReport/template/examineInfor.html', examineController, 'examine-brief') //内审弹出框
    this.addView(process.env.baseurl + 'briefReport/template/textpreservation.html', TextPreservationController, 'text-preservation') //文本文件保存弹出框
    this.addView(process.env.baseurl + 'briefReport/template/modiftyIssue.html', modiftyIssueController, 'modiftyIssue-brief') //修改期号弹出框
    this.addView(process.env.baseurl + 'briefReport/template/deleteBrief.html', deleteBriefController, 'deleteBrief-brief') //修改期号弹出框

  }
}

module.exports = new BriefReportModule()