// author by xinglu
import { ControllerBase, Prop, Inject, Emit, Watch } from 'prism-web'
import searchSession from '../../../assets/libs/searchData'

export class TextPreservationController extends ControllerBase {

  //简报选择类型
  private type: string = '1';
  private formData = {
    id: "",
    comments: "",
    materialId: "",
    reportTitle: "",
    reportType: ""
  }
  // 请求参数
  private listParams = {
    briefId: '',//简报Id
    reportType: '' //转换类型
  }
  private infoId = '' //信息生成文本的id

  @Prop() propdata
  // @Prop() listparams

  @Inject("http") http: any
  @Inject('store') store:any
  constructor() {
    super()
  }

  private temp = {
    style: require('../../briefReport/style/preservation.less')
  }

  created() {}

  //保存按钮
  saveFun(data) {
    if (this.$route.query.id) {
      this.listParams.briefId = this.$route.query.id as string
    } else if(this.propdata.data) {
      this.listParams.briefId = this.propdata.data.id
    } else {
      this.listParams.briefId = this.propdata.textId
    }
    if (this.type == '1') {
      this.listParams.reportType = "SPECIAL"
      this.changeType('specialReportAdd')
    } else if (this.type == '2') {
      this.listParams.reportType = "BRIEF"
      this.changeType('wallBulletinAdd')
    } else {
      this.listParams.reportType = "REPORT"
      this.changeType('reportAdd')
    }

  }
  //发送请求
  // by 刘文磊 区别新增和编辑生成简报
  changeType(urlJump) {
    let transferFunc:Function
    transferFunc = this.store.state.SYSTEMOFFICE === 'ONLYOFFICE'? this.http.briefReportRequest.transferOffice:this.http.briefReportRequest.transferType
    transferFunc(this.listParams).then(res => {
      if (res.status != 200) {
        this.$message.error('生成简报失败！')
        return false
      }

      let inparameter = res.data
      // if (this.propdata.data.infoId){
      if (this.propdata.data){
        this.infoId = this.propdata.data.infoId
      }else {
        this.infoId = this.propdata.textId
      }

      setTimeout(() => {
        this.closeDialogCall()
        this.$router.push({ name: urlJump, params: { inparameter: inparameter, infoId: res.data.infoId} })
      }, 200)

      // this.http.briefReportRequest.briefAdd({
      //   infoId: res.data.infoId,
      //   materialId: res.data.materialId,
      //   reportType: this.listParams.reportType,
      //   comments: this.listparams.reportContent,
      //   reportTitle: this.listparams.reportTitle,
      //   id: ''
      // }).then((res) => {
      //   if(res.status != 200) {
      //     this.closeDialogCall()
      //     return false
      //   }

      //   this.closeDialogCall()
      //   this.$router.push({ name: urlJump, params: { inparameter: inparameter, infoId: res.data.infoId} })
      //   return true
      // })
    })
  }
  
  @Emit('dialogcallback')
  closeDialogCall() {
    return
  }

  //生成简报后点击取消按钮
  cancelOpen() {
    this.$message('取消文本文件生成简报')
    this.closeDialogCall()
    if (this.$route.name !== 'textFileList') this.$router.push('/briefReport/textFile')
  }
}
