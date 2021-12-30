import { ControllerBase, Prop, Inject, Emit } from 'prism-web'

export class examineInforController extends ControllerBase {
  private dialogImitate: Boolean = true
  private feelings: Boolean = false
  private activeLeader:Array<any> = []; //选择的领导
  private approvalContent:String = '';//建议
  private leaderList: Array<any> = [{reportId: '1',reportName: '名师红',reportType: '2'}];
  private messageDom:any = null // message实体
  private commonLanguageData: Array<any> = [] // 常用语数据
  @Inject("http") http:any

  constructor() {
    super()
  }

  @Prop() propdata

  private temp = {
    style: require('../../style/infoManage/imitateManage.less')
  }

  created() {
    //根据常用语ID查询该组常用语
    this.http.DetailOperationsRequest.getCommonLanguage({
      groupCode: "10002"
    }).then(res => {
      this.commonLanguageData = res.data
    });

    //用户可以在录入信息拟办时选择领导GEMP-176
    this.http.DetailOperationsRequest.getUserGroup({
      groupCode: "10002"
    }).then(res => {
      this.leaderList = res.data;
    });
  }

  addClass(e,curPerson) {
    var incIndex = this.activeLeader.findIndex(item => {
      return item.reportId == curPerson.reportId;
    })
    if(incIndex == -1){
      this.activeLeader.push(curPerson);
    } else {
      this.activeLeader.splice(incIndex, 1);
    }
  }

  // 点击获取常用语的值
  /**
   * Modify by chenzheyu 修改点击常用语功能
   * @param e 
   */
  getDomData(e) {
    this.$refs.emoticon['updateContent'](e.currentTarget.innerHTML)
  }

  // 取消 关闭弹窗
  cancleFun() {
    this.closeDialogCall(this.propdata.infoId);
  }

  //信息审核
  saveFun(){
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
    let leaderArr = []
    this.activeLeader.map(it =>{
      leaderArr.push(
        {
        "reportId": it.userId,
        "reportName": it.userName,
        "reportType": "2"
        }
      )
    })

    let insObj = {
      infoId: this.propdata && this.propdata.infoId,
      approvalOrgInfos: leaderArr,
      approvalContent: this.approvalContent
    };
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
}
