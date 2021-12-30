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
    this.addView(process.env.baseurl + 'component/template/tag.html', resolve => require(['./controller/tagController'], resolve), 'iams-tag') // 自定义tag标签
    this.addView(process.env.baseurl + 'component/template/fileCell.html', resolve => require(['./controller/fileCell'], resolve), 'file-cell') // 附件展示列表
    this.addView(process.env.baseurl + 'component/template/themePicker.html', resolve => require(['./controller/themePicker'], resolve), 'theme-picker') // 主题切换组件
    this.addView(process.env.baseurl + 'component/template/iamsSelectList.html',resolve => require(['./controller/iamsSelectListController'], resolve), 'iams-selectlist')
    this.addView(process.env.baseurl + 'component/template/filesImport.html', resolve => require(['./controller/filesImportController'], resolve), 'files-import') //excel导入
    this.addView(process.env.baseurl + 'component/template/searchTree.html', resolve => require(['./controller/searchTreeController'], resolve), 'search-tree') //值班树形结构搜索
    this.addView(process.env.baseurl + 'component/template/phonePanel.html', resolve => require(['./controller/phonePanelController'], resolve), 'phone-panel') // 拨号面板
    this.addView(process.env.baseurl + 'component/template/iamsUpload.html', resolve => require(['./controller/iamsUpload'], resolve), 'iams-upload') // 附件上传组件
    this.addView(process.env.baseurl + 'component/template/iamsEditor.html', resolve => require(['./controller/iamsEditor'], resolve), 'iams-editor') // 文本编辑器
    this.addView(process.env.baseurl + 'component/template/wavFaxPanel.html', resolve => require(['./controller/wavFaxPanelController'], resolve), 'wav-fax-panel') // 录音文件列表
    this.addView(process.env.baseurl + 'component/template/egisMap.html', resolve => require(['./controller/egisMapController'], resolve), 'egis-map') // egis地图
  }
}

module.exports = new ComponentModule()