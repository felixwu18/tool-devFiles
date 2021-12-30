import { ControllerBase, Inject, Prop, Watch } from 'prism-web'
import { downloadFuncs } from '../../../../assets/libs/commonUtils'

export class DocumentProcessedComController extends ControllerBase {
  constructor() {
    super()
  }

  private temp = {
    style: require('../../style/documentProcessedCom/documentProcessedcCom.less')
  }

  // 全屏状态
  private fullScreenStatus: boolean = false

  @Inject('http') http: any
  @Inject('store') store: any
  @Prop() handlelist //处理过程
  @Prop() reporttype //文件类型
  @Prop() dialogflag //弹出框参数
  @Prop({
    default: false
  }) basetemplate // 是否需要加载基础office模板
  @Prop() opendocbyurl
  @Watch('opendocbyurl') //监听简报地址
  wordUrl(val, oldVal) {
    if(val === oldVal) {
      return
    }

    if (val) {
      this.opendocurl = val
    } else {
      this.opendocurl = oldVal
    }
  }
  /*
   * Author by chengyun 监听弹出框的显示
   * Modify by chengyun
   */
  @Watch('dialogflag')
  dialogFlagf(val) {
    if (this.store.state.SYSTEMOFFICE != 'ONLYOFFICE') {
      if (val) {
        this.$refs.ntkotoolShow['style'].display = 'none'
        this.isShow = val
      } else {
        this.$refs.ntkotoolShow['style'].display = 'block'
        this.isShow = val
      }
    }
  }

  @Watch('dialogVisible')
  dialogFlag(val) {
    if (this.store.state.SYSTEMOFFICE != 'ONLYOFFICE') {
      if (val) {
        this.$refs.ntkotoolShow['style'].display = 'none'
        this.isShow = val
      } else {
        this.$refs.ntkotoolShow['style'].display = 'block'
        this.isShow = val
      }
    }
  }

  private activeName = 'first' //tab栏选中
  private activeNamex = 'first'
  private handleClick(val) { }
  //显示和隐藏控件
  private isShow: Boolean = false
  // 弹出框显示和关闭
  private dialogVisible: Boolean = false
  private opendocurl = ''
  //弹出框的内容
  private dialogContent = ''
  // 当前角色级别
  private roleLevel: boolean
  // 当前角色信息
  private role: string
  // 是否为onlyoffice
  private officeconfig: boolean
  // 获取基础模板数据
  private baseTemplate = {}
  created() {
    this.opendocurl = this.opendocbyurl
    this.officeconfig = this.store.state.SYSTEMOFFICE === 'ONLYOFFICE'
    if (this.basetemplate) {
      this.getOfficeTemplate()
    }
  }

  mounted() {
    console.log(this.handlelist)
  }

  wordUpload(e) { }

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

  /*
   * Author by chengyun 弹出框显示
   * Modify by chengyun
   */
  textDialog(data) {
    this.dialogVisible = true
    this.dialogContent = data
  }

  /*
   * Author by chengyun 文档保存
   * Modify by chengyun
   */
  saveReport() {
    this.$refs.iamsNtkotool['saveReportCom']()
  }

  processedcomSave() {
    this.$refs.iamsNtkotool['SaveToLocal']()
  }

  /**
   * onlyOffice根据type获取新增模板数据
   * Author by chenzheyu
   */
  getOfficeTemplate() {
    this.http.briefReportRequest.onlyOfficeType({ reportType: this.reporttype }).then(res => {
      if (res.status === 200) {
        this.opendocurl = res.data.onlyOfficeUrl
        this.store.dispatch('setMaterialId', res.data.materialId)
        this.$set(this, 'baseTemplate', res.data)
      }
    })
  }

  updateURl(url: string) {
    let index = url.indexOf('?')
    const lastStr = url.substring(index + 1)
    const firstStr = url.substring(0, index)
    const regExp = /edit$/ig

    if(regExp.test(firstStr)) {
      return firstStr.substring(0, firstStr.length - 4) + 'getFile?' + lastStr
    }
    return firstStr + 'File?' + lastStr
  }

  /**
   * Author by chenzheyu
   * 下载文档方法
   */
  downloadFile(url:string):void {
    let obj = {fileType:this.$parent['breifDownloadData'].reportType,issueInfo:this.$parent['breifDownloadData'].issueInfo}
    let param = Object.assign({},obj,{fileOuterPath:url})
    this.http.mainRequest.breifDownload(param).then(res => {
      downloadFuncs(res)
    })
  }
}
