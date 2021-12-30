import { ControllerBase, Prop, Inject, Emit } from 'prism-web'
import { timeFormat } from '../../../../assets/libs/commonUtils'

export class leadDialogController extends ControllerBase {
  private feelings: Boolean = false
  private instructTime: String = new Date().toJSON();//批示时间
  private activeLeader: any = {}; //选择的领导
  private instructInfo: String = '';//批示建议
  private leaderList: Array<any> = [{ reportId: '1', reportName: '名师红' }];
  private messageDom: any = null
  private approvalContent: String = '';//建议
  private messagaDom: any = null // message实体
  private commonLanguageData: Array<any> = [] // 常用语数据
  private pickerOptions = {
    disabledDate: (time) => {
      return time.getTime() > Date.now()
    }
  }
  @Inject("http") http: any

  created() {
    //根据常用语ID查询该组常用语
    this.http.DetailOperationsRequest.getCommonLanguage({
      groupCode: "10003"
    }).then(res => {
      this.commonLanguageData = res.data
    });

//     //用户可以在录入信息拟办时选择领导GEMP-176
    this.http.DetailOperationsRequest.getUserGroup({
      groupCode: "10003"
    }).then(res => {
      this.leaderList = res.data;


  //   //用户可以在录入领导批示时选择领导GEMP-176
  //   this.http.DetailOperationsRequest.auditUserList({
  //     infoId: this.propdata && this.propdata.infoId,
  //   }).then(res => {
  //     if (res.status !== 200) {
  //       this.leaderList = [];
  //       this.$message(res.msg);
  //       return;
  //     }
  //     this.leaderList = res.data.filter((maps)=>{
  //       if(maps.reportType == '2') {
  //         return maps
  //       }
  //     });
    });
  }

  constructor() {
    super()
  }

  @Prop() propdata

  private temp = {
    style: require('../../style/infoManage/imitateManage.less')
  }

  addClass(e, curPerson) {
    if (this.activeLeader.userId !== curPerson.userId) {
      this.activeLeader = curPerson
    }
  }
  //领导批示 instruct({
  saveFun() {
    let insObj = {
      infoId: this.propdata && this.propdata.infoId || '2c9282bb6c045343016c04544c970000',
      instructTime: timeFormat(this.instructTime, true),
      leaderId: this.activeLeader.userId,
      leaderName: this.activeLeader.userName,
      instructInfo: this.instructInfo,
      approvalContent: this.approvalContent
    };
    if (!this.instructTime) {
      if (this.messageDom) { this.messageDom.close() }
      this.messageDom = this.$message('批阅时间不能为空！');
      return;
    }
    if (!this.activeLeader.userId) {
      if (this.messageDom) { this.messageDom.close() }
      this.messageDom = this.$message('请选择批阅领导！');
      return;
    }
    if (!this.instructInfo) {
      if (this.messageDom) { this.messageDom.close() }
      this.messageDom = this.$message('批阅意见不能为空！');
      return;
    }
    //领导批示保存按钮点击事件
    this.http.DetailOperationsRequest.instruct(insObj).then(res => {
      if (res.status !== 200) {
        this.$message(res.msg);
        return;
      }
      this.emit('setprocess', '')
      //成功后，关闭弹框, 并加载信息详情信息
      this.closeDialogCall(this.propdata.infoId);
    });
  }

  // 取消 关闭弹窗
  cancleFun() {
    this.closeDialogCall(this.propdata.infoId);
  }
  // 点击获取常用语的值
  /**
   * Modify by chenzheyu 修改点击常用于功能
   * @param e 
   */
  getDomData(e) {
    // this.$refs.leaderoption['inputHtml'] = e.currentTarget.innerHTML
    this.instructInfo = e.currentTarget.innerHTML
    // this.$refs.leaderoption['inputText'] = e.currentTarget.innerHTML
  }
  // 获取输入框返回值
  getVal(val) {
    this.approvalContent = val
  }
  @Emit('dialogcallback')
  closeDialogCall(infoId) {

  }
}
