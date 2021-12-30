import { ControllerBase,Inject } from 'prism-web'

export class OutboxDetailController extends ControllerBase {
  private temp = {
    style: require('../../style/shortLetter/outboxDetail.less')
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
      newname:'xxxx'
    },
    config: [
      {
        label: ' * 基本信息：',
        span: [24],
        dataProp: [
          [
            {
              label: '标题：',
              prop: 'reportTitle',
              type: 'text'
            },
            {
              label: '内容：',
              type: 'textarea',
              prop: 'content'
            },
            {
              label: '接收人：',
              type: 'text',
              prop: 'contentname'
            },
            {
              label: '创建人：',
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
    debugger
  }



}
