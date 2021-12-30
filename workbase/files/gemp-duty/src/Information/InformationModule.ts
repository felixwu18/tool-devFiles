import { SimpleModule } from 'prism-web';

// 引入数据序列化DTO
const GempInfoDTO = require('../../service/interfaces/GempInfoDTO');
const GempInfoDisposeDTO = require('../../service/interfaces/GempInfoDisposeDTO');
const GempInfoEventLevelDTO = require('../../service/interfaces/GempInfoEventLevelDTO');
const GempInfoEventTypeDTO = require('../../service/interfaces/GempInfoEventTypeDTO');
const GempInfoProgressDTO = require('../../service/interfaces/GempInfoProgressDTO');
const GempInfoReceiptDTO = require('../../service/interfaces/GempInfoReceiptDTO');
const GempInfoTransactDTO = require('../../service/interfaces/GempInfoTransactDTO');
const GempInfoUserDTO = require('../../service/interfaces/GempInfoUserDTO');
const Result = require('../../service/interfaces/Result'); // 返回数据DTO(公共)
const PageResult = require('../../service/interfaces/PageResult'); // 返回列表数据DTO(公共)
const TreeNode = require('../../service/interfaces/TreeNode'); // 返回列表数据DTO(公共)

import { imitateManageController } from './controller/infoManage/imitateManageController';
import { examineInforController } from './controller/infoManage/examineInforController';
import { leadDialogController } from './controller/infoManage/leadDialogController';

import { TransferInfoController } from './controller/transfer/transferChildren/transferInfo';
import { ProcessPageController } from './controller/transfer/transferChildren/processPage';

import { TransferDeleteDialogController } from './controller/transfer/transferDeleteDialogController';

import { transferDialogController } from './controller/transfer/transferDialogController';
import { detailsMatterController } from './controller/infoManage/detailsMatterController';
import { detailsNavRightController } from './controller/infoManage/detailsNavRightController';
import { detailsProcessController } from './controller/infoManage/detailsProcessController';
import { detailsRelevanceController } from './controller/infoManage/detailsRelevanceController';
import { addRelevanceListController } from './controller/infoManage/addRelevanceListController';
import { detailsPlanController } from './controller/infoManage/detailsPlanController';
import { detailsLawController } from './controller/infoManage/detailsLawController';
import { detailsKnowledgeController } from './controller/infoManage/detailsKnowledgeController';
import { detailsOfficialController } from './controller/infoManage/detailsOfficialController';
import { ContinueReportController } from './controller/infoManage/continueReportControler'; //续报页面
import { ReturnReportController } from './controller/infoManage/returnReportControler'; //退回页面
import { DetailsLeadershipListController } from './controller/infoManage/detailsLeadershipListController'; //信息详情中领导批示
import { SupplementDialogController } from './controller/infoManage/supplementDialogController'; //信息详情中呈报上报
import { DetailsSupplementDialogController } from './controller/infoManage/detailsSupplementDialogController';
import { repeatController } from './controller/infoManage/repeatController'; //信息重报页面
import { MsgAppendSendDialogController } from './controller/transfer/msgAppendSendDialogController'; //追加发送弹出框
import { InfoTemplate } from './controller/infoManage/infoTemplate'; // 智能填充模板
import { MsgTransferApplyDialogController } from './controller/transfer/msgTransferApplyDialogController'; //转办督办弹出框
import { PreviewControler } from './controller/infoManage/previewControler'; //续报页面
import { CleanUpControler } from './controller/infoManage/cleanUpController'; //抄清页面
import { InformationHandlingController } from './controller/infoManage/informationHandlingController'; //信息处理
import { InformationHandlingTreeController } from './controller/infoManage/informationHandlingTreeController'; //信息处理
import { InformationHandlingSearchTreeController } from './controller/infoManage/InformationHandlingSearchTreeController'; //信息处理

class InformationModule extends SimpleModule {
  constructor() {
    super();
  }

