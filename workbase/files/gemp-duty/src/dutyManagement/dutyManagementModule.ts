import { SimpleModule } from 'prism-web'

//注册组件的ts引入
import { ReceiptDocumentListController } from './controller/documentHandle/receiptDocument/receiptDocumentListController'
// import { ReportDocumentListController } from './controller/documentHandle/reportDocument/reportDocumentListController'
import { LowerHairDocumentListController } from './controller/documentHandle/lowerHairDocument/lowerHairDocumentListController'
import { DraftDocumentListController } from './controller/documentHandle/draftDocument/draftDocumentListController'
import { ChooseDutyController } from './controller/documentHandle/chooseDutyController'

import { DutySituationAddController } from './controller/dutySituation/dutySituationAddController'
import { DutySituationEditController } from './controller/dutySituation/dutySituationEditController'
import { DutySituationDetailController } from './controller/dutySituation/dutySituationDetailController'

import { DocumentProcessController } from './controller/documentProcessController'
import { ViewMaskController } from './controller/viewMaskController'
import { ShareMaskController } from './controller/shareMaskController'

import { DutyInformationAddController } from './controller/documentHandle/dutyInformationAddController'
import { LeaveReportController } from './controller/documentHandle/leaveReportController'
import { OutgoingReportController } from './controller/documentHandle/outgoingReportController'
import { ReceipInstructionsIssueController } from './controller/documentHandle/receipInstructionsIssueController'
import { ReceipIssueController } from './controller/documentHandle/receipIssueController'
import { LowerHairInstructionsIssueController } from './controller/documentHandle/lowerHairInstructionsIssueController'
import { LowerHairIssueController } from './controller/documentHandle/lowerHairIssueController'
import { SelectLeaderController } from './controller/documentHandle/selectleaderController'
import { ReportedController } from './controller/documentHandle/reportedController'
import { LowerHaireReportController } from './controller/documentHandle/lowerHaireReportController'
import { SendBackController } from './controller/documentHandle/sendBackController'
import { OutgoingReportControllere } from './controller/documentHandle/outgoingReportEditController'
class DutyManagementModule extends SimpleModule {

    constructor() {
        super()
    }

