import { ControllerBase } from 'prism-web'
//值班要情列表
export class ShortLetterListController extends ControllerBase {

  private temp = {
    style: require('../../style/shortLetter/shortLetterList.less')
  }

  constructor() {
    super()
  }

  //向弹出框配置参数
  private dialogConfig: Object = {
    viewDialog: false, //弹框是否显示
    templateName: '', //弹框组件名
    tilteName: '' //标题头
  }
  //向弹出框传递参数
  private propsData: Object = {}
  //时间搜索的返回值
  private search_time = []
  private checkPage ="1"
  //机构树的默认值
  private defaultchecked = '378420e3b12d4b3784525abbc5431d3c'

  private fakeData = [
    {
      reportTitle: '我是大帅哥',
      starttime: '2019-9-26',
      endtime: '2019-9-26',
      work: '看星星',
      handover: '继续看星星'
    },
    {
      reportTitle: '我是大帅哥',
      starttime: '2019-9-26',
      endtime: '2019-9-26',
      work: '看星星',
      handover: '继续看星星'
    },
    {
      reportTitle: '我是大帅哥',
      starttime: '2019-9-26',
      endtime: '2019-9-26',
      work: '看星星',
      handover: '继续看星星'
    },
  ]

  private fakeData2= [
    {
      reportTitle: '我是大帅哥',
      starttime: '2019-9-26',
      endtime: '2019-9-26',
      work: '看星星',
      handover: '继续看星星'
    },
    {
      reportTitle: '我是大帅哥',
      starttime: '2019-9-26',
      endtime: '2019-9-26',
      work: '看星星',
      handover: '继续看星星'
    },
    {
      reportTitle: '我是大帅哥',
      starttime: '2019-9-26',
      endtime: '2019-9-26',
      work: '看星星',
      handover: '继续看星星'
    },
    {
      reportTitle: '我是大帅哥',
      starttime: '2019-9-26',
      endtime: '2019-9-26',
      work: '看星星',
      handover: '继续看星星'
    },
    {
      reportTitle: '我是大帅哥',
      starttime: '2019-9-26',
      endtime: '2019-9-26',
      work: '看星星',
      handover: '继续看星星'
    },
    {
      reportTitle: '我是大帅哥',
      starttime: '2019-9-26',
      endtime: '2019-9-26',
      work: '看星星',
      handover: '继续看星星'
    },
    {
      reportTitle: '我是大帅哥',
      starttime: '2019-9-26',
      endtime: '2019-9-26',
      work: '看星星',
      handover: '继续看星星'
    },
    {
      reportTitle: '我是大帅哥',
      starttime: '2019-9-26',
      endtime: '2019-9-26',
      work: '看星星',
      handover: '继续看星星'
    }
  ]
  //查看所有传参(传空) 查看未删传参(传0)
  private searchData: Object = {
    deleteFlag: null,
    startTime: '',
    endTime: '',
    keyWord: '',
    listOrder: {
      prop: '',
      sort: ''
    },
    nowPage: 1,
    pageSize: 8
  }
  //列表添加操作参数
  private btnGroup: object = {
    edit: { name: '编辑', type: 'warning', emit: 'editDialog', expression: true },
    delete: { name: '删除', type: 'danger', emit: 'deleteDialog', expression: true }
  }
  created() {
    this.getListData('')
  }

  /* author by chengyun 数据请求
   *  Modify by
   */
  getListData(val) {

  }

}