  configureRouter() {
    this.addRouter('/', '/information/infoManage');
    this.addRouter(
      '/information',
      process.env.baseurl + 'Information/template/baseView.html',
      resolve => require(['./controller/baseViewController'], resolve),
      true,
      'information',
    );
    this.addRouter(
      '/information/infoManage',
      process.env.baseurl +
      'Information/template/infoManage/infoManageList.html',
      resolve =>
        require(['./controller/infoManage/infoManageListController'], resolve),
      false,
      'info-manage',
    ); // 信息管理列表页面
    this.addRouter(
      '/information/sharedPage',
      process.env.baseurl +
      'Information/template/infoManage/sharedPage.html',
      resolve =>
        require([
          './controller/infoManage/sharedPageController',
        ], resolve),
      false,
      'shared-page',
    );
    // 信息管理列表页面
    this.addRouter(
      '/information/detailsManage',
      process.env.baseurl +
      'Information/template/infoManage/detailsManageList.html',
      resolve =>
        require([
          './controller/infoManage/detailsManageListController',
        ], resolve),
      false,
      'details-manage',
    );

    //信息详情页面
    this.addRouter(
      '/information/detailsEdit',
      process.env.baseurl + 'Information/template/infoManage/detailsEdit.html',
      resolve =>
        require(['./controller/infoManage/detailsEditController'], resolve),
      false,
      'details-edit',
    ); //编辑详情页面
    this.addRouter(
      '/information/transfer',
      process.env.baseurl + 'Information/template/transfer/transferList.html',
      resolve =>
        require(['./controller/transfer/transferListController'], resolve),
      false,
      'transfer',
    ); // 转办督办列表页面
    this.addRouter(
      '/information/transferAdd',
      process.env.baseurl + 'Information/template/transfer/transferAdd.html',
      resolve =>
        require(['./controller/transfer/transferAddController'], resolve),
      false,
      'transfer-add',
    ); // 转办督办新增页面
    this.addRouter(
      '/information/transferView',
      process.env.baseurl + 'Information/template/transfer/transferView.html',
      resolve =>
        require(['./controller/transfer/transferViewController'], resolve),
      false,
      'transfer-view',
    ); // 转办督办新增页面
    this.addRouter(
      '/information/repeat',
      process.env.baseurl + 'Information/template/infoManage/repeat.html',
      resolve => require(['./controller/infoManage/repeatController'], resolve),
      false,
      'repeat',
    ); //信息重报页面
    this.addRouter(
      '/information/detailsDrafts',
      process.env.baseurl +
      'Information/template/infoManage/detailsDrafts.html',
      resolve =>
        require(['./controller/infoManage/detailsDraftsController'], resolve),
      false,
      'details-drafts',
    ); //信息保存为草稿页面
    this.addRouter(
      '/information/submitReport',
      process.env.baseurl + 'Information/template/infoManage/submitReport.html',
      resolve =>
        require(['./controller/infoManage/submitReportController'], resolve),
      false,
      'submit-report',
    ); // 呈报上报页面
    this.addRouter(
      '/information/reportInformation',
      process.env.baseurl + 'Information/template/reportInformation/reportInformationList.html',
      resolve =>
        require(['./controller/reportInformation/reportInformationListController'], resolve),
      false,
      'report-info',
    ); // 已上报页面
    this.addRouter(
      '/information/oneclickReport',
      process.env.baseurl + 'Information/template/clickReport/oneClickReport.html',
      resolve =>
        require(['./controller/clickReport/oneClickReportController'], resolve),
      false,
      'one-click-report',
    ); // 一键上报列表页面
    this.addRouter(
      '/information/addclickReport',
      process.env.baseurl + 'Information/template/clickReport/addClickReport.html',
      resolve =>
        require(['./controller/clickReport/addClickReportController'], resolve),
      false,
      'add-click-report',
    ); // 一键上报新增页面
    this.addRouter(
      '/information/editclickReport',
      process.env.baseurl + 'Information/template/clickReport/editClickReport.html',
      resolve =>
        require(['./controller/clickReport/editClickReportController'], resolve),
      false,
      'edit-click-report',
    ); // 一键上报查看页面
    this.addRouter(
      '/information/detailsClickReport',
      process.env.baseurl + 'Information/template/clickReport/detailsClickReport.html',
      resolve =>
        require(['./controller/clickReport/detailsClickReportController'], resolve),
      false,
      'details-click-report',
    ); // 一键上报查看页面
  }

