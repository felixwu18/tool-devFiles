import { SimpleModule } from 'prism-web'

class ComponentModule extends SimpleModule {
  constructor() {
    super()
  }

  configureRouter() {
    this.addRouter('/ntko', process.env.baseurl + 'component/template/ntkoTool.html', (resolve) => require(['./controller/ntkoTool'], resolve), true, 'ntko-page')
    this.addRouter('/iamsntkotool', process.env.baseurl + 'component/template/iamsNtkoTool.html', (resolve) => require(['./controller/iamsNtkoToolController'], resolve), true, 'iams-ntkotool')
  }

  configureView() {
    this.addView(process.env.baseurl + 'component/template/navBar.html', resolve => require(['./controller/navBarController'], resolve), 'nav-bar')
    this.addView(process.env.baseurl + 'component/template/listTable.html',resolve => require(['./controller/listTableController'], resolve), 'list-table')
    this.addView(process.env.baseurl + 'component/template/iamsCombobox.html', resolve => require(['./controller/iamsComboboxController'], resolve), 'iams-combobox')
    this.addView(process.env.baseurl + 'component/template/searchTable.html', resolve => require(['./controller/searchTableController'], resolve), 'search-table')
    this.addView(process.env.baseurl + 'component/template/viewDialog.html', resolve => require(['./controller/viewDialogController'], resolve), 'view-dialog')
    this.addView(process.env.baseurl + 'component/template/iamsForm.html',resolve => require(['./controller/iamsFormController'], resolve), 'iams-form')
    this.addView(process.env.baseurl + 'component/template/tab.html', resolve => require(['./controller/tabController'], resolve), 'tab')
    this.addView(process.env.baseurl + 'component/template/gisMap.html', resolve => require(['./controller/gisMapController'], resolve), 'gis-map')
    this.addView(process.env.baseurl + 'component/template/ntkoTool.html', resolve => require(['./controller/ntkoTool'], resolve), 'ntko-tool')
    // this.addView(process.env.baseurl+'component/template/iamsNtkoTool.html',IamsNtkoToolController,'iams-ntkotool')
    this.addView(process.env.baseurl + 'component/template/iamsReplyBox.html', resolve => require(['./controller/iamsReplyBox'], resolve), 'iams-replybox')
    this.addView(process.env.baseurl + 'component/template/icon.html', resolve => require(['./controller/icon'], resolve), 'icon-cell')
    this.addView(process.env.baseurl + 'component/template/pdfPage.html',resolve => require(['./controller/pdfPage'], resolve), 'pdf-page')
    this.addView(process.env.baseurl + 'component/template/tag.html', resolve => require(['./controller/tagController'], resolve), 'iams-tag') // ?????????tag??????
    this.addView(process.env.baseurl + 'component/template/fileCell.html', resolve => require(['./controller/fileCell'], resolve), 'file-cell') // ??????????????????
    this.addView(process.env.baseurl + 'component/template/themePicker.html', resolve => require(['./controller/themePicker'], resolve), 'theme-picker') // ??????????????????
    this.addView(process.env.baseurl + 'component/template/iamsSelectList.html',resolve => require(['./controller/iamsSelectListController'], resolve), 'iams-selectlist')
    this.addView(process.env.baseurl + 'component/template/filesImport.html', resolve => require(['./controller/filesImportController'], resolve), 'files-import') //excel??????
    this.addView(process.env.baseurl + 'component/template/searchTree.html', resolve => require(['./controller/searchTreeController'], resolve), 'search-tree') //????????????????????????
    this.addView(process.env.baseurl + 'component/template/phonePanel.html', resolve => require(['./controller/phonePanelController'], resolve), 'phone-panel') // ????????????
    this.addView(process.env.baseurl + 'component/template/iamsUpload.html', resolve => require(['./controller/iamsUpload'], resolve), 'iams-upload') // ??????????????????
    this.addView(process.env.baseurl + 'component/template/iamsEditor.html', resolve => require(['./controller/iamsEditor'], resolve), 'iams-editor') // ???????????????
    this.addView(process.env.baseurl + 'component/template/wavFaxPanel.html', resolve => require(['./controller/wavFaxPanelController'], resolve), 'wav-fax-panel') // ??????????????????
    this.addView(process.env.baseurl + 'component/template/egisMap.html', resolve => require(['./controller/egisMapController'], resolve), 'egis-map') // egis??????
  }
}

module.exports = new ComponentModule()