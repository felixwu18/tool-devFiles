import { ControllerBase, Inject, Prop, Emit,Watch } from 'prism-web'

export class DetailsLeadershipListController extends ControllerBase {
  constructor() {
    super()
  }
  private temp = {
    style: require('../../style/infoManage/detailsLeadershipList.less')
  }
  @Inject('http') http: any
  @Inject('store') store: any
  @Watch('store.state.HANDLE_STATE')
  watchState(val) {
    if(!!this.$refs.handleButton['$el'] && val) {
      this.$refs.handleButton['$el'].style.display = "block"
    }
      // this.$forceUpdate()
  }
  @Prop() propdata //领导批示选中的id
  @Prop() detailsdata //详情参数
  @Prop() onlyshow //只展示信息
  @Prop() config //没有转办和上移功能
  @Emit('leadercall')
  parentLeaderCall(infoId) {
    return infoId
  }
  private selectNode = { infoDisposeId: '', orderNum: '' }
  private propId
  private viewDialogCleanUp: boolean = false; // 抄清弹框标志
  private propsData: any = {} ; // 抄清弹框数据
  private flag: Boolean = false
  private templateName: string = ''
  private detailsLeaderSelect = {}  //详情(有事件id)
  private detailsLeaderSelectid: Array<any> = [] //领导批示选中id
  private tilteName: string = ''
  private roleLevel:boolean
  private role:object
  private editDisoseOrder = {
    //领导批示上移参数
    infoDisposeId: '', //infoDisposeId
    orderNum: '' //disposeOrder
  }
  private messageDom:any = null // message对象实体
  //转办按钮
  /**
   * Modify by chenzheyu  修改转办提示信息
   * @param el 
   * @param name
   *  
   */
  private transferClick(el: string, name: string) {
    if (this.detailsLeaderSelectid.length <= 0) {
      if(this.messageDom) {this.messageDom.close()}
      this.messageDom = this.$message({
        type:'warning',
        message: '勾选领导批示'
      })
      return false
    }
    this.flag = true
    this.templateName = el
    this.tilteName = name
  }

  //上移方法
  private sticky(index, row) {
    let orderNum = Number(row.disposeOrder) - 1
    this.editDisoseOrder.orderNum = orderNum + ''
    this.editDisoseOrder.infoDisposeId = row.infoDisposeId
    this.http.GempInfoBaseRequest.editDisoseOrderByDid(this.editDisoseOrder).then((res) => {
      if (res.status == 200) {
        if(this.messageDom) {
          this.messageDom.close()
        }
        this.messageDom = this.$message('上移成功')
        this.parentLeaderCall(this.propId)
      }
    })
  }

  // 抄清按钮
  private cleanUpClick(el: string, name: string) {
    if (this.detailsLeaderSelectid.length <= 0) {
      if(this.messageDom) {this.messageDom.close()}
      this.messageDom = this.$message({
        type:'warning',
        message: '勾选领导批示'
      })
      return false
    }
    this.cleanUpData(el);
    // this.viewDialogCleanUp = true
    // this.templateName = el
    // this.tilteName = name
  }

  // 得到抄清数据
  private cleanUpData(el) {
    let data: any = {}
    data.infoId = this.propId;
    //修改为选中数据抄清
    // data.instructionIds = this.propdata.map((item, index) => {
    //   return item.infoDisposeId
    // });

    data.instructionIds = this.detailsLeaderSelectid
    this.http.InfoDutyRequest.getCleanUpData(data).then((res) => {
      this.propsData = {
        infoId: this.propId,
        docUrl: res.data.onlyOfficeUrlRead
      }
      this.viewDialogCleanUp = true
      this.templateName = el
      this.tilteName = name
    })
  }

  created() {
    this.role = JSON.parse(sessionStorage.getItem("role"))
    this.roleLevel = this.role['isYjb']
    this.propId = this.$route.query.id

  }
  
  //选中领导批示触发事件
  hanlderChange(val) {
    if(this.config && this.config.defaultCheckAll){
      return;
    }
    this.detailsLeaderSelect = this.detailsdata //详情参数
     this.detailsLeaderSelectid = []
    val.forEach((element) => {
      this.detailsLeaderSelectid.push(element.infoDisposeId)  //领导批示选中的id
    })
    this.hanlderChangeCall(this.detailsLeaderSelectid);
  }

  @Emit('checkChange')
  //单选
  hanlderChangeCall(allSelectid){
 }

  //全选
  checkAll() {
    //多选表格全选或全不选
    this.$refs.leadershiptable['toggleAllSelection']();
    this.propdata.forEach((element) => {
      this.detailsLeaderSelectid.push(element.infoDisposeId)  //领导批示选中的id
    })
    console.log(this.detailsLeaderSelectid)
    this.hanlderChangeCall(this.detailsLeaderSelectid);
  }

  //关闭信息拟办、信息审核、领导批示等弹框的回调函数
  closeDialogCall(callInfo) {
    //关闭弹框
    this.flag = false
    //重新刷新当前页面数据
    this.parentLeaderCall(this.propId)
  }
  closeDialogCallCleanUp(callInfo) {
    //关闭弹框
    this.viewDialogCleanUp = false
    //重新刷新当前页面数据
    this.parentLeaderCall(this.propId)
  }

}
