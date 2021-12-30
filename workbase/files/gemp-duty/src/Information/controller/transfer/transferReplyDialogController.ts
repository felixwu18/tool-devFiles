import { ControllerBase, Prop, Inject, Emit } from 'prism-web'

export class transferDialogController extends ControllerBase {
  constructor() {
    super()
  }

  @Prop() propdata
  @Prop() infodisposeid
  @Emit('dialogcallback')
  closeDialogCall(infoId) {}
  @Inject('http') http: any

  private temp = {
    style: require('../../style/transfer/transferDialog.less')
  }
  private rules = {
    orgCodes: [{ required: true, message: '请选择接受单位', trigger: 'change' }],
    userids: [{ required: true, message: '请选择接收人', trigger: 'change' }],
    disposePriority: [{ required: true, message: '请选择紧急程度', trigger: 'change' }],
    opinionContent: [{ required: true, message: '请输入转办内容', trigger: 'change' }],
  }
  private reviceUserdata: Array<any> = [] //接受人
  private transferData = {
    infoId: '', //事件id
    opinionContent: '', //内容
    title: '' , //转办事项
    userids: [], //接受人id
    orgCodes: [], //接受机构
    instructionId: [], //领导批示id
    disposePriority: '', //紧急程度
    attachmentList:[] // 上传附件列表
  }
  //紧急程度参数
  private disposePriorityData: Array<any> = [
    {
      label: '特急',
      value:1
    },
    {
      label: '加急',
      value:2
    },
    {
      label: '平急',
      value:9
    },
    {
      label: '特提',
      value:0
    },
    {
      label: '一般',
      value:99
    }
  ]

  private messageDom:any = null // message实体
  //转办督办保存按钮
  private saveTransfer() {
    if(this.transferData['opinionContent'] == ''
    && this.transferData['orgCodes'] === []
    && this.transferData['userids'] === []
    && this.transferData['disposePriority'] === ''){
      if(this.messageDom){this.messageDom.close()}
      this.messageDom = this.$message('您还有信息没输入！')
      return false
    }
    this.http.InfoDutyRequest.transactAdd(this.transferData).then((res) => {
      // 信息详情-新增转办督办
      if (res.status !== 200) {
        return this.$message(res.msg)
      }
      if(this.infodisposeid) {
        this.transferData.instructionId = this.infodisposeid
      }
    // 成功后，关闭弹框, 并加载信息详情信息
      this.$message('保存成功')
      this.emit('setTransferProcess', '')
      this.closeDialogCall(this.propdata.infoId)
    })
  }

  created() {
    this.transferData.attachmentList = this.propdata.attachmentList
    this.http.InfoDutyRequest.findReviceUser().then((res) => {
      //获取转办督办接收人
      if (res.data) { this.reviceUserdata = res.data }
      // 转办督办参数赋值
      this.transferData.infoId = this.propdata.infoId
      this.transferData.title = this.propdata.infoTitle
      this.transferData.instructionId = this.propdata.infoDisposeId
      this.transferData.attachmentList = this.propdata.attachmentList
      this.transferData.orgCodes.push(this.propdata.orgCode)
      this.transferData.userids.push(this.propdata.createPerson)
    })
    
  }

  //附件
  getAttachList(data) {
    if(data) {
      this.transferData.attachmentList = data
    }
  }
}
