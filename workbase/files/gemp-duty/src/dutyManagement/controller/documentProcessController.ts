import { ControllerBase, Inject, Prop } from 'prism-web'

export class DocumentProcessController extends ControllerBase {
  private temp = {
    style: require('../style/documentProcess.less')
  }
  constructor() {
    super()

  }

  @Prop() processid
  //处理过程参数
  private handlelist = []

  private activeNamex = 'first' //tab栏选中

  //请求参数
  private listParams = {
    gempBriefInstructDTOs: [
      {
        instructContent: '', //	批示内容
        instructTitle: '' //批示标题
      }
    ],
    id: '', //公文Id
    infoId: '', //事件id
    reportContent: '', //内容
    reportTitle: '' //标题
  }
  @Inject('http') http: any

  created() {
    this.getListData()
  }

  // 获取列表数据
  getListData() {}
  handleClick(val) {

  }
}
