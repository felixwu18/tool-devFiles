import { ControllerBase,Inject } from 'prism-web'

export class InboxDetailController extends ControllerBase {
  private temp = {
    style: require('../../style/shortLetter/inboxDetail.less')
  }
  constructor() {
    super()
  }

  @Inject('http') http: any

  private formdata = {
    data: {
      reportTitle: '我是大帅哥',
      date: '2019-04-30 08:04:22',
      telephone: '18900009999',
      newname:'法网法网发'
    },
    config: [
      {
        label: ' * 基本信息：',
        span: [24],
        dataProp: [
          [
            {
              label: '回复人：',
              prop: 'reportTitle',
              type: 'text'
            },
            {
              label: '回复时间：',
              type: 'text',
              prop: 'content'
            },
            {
              label: '手机号码：',
              type: 'text',
              prop: 'telephone'
            },
            {
              label: '回复内容：',
              type: 'textarea',
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
    debugger
  }



}
