import { ControllerBase, Inject, Prop, Emit } from 'prism-web'
import { timeFormat } from '../../../../assets/libs/commonUtils'
export class DutyInformationController extends ControllerBase {
  private temp = {
    style: require('../../style/documentHandle/dutyInformation.less')
  }
  constructor() {
    super()
  }

  @Inject('http') http: any
  //向弹出框传递参数
  private propsData: Object = {}
  //tab信息
  private tab: string
  //判断是否有数据
  private editId: String
  //是否可编辑
  private edit: string
  private titleData = '值班信息'
  //是否不可编辑
  private isdisabled: boolean = false
  //处理过程参数
  private handlelist = []
  // message实体
  private messageDom: any = null
  //弹出框选中的信息的列表
  private handleSelect = {}
  private orgPeopleList = []
  //向弹出框配置参数
  private dialogConfig: Object = {
    viewDialog: false, //弹框是否显示
    templateName: '', //弹框组件名
    tilteName: '',//标题头
    propsData: {}
  }
  private chooseOrgCode
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
    "reportType": "1"
  }
  //规则
  private rules = {
    documentTitle: [{ required: true, message: '请输入标题', trigger: 'blur' }, { max: 50, message: "最大长度为50", trigger: 'change' }],
    dutyPeopleId: [{ required: true, message: '请输入值班人员', trigger: 'blur' }, { max: 50, message: "最大长度为50", trigger: 'change' }],
    startTime: [{ required: true, message: '请输入值班开始时间', trigger: 'change' }],
    endTime: [{ required: true, message: '请输入值班结束时间', trigger: 'change' }],
    content: [{ required: false, message: '请输入工作事项', trigger: 'change' }],
    handover: [{ required: false, message: '请输入交办事项', trigger: 'blur' }]
  }

  created() {
    if (this.$route.query.id) {
      this.editId = this.$route.query.id.toString()
      this.getListData()
    }
    this.onNotify()
    //获取当前机构下所有的人员
    this.getOrgPeopleList()
  }
  getOrgPeopleList() {
    let unitOrgCode = ""
    let roleInfo = []
    if (window.sessionStorage.getItem("role")) {
      let role = JSON.parse(window.sessionStorage.getItem("role"))
      unitOrgCode = role.orgCode
      roleInfo.push(role)
      // this.listparams.recevierId = role.userId
    }
    this.http.DocumentHandleRequest.getdutyPeopleList(unitOrgCode).then(res => {
      if (res.status == 200) {
        this.orgPeopleList = res.data
        if (res.data.length == 0) {
          this.orgPeopleList = [
            {
              name:roleInfo[0].userName,
              orgCode: roleInfo[0].orgCode,
              tenantId: "",
              userId: roleInfo[0].userId,
              orgName:roleInfo[0].orgName
            }
          ]
        }
      }
    });
  }
  select(val, prop) {
    console.log(this.orgPeopleList);
    
    for (let i = 0, length = this.orgPeopleList.length; i < length; i++) {
      if (val == this.orgPeopleList[i].userId) {
        this.listparams[prop] = this.orgPeopleList[i].name
        // console.log(this.listparams[prop]);
      }

    }
    // console.log(this.listparams);

    // this.listparams.applicantId = val.userId
    // this.listparams.applicantName = val.userName
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

  /*
  * 导入值班信息
  */
  importDutyData(el: string, name: string) {
    this.dialogConfig['viewDialog'] = true
    let data = {
      viewDialog: true,
      templateName: el,
      tilteName: name,
      propsData: this.chooseOrgCode
    }
    this.$set(this, 'dialogConfig', data)
  }
  /* author by huihui 监听选中的值
  *  Modify by xinglu 处理选中的值
  */
  onNotify() {
    this.on("handleChooseDuty", (data) => {
      this.closeDialogCall()
      data.forEach(element => {
        this.handleSelect = element
      });
      Object.assign(this.listparams, this.handleSelect[0])
      this.listparams['dutyPeopleName'] = this.handleSelect[0].dutyPeopleName
      this.listparams['endTime'] = this.handleSelect[0].endTiime.replace(/\-/g, "/")
      this.listparams['handover'] = this.handleSelect[0].takeOverItem
      this.listparams['startTime'] = this.handleSelect[0].startTime.replace(/\-/g, "/")
      this.listparams['content'] = this.handleSelect[0].workItem
      this.listparams['dutyPeopleId'] = this.handleSelect[0].dutyPeopleId
    })

    if (this.$route.query.code) {
      this.chooseOrgCode = this.$route.query.code
    }
  }

  /* 
  * 保存按钮
  */
  addReportInfo() {
    this.listparams.documentProgressStatus = "4"
    let data = JSON.parse(JSON.stringify(this.listparams))
    data['endTime'] = new Date(this.listparams['endTime'])
    data['startTime'] = new Date(this.listparams['startTime'])
    // console.log(data);
    
    this.$refs.listparams['validate'](valid => {
      if (!valid) {
        if (this.messageDom) { this.messageDom.close() }
        this.messageDom = this.$message({
          type: 'warning',
          message: '您还有未填字段'
        })
        return false
      } else {
        if (this.editId) {
          this.http.DocumentHandleRequest.dutyInformationEdit(data).then(res => {
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
          this.http.DocumentHandleRequest.dutyInformationAdd(data).then(res => {
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
  //上报
  addReport() {
    this.$refs.listparams['validate'](valid => {
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

  //下发
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
