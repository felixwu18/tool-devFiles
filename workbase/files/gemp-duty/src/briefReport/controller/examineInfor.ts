// author by 刘文磊
import { ControllerBase, Prop, Inject, Emit,Watch } from 'prism-web'
export class examineController extends ControllerBase {


  constructor() {
    super()
  }
  private temp = {
    style: require('../style/imitateManage.less')
  }

  @Inject("http") http: any
  @Prop() propdata
  // @Prop() typereport //简报类型

  private dialogImitate: Boolean = true
  private feelings: Boolean = false
  private activeLeader = ''; //选择的领导
  private approvalContent: String = '';//建议
  private leaderList: Array<any> = [];
  private messageDom: any = null //message实体

  created() {
    this.getLeaderList()
  }

  //获取领导列表
  getLeaderList() {
    this.http.briefReportRequest.baseUsers().then(res => {
      if (res.status !== 200) {
        this.leaderList = [];
        this.$message({type:"error",message:"获取领导失败"});
      }
      this.leaderList = res.data;
    });
  }

  // 选择或取消选择领导
  addClass(item){
   this.$set(item,'select',!item.select)
  }

  // 点击获取常用语的值
  getDomData(item ) {
    this.approvalContent = item
  }



  /*
  * Author by
  * Modify by chengyun   信息审核
  */
  saveFun() {
    this.leaderList.forEach(item=>{
      if(item.select){
        this.activeLeader+= item.userId + ','
      }
    })
    this.activeLeader = this.activeLeader.substr(0,this.activeLeader.length - 1)
    if (this.activeLeader.length == 0) {
      if (this.messageDom)
        this.messageDom.close()
      return this.messageDom=this.$message('发送人员不能为空！');;
    }
    if (!this.approvalContent.trim()) {
      if (this.messageDom)
        this.messageDom.close()

      return this.messageDom=this.$message('审核意见不能为空！')
    }

    let insObj = {
      briefId: this.$route.query.id || '',
      comment: this.approvalContent ||'',
      description: "",  //暂时无数据
      materialid: this.propdata.materialId ||'', //
      reportType: this.propdata.reportType, // this.activeLeader
      toUsers: this.activeLeader ||''
    }

    //信息审核保存按钮点击事件 by 程云
    this.http.briefReportRequest.audit(insObj).then(res => {
      if (res.status == 200) {
        this.$message({type:"success",message:"审核成功"});
      }else{
        this.$message({type:"error",message:"审核失败"});
      }
    //成功后，关闭弹框, 并加载信息详情信息 by 刘文磊
      this.closeDialogCall({id:this.$route.query.id});
    });
  }

  @Emit('dialogcallback')
  closeDialogCall(infoId) {
  }

  /** author by 刘文磊 监听propdata
   *
   *
   */
  @Watch('propdata',{deep:true})
  getPropdata(val){
    // 清空选中领导的样式
    this.leaderList.forEach(item => {
     this.$set(item,'select',false)
    })
    // 清空选中的领导
    this.activeLeader=""
    // 清空意见
    this.$set(this.$refs.emoticon, 'inputHtml', '')
    this.$set(this.$refs.emoticon, 'inputText', '')
    this.$set(this.$refs.emoticon['$refs'].input,'innerHTML','')
    this.$set(this.$refs.emoticon['$refs'].input, 'innerText', '')
    this.approvalContent=""
  }
}
