import { ControllerBase, Prop, Inject, Emit, Watch } from 'prism-web'
import { timeFormat } from '../../../../assets/libs/commonUtils'

export class SupplementDialogController extends ControllerBase {

  @Prop() propdata

  private ruleForm = {
    addInfo: '' //补充信息
  }
  private messageDom: any = null // message实体

  @Inject("http") http: any

  created() {

  }

  constructor() {
    super()
  }


  private temp = {
    style: require('../../style/infoManage/imitateManage.less'),
    styles: require('../../style/infoManage/supplementDialog.less')
  }

  private count: number = 0

  rules() {
    const that = this
    return ({
      addInfo: [
        { validator: that.validateAddInfo, trigger: 'blur' }
      ]
    })
  }

  validateAddInfo(rule, value, callback) {
    if(this.count === 0) {
      callback(new Error('内容不能为空！'))
    }

    if (this.count > 500) {
      callback(new Error('最大字数不能超过500！'))
    }
    callback()
  }

  @Watch('ruleForm.addInfo')
  addInfoChange(newVal) {
    this.count = newVal.trim().length
  }

  //补充信息 instruct({
  saveFun() {
    this.$refs.ruleForm['validate']((valid) => {
      if (valid) {
        let insObj = {
          infoId: this.propdata && this.propdata.infoId || this.$route.query.id,
          appendInfo: this.ruleForm.addInfo
        };
        if (!this.ruleForm.addInfo) {
          if (this.messageDom) { this.messageDom.close() }
          this.messageDom = this.$message('补充信息内容不能为空!')
          return;
        }
        //补充信息保存按钮点击事件
        this.http.DetailOperationsRequest.append(insObj).then(res => {
          if (res.status !== 200) {
            this.$message(res.msg);
            return;
          }
          this.emit('setprocess', '')
          //成功后，关闭弹框, 并加载信息详情信息
          this.closeDialogCall(this.propdata.infoId);
        })
      } else {
        return false;
      }
    })
  }

  // 隐藏弹出框
  hiddenDialog() {
    this.closeDialogCall(this.$route.query.id)
  }

  @Emit('dialogcallback')
  closeDialogCall(infoId) {
    return infoId
  }

  destoryed() {
    this.ruleForm.addInfo = null;
  }
}
