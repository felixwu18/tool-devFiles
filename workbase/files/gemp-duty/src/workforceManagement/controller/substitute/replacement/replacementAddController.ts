import { ControllerBase, Inject, Watch, Prop} from 'prism-web'

export class AddSubstituteController extends ControllerBase {
  private temp = {
    style: require('../../../style/substitute/replacement/replacement.less')
  }

  constructor() {
    super()
  }
  @Inject("http") http: any
  @Prop() orgcode
  @Watch('orgCode')
  getOrgCode(val) {
    this.replacePeople.orgCode = val
    this.listparams.orgCode=val
  }
  //选项列表
  private selectLiat = {}
  private listparams = {
    "applicantId": "",//申请人id
    "applicantName": "",//申请人姓名
    "exchangeReason": "",//换班/替班原因
    "exchangeType": "",//换班/替班类型
    "peopleid": "",//换班/替班人id
    "peopleName": "",//换班/替班人姓名
    "remarksInformation": "",//备注信息
    "returnTime": "",//还班时间
    "returnType": "",//还班类型
    "swapInsteadTime": "",//换班/替班时间
    "swapInsteadType": "1",//替班or换班
    orgCode:""
  }
  //规则
  private rules = {
    applicantId: [{ required: true, message: '请选择申请人', trigger: ['blur','change'] }, { max: 50, message: "最大长度为50", trigger: 'change' }],
    peopleId: [{ required: true, message: '请选择换班人', trigger: ['blur','change'] }],
    swapInsteadTime: [{ required: true, message: '请输入替班时间', trigger: ['change','blur'] }],
    exchangeType: [{ required: true, message: '请输入替班类型', trigger: ['change','blur'] }],
    exchangeReason: [{ required: true, message: '请输入替班原因', trigger: ['change','blur'] }],
    remarksInformation: [{ required: false, message: '请输入备注信息', trigger: 'blur' }]
  }
  //
  private scaleList: Array<any> = []

  private initTime = new Date()
  private editId
  private isAdd: boolean = false
  private messageDom: any = null // message实体
  created() {
    this.replacePeople.orgCode = this.orgcode
    this.listparams.orgCode=this.orgcode
    this.getReplacementPeople()
  }
  /**
   * author by xinglu
   * 换班人/替班人请求信息
   */
  private replacePeople = {
    "orgCode": "",//组织机构code
    "userName": ""//人员姓名
  }
  /**
  * author by xinglu
  * 获取换班人/替班人列表
  */
  getReplacementPeople() {
    this.http.WorkforceManagementRequest.getSubstitutePeople(this.replacePeople).then(res => {
      if (res.status == 200) {
        this.scaleList = res.data
        // this.scaleList1 = res.data
      }
    })
  }
  /** 
   * author by xinglu
   *  提交上报信息
  */
  private addReportInfo() {
    this.$refs.listparams['validate'](valid => {
      if (!valid) {
        if (this.messageDom) { this.messageDom.close() }
        this.messageDom = this.$message({
          type: 'warning',
          message: '请按提示正确填写信息'
        })
        return false
      } else {
        this.http.WorkforceManagementRequest.SubstituteAdd(this.listparams).then(res => {
          if (res.status == 200) {
            this.emit('replacementEditWindow');
            this.selectLiat = {}
            this.$refs.listparams['resetFields']()
            if (this.messageDom) { this.messageDom.close() }
            this.messageDom = this.$message({
              type: 'success',
              message: "修改成功"
            })
          }else{
            this.$message.error(res.msg)
          }
        })
      }
    })
  }
  /**
   * author by xinglu
   * 处理申请人列表
   * by 刘文磊 下拉选change事件
   */
  select(val, prop) {
    for (let i = 0, length = this.scaleList.length; i < length; i++) {
      if (val == this.scaleList[i].userId)
        this.listparams[prop] = this.scaleList[i].userName
    }
  }
  /**
   * author by xinglu
   * 处理换班人列表
   * by 刘文磊 注释改功能
   */
  // selectpeople(val) {
  //     this.listparams.peopleid = val.userId
  //     this.listparams.peopleName = val.userName
  // }
}
