import { SimpleModule } from 'prism-web'
import { AddressBookDetailController } from './controller/addressBook/addressBookDetailController';

//注册组件的ts引入

import { RecordPlayDialogController } from './controller/telephoneMessage/recordPlayDialogController'
import { InboxListController } from './controller/shortLetter/inboxListController'
import { OutboxListController } from './controller/shortLetter/outboxListController'
import { AddressBookSendMessage } from './controller/addressBook/addressBookSendMessage';

import { FaxedListController } from './controller/faxManage/faxedListController'
import { FaxedReceivedListController } from './controller/faxManage/faxedReceivedListController';
class AddressBookManageModule extends SimpleModule {

    constructor(){
        super()
    }

    configureRouter() {
        this.addRouter('/addressBookManage', process.env.baseurl+'addressBookManage/template/baseView.html', resolve => require(['./controller/baseViewController'], resolve), true,'address-book-manage')
        this.addRouter('/addressBookManage/addressBook', process.env.baseurl+'addressBookManage/template/addressBook/addressBookList.html',resolve => require(['./controller/addressBook/addressBookListController'], resolve), false,'address-book') //通讯录列表页面
		this.addRouter('/addressBookManage/telephoneMessage', process.env.baseurl+'addressBookManage/template/telephoneMessage/telephoneMessageList.html',resolve => require(['./controller/telephoneMessage/telephoneMessageListController'], resolve), false,'telephone-message') //电话记录列表页面
        this.addRouter('/addressBookManage/shortLetter', process.env.baseurl+'addressBookManage/template/shortLetter/shortLetterList.html',resolve => require(['./controller/shortLetter/shortLetterListController'], resolve), false,'short-letter') //短信收发列表页面
        this.addRouter('/addressBookManage/outboxAdd', process.env.baseurl+'addressBookManage/template/shortLetter/outboxAdd.html',resolve => require(['./controller/shortLetter/outboxAddController'], resolve), false,'outbox-add') //发短信新增页面
        this.addRouter('/addressBookManage/outboxDetail', process.env.baseurl+'addressBookManage/template/shortLetter/outboxDetail.html',resolve => require(['./controller/shortLetter/outboxDetailController'], resolve), false,'outbox-detail') //发短信查看页面
        this.addRouter('/addressBookManage/inboxDetail', process.env.baseurl+'addressBookManage/template/shortLetter/inboxDetail.html',resolve => require(['./controller/shortLetter/inboxDetailController'], resolve), false,'inbox-detail') //收短信查看页面
        this.addRouter('/addressBookManage/faxManage', process.env.baseurl+'addressBookManage/template/faxManage/faxManageList.html',resolve => require(['./controller/faxManage/faxManageListController'], resolve), false,'fax-manage') //传真管理页面
        this.addRouter('/addressBookManage/controlFaxAdd', process.env.baseurl+'addressBookManage/template/faxManage/controlFaxAdd.html',resolve => require(['./controller/faxManage/controlFaxAddController'], resolve), false,'control-fax') //传真已收新增页面
        this.addRouter('/addressBookManage/deliverFaxAdd', process.env.baseurl+'addressBookManage/template/faxManage/deliverFaxAdd.html',resolve => require(['./controller/faxManage/deliverFaxAddController'], resolve), false,'deliver-fax') //传真已发新增页面
        this.addRouter('/addressBookManage/controlFaxDetail', process.env.baseurl+'addressBookManage/template/faxManage/controlFaxDetail.html',resolve => require(['./controller/faxManage/controlFaxDetailController'], resolve), false,'control-fax-detail') //传真已收新增页面
        this.addRouter('/addressBookManage/deliverFaxDetail', process.env.baseurl+'addressBookManage/template/faxManage/deliverFaxDetail.html',resolve => require(['./controller/faxManage/deliverFaxDetailController'], resolve), false,'deliver-fax-detail') //传真已发新增页面
        this.addRouter('/addressBookManage/forwardFaxDetail', process.env.baseurl+'addressBookManage/template/faxManage/forwardFaxDetail.html',resolve => require(['./controller/faxManage/forwardFaxAddController'], resolve), false,'deliver-fax-detail') //传真转发新增页面
        this.addRouter('/addressBookManage/commonCommunication', process.env.baseurl+'addressBookManage/template/commonCommunication/commonCommunicationList.html',resolve => require(['./controller/commonCommunication/commonCommunicationListController'], resolve), false,'common-communication') //常用通讯列表页面
    }


    configureView(){
        this.addView( process.env.baseurl+'addressBookManage/template/addressBook/addressBookDetail.html', AddressBookDetailController, 'duty-addressbook-detail') //弹出框 
        this.addView(process.env.baseurl + 'addressBookManage/template/addressBook/addressBookSendMessage.html',AddressBookSendMessage,'duty-addressbook-send');
        this.addView( process.env.baseurl+'addressBookManage/template/telephoneMessage/recordPlayDialog.html', RecordPlayDialogController, 'record-play-dialog') // 播放弹出框
        this.addView( process.env.baseurl+'addressBookManage/template/shortLetter/inboxList.html', InboxListController, 'inbox-list') // 收件箱
        this.addView( process.env.baseurl+'addressBookManage/template/shortLetter/outboxList.html', OutboxListController, 'outbox-list') // 发件箱
        this.addView( process.env.baseurl+'addressBookManage/template/faxManage/faxedList.html', FaxedListController, 'faxed-list') // 已发传真
        this.addView( process.env.baseurl+'addressBookManage/template/faxManage/faxedReceivedList.html', FaxedReceivedListController, 'faxed-received-list') // 已收传真
    }

}

module.exports = new AddressBookManageModule()