import { ControllerBase, Inject } from 'prism-web'
import { getRequestUrl } from '../../../../assets/libs/commonUtils'

export class detailsProcessController extends ControllerBase {
  constructor() {
    super()
  }
  private infoId: string = ''

   // 全屏状态
  private fullScreenStatus: boolean = false

  @Inject('http') http: any
  @Inject('timeFormat') timeFormat: any
  // 值班信息文档地址
  private docUrl: string = ''
  private viewDialogDuty:Boolean = false
  created() {
    if (this.$route.query.id) {
      this.infoId = this.$route.query.id.toString()
    }

    // 从提醒信息跳转的时候
    var url = window.location.href;
    let urlCode = getRequestUrl(url)
    if (urlCode && urlCode['detailUrlId']) {
      this.infoId = urlCode['detailUrlId']
    }

    this.onNotify()
    this.getHandleList(this.infoId)
    this.on('changeInfoId',(data=>{
      this.infoId = data[0]
      this.getHandleList(this.infoId)
    }))
  }

  public handleFullScreen(){
    const el: any = document.getElementById("docUrl")
    // 判断是否已经是全屏
    // 如果是全屏，退出
    if (this.fullScreenStatus) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).webkitCancelFullScreen) {
          (document as any).webkitCancelFullScreen();
        } else if ((document as any).mozCancelFullScreen) {
          (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
        console.log('已还原！');
    } else {    // 否则，进入全屏
        if (el.requestFullscreen) {
          el.requestFullscreen();
        } else if (el.webkitRequestFullScreen) {
          el.webkitRequestFullScreen();
        } else if (el.mozRequestFullScreen) {
          el.mozRequestFullScreen();
        } else if (el.msRequestFullscreen) {
            // IE11
            el.msRequestFullscreen();
        }
        console.log('已全屏！');
    }
    // 改变当前全屏状态
    this.fullScreenStatus = !this.fullScreenStatus;
  }

  private getHandleList(id) {
    let infoParams = { infoId: id }
    this.http.GempInfoBaseRequest.getGempInfoProgressList(infoParams).then((res) => {
      this.list = res.data.map(val => {
        val.remark = val.remark.replace(/,$/ig, '')
        return val
      })
    })
  }
  private list: Array<any> = []
  private temp = {
    style: require('../../style/infoManage/detailsProcess.less')
  }

  //监听弹出框成功后刷新数据
  onNotify() {
    this.on('setprocess', function (data) {
      this.getHandleList(this.infoId)
    })
  }

  async getDutyInfo(val) {
    console.log(val);
    
    // 获取值班信息文档
    let param = {
      infoId: this.infoId,
      orgCode: val.operOrgCode||'',
      progressId:val.progressId||''
    }
    let res = await this.http.GempInfoBaseRequest.getDoc(param)
      if (res.status == 200) {
        this.docUrl = res.data
      } else {
        this.$message(res.msg)
      }
      if(res){
        this.viewDialogDuty = true
      }
  }
  handleCancel(){
    this.viewDialogDuty = false
  }
}
