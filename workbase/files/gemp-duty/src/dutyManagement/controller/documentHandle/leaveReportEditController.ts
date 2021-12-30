import { ControllerBase, Inject, Prop } from 'prism-web'

export class LeaveReportEditController extends ControllerBase {
  private temp = {
    style: require('../../style/documentHandle/leaveReport.less')
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
  private titleData = '请假报备'
  //处理过程参数
  private handlelist = []
  private hostLeader = {}
  private outLeader = {}
  private selectLeadertype = ""
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
    "reportType": "3",
    "documentType":"3",
    "startTime":'',
    "endTime":'',
    "lateReport":''
  }
  //对比
  private rules = {
    documentTitle: [{ required: true, message: '请输入信息标题', trigger: 'change' }],
    leavePeople: [{ required: true, message: '请输入请假人', trigger: 'change' }],
    outpeople: [{ required: false, message: '请输入职务', trigger: 'change' }],
    contactPhone: [
      { required: true, message: '请输入正确的手机号码', trigger: 'change' },
      { validator: this.validatePhone, trigger: 'change' }
    ],
    startTime: [{ required: true, message: '请输入请假开始时间', trigger: 'change' }],
    endTime: [{ required: true, message: '请输入请假结束时间', trigger: 'change' }],
    eventDescription: [{ required: true, message: '请输入情况描述', trigger: 'change' }],
    eventReason: [{ required: true, message: '请输入请假理由', trigger: 'change' }],
  }
  created() {
    if (this.$route.query.id) {
      this.editId = this.$route.query.id.toString()
      this.getListData()
    }
    this.getRoleInfo()
    this.onNotify()
  }

  //校验手机号
  validatePhone(rule, value, callback) {
    if (!value) {
        return callback(new Error("请输入正确的联系电话"))
    }
    else {
        if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) {
            return callback(new Error("请输入正确的联系电话"))
        } else {
            return callback()
        }
    } 
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
  private deadline :any = "";

  handleDate(value){
    this.deadline = value
  }
  private pickerOptions :any = {
      disabledDate : this.disabledDate
  }
  disabledDate(time:any){
    return time.getTime() <= Date.parse(this.listparams.startTime) - 24 * 3600 * 1000
  }
  /* author by chengyun 获取列表数据
  *  Modify by xinglu
  */
  getListData() {
    if (this.editId) {
      let publi = { publicId: this.$route.query.id }
      this.http.DocumentHandleRequest.getdutyInformationDetail(publi).then(res => {
        if (res.status == 200) {
          res.data.startTime = new Date(res.data.startTime.replace(/\-/g,'/'))
          res.data.endTime = new Date(res.data.endTime.replace(/\-/g,'/'))
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

      /* author by xinglu 监听选中的值
    *
    */
   onNotify() {
    this.on("getSelectLeaderDetail", (data) => {
      console.log(data);
      this.closeDialogCall()
      this.hostLeader = data[0]
      this.outLeader = data[0]
      if (this.selectLeadertype == "2") {
        // this.listparams.
      }


    })
  }

  getHostLeaderInfo(name: string, type) {
    this.selectLeadertype = type
    this.dialogConfig['viewDialog'] = true
    this.dialogConfig['propsData'] = this.listparams
    this.dialogConfig['propsData'].type = type
    this.dialogConfig['tilteName'] = name
    this.dialogConfig['templateName'] = "select-leader"
  }

  /* author by chengyun 保存按钮
  *  Modify by xinglu
  */
  addReportInfo() {
    this.$refs.leaveReport['validate'](valid => {
      if (!valid) {
        if (this.messageDom) { this.messageDom.close() }
        this.messageDom = this.$message({
          type: 'warning',
          message: '您还有未填字段'
        })
        return false
      } else {
        if (this.listparams.startTime > this.listparams.endTime) {
          if (this.messageDom) { this.messageDom.close() }
          this.messageDom = this.$message({
            type: 'warning',
            message: '请假开始时间不得晚于请假结束时间！'
          })
          return false
        }
        if (this.editId) {
          this.http.DocumentHandleRequest.leaveReportEdit(this.listparams).then(res => {
            if (res.status == 200) {
              if (this.messageDom) { this.messageDom.close() }
              this.messageDom = this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.goback()
            }else{
              if (this.messageDom) { this.messageDom.close() }
              this.messageDom = this.$message({
                type: 'warning',
                message: res.msg
              })
            }
          });

        } else {
          this.http.DocumentHandleRequest.leaveReportAdd(this.listparams).then(res => {
            if (res.status == 200) {
              if (this.messageDom) { this.messageDom.close() }
              this.messageDom = this.$message({
                type: 'success',
                message: '新增成功'
              })
              this.goback()
            }else{
              if (this.messageDom) { this.messageDom.close() }
              this.messageDom = this.$message({
                type: 'warning',
                message: res.msg
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
      } else if(this.listparams.startTime > this.listparams.endTime){
        if (this.messageDom) { this.messageDom.close() }
        this.messageDom = this.$message({
          type: 'warning',
          message: '请假开始时间不得晚于请假结束时间！'
        })
        return false
    }else {
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
