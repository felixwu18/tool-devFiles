import { SimpleModule } from 'prism-web';

class conferenceroomModule extends SimpleModule {
  constructor() {
    super();
  }
  configureRouter() {
    this.addRouter(
      '/conferenceroom',
      process.env.baseurl + 'conferenceroom/template/baseView.html',
      resolve => require(['./controllers/baseViewController'], resolve),
      true,
      'conferenceroom'
    );
    this.addRouter(
      '/conferenceroom/conferencereserve',
      process.env.baseurl +
        'conferenceroom/template/conferencereserve/destine.html',
      resolve =>
        require(['./controllers/conferencereserve/destineControler'], resolve),
      false,
      'destine'
    );
    this.addRouter(
      '/conferenceroom/addDestine',
      process.env.baseurl +
        'conferenceroom/template/conferencereserve/addDestine.html',
      resolve =>
        require([
          './controllers/conferencereserve/addDestineControler',
        ], resolve),
      false,
      'add-destine'
    );
    this.addRouter(
      '/conferenceroom/editDestine',
      process.env.baseurl +
        'conferenceroom/template/conferencereserve/editDestine.html',
      resolve =>
        require([
          './controllers/conferencereserve/editDestineControler',
        ], resolve),
      false,
      'edit-destine'
    );
    this.addRouter(
      '/conferenceroom/management',
      process.env.baseurl +
        'conferenceroom/template/conferencereserve/management.html',
      resolve =>
        require([
          './controllers/conferencereserve/managementControler',
        ], resolve),
      false,
      'management'
    );
    this.addRouter(
      '/conferenceroom/addManagement',
      process.env.baseurl +
        'conferenceroom/template/conferencereserve/addManagement.html',
      resolve =>
        require([
          './controllers/conferencereserve/addManagementControler',
        ], resolve),
      false,
      'add-management'
    );
    this.addRouter(
      '/conferenceroom/detailManagement',
      process.env.baseurl +
        'conferenceroom/template/conferencereserve/detailManagement.html',
      resolve =>
        require([
          './controllers/conferencereserve/detailManagementControler',
        ], resolve),
      false,
      'detail-management'
    );
    this.addRouter(
      '/conferenceroom/history',
      process.env.baseurl +
        'conferenceroom/template/conferencereserve/history.html',
      resolve =>
        require(['./controllers/conferencereserve/historyControler'], resolve),
      false,
      'history'
    );
    this.addRouter(
      '/conferenceroom/detailHistory',
      process.env.baseurl +
        'conferenceroom/template/conferencereserve/detailHistory.html',
      resolve =>
        require([
          './controllers/conferencereserve/detailHistoryControler',
        ], resolve),
      false,
      'detail-history'
    );
    this.addRouter(
      '/conferenceroom/applyList',
      process.env.baseurl +
        'conferenceroom/template/conferenceapply/gempConferenceApplyList.html',
      resolve =>
        require([
          './controllers/conferenceapply/gempConferenceApplyListController',
        ], resolve),
      false,
      'apply-list'
    );
    this.addRouter(
      '/conferenceroom/applyAdd',
      process.env.baseurl +
        'conferenceroom/template/conferenceapply/gempConferenceApplyAdd.html',
      resolve =>
        require([
          './controllers/conferenceapply/gempConferenceApplyAddController',
        ], resolve),
      false,
      'apply-add'
    );
    this.addRouter(
      '/conferenceroom/applyEdit',
      process.env.baseurl +
        'conferenceroom/template/conferenceapply/gempConferenceApplyEdit.html',
      resolve =>
        require([
          './controllers/conferenceapply/gempConferenceApplyEditController',
        ], resolve),
      false,
      'apply-edit'
    );
    this.addRouter(
      '/conferenceroom/applyDetail',
      process.env.baseurl +
        'conferenceroom/template/conferenceapply/gempConferenceApplyDetail.html',
      resolve =>
        require([
          './controllers/conferenceapply/gempConferenceApplyDetailController',
        ], resolve),
      false,
      'apply-detail'
    );
    this.addRouter(
      '/conferenceroom/detailDestine',
      process.env.baseurl +
        'conferenceroom/template/conferencereserve/detailDestine.html',
      resolve =>
        require([
          './controllers/conferencereserve/detailDestineControler',
        ], resolve),
      false,
      'detail-destine'
    );
    this.addRouter(
      '/conferenceroom/applyReserve',
      process.env.baseurl +
        'conferenceroom/template/conferenceapply/gempConferenceApplyReserve.html',
      resolve =>
        require([
          './controllers/conferenceapply/gempConferenceApplyReserveController',
        ], resolve),
      false,
      'apply-reserve'
    );
  }
  configureView() {}
}
module.exports = new conferenceroomModule();
