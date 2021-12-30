import { ControllerBase, Inject, Prop } from 'prism-web'
import { timeFormat } from '../../../../assets/libs/commonUtils'
import { getRequestUrl } from '../../../../assets/libs/commonUtils'

export class OutgoingReportDetailController extends ControllerBase {
  private temp = {
    style: require('../../style/documentHandle/outgoingReportDetail.less')
  }
  constructor() {
    super()
  }

  @Inject('http') http: any
  //向弹出框传递参数
  private propsData: Object = {}

  private checkPage: string = '1'
  private messageDom: any = null // message实体
  private titleData = ''
   //判断是否有数据
   private editId: String
  //处理过程参数
  private handlelist = []

  private tab :string
  private activeNamex = 'first' //tab栏选中
  private  detailUrlinfoId :any

  private processid = ''
  //向弹出框配置参数
  private dialogConfig: Object = {
    viewDialog: false, //弹框是否显示
    templateName: '', //弹框组件名
    tilteName: '' //标题头
  }

  //请求参数
  private listparams = {
    "documentProgressStatus": "4",//公文状态 未处理-1|已接收-2|已退回-3|草稿-4
    "documentTitle": "",//公文标题
    "hostLeaderId": "1111",//主持领导id
    "hostLeaderName": "",//主持领导名称
    "endTime":"",//外出结束时间
    "hostLeaderPosition": "",//主持单位职务
    "hostLeaderUnitCode": "",//主持领导单位code
    "hostLeaderUnitName": "",//主持领导单位名称
    "outContactPeople": "",//外出联系人
    "outContactPhone": "",//外出联系电话
    "outLeaderId": "",//外出领导id
    "outLeaderName": "",//外出领导名称
    "outLeaderPosition": "",//外出领导职务
    "outLeaderUnitCode": "",//外出领导单位Code
    "outLeaderUnitName": "",//外出领导单位名称
    "outReason": "",//外出事由
    "outType": "",//外出类型
    "receiveName": "",//接收人名称
    "receiveUnitCode": "",//接受发送单位code
    "receiveUnitName": "",//公文接收单位名称
    "recevierId": "",//接收人id
    "remarks": "",//备注
    "startTime": "",//外出开始时间
    "upDowmType": "1",//公文操作状态 公文操作类型 公文上报-1|公文下发-2
    "type": "2",
    "attachmentList":[]//附件列表
  }
  //规则
  private rules = {
    documentTitle: [{ required: false, message: '请输入标题', trigger: 'change' }],
    outLeaderName: [{ required: false, message: '请输入外出领导', trigger: 'blur' }],
    // unit: [{ required: true, message: '请输入单位', trigger: 'blur' }],
    outLeaderPosition: [{ required: false, message: '请输入职务', trigger: 'blur' }],
    outReason: [{ required: false, message: '请输入外出事由', trigger: 'blur' }],
    outType: [{ required: false, message: '请输入外出类型', trigger: 'blur' }],
    outContactPeople: [{ required: false, message: '请输入外出联系人', trigger: 'blur' }],
    startTime: [{ required: false, message: '请选择外出开始时间', trigger: 'change' }],
    endTime: [{ required: false, message: '请选择外出结束时间', trigger: 'change' }],
    hostLeaderName: [{ required: false, message: '请输入主持工作领导', trigger: 'blur' }],
    hostLeaderUnitName: [{ required: false, message: '请输入领导单位', trigger: 'blur' }],
    hostLeaderPosition: [{ required: false, message: '请输入职务', trigger: 'blur' }],
    remarks: [{ required: false, message: '请输入备注', trigger: 'blur' }]
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
        let publi = { publicId: this.detailUrlinfoId }
          this.http.DocumentHandleRequest.getdutyInformationDetail(publi).then(res => {
            if (res.status == 200) {
              this.listparams = res.data
              this.handlelist = [res.data]
              this.listparams['startTime'] = timeFormat( this.listparams['startTime'])
              this.listparams.endTime = timeFormat( this.listparams.endTime)
              if (this.listparams['outType'] == '1') {
                this.listparams['outType'] = "国外";
              } else if (this.listparams['outType'] == '2') {
                this.listparams['outType'] = "省内";
              } else if (this.listparams['outType'] == '3') {
                this.listparams['outType'] = "省外";
              }
              // this.updateMessageRemindData();
            }
          });
          }
    }
  }
  // 获取列表数据
  getListData() { 
    if (this.editId) {
      let publi = {publicId:this.$route.query.id}
      this.http.DocumentHandleRequest.getdutyInformationDetail(publi).then(res => {
        if (res.status == 200) {
          this.listparams = res.data
          this.handlelist = [res.data]
          this.listparams['startTime'] = timeFormat( this.listparams['startTime'])
          this.listparams.endTime = timeFormat( this.listparams.endTime)
          if (this.listparams['outType'] == '1') {
            this.listparams['outType'] = "国外";
          } else if (this.listparams['outType'] == '2') {
            this.listparams['outType'] = "省内";
          } else if (this.listparams['outType'] == '3') {
            this.listparams['outType'] = "省外";
          }
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
    this.$refs.listparams['validate'](valid => {
      if (!valid) {
        if (this.messageDom) { this.messageDom.close() }
        this.messageDom = this.$message({
          type: 'warning',
          message: '请按提示正确填写信息'
        })
        return false
      }
    })
  }
  //返回 by xinglu
  goback(){
    if(this.$route.query.tab){
      this.tab = this.$route.query.tab.toString()
      this.$router.push(`/dutyManagement/documentHandle?tab=${this.tab}`)
    } else {
      this.$router.push(`/dutyManagement/documentHandle?tab=1`)
    }
  }
  getLeaderInfo(el: string, name: string) {
    this.dialogConfig['viewDialog'] = true
    let data = {
      viewDialog: true,
      templateName: el,
      tilteName: name
    }
    this.$set(this, 'dialogConfig', data)
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
  //  // 更新消息提醒的滚动条，弹框，铃铛
  // updateMessageRemindData() {
  //   let data = {
  //     type:"updateMessageRemind",
  //   }
  //   setTimeout(() => {
  //      parent.postMessage(data,"*")
  //     }, 2000);
  // }
}
