import { ControllerBase,Inject } from 'prism-web'
import { showLoading, hideLoading } from '../../../../service/Loading/loading'
import { timeFormat, downloadFuncs } from '../../../../assets/libs/commonUtils'

export class ControlFaxDetailController extends ControllerBase {
  private temp = {
    style: require('../../style/faxManage/controlFaxDetail.less')
  }
  constructor() {
    super()
  }

  @Inject('http') http: any

  private formdata = {
    data: {
      reportTitle: '我是大帅哥',
      content: '2019-08-09',
      contentname:'刘国文',
      newname:'87160925'
    },
    config: [
      {
        span: [24],
        dataProp: [
          [
            {
              label: '传真标题：',
              prop: 'reportTitle',
              type: 'text'
            },
            {
              label: '传真时间：',
              type: 'text',
              prop: 'content'
            },
            {
              label: '发件单位：',
              type: 'text',
              prop: 'contentname'
            },
            {
              label: '传真号：',
              type: 'text',
              prop: 'newname'
            }
         ]
        ]
      }
    ]
  }

  created() {
    this.getListData()
  }


  // 获取列表数据
  getListData() {


  }

  getListCode(val){
  }

  //下载模板
  downloadFiles(e) {
    e.preventDefault()
    // let data = encodeURI(this.config['fileName'])
    let data = encodeURI('附件名称')
    if (encodeURI("物资与装备导入模板.xlsx") == data) {
      this.http.Resource.MaterialDownloadFlie(data).then((res) => {
        if (res.url) {
          downloadFuncs(res)
        } else {
          hideLoading()
        }
      })
    } else {
      this.http.Resource.ResourceDownloadFlie(data).then((res) => {
        if (res.url) {
          downloadFuncs(res)
        }else {
          hideLoading()
        }
      })
    }
  }


}
