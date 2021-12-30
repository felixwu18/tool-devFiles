import { ControllerBase, Prop, Inject, Emit } from 'prism-web'

export class DetailsSupplementDialogController extends ControllerBase {
  private feelings: Boolean = false
  private instructInfo: String = ''

  @Inject('http') http: any

  created() {}

  constructor() {
    super()
  }

  @Prop() propdata

  private temp = {
    // style: require('../../style/infoManage/imitateManage.less')
  }

  //领导批示 instruct({
  saveFun() {
    let insObj = {}
    //领导批示保存按钮点击事件
    this.http.DetailOperationsRequest.instruct(insObj).then((res) => {
      if (res.status !== 200) {
        this.$message(res.msg)
        return
      }
      this.emit('setprocess', '')
      //成功后，关闭弹框, 并加载信息详情信息
      this.closeDialogCall(this.propdata.infoId)
    })
  }

  @Emit('dialogcallback')
  closeDialogCall(infoId) {}
}
