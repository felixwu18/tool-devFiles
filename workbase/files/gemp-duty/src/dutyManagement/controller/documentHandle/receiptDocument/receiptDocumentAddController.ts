import { ControllerBase, Inject, Prop } from 'prism-web'

export class ReceiptDocumentAddController extends ControllerBase {
  private temp = {
    style: require('../../../style/documentHandle/receiptDocument/receiptDocumentAdd.less')

  }
  constructor() {
    super()
  }


  //向弹出框传递参数
  private propsData: Object = {}

  private checkPage:string = '1'


  private titleData = ''
  //处理过程参数
  private handlelist = []


  private activeNamex = 'first' //tab栏选中

  private processid = ''
  //向弹出框配置参数
  private dialogConfig: Object = {
    viewDialog: false, //弹框是否显示
    templateName: '', //弹框组件名
    tilteName: '' //标题头
  }

  //请求参数
  private listParams = {
    gempBriefInstructDTOs: [
      {
        instructContent: '', //	批示内容
        instructTitle: '' //批示标题
      }
    ],
    id: '', //公文Id
    infoId: '', //事件id
    reportContent: '', //内容
    reportTitle: '' //标题
  }


  created() {
    this.getListData()

    this.titleData = this.$route.query.title.toString()
    // if(this.$route.query.tab){
    //     this.checkPage=this.$route.query.tab.toString()
    //     console.log(this.checkPage)
    // }
  }

  // 获取列表数据
  getListData() { }

  /* author by chengyun 关闭弹框
   *  Modify by
   */
  closeDialogCall() {
    //关闭弹框
    this.dialogConfig['viewDialog'] = false
  }

  handleClick(val) {

  }
  /* author by chengyun 保存草稿
  *  Modify by
  */
  addReportInfo() {

  }


  private addReport(el: string, name: string) {
    this.dialogConfig['viewDialog'] = true
    let data = {
      viewDialog: true,
      templateName: el,
      tilteName: name
    }
    this.$set(this, 'dialogConfig', data)
  }


  private addLower(el: string, name: string) {
    this.dialogConfig['viewDialog'] = true
    let data = {
      viewDialog: true,
      templateName: el,
      tilteName: name
    }
    this.$set(this, 'dialogConfig', data)
  }
  private shareReport(el: string, name: string) {
    this.dialogConfig['viewDialog'] = true
    let data = {
      viewDialog: true,
      templateName: el,
      tilteName: name
    }
    this.$set(this, 'dialogConfig', data)
  }
}
