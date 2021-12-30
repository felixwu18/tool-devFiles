import { ControllerBase, Prop, Inject, Emit } from 'prism-web'
export class ReturnReportController extends ControllerBase {
  private sendBackReason: string = ''; //情况描述
  
  @Prop() infoid

  @Inject("http") http:any

  private temp = {
    style: require('../../style/infoManage/imitateManage.less')
  }
  private returnData = {
    infoId:'',
    sendBackReason:''
  }

  private dialogFlag:any // 弹出框控制

  constructor() {
    super()
  }

  created() {
    
  }

  //退回 
  /**
   *Modify by chenzheyu  添加退回成功页面跳转到列表页  成功提示框 
   *Modify by chenzheyu  添加退回原因字段效验
   */
  saveFun(){
    // debugger
    if(this.returnData.sendBackReason.trim()) {
      this.$set(this.returnData, 'infoId', this.infoid)
      //退回保存按钮点击事件
      this.http.DetailOperationsRequest.back(this.returnData).then(res => {
        if(res.status !== 200){
          this.$message(res.msg);
          return;
        } 
        this.$message({
          type: 'success',
          message: '退回成功!'
        })
        this.closeDialogCall(this.infoid,true);
        });
      } else {
        if(this.dialogFlag) {
          this.dialogFlag.close()
        }
        this.dialogFlag = this.$message.warning("请输入退回原因")
      }
    
  }

    @Emit('dialogcallback')
    closeDialogCall(infoId,type) {

    }
    //附件改变
    handleFileChange(){

    }

    //返回
    cancleFun(){   
      this.closeDialogCall(this.infoid,false);
    }
}
