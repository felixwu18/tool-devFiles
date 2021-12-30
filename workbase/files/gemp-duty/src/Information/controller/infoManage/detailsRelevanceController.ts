import { ControllerBase, Inject, Prop ,Watch} from 'prism-web'
import { getRequestUrl } from '../../../../assets/libs/commonUtils'

export class detailsRelevanceController extends ControllerBase {
  constructor() {
    super()
  }

  private flag: Boolean = false

  private templateName: string = ''
  private tilteName: string = ''
  private propsData: Object = {
    infoId: ''
  }
  private infoId
  private role:object
  private roleLevel:boolean

  private propId
  // 列表查询参数
  private searchData:Object = {
    "infoId": this.infoId,
    "nowPage": 1,
    "pageSize": 100
  }

  private expectDraft:boolean=false
  private propData: any = []

  private temp = {
    style: require('../../style/infoManage/detailsRelevance.less')
  }

  @Inject("http") http:any
  @Prop() signforflag

  //@Prop() expectDraft


  /**
   * 根据签收状态判断关联数据展示
   * @param val 
   * Author by chenzheyu
   */
  @Watch("signforflag") 
  // @Watch("expectDraft") 
  watchSingFor(val) {
    if(val) {
      this.getRelevanceList()
    }
  }

  created() {
    this.infoId = this.$route.query.id

    // 从提醒信息跳转的时候
    var url = window.location.href;
    let urlCode = getRequestUrl(url)
    if(urlCode && urlCode['detailUrlId']){
     this.infoId = urlCode['detailUrlId']
    }

    this.role = JSON.parse(sessionStorage.getItem("role"))
    this.roleLevel = this.role['isYjb']
    // 下级用户删除操作栏  chenzheyu
    // if(!this.roleLevel) {
    //   this.propData.config.pop()
    // }
    this.searchData['infoId'] = this.infoId;
    let infoParams = {infoId:this.infoId}
      this.http.GempInfoBaseRequest.getInfoById(infoParams).then((res) => {
     
        if(res.data.infoStatus*1){  
          this.expectDraft=true
        }else{
          this.expectDraft=false
        }
      })
    
  }


  private click(el: string, name: string) {
    this.flag = true
    this.templateName = el
    this.tilteName = name
    this.propsData = {
      infoId: this.infoId
    }
  }

  //关闭信息拟办、信心审核、领导批示等弹框的回调函数
  closeDialogCall(callInfo) {
    //关闭弹框
    this.flag = false
    //重新刷新当前页面数据
    this.getRelevanceList()
  }

  // 列表按钮点击响应
  tablecallback(data){
    this[data.type](data);
  }

  handlePageChange(data) {
    let id = data.rowVal
    this.searchData['nowPage'] = data.rowVal
    this.getRelevanceList()
  }

  /**
   * Modify by chenzheyu 修改取消关联获取参数方法
   * @param data 
   */
  cancel(data){
    let id = data.infoId
    this.cancelRelevance(id)
  }

  /**
   * Modify by chenzheyu 修改设为主信息获取参数方法
   * @param data 
   */
  main(data){
    let id = data.infoId
    this.setMainMessage(id)
  }

  // 获取关联列表数据
  getRelevanceList(fun?){
    this.http.GempInfoBaseRequest.getInfoChainById(this.searchData).then(res =>{
      // this.propData.total = item.data.total
      // this.propData.pageSize = item.data.pageSize
      let  data = res.data.list || [];
      this.propData = data.map((item, index) => {
        if (this.roleLevel) {
          item.operate = [{ name: '', icon: 'el-icon-delete', emit: 'cancel', type: 'danger', title: '取消关联', expression: true }, { name: '', icon: 'el-icon-star-off', emit: 'main', type: 'success', title: '设为主信息', expression: true }]
        } else {
          item.operate = []
        }
        item.infoTypeName = item.infoTypeName || []
        return item
      })
      fun()
    })
  }

  // 更新相关信息下的数据
  updateAssocciationInfoViewData(){
    this.emit("udpateassocciationinfoview",'');
  }

  /**取消关联
   * @param id
   * Modify by chenzheyu  修改取消关联后新增关联列表未刷新问题
   * Modify by chenzheyu  修改第一次取消关联失败的问题
   */
  cancelRelevance(id) {
    const data = {
      "infoId": this.infoId,
      "secondInfo": id
    }
    this.http.GempInfoBaseRequest.cancelAssocciation(data).then(item =>{
      if(item.status === 200) {
        this.$message('取消关联成功')
        try{
          this.$refs.addRelevance['getMessageList']() // 刷新新增列表数据
        } catch (error) {  
        }
       
        this.getRelevanceList(this.updateAssocciationInfoViewData) // 刷新页面
      }
    })
  }

  // 设为主信息
  setMainMessage(id) {
    let infoParams = {infoId:id}
    this.http.GempInfoBaseRequest.setMainAssocciation(infoParams).then(item =>{
      if(item.status === 200) {
        this.$message('设为主信息成功')
        this.$router.push({ path: `/information/detailsManage`, query: { id } })
      }
    })
  }

}
