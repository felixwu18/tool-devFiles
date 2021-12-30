import { ControllerBase, Inject, Watch } from 'prism-web'
import { getRequestUrl } from '../../../assets/libs/commonUtils'


export class detailsManageController extends ControllerBase {
  constructor() {
    super()
  }
  @Inject("http") http: any
  private temp = {
    style: require('../style/addReportPa.less')
  }

  private flag: boolean = false;
   // 事发时间绑定数据
  //  private initTime = new Date()
  //  @Watch("initTime")
  //  timeChange(val) {
  //    this.ruleForm.dailyTime = val
  //  }
   private move(flag) {
    this.flag = !this.flag;
    if (flag) {
    }
  }
   
    // 时间选择器
  private start_Date = {
    disabledDate: time => {
      return time.getTime() > Date.now()
    }
  }

  private ruleForm: any = {
    dailyId:'',
    dailyTitle:'', //标题
    dailyTime: '', //时间
    dailyContent:'', //内容
    attachmentList: [] // 上传附件列表

  }
  private messageDom: any = null // message实体
  private  detailUrlinfoId :any


  private rules = {
    // dailyTitle: [{ required: true, message: '请输入事件标题', trigger: 'blur' }],
    // dailyTime: [{ required: true, message: '请输入上报时间', trigger: 'change' }],
    // dailyContent: [{ required: true, message: '请输入信息描述', trigger: 'blur' }],
  }
  getBack() {
    this.go('/reportPingan/reportPinganList')
  }

  created() {
    if (this.$route.query.id) {
      this.getData();
    } else {
      var url = window.location.href;
      let urlCode = getRequestUrl(url)
      if (urlCode && urlCode['detailUrlId']) {
      this.detailUrlinfoId = urlCode['detailUrlId']
      let publi = { dailyId: this.detailUrlinfoId }
      this.getData(publi)
      this.getTabUnread()
      }
    }
    this.updateMessageRemindData();
  }

  async getData(data?) {
    let id = this.$route.query.id
    let params = {
      dailyId: id,
    };
    await this.http.GempInfoBaseRequest.getReportPinganData(data?data:params).then(item => {
      this.$set(this, 'ruleForm', item.data);
      this.$emit('initUnreadOnNotifyeRport','')
    });
    // 进入详情重新请求tab未读数
    this.getTabUnread()
  }
  // tab组件展示未读数功能
  tabUnread(obj: object) {
    this.emit('unread', obj);
  }
  getTabUnread() {
    // this.http.ClickReportRequest.getUnread().then(res => {
    //   this.tabUnread({
    //     name: '上报平安',
    //     unreadCount: res.data[0],
    //   });
    // })
  }
  // 更新消息提醒的滚动条，弹框，铃铛
  updateMessageRemindData() {
    let data = {
      type:"updateMessageRemind",
    }
    setTimeout(() => {
      parent.postMessage(data,"*")
    }, 2000);
  }
}
