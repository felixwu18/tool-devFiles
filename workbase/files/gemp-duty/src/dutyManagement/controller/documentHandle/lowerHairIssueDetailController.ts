import { ControllerBase, Inject, Prop } from 'prism-web'
import { getRequestUrl } from '../../../../assets/libs/commonUtils'

export class LowerHairIssueDetailController extends ControllerBase {
  private temp = {
    style: require('../../style/documentHandle/lowerHairIssueDetail.less')
  }
  constructor() {
    super()
  }

  @Inject('http') http: any
  //向弹出框传递参数
  private propsData: Object = {}
  private checkPage: string = '1'
  private titleData = ''
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
    documentTitle: "",//标题
    content: "",//内容
    remarks: "",//备注
    contactPeopleName: "",//联系人
    sendingUnitName: "",//职务
    contactPhone: "",//联系电话
    attachmentList: []//批示附件
  }
  private  detailUrlinfoId :any

  created() {
    if (this.$route.query.id) {
      // this.editId = this.$route.query.id.toString();
      this.getListData();
      // this.updateMessageRemindData();
      // console.log(233338888)
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
            // this.updateMessageRemindData();
          }
        })
      }
    }
  }

  /**
   * Modify by chenzheyu
   * 获取列表数据
   */
  getListData() {
    if (this.$route.query.id) {
      let id = this.$route.query.id
      this.http.DocumentHandleRequest.getdutyInformationDetail({publicId:id}).then(res => {
        if(res.status == 200) {
          this.handlelist = [res.data]
          this.$set(this,'listparams',res.data)
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
