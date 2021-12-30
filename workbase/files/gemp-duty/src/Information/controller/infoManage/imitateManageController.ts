import { ControllerBase, Prop, Inject, Emit } from 'prism-web'

export class imitateManageController extends ControllerBase {

  private feelings: Boolean = false

  private activeLeader:Array<any> = []; //选择的领导
  private approvalContent:String = '';//建议
  private leaderList: Array<any> = [];
  private messagaDom:any = null // message实体
  private commonLanguageData: Array<any> = [] // 常用语数据

  @Prop() propdata

  @Inject("http") http:any

  constructor() {
    super()
  }

  private temp = {
    style: require('../../style/infoManage/imitateManage.less')
  }

  created() {
    //根据常用语ID查询该组常用语
    this.http.DetailOperationsRequest.getCommonLanguage({
      groupCode: "10001"
    }).then(res => {
      this.commonLanguageData = res.data
    });

    //用户可以在录入信息拟办时选择领导GEMP-176
    this.http.DetailOperationsRequest.getUserGroup({
      groupCode: "10001"
    }).then(res => {
      this.leaderList = res.data;
    });
  }

  // 点击获取常用语的值
  /**
   * Modify by chenzheyu 修改点击常用于功能
   * @param e 
   */
  getDomData(e) {
    this.$refs.emoticon['updateContent'](e.currentTarget.innerHTML)
  }

  addClass(e,curPerson) {
    var incIndex = this.activeLeader.findIndex(item => {
      return item.userId == curPerson.userId;
    })
    if(incIndex == -1){
      this.activeLeader.push(curPerson);
    } else {
      this.activeLeader.splice(incIndex, 1);
    }
  }

  // 取消 关闭弹窗
  cancleFun() {
    this.closeDialogCall(this.propdata.infoId);
  }

  //信息拟办 instruct({
  saveFun(){

    if(this.activeLeader.length == 0){
      if(this.messagaDom){this.messagaDom.close()}
      this.messagaDom = this.$message('发送人员不能为空！');
      return;
    }
    if(!this.approvalContent){
      if(this.messagaDom){this.messagaDom.close()}
      this.messagaDom = this.$message('拟办意见不能为空！');
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
    //信息拟办保存按钮点击事件
    this.http.DetailOperationsRequest.opinion(insObj).then(res => {
      if(res.status !== 200){
        this.$message(res.msg);
        return;
      }
      this.emit('setprocess', '')
      //成功后，关闭弹框, 并加载信息详情信息
      this.closeDialogCall(this.propdata.infoId);
    });
  }

  @Emit('dialogcallback')
  closeDialogCall(infoId) {

  }
}
