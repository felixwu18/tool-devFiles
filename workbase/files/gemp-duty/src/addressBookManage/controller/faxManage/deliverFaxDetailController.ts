import { ControllerBase,Inject } from 'prism-web'
import { showLoading, hideLoading } from '../../../../service/Loading/loading'
import { timeFormat, downloadFuncs } from '../../../../assets/libs/commonUtils'

export class DeliverFaxDetailController extends ControllerBase {
  private temp = {
    style: require('../../style/faxManage/deliverFaxDetail.less')
  }
  constructor() {
    super()
  }

  @Inject('http') http: any

  private formdata = {
    data: {
      reportTitle: '我是大帅哥',
      content: '看星星',
      handover: '继续看星星',
      contentname:'刘国文',
      newname:'xxxx',
      fujian:''
    },
    config: [
      {
        label: ' * 基本信息：',
        span: [24],
        dataProp: [
          [
            {
              label: '传真标题：',
              prop: 'reportTitle',
              type: 'text'
            },
            {
              label: '传真号：',
              type: 'textarea',
              prop: 'content'
            },
            {
              label: '传真部门：',
              type: 'text',
              prop: 'contentname'
            },
            {
              label: '传真时间：',
              type: 'text',
              prop: 'newname'
            },
            {
              label: '附件',
              type: 'picture',
              prop: 'picture'
            }
         ]
        ]
      }
    ]
  }

  private propSedata = {  // 已发
    isCheck: false,
    pageSize: 10,
    total: 0,
    config: [
      {
        type: 'string',
        label: '所属单位',
        prop: 'infoTypeName'
      },
      {
        type: 'string',
        label: '传真号',
        prop: 'people'
      },
      {
        type: 'string',
        label: '回执时间',
        prop: 'newdate'
      },
      {
        type: 'string',
        label: '回执状态',
        prop: 'orgName'
      }
    ],
    data: [
      {
        infoTitle: '传真测试',
        infoTypeName: '辰安科技',
        reportDate: '传真测试文档.docx',
        people: '87160925',
        newdate: '2019-9-27',
        orgName: '0/1',
        status: '删除'
      },
      {
        infoTitle: '传真测试',
        infoTypeName: '辰安科技',
        reportDate: '传真测试文档.docx',
        people: '87160925',
        newdate: '2019-9-27',
        orgName: '0/1',
        status: '删除'
      },
      {
        infoTitle: '传真测试',
        infoTypeName: '辰安科技',
        reportDate: '传真测试文档.docx',
        people: '87160925',
        newdate: '2019-9-27',
        orgName: '0/1',
        status: '删除'
      },
      {
        infoTitle: '传真测试',
        infoTypeName: '辰安科技',
        reportDate: '传真测试文档.docx',
        people: '87160925',
        newdate: '2019-9-27',
        orgName: '0/1',
        status: '删除'
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

  /* author by chengyun 列表所有按钮点击响应
   *  Modify by
   */
  tablecallback(data) {
    this[data.type](data);
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