  configureView() {
    this.addView(
      process.env.baseurl +
      'Information/template/infoManage/informationHandling.html',
      InformationHandlingController,
      'information-handling',
    ); //信息处理弹框
    this.addView(
      process.env.baseurl +
      'Information/template/infoManage/informationHandlingTree.html',
      InformationHandlingTreeController,
      'information-handling-tree',
    ); //信息处理tree
    this.addView(
      process.env.baseurl +
      'Information/template/infoManage/informationHandlingSearchTree.html',
      InformationHandlingSearchTreeController,
      'information-handling-search-tree',
    ); //信息处理tree
    this.addView(
      process.env.baseurl +
        'Information/template/infoManage/detailsMatter.html',
      detailsMatterController,
      'details-content',
    ); //信息详情页面左侧信息详情内容模块
    this.addView(
      process.env.baseurl +
        'Information/template/infoManage/detailsNavRight.html',
      detailsNavRightController,
      'details-nav',
    ); //信息详情页面右侧法律法规模块
    this.addView(
      process.env.baseurl +
        'Information/template/infoManage/detailsProcess.html',
      detailsProcessController,
      'details-process',
    ); //信息详情页面右侧处理过程模块
    this.addView(
      process.env.baseurl +
        'Information/template/infoManage/detailsRelevance.html',
      detailsRelevanceController,
      'details-relevance',
    ); //信息详情页面右侧信息关联模块
    this.addView(
      process.env.baseurl + 'Information/template/infoManage/detailsPlan.html',
      detailsPlanController,
      'details-plan',
    ); //信息详情页面右侧应急预案模块
    this.addView(
      process.env.baseurl + 'Information/template/infoManage/detailsLaw.html',
      detailsLawController,
      'details-law',
    ); //信息详情页面右侧法律法规模块
    this.addView(
      process.env.baseurl +
        'Information/template/infoManage/detailsKnowledge.html',
      detailsKnowledgeController,
      'details-knowledge',
    ); //信息详情页面右侧相关知识模块
    this.addView(
      process.env.baseurl +
        'Information/template/infoManage/detailsOfficial.html',
      detailsOfficialController,
      'details-official',
    ); //信息详情页面右侧相关公文模块
    this.addView(
      process.env.baseurl +
        'Information/template/infoManage/examineInfoList.html',
      examineInforController,
      'examine-list',
    ); //审核意见弹框
    this.addView(
      process.env.baseurl +
        'Information/template/infoManage/imitateManageList.html',
      imitateManageController,
      'imitate-manage',
    ); //拟办弹出框
    this.addView(
      process.env.baseurl + 'Information/template/infoManage/leadDialog.html',
      leadDialogController,
      'lead-dialog',
    ); //领导批示弹出框
    this.addView(
      process.env.baseurl +
        'Information/template/infoManage/supplementDialog.html',
      SupplementDialogController,
      'supplement-dialog',
    ); //详情页补充信息弹出框
    this.addView(
      process.env.baseurl +
        'Information/template/infoManage/addRelevanceList.html',
      addRelevanceListController,
      'add-relevance',
    ); // 添加关联信息列表弹出框
    this.addView(
      process.env.baseurl + 'Information/template/transfer/transferDialog.html',
      transferDialogController,
      'transfer-dialog',
    ); //转办督办弹出框
    this.addView(
      process.env.baseurl +
        'Information/template/transfer/transferChildren/transferInfo.html',
      TransferInfoController,
      'transfer-info',
    ); // 转办信息页面
    this.addView(
      process.env.baseurl +
        'Information/template/transfer/transferChildren/processPage.html',
      ProcessPageController,
      'process-page',
    ); // 处理过程页面
    this.addView(
      process.env.baseurl +
        'Information/template/infoManage/continueReport.html',
      ContinueReportController,
      'continue-report',
    ); //续报
    this.addView(
      process.env.baseurl + 'Information/template/infoManage/returnReport.html',
      ReturnReportController,
      'return-report',
    ); //回退
    this.addView(
      process.env.baseurl +
        'Information/template/infoManage/detailsLeadershipList.html',
      DetailsLeadershipListController,
      'details-leader',
    ); //信息详情中领导批示
    this.addView(
      process.env.baseurl +
        'Information/template/infoManage/detailsSupplementDialog.html',
      DetailsSupplementDialogController,
      'details-supplement',
    ); //信息详情中领导批示
    this.addView(
      process.env.baseurl +
        'Information/template/transfer/transferDeleteDialog.html',
      TransferDeleteDialogController,
      'transfer-delete',
    ); //转办督办信息删除
    this.addView(
      process.env.baseurl + 'Information/template/infoManage/repeat.html',
      repeatController,
      'repeat',
    ); //信息重报
    this.addView(
      process.env.baseurl +
        'Information/template/transfer/msgAppendSendDialog.html',
      MsgAppendSendDialogController,
      'appendsend-dialog',
    ); //追加发送弹出框
    this.addView(
      process.env.baseurl + 'Information/template/infoManage/infoTemplate.html',
      InfoTemplate,
      'info-template',
    ); // 智能填充模板
    this.addView(
      process.env.baseurl +
        'Information/template/transfer/msgTransferApplyDialog.html',
      MsgTransferApplyDialogController,
      'transferapply-dialog',
    ); //转办督办回复弹出框
    this.addView(
      process.env.baseurl + 'Information/template/infoManage/preview.html',
      PreviewControler,
      'preview',
    ); //预览页面
    this.addView(
      process.env.baseurl + 'Information/template/infoManage/cleanUp.html',
      CleanUpControler,
      'clean-up',
    ); //抄清页面
  }
}

module.exports = new InformationModule();