    configureRouter() {
        this.addRouter('/dutyManagement', process.env.baseurl + 'dutyManagement/template/baseView.html', resolve => require(['./controller/baseViewController'], resolve), true, 'duty-management')
        this.addRouter('/dutyManagement/dutyRecordSheet', process.env.baseurl + 'dutyManagement/template/dutyRecordSheet/dutyRecordSheetList.html', resolve => require(['./controller/dutyRecordSheet/dutyRecordSheetListController'], resolve), false, 'duty-record-sheet') //值班记录表
        this.addRouter('/dutyManagement/dutyRecordSheetAdd', process.env.baseurl + 'dutyManagement/template/dutyRecordSheet/dutyRecordSheetAdd.html', resolve => require(['./controller/dutyRecordSheet/dutyRecordSheetAddController'], resolve), false, 'duty-record-sheet-add') //新增值班记录表
        this.addRouter('/dutyManagement/dutyRecordSheetEdit', process.env.baseurl + 'dutyManagement/template/dutyRecordSheet/dutyRecordSheetEdit.html', resolve => require(['./controller/dutyRecordSheet/dutyRecordSheetEditController'], resolve), false, 'duty-record-sheet-edit') // 编辑值班记录表
        this.addRouter('/dutyManagement/dutyRecordSheetDetail', process.env.baseurl + 'dutyManagement/template/dutyRecordSheet/dutyRecordSheetDetail.html', resolve => require(['./controller/dutyRecordSheet/dutyRecordSheetDetailController'], resolve), false, 'duty-record-sheet-detail') // 参看值班记录表
        this.addRouter('/dutyManagement/dutySituation', process.env.baseurl + 'dutyManagement/template/dutySituation/dutySituationList.html', resolve => require(['./controller/dutySituation/dutySituationListController'], resolve), false, 'duty-situation') //值班要情
        this.addRouter('/dutyManagement/dutyStatistics', process.env.baseurl + 'dutyManagement/template/dutyStatistics/dutyStatisticsList.html', resolve => require(['./controller/dutyStatistics/dutyStatisticsListController'], resolve), false, 'duty-duty-statistics') //值班统计
        this.addRouter('/dutyManagement/documentHandle', process.env.baseurl + 'dutyManagement/template/documentHandle/documentHandleList.html', resolve => require(['./controller/documentHandle/documentHandleListController'], resolve), false, 'document-handle') //公文办理

        this.addRouter('/dutyManagement/receiptDocumentAdd', process.env.baseurl + 'dutyManagement/template/documentHandle/receiptDocument/receiptDocumentAdd.html', resolve => require(['./controller/documentHandle/receiptDocument/receiptDocumentAddController'], resolve), false, 'receip-document-add') //公文办理接受公文新增
        this.addRouter('/dutyManagement/receiptDocumentEdit', process.env.baseurl + 'dutyManagement/template/documentHandle/receiptDocument/receiptDocumentEdit.html', resolve => require(['./controller/documentHandle/receiptDocument/receiptDocumentEditController'], resolve), false, 'receip-document-edit') //公文办理接受公文编辑
        this.addRouter('/dutyManagement/receiptDocumentDetail', process.env.baseurl + 'dutyManagement/template/documentHandle/receiptDocument/receiptDocumentDetail.html', resolve => require(['./controller/documentHandle/receiptDocument/receiptDocumentDetailController'], resolve), false, 'receip-document-detail') //公文办理接受公文查看

        this.addRouter('/dutyManagement/reportDocumentAdd', process.env.baseurl + 'dutyManagement/template/documentHandle/reportDocument/reportDocumentAdd.html', resolve => require(['./controller/documentHandle/reportDocument/reportDocumentAddController'], resolve), false, 'report-document-add') //上报公文新增页面
        this.addRouter('/dutyManagement/reportDocumentEdit', process.env.baseurl + 'dutyManagement/template/documentHandle/reportDocument/reportDocumentEdit.html', resolve => require(['./controller/documentHandle/reportDocument/reportDocumentEditController'], resolve), false, 'report-document-edit') //上报公文查看页面
        this.addRouter('/dutyManagement/reportDocumentDetail', process.env.baseurl + 'dutyManagement/template/documentHandle/reportDocument/reportDocumentDetail.html', resolve => require(['./controller/documentHandle/reportDocument/reportDocumentDetailController'], resolve), false, 'report-document-detail') //上报公文编辑页面

        this.addRouter('/dutyManagement/lowerHairDocumentAdd', process.env.baseurl + 'dutyManagement/template/documentHandle/lowerHairDocument/lowerHairDocumentAdd.html', resolve => require(['./controller/documentHandle/lowerHairDocument/lowerHairDocumentAddController'], resolve), false, 'lower-document-add') //下发公文新增页面
        this.addRouter('/dutyManagement/lowerHairDocumentEdit', process.env.baseurl + 'dutyManagement/template/documentHandle/lowerHairDocument/lowerHairDocumentEdit.html', resolve => require(['./controller/documentHandle/lowerHairDocument/lowerHairDocumentEditController'], resolve), false, 'lower-document-edit') //下发公文查看页面
        this.addRouter('/dutyManagement/lowerHairDocumentDetail', process.env.baseurl + 'dutyManagement/template/documentHandle/lowerHairDocument/lowerHairDocumentDetail.html', resolve => require(['./controller/documentHandle/lowerHairDocument/lowerHairDocumentDetailController'], resolve), false, 'lower-document-detail') //下发公文编辑页面

        this.addRouter('/dutyManagement/draftDocumentDetail', process.env.baseurl + 'dutyManagement/template/documentHandle/draftDocument/draftDocumentDetail.html', resolve => require(['./controller/documentHandle/draftDocument/draftDocumentDetailController'], resolve), false, 'draft-document-detail') //下发公文编辑页面
        //公文办理列表页
        this.addRouter('/dutyManagement/receiptDocumentList', process.env.baseurl + 'dutyManagement/template/documentHandle/receiptDocument/receiptDocumentList.html', resolve => require(['./controller/documentHandle/receiptDocument/receiptDocumentListController'], resolve), false, 'receipt-document') // 接收公文      
        this.addRouter('/dutyManagement/reportDocumentList', process.env.baseurl + 'dutyManagement/template/documentHandle/reportDocument/reportDocumentList.html', resolve => require(['./controller/documentHandle/reportDocument/reportDocumentListController'], resolve), false, 'report-document') // 上报公文   
        this.addRouter('/dutyManagement/lowerHairDocumentList', process.env.baseurl + 'dutyManagement/template/documentHandle/lowerHairDocument/lowerHairDocumentList.html', resolve => require(['./controller/documentHandle/lowerHairDocument/lowerHairDocumentListController'], resolve), false, 'lower-hair-document') // 下发公文   
        //公文办理详情页面
        this.addRouter('/dutyManagement/dutyInfoDetail', process.env.baseurl + 'dutyManagement/template/documentHandle/dutyInformationDetail.html', resolve => require(['./controller/documentHandle/dutyInfomationDetailController'], resolve), false, 'duty-information-detail') //值班信息详情
        this.addRouter('/dutyManagement/leaveReportDetail', process.env.baseurl + 'dutyManagement/template/documentHandle/leaveReportDetail.html', resolve => require(['./controller/documentHandle/leaveReportDetailController'], resolve), false, 'leave-report-detail') //请假报告详情
        this.addRouter('/dutyManagement/outgoingReportDetail', process.env.baseurl + 'dutyManagement/template/documentHandle/outgoingReportDetail.html', resolve => require(['./controller/documentHandle/outgoingReportDetailController'], resolve), false, 'outgoing-report-detail') //外出报备详情
        this.addRouter('/dutyManagement/lowerInstructsDetail', process.env.baseurl + 'dutyManagement/template/documentHandle/lowerInstructsDetail.html', resolve => require(['./controller/documentHandle/lowerInstructsDetailController'], resolve), false, 'lower-instructs-detail') //批示下发详情
        this.addRouter('/dutyManagement/lowerHairIssueDetail', process.env.baseurl + 'dutyManagement/template/documentHandle/lowerHairIssueDetail.html', resolve => require(['./controller/documentHandle/lowerHairIssueDetailController'], resolve), false, 'lower-hairissue-detail') //下发公文详情
        this.addRouter('/dutyManagement/lowerHairIssueCopy', process.env.baseurl + 'dutyManagement/template/documentHandle/lowerHairIssueCopy.html', resolve => require(['./controller/documentHandle/lowerHairIssueCopyController'], resolve), false, 'lower-hairissue-copy') //同文下发公文
        //公文办理新增编辑页面
        this.addRouter('/dutyManagement/dutyInformation', process.env.baseurl + 'dutyManagement/template/documentHandle/dutyInformation.html', resolve => require(['./controller/documentHandle/dutyInformationController'], resolve), false, 'duty-information') //值班信息
        this.addRouter('/dutyManagement/leaveReport', process.env.baseurl + 'dutyManagement/template/documentHandle/leaveReport.html', resolve => require(['./controller/documentHandle/leaveReportController'], resolve), false, 'leave-report') //请假报告
        this.addRouter('/dutyManagement/leaveReportEdit', process.env.baseurl + 'dutyManagement/template/documentHandle/leaveReportEdit.html', resolve => require(['./controller/documentHandle/leaveReportEditController'], resolve), false, 'leave-report-edit') //请假报告
        this.addRouter('/dutyManagement/outgoingReport', process.env.baseurl + 'dutyManagement/template/documentHandle/outgoingReport.html', resolve => require(['./controller/documentHandle/outgoingReportController'], resolve), false, 'outgoing-report') //外出报备
       
        this.addRouter('/dutyManagement/outgoingReportEdit', process.env.baseurl + 'dutyManagement/template/documentHandle/outgoingReportEdit.html', resolve => require(['./controller/documentHandle/outgoingReportEditController'], resolve), false, 'outgoing-report-edit') //外出报备编辑
       
        this.addRouter('/dutyManagement/otherDocumnet', process.env.baseurl + 'dutyManagement/template/documentHandle/otherDocument.html', resolve => require(['./controller/documentHandle/otherDocumentController'], resolve), false, 'other-document') //其他公文
        this.addRouter('/dutyManagement/otherDocumnetEdit', process.env.baseurl + 'dutyManagement/template/documentHandle/otherDocumentEdit.html', resolve => require(['./controller/documentHandle/otherDocumenteEditController'], resolve), false, 'other-document-edit') //其他公文编辑
        this.addRouter('/dutyManagement/otherDocumnetDetail', process.env.baseurl + 'dutyManagement/template/documentHandle/otherDocumentDetail.html', resolve => require(['./controller/documentHandle/otherDocumenteDetailController'], resolve), false, 'other-document-detail') //其他公文详情
        this.addRouter('/dutyManagement/receipInstructsIssue', process.env.baseurl + 'dutyManagement/template/documentHandle/receipInstructionsIssue.html', resolve => require(['./controller/documentHandle/receipInstructionsIssueController'], resolve), false, 'receip-instructs-issue') //接收的批示下发
        this.addRouter('/dutyManagement/receipIssue', process.env.baseurl + 'dutyManagement/template/documentHandle/receipIssue.html', resolve => require(['./controller/documentHandle/receipIssueController'], resolve), false, 'receip-issue') //接收的下发公文
    }


