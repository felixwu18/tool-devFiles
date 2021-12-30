import { ControllerBase, Inject, Prop } from 'prism-web'
import { getRequestUrl } from '../../../../assets/libs/commonUtils'

export class DutyInformationDetailController extends ControllerBase {
  private temp = {
    style: require('../../style/documentHandle/leaveReportDetail.less')
  }
  constructor() {
    super()
  }

  @Inject('http') http: any
  //向弹出框传递参数
  private propsData: Object = {}
  private detailUrlinfoId: any

  private titleData = '请假报备详情'
  private tab: string
  //处理过程参数
  private handlelist = []
  //判断是否有数据
  private editId: String
  private activeNamex = 'first' //tab栏选中

  private processid = ''
  //向弹出框配置参数
  private dialogConfig: Object = {
    viewDialog: false, //弹框是否显示
    templateName: '', //弹框组件名
    tilteName: '' //标题头
  }

  //请求参数
  private listparams = {
    "attachmentList": [],//附件列表
    "contactPhone": "",//联系电话
    "documentProgressStatus": "4",//公文状态 未处理-1|已接收-2|已退回-3|草稿-4
    "documentTitle": "",//公文标题
    "eventDescription": "",//请假描述
    "eventReason": "",//请假理由
    "leavePeople": "",//请假人
    "receiveName": "",//接收人名称
    "receiveUnitCode": "",//接受发送单位code
    "receiveUnitName": "",//公文接收单位名称
    "recevierId": "",//接收人id
    "remarks": "",//备注
    "upDowmType": "1",//公文操作状态 公文操作类型 公文上报-1|公文下发-2
    "type": "3",
    "startTime": "",
    "endTime": ""
  }
  private rules = {
    documentTitle: [{ required: false, message: '请输入信息标题', trigger: 'change' }],
    leavePeople: [{ required: false, message: '请输入请假人', trigger: 'change' }],
    // outpeople: [{ required: true, message: '请输入职务', trigger: 'change' }],
    contactPhone: [{ required: false, message: '请输入正确的手机号码', trigger: 'change' }],
    // changedate: [{ required: true, message: '请输入请假开始时间', trigger: 'change' }],
    // givedate: [{ required: true, message: '请输入请假结束时间', trigger: 'change' }],
    eventDescription: [{ required: false, message: '请输入情况描述', trigger: 'change' }],
    eventReason: [{ required: false, message: '请输入请假理由', trigger: 'change' }],
  }
  created() {
    if (this.$route.query.id) {
      this.editId = this.$route.query.id.toString()
      this.getListData()
      // this.updateMessageRemindData();
    } else {
      var url = window.location.href;
      let urlCode = getRequestUrl(url)
      if (urlCode && urlCode['detailUrlId']) {
        this.detailUrlinfoId = urlCode['detailUrlId'];
        // this.activeId = this.detailUrlinfoId
        // console.log(this.detailUrlinfoId, 33338888)

        let publi = { publicId: this.detailUrlinfoId }
        this.http.DocumentHandleRequest.getdutyInformationDetail(publi).then(res => {
          if (res.status == 200) {
            this.listparams = res.data
            this.listparams["startTime"] = this.listparams["startTime"].replace(/\-/g, "/")
            this.listparams["endTime"] = this.listparams["endTime"].replace(/\-/g, "/")
            this.handlelist = [res.data]
            // this.updateMessageRemindData();
            // this.listparams['data'].startTime = timeFormat( this.listparams['data'].startTime)
            // this.listparams['data'].endTime = timeFormat( this.listparams['data'].endTime)
          }
        });
      }
    }
    // this.titleData = this.$route.query.title.toString()
  }

  // 获取列表数据
  getListData() {
    if (this.editId) {
      let publi = { publicId: this.$route.query.id }
      this.http.DocumentHandleRequest.getdutyInformationDetail(publi).then(res => {
        if (res.status == 200) {
          this.listparams = res.data
          this.listparams["startTime"] = this.listparams["startTime"].replace(/\-/g, "/")
          this.listparams["endTime"] = this.listparams["endTime"].replace(/\-/g, "/")
          this.handlelist = [res.data]
          // this.listparams['data'].startTime = timeFormat( this.listparams['data'].startTime)
          // this.listparams['data'].endTime = timeFormat( this.listparams['data'].endTime)
        }
      });
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
  //  // 更新消息提醒的滚动条，弹框，铃铛
  // updateMessageRemindData() {
  //    let data = {
  //      type:"updateMessageRemind",
  //    }
  // setTimeout(() => {
  //    parent.postMessage(data,"*")
  //   }, 2000);
  // }
}
