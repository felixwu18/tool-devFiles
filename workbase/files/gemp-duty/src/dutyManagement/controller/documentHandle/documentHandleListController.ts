import { ControllerBase, Inject, Emit } from 'prism-web'

export class DocumentHandleController extends ControllerBase {
  private temp = {
    style: require('../../style/documentHandle/documentHandleList.less')
  }
  constructor() {
    super()
  }
  @Inject('http') http: any

  private checkPage: string = '1'
  private unreadnum: string = '0'
  private unreadShow: Boolean = false;
  private navselectcode: string = ''



  created() {
    if (this.$route.query.tab) {
      this.checkPage = this.$route.query.tab.toString()
    }
  }
  change() {
    if (this.$route.query.tab) {
    }
    // if (this.checkPage == '2' || this.checkPage == '3' ) {
    // // console.log(this.checkPage, 87777)
    //   this.unreadShow = false;
    // }
    // console.log(this.checkPage)
  }
  toread() {
    this.$confirm('此操作将把所有未读消息一键标为已读，是否继续?', "提示", {
      confirmButtonText: '确定',
      cancelButtonText: "取消",
      confirmButtonClass: 'confirmButtonClass',
      cancelButtonClass: "confirmButtonClass",
    }).then(() => { this.sureReport() })
      .catch(() => {
        this.$message({
          message: '已取消操作'
        })
      })
  }

  // 更新消息提醒的滚动条，弹框，铃铛
  updateMessageRemindData() {
    let data = {
      type: "updateMessageRemind",
    }
    setTimeout(() => {
      parent.postMessage(data, "*")
    }, 2000);
  }
  getGroupUnread() {
    this.http.DocumentHandleRequest.getGroupUnread().then(res => {
      if (res.status == 200) {
        // console.log(res.data[0])
        this.unreadnum = res.data[0]
        if (this.unreadnum != '0') {
          this.unreadShow = true;
        } else {
          this.unreadShow = false;
        }
        // console.log(this.unreadShow)
      }
    })
  }
  sureReport() {
    this.http.DocumentHandleRequest.getSureReport().then(res => {
      if (res.status == 200) {
        this.$message({
          type: 'success',
          message: '一键已读成功',
          duration: 1000
        })
        this.getGroupUnread();
        this.updateMessageRemindData();
        this.surechange()
      }
    })
  }

  @Emit('surechange')
  surechange() {
    // console.log(54444)
    this.navselectcode = '1'
    // return 
  }
}
