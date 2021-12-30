import { ControllerBase, Prop, Emit,Watch,Inject } from 'prism-web'
  /**
   * Modify by huihui 修改点击常用语功能
   */
export class ViewMaskController extends ControllerBase {
  private activeLeader:Array<any> = []; //选择的领导
  private approvalContent:String = '';//建议
  private leaderList: Array<any> = [{reportId: '1',reportName: '名师红',reportType: '2'}];
  private messageDom:any = null // message实体
  private reviceUserdata: Array<any> = [] //接受人

  constructor() {
    super()
  }
  @Inject("http") http:any
  @Prop() propdata

  private temp = {
    style:require("../style/viewMask.less")
   
  }
  private rules = {
    orgCodes: [{ required: true, message: '请选择接受单位', trigger: 'change' }],
    userids: [{ required: true, message: '请选择接收人', trigger: 'change' }],
    // disposePriority: [{ required: true, message: '请选择紧急程度', trigger: 'change' }],
    // opinionContent: [{ required: true, message: '请输入转办内容', trigger: 'change' }],
  }

  created() {
 
  }


  // 点击获取常用语的值
  /**
   * Modify by huihui 修改点击常用语功能
   * @param e 
   */
  getDomData(e) {
    this.$refs.emoticon['updateContent'](e.currentTarget.innerHTML)
  }

  //信息审核
  saveFun(){
    let insObj = {
      infoId: this.propdata && this.propdata.infoId,
      approvalOrgInfos: this.activeLeader,
      approvalContent: this.approvalContent
    };
    if(this.activeLeader.length == 0){
      if(this.messageDom){this.messageDom.close()}
      this.messageDom = this.$message('发送人员不能为空！');
      return;
    }
    if(!this.approvalContent){
      if(this.messageDom){this.messageDom.close()}
      this.messageDom = this.$message('审核意见不能为空！');
      return;
    }
    //信息审核保存按钮点击事件
    this.http.DetailOperationsRequest.audit(insObj).then(res => {
      if(res.status !== 200){
        this.$message(res.msg);
        return;
      }
      this.$message({
        type: "success",
        message: '审核成功!'
      })
      this.emit('setprocess', '')
       //成功后，关闭弹框, 并加载信息详情信息
       this.closeDialogCall(this.propdata.infoId);
      });
    }

    @Emit('dialogcallback')
    closeDialogCall(infoId) {
      return infoId
    }

  private transferData = {
    userids: [], //接受人id
    orgCodes: [], //接受机构
  
  }
    //选中机构的返回值
  getOrg(val) {
      this.transferData.orgCodes = val
  }

}
