import { ControllerBase, Inject, Prop } from 'prism-web'
import { timeFormat } from '../../../../assets/libs/commonUtils'

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

  private titleData = '值班信息详情'
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
  private formdata: Object = {
    data: {
      "content": "",//工作事项
      "documentProgressStatus": "",//公文状态 未处理-1|已接收-2|已退回-3|草稿-4
      "documentTitle": "",//公文标题
      "dutyPeopleId": "",//值班值班人员id
      "dutyPeopleName": "",//值班值班人员名称
      "endTime": "",//值班结束时间
      "handover": "",//交办事项
      "receiveName": "",//接收人名称
      "receiveUnitCode": "",//接受发送单位code
      "receiveUnitName": "",//公文接收单位名称
      "recevierId": "",//接收人id
      "startTime": "",//值班开始时间
      "upDowmType": "1",//公文操作状态 公文操作类型 公文上报-1|公文下发-2
      "type": "1"
    },
    config: [
      {
        span: [24],
        dataProp: [
          [
            {
              label: '标题：',
              prop: 'documentTitle',
              type: 'text',
            },
            {
              label: '值班人员：',
              prop: 'dutyPeopleName',
              type: 'text',
            },
            {
              label: '值班开始时间：',
              prop: 'startTime',
              type: 'text',
              requireType: ['required']
            },
            {
              label: '值班结束时间：',
              prop: 'endTime',
              type: 'text',
              requireType: ['required']
            },
            {
              label: '工作事项：',
              prop: 'content',
              type: 'textarea',
              requireType: ['required']
            },
            {
              label: '交办事项：',
              prop: 'handover',
              type: 'textarea',
              requireType: ['required']
            },
          ]
        ]
      }
    ]
  };
  created() {
    if (this.$route.query.id) {
      this.editId = this.$route.query.id.toString()
      this.getListData()
    }
  }
  //返回按钮 by xinglu
  goback() {
    if (this.$route.query.tab) {
      this.tab = this.$route.query.tab.toString()
      this.$router.push(`/dutyManagement/documentHandle?tab=${this.tab}`)
    } else {
      this.$router.go(-1)
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
          this.formdata['data'].startTime = timeFormat(this.formdata['data'].startTime)
          this.formdata['data'].endTime = timeFormat(this.formdata['data'].endTime)
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

}
