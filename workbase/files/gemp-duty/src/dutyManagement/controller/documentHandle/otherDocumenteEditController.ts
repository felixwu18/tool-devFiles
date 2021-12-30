import { ControllerBase, Inject, Prop } from 'prism-web'

export class otherDocumentEditController extends ControllerBase {
  private temp = {
    style: require('../../style/documentHandle/otherDocument.less')
  }
  constructor() {
    super()
  }

  @Inject('http') http: any
  //向弹出框传递参数
  private propsData: Object = {}

  private checkPage: string = '1'

  //是否可编辑
  private editId: string
  //tab信息
  private tab: string
  private titleData = '其他公文'
  //处理过程参数
  private handlelist = []
  private messageDom: any = null // message实体

  private activeNamex = 'first' //tab栏选中

  private processid = ''
  //向弹出框配置参数
  private dialogConfig: Object = {
    viewDialog: false, //弹框是否显示
    templateName: '', //弹框组件名
    tilteName: '',//标题头
    propsData: {}
  }

  //请求参数
  private listparams = {
    "content": "",//工作事项
    "documentProgressStatus": "",//公文状态 未处理-1|已接收-2|已退回-3|草稿-4
    "documentTitle": "",//公文标题
    "dutyPeopleId": "",//值班值班人员id
    "dutyPeopleName": "",//值班值班人员名称
    "endTime": "",//值班结束时间
    "handover": "",//交办事项
    "receiveName": "",//接收人名称
    "receiveUnitCode": "",//接受发送单位code
    "receiveUnitName": "",//公文接收单位名称
    "recevierId": "",//接收人id
    "startTime": '',//值班开始时间
    "upDowmType": "1",//公文操作状态 公文操作类型 公文上报-1|公文下发-2
    "upDocumentId": "",//主键
    "reportType": "1",
    "documentType": "1",
    "attachmentList": [],//附件列表
  }
  //对比
  private rules = {
    documentTitle: [{ required: true, message: '请输入信息标题', trigger: 'change' }],
    leavePeople: [{ required: true, message: '请输入请假人', trigger: 'change' }],
    outpeople: [{ required: false, message: '请输入职务', trigger: 'change' }],
    receiveName: [{ required: true, message: '请输入接收人', trigger: 'change' }],
    // changedate: [{ required: true, message: '请输入请假开始时间', trigger: 'change' }],
    // givedate: [{ required: true, message: '请输入请假结束时间', trigger: 'change' }],
    content: [{ required: true, message: '请输入内容摘要', trigger: 'change' }],
    eventReason: [{ required: true, message: '请输入请假理由', trigger: 'change' }],
  }
  created() {
    if (this.$route.query.id) {
      this.editId = this.$route.query.id.toString()
      this.getListData()
    }
    this.getRoleInfo()
  }
  //获取用户信息
  getRoleInfo() {
    let unitOrgCode = ""
    if (window.sessionStorage.getItem("role")) {
      let role = JSON.parse(window.sessionStorage.getItem("role"))
      unitOrgCode = role.orgCode
      this.listparams.recevierId = role.userId
      this.listparams.receiveName = role.name
    }
  }
  /* author by chengyun 获取列表数据
  *  Modify by xinglu
  */
  getListData() {
    if (this.editId) {
      let publi = { publicId: this.$route.query.id }
      this.http.DocumentHandleRequest.getdutyInformationDetail(publi).then(res => {
        if (res.status == 200) {
          this.listparams = res.data
          if (!res.data.attachmentList) {
            this.listparams.attachmentList = []
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
  /* author by chengyun 保存按钮
  *  Modify by xinglu
  */
  addReportInfo() {
    this.listparams.documentProgressStatus = "4"
    this.$refs.leaveReport['validate'](valid => {
      if (!valid) {
        if (this.messageDom) { this.messageDom.close() }
        this.messageDom = this.$message({
          type: 'warning',
          message: '您还有未填字段'
        })
        return false
      } else {
        if (this.editId) {
          this.http.DocumentHandleRequest.dutyInformationEdit(this.listparams).then(res => {
            if (res.status == 200) {
              this.goback()
              if (this.messageDom) { this.messageDom.close() }
              this.messageDom = this.$message({
                type: 'success',
                message: '修改成功'
              })
            }
          });

        } else {
          this.http.DocumentHandleRequest.dutyInformationAdd(this.listparams).then(res => {
            if (res.status == 200) {
              this.goback()
              if (this.messageDom) { this.messageDom.close() }
              this.messageDom = this.$message({
                type: 'success',
                message: '新增成功'
              })
            }
          });
        }

      }
    })
  }
  /* author by xinglu 返回按钮
  *  Modify by 
  */
  goback() {
    if (this.$route.query.tab) {
      this.tab = this.$route.query.tab.toString()
      this.$router.push(`/dutyManagement/documentHandle?tab=${this.tab}`)
    } else {
      this.$router.go(-1)
    }
  }
  /* author by xinglu 上报按钮
  *  Modify by 
  */
  private addReport(el: string, name: string) {
    this.$refs.leaveReport['validate'](valid => {
      if (!valid) {
        if (this.messageDom) { this.messageDom.close() }
        this.messageDom = this.$message({
          type: 'warning',
          message: '您还有未填字段'
        })
        return false
      } else {
        this.dialogConfig['viewDialog'] = true
        this.dialogConfig['propsData'] = this.listparams
        this.dialogConfig['tilteName'] = "上报"
        this.dialogConfig['templateName'] = "document-reported"
        // console.log(this.listparams);
      }
    })
  }

  /* author by xinglu 下发按钮
  *  Modify by 
  */
  private addLower(el: string, name: string) {
    this.dialogConfig['viewDialog'] = true
    let data = {
      viewDialog: true,
      templateName: el,
      tilteName: name
    }
    this.$set(this, 'dialogConfig', data)
  }
  /* author by xinglu 分享
  *  Modify by 
  */
  private shareInformatiom(el: string, name: string) {
    this.dialogConfig['viewDialog'] = true
    let data = {
      viewDialog: true,
      templateName: el,
      tilteName: name
    }
    this.$set(this, 'dialogConfig', data)
  }
}
