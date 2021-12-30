import { ControllerBase, Prop, Inject, Emit } from 'prism-web'
import { timeFormat } from '../../../../assets/libs/commonUtils'

export class TransferDeleteDialogController extends ControllerBase {
  
  @Prop() dialogprop

  private addInfo:String = ''; //补充信息
  private messageDom:any = null // message实体

  @Inject("http") http:any

  created() {

  }

  constructor() {
    super()
  }

  private temp = {
    //style: require('../../style/infoManage/imitateManage.less')
  }

  //转办督办 instruct({
  saveFun(){
    let insObj = {
      disposeId: this.dialogprop && this.dialogprop.infoDisposeId,
      deleteReason: this.addInfo
    };
    if(!this.addInfo.trim()){
      if(this.messageDom){this.messageDom.close()}
      this.messageDom = this.$message('请输入删除原因！');
      return;
    }
    //转办督办保存按钮点击事件
    this.http.GempInfoBaseRequest.delete(insObj).then(item =>{
      if (item.status === 200) {
        this.$message('删除成功！')
        //成功后，关闭弹框, 并加载信息详情信息
        this.closeDialogCall(this.dialogprop);
      } else {
        this.$message(item.msg)
      }
    })
  }

    @Emit('dialogcallback')
    closeDialogCall(infoId) {
      this.addInfo = null;

    }

    destoryed() {
      this.addInfo = null;
    }
}
