import { ControllerBase, Inject, Prop } from 'prism-web'

export class OutgoingReportControllere extends ControllerBase {
  private temp = {
    style: require('../../style/documentHandle/outgoingReport.less')
  }
  constructor() {
    super()
  }

  @Inject('http') http: any
  private selectLeadertype = ""
  //向弹出框传递参数
  private propsData: Object = {}

  private checkPage: string = '1'
  private messageDom: any = null // message实体

  private titleData = '外出报备'
  private aaa = false
  //处理过程参数
  private handlelist = []
  private hostLeader = {}
  private outLeader = {}
  //判断是否有数据
  private editId: String
  //tab信息
  private tab: string
  private activeNamex = 'first' //tab栏选中

  private processid = ''
  //向弹出框配置参数
  private dialogConfig: Object = {
    viewDialog: false, //弹框是否显示
    templateName: '', //弹框组件名
    tilteName: '',//标题头
    propsData: ''
  }


  //请求参数
  private listparams = {
    "documentProgressStatus": "4",//公文状态 未处理-1|已接收-2|已退回-3|草稿-4
    "documentTitle": "",//公文标题
    "hostLeaderId": "",//主持领导id
    "hostLeaderName": "",//主持领导名称
    "endTime": new Date(),//外出结束时间
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
    "startTime": new Date(),//外出开始时间
    "upDowmType": "1",//公文操作状态 公文操作类型 公文上报-1|公文下发-2
    "reportType": "2",
    "documentType": "2",
    "attachmentList": [],//附件列表
    "lateReport": '' //迟报说明
  }
  //规则
  private rules = {
    documentTitle: [{ required: true, message: '请输入标题', trigger: 'change' }],
    outLeaderName: [{ required: true, message: '请输入外出领导', trigger: 'c' }],
    // unit: [{ required: true, message: '请输入单位', trigger: 'c' }],
    outLeaderPosition: [{ required: false, message: '请输入职务', trigger: 'c' }],
    outReason: [{ required: true, message: '请输入外出事由', trigger: 'c' }],
    outType: [{ required: true, message: '请输入外出类型', trigger: 'c' }],
    outContactPeople: [{ required: true, message: '请输入外出联系人', trigger: 'c' }],
    startTime: [{ required: true, message: '请选择外出开始时间', trigger: 'change' }],
    endTime: [{ required: true, message: '请选择外出结束时间', trigger: 'change' }],
    hostLeaderName: [{ required: true, message: '请输入主持工作领导', trigger: 'c' }],
    hostLeaderUnitName: [{ required: true, message: '请联系管理员，配置组织机构信息。', trigger: 'c' }],
    hostLeaderPosition: [{ required: false, message: '请输入职务', trigger: 'c' }],
    remarks: [{ required: false, message: '请输入备注', trigger: 'c' }]
  }
  created() {
    if (this.$route.query.id) {
      this.editId = this.$route.query.id.toString()
      this.getListData()
    }
    // this.getRoleInfo()
    this.onNotify()
  }


  //获取用户信息
  getRoleInfo() {
    let unitOrgCode = ""
    if (window.sessionStorage.getItem("role")) {
      let role = JSON.parse(window.sessionStorage.getItem("role"))
      unitOrgCode = role.orgCode
      this.listparams.recevierId = role.userId
    }
  }
  /* author by xinglu 监听选中的值
    *
    */
  onNotify() {
    this.on("getSelectLeaderDetail", (data) => {
      // console.log(data);

      this.closeDialogCall()
      this.hostLeader = data[0]
      this.outLeader = data[0]
      if (this.selectLeadertype == "1") {
        this.listparams.outLeaderId = this.outLeader['personId']
        this.listparams.outLeaderName = this.outLeader['personName']
        this.listparams.outLeaderPosition = this.outLeader['personJob']
        this.listparams.outLeaderUnitCode = this.outLeader['orgCode']
        this.listparams.outLeaderUnitName = this.outLeader['orgName']
      } else if (this.selectLeadertype == "2") {
        this.listparams.hostLeaderId = this.hostLeader['personId']
        this.listparams.hostLeaderName = this.hostLeader['personName']
        this.listparams.hostLeaderPosition = this.hostLeader['personJob']
        this.listparams.hostLeaderUnitCode = this.hostLeader['orgCode']
        this.listparams.hostLeaderUnitName = this.hostLeader['orgName']

      }


    })
  }
  // 获取列表数据
  getListData() {
    if (this.editId) {
      let publi = { publicId: this.$route.query.id }
      this.http.DocumentHandleRequest.getdutyInformationDetail(publi).then(res => {
        if (res.status == 200) {
          this.listparams = res.data
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
  *  Modify by xinglu
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
      } else {
        if (this.listparams.startTime > this.listparams.endTime) {
          if (this.messageDom) { this.messageDom.close() }
          this.messageDom = this.$message({
            type: 'warning',
            message: '外出开始时间不得晚于外出结束时间！'
          })
        } else {
          if (this.editId) {
            this.http.DocumentHandleRequest.outgoingReportEdit(this.listparams).then(res => {
              if (res.status == 200) {
                if (this.messageDom) { this.messageDom.close() }
                this.messageDom = this.$message({
                  type: 'success',
                  message: '修改成功'
                })
                this.goback()
              }
            });
          } else {
            this.http.DocumentHandleRequest.outgoingReportAdd(this.listparams).then(res => {
              if (res.status == 200) {
                if (this.messageDom) { this.messageDom.close() }
                this.messageDom = this.$message({
                  type: 'success',
                  message: '新增成功'
                })
                this.goback()
              }
            });
          }
        }
      }
    })
  }
  // 返回按钮 by xinglu
  goback() {
    if (this.$route.query.tab) {
      this.tab = this.$route.query.tab.toString()
      this.$router.push(`/dutyManagement/documentHandle?tab=${this.tab}`)
    } else {
      this.$router.go(-1)
    }
  }
  getHostLeaderInfo(name: string, type) {
    this.selectLeadertype = type
    this.dialogConfig['viewDialog'] = true
    this.dialogConfig['propsData'] = this.listparams
    this.dialogConfig['propsData'].type = type
    this.dialogConfig['tilteName'] = name
    this.dialogConfig['templateName'] = "select-leader"
  }
  getOutLeaderInfo(name: string) {
    this.dialogConfig['viewDialog'] = true
    this.dialogConfig['propsData'] = this.listparams
    this.dialogConfig['propsData'].type = "1"
    this.dialogConfig['tilteName'] = name
    this.dialogConfig['templateName'] = "select-leader"
  }
  //上报
  private addReport() {
    this.$refs.listparams['validate'](valid => {
      if (!valid) {
        if (this.messageDom) { this.messageDom.close() }
        this.messageDom = this.$message({
          type: 'warning',
          message: '您还有未填字段'
        })
        return false
      } else if(this.listparams.startTime > this.listparams.endTime){
        if (this.messageDom) { this.messageDom.close() }
        this.messageDom = this.$message({
          type: 'warning',
          message: '外出开始时间不得晚于外出结束时间！'
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
}
