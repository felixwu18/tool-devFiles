import { ControllerBase, Inject, Prop } from 'prism-web'
import { timeFormat } from '../../../../assets/libs/commonUtils'
import { getRequestUrl } from '../../../../assets/libs/commonUtils'


export class DutyInformationDetailController extends ControllerBase {
  private temp = {
    style: require('../../style/documentHandle/dutyInfomationDetail.less')
  }
  constructor() {
    super()
  }

  @Inject('http') http: any

  //向弹出框传递参数
  private propsData: Object = {}
  //页面的信息详情id
  private  detailUrlinfoId :any
  private titleData = '其他公文详情'
  private tab: string
  //处理过程参数
  private handlelist = []
  private dutyDetail = {}
  private activeNamex = 'first' //tab栏选中
  //判断是否有数据
  private editId: String
  private processid = ''
  //向弹出框配置参数
  private dialogConfig: Object = {
    viewDialog: false, //弹框是否显示
    templateName: '', //弹框组件名
    tilteName: '' //标题头
  }
  //请求参数
  private formdata={
    data:[]
  }
  created() {
    if (this.$route.query.id) {
      this.editId = this.$route.query.id.toString()
      this.getListData()
      // this.updateMessageRemindData()
    } else {
      var url = window.location.href;
      let urlCode = getRequestUrl(url)
      if (urlCode && urlCode['detailUrlId']) {
        this.detailUrlinfoId = urlCode['detailUrlId'];
        // this.activeId = this.detailUrlinfoId
        // console.log(this.detailUrlinfoId, 33338888)
        let publi = { publicId: this.detailUrlinfoId }
        this.http.DocumentHandleRequest.getdutyInformationDetail(publi).then(res => {
        if (res.status == 200) {
          this.formdata['data'] = res.data
          this.handlelist = [res.data]
          // console.log(this.handlelist);
          this.formdata['data']['startTime'] = timeFormat(this.formdata['data']['startTime'])
          this.formdata['data']['endTime'] = timeFormat(this.formdata['data']['endTime'])
          // this.updateMessageRemindData()
        }
      });
      }
    }
  }
  //返回按钮 by xinglu
  goback() {
    if (this.$route.query.tab) {
      this.tab = this.$route.query.tab.toString()
      this.$router.push(`/dutyManagement/documentHandle?tab=${this.tab}`)
    } else {
      // this.$router.go(-1)
      this.$router.push(`/dutyManagement/documentHandle?tab=1`)
    }
  }
  // 获取列表数据 by xinglu
  getListData() {
    if (this.editId) {
      let publi = { publicId: this.$route.query.id }
      this.http.DocumentHandleRequest.getdutyInformationDetail(publi).then(res => {
        if (res.status == 200) {
          this.formdata['data'] = res.data
          this.handlelist = [res.data]
          // console.log(this.handlelist);

          this.formdata['data']['startTime'] = timeFormat(this.formdata['data']['startTime'])
          this.formdata['data']['endTime'] = timeFormat(this.formdata['data']['endTime'])
        }
      });
    }
  }

  /* author by chengyun 关闭弹框
  *  Modify by
  */
  closeDialogCall() {
    //关闭弹框
    this.dialogConfig['viewDialog'] = false
  }
  /* author by xinglu tab栏切换事件
  *  Modify by
  */
  handleClick(val) {

  }
  /* author by chengyun 保存草稿
  *  Modify by
  */
  addReportInfo() {

  }
  //分享
  private shareInformatiom(el: string, name: string) {
    this.dialogConfig['viewDialog'] = true
    let data = {
      viewDialog: true,
      templateName: el,
      tilteName: name
    }
    this.$set(this, 'dialogConfig', data)
  }
   // 更新消息提醒的滚动条，弹框，铃铛
  // updateMessageRemindData() {
  //  let data = {
  //    type:"updateMessageRemind",
  //  }
  //  setTimeout(() => {
  //     parent.postMessage(data,"*")
  //   }, 2000);
  // }
}
