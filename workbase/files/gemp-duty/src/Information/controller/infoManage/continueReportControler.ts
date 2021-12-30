import { ControllerBase, Prop, Inject, Emit } from 'prism-web'
export class ContinueReportController extends ControllerBase {
  // 数据绑定接口
  private continueReportData = {
    infoId: '',
    attachmentList: [],
    infoDescription: ''
  }
  private messageDom: any = null // message实体
  @Prop() propdata

  @Inject("http") http: any

  private temp = {
    style: require('../../style/infoManage/continueReport.less')
  }

  constructor() {
    super()
  }

  activated() {

  }

  //续报
  saveFun() {
    this.$set(this.continueReportData, 'infoId', this.propdata.infoId)
    if (this.continueReportData.infoDescription.trim() == "") {
      if (this.messageDom) { this.messageDom.close() }
      this.messageDom = this.$message("续报信息内容不能为空！");
      return
    }
    //续报保存按钮点击事件
    this.http.DetailOperationsRequest.continueBaseInfo(this.continueReportData).then(res => {
      if (res.status !== 200) {
        this.$message(res.msg);
        return;
      }
      this.$message.success("续报成功")
      this.closeDialogCall(this.propdata.infoId);
    });
  }

  @Emit('dialogcallback')
  closeDialogCall(infoId) {

  }
  //附件改变
  handleFileChange() {

  }

  //返回
  cancleFun() {
    this.closeDialogCall(this.propdata.infoId);
  }
}
