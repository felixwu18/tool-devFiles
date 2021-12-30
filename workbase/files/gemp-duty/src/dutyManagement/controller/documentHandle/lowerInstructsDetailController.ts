import { ControllerBase, Inject, Prop } from 'prism-web'
import { getRequestUrl } from '../../../../assets/libs/commonUtils'

export class LowerHairInstructionsIssueController extends ControllerBase {
  private temp = {
    style: require('../../style/documentHandle/lowerInstructsDetail.less')
  }
  constructor() {
    super()
  }

  @Inject('http') http: any
  //向弹出框传递参数
  private propsData: Object = {}
  private checkPage: string = '1'
  private titleData = ''
  private  detailUrlinfoId :any

  //处理过程参数
  private handlelist = []
  private activeNamex = 'first' //tab栏选中
  private tab: string
  private processid = ''
  //向弹出框配置参数
  private dialogConfig: Object = {
    viewDialog: false, //弹框是否显示
    templateName: '', //弹框组件名
    tilteName: '' //标题头
  }

  //请求参数
  private listparams = {
    documentTitle: "",//批示标题
    reviewLeaderName: "",//批示领导
    receiveUnitName: "",//职务
    updateTime: "",//批示日期
    reviewEvent: "",//批示事件
    content: "",//批示内容
    remarks: "",//备注
    attachmentList: []//批示附件
  }
  created() {
    if (this.$route.query.id) {
      this.getListData();
      // this.updateMessageRemindData();
    } else {
      var url = window.location.href;
      let urlCode = getRequestUrl(url)
      if (urlCode && urlCode['detailUrlId']) {
        this.detailUrlinfoId = urlCode['detailUrlId'];
        let publi = { publicId: this.detailUrlinfoId }
        this.http.DocumentHandleRequest.getdutyInformationDetail(publi).then(res => {
          if(res.status == 200) {
            this.handlelist = [res.data]
            this.$set(this,'listparams',res.data)
            if(this.listparams['reviewEventName']==""){
              this.listparams['reviewEventName']==""
            }
            // this.updateMessageRemindData();
          }
        })
      }
    }
}

  // 获取列表数据
  getListData() {
    if (this.$route.query.id) {
      // debugger
      let id = this.$route.query.id
      this.http.DocumentHandleRequest.getdutyInformationDetail({publicId:id}).then(res => {
        if(res.status == 200) {
          this.handlelist = [res.data]
          this.$set(this,'listparams',res.data)
          if(this.listparams['reviewEventName']==""){
            this.listparams['reviewEventName']==""
          }
        }
      })
    }
  }

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

  // 返回按钮 by xinglu
  goback() {
    if (this.$route.query.tab) {
      this.tab = this.$route.query.tab.toString()
      this.$router.push(`/dutyManagement/documentHandle?tab=${this.tab}`)
    } else {
      this.$router.push(`/dutyManagement/documentHandle?tab=1`)
      // this.$router.go(-1)
    }
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
  //分享
  private shareInformatiom(el: string, name: string) {
    this.dialogConfig['viewDialog'] = true
    let data = {
      viewDialog: true,
      templateName: el,
      tilteName: name
    }
    this.$set(this, 'dialogConfig', data)
  }

  // // 更新消息提醒的滚动条，弹框，铃铛
  // updateMessageRemindData() {
  //   let data = {
  //     type:"updateMessageRemind",
  //   }
  //   setTimeout(() => {
  //     parent.postMessage(data,"*")
  //   }, 2000);
  // }
}