    configureView() {
        this.addView(process.env.baseurl + 'dutyManagement/template/documentProcess.html', DocumentProcessController, 'document-process') // 处理过程
        this.addView(process.env.baseurl + 'dutyManagement/template/documentHandle/sendBack.html', SendBackController, 'send-back') // 退回弹出框
        this.addView(process.env.baseurl + 'dutyManagement/template/documentHandle/reported.html', ReportedController, 'document-reported') //公文办理上报弹出框
        this.addView(process.env.baseurl + 'dutyManagement/template/viewMask.html', ViewMaskController, 'view-mask') //文本办理新增部分的上报下报弹框
        this.addView(process.env.baseurl + 'dutyManagement/template/shareMask.html', ShareMaskController, 'share-mask') //文本办理新增部分的分享弹框
        this.addView(process.env.baseurl + 'dutyManagement/template/documentHandle/draftDocument/draftDocumentList.html', DraftDocumentListController, 'draft-document') //草稿
        this.addView(process.env.baseurl + 'dutyManagement/template/documentHandle/chooseDuty.html', ChooseDutyController, 'choose-duty') //选择值班要情弹出框
        this.addView(process.env.baseurl + 'dutyManagement/template/documentHandle/selectleader.html', SelectLeaderController, 'select-leader') //选择外出人员弹出框
        this.addView(process.env.baseurl + 'dutyManagement/template/dutySituation/dutySituationAdd.html', DutySituationAddController, 'duty-situation-add') //值班要情弹出框
        this.addView(process.env.baseurl + 'dutyManagement/template/dutySituation/dutySituationEdit.html', DutySituationEditController, 'duty-situation-edit') //值班要情弹出框
        this.addView(process.env.baseurl + 'dutyManagement/template/dutySituation/dutySituationDetail.html', DutySituationDetailController, 'duty-situation-detail') //值班要情弹出框
        this.addView(process.env.baseurl + 'dutyManagement/template/documentHandle/lowerHairInstructionsIssue.html', LowerHairInstructionsIssueController, 'lower-instructs-issue') //下发的批示下发
        this.addView(process.env.baseurl + 'dutyManagement/template/documentHandle/lowerHairIssue.html', LowerHairIssueController, 'lower-issue') //下发的下发公文
        this.addView(process.env.baseurl + 'dutyManagement/template/documentHandle/lowerHaireReport.html', LowerHaireReportController ,'lower-haire-report') // 公办办理下发弹出框
        this.addView(process.env.baseurl + 'dutyManagement/template/documentHandle/dutyInformationAdd.html', DutyInformationAddController, 'duty-add-information') //值班信息添加
    }

}

module.exports = new DutyManagementModule()