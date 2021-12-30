import { ControllerBase,Inject } from 'prism-web'

export class DraftDocumentListController extends ControllerBase {
//   private temp = {
//     style: require('../../../style/documentHandle/lowerHairDocument/lowerHairDocumentList.less')
//   }
  constructor() {
    super()
  }

  @Inject('http') http: any

  private showSearch: Boolean = false
  private defaultchecked = '9e55c0339c4c46aba807f7094ac8ea67'
  // 默认显示查看未读
  private readSign:string = '查看未读'
  // 列表时间查询参数
  private search_time: Array<any> = []
  // 列表查询参数
  private searchData:object = {
    eventType: [],
    infoStatus: '',
    isReadCode: '',
    keyWord: '',
    nowPage: 1,
    orgCode: [],
    pageSize: 10,
    reportDateStrEnd: '',
    reportDateStrStart: '',
    listOrder:{}
  }

  // //列表添加操作参数
  // private btnGroup: object = {
  //   edit: { name: '接受', type: 'warning', emit: 'acceptDialog', expression: true },
  //   delete: { name: '退回', type: 'danger', emit: 'returnDialog', expression: true }
  // }

  private propData = {
    isCheck: false,
    pageSize: 10,
    total: 0,
    config: [
      {
        // type: 'link',
        // label: '公文标题',
        // basehref: '/dutyManagement/documentHandleDetail',
        // passProp: 'infoId',
        // width: '/',
        // prop: 'infoTitle',

        type: 'string',
        label: '公文标题',
        width: '/',
        prop: 'infoTitle',
        emit: 'drafDetail',
        color: '#66b1ff'
      },
      {
        type: 'string',
        label: '公文类型',
        prop: 'infoTypeName'
      },
      {
        type: 'string',
        label: '公文期号',
        prop: 'reportDate'
      },
      {
        type: 'string',
        label: '创建人',
        prop: 'people'
      },
      {
        type: 'string',
        label: '更新时间',
        prop: 'newdate'
      },
   
      // {
      //   type: 'button',
      //   label: '操作',
      //   width: '/',
      //   prop: 'operate'
      // }
    ],
    // tag展示列表
    tagArray:{'0':{name:'待签',type:'danger'},'1':{name:'待办',type:'primary'},'9':{name:'退回',type:'info'}},
    data: []
  }
  created() {
    this.getListData()
  }

  // 获取列表数据
  getListData() {
    // let data = this.propData.data.map((item) => {
    //   item['operate'] = this.btnGroup
    //   return item
    // })
    // this.$set(this.propData, 'data', data)
    this.propData.total = this.propData.data.length+1

  } 
  /* author by huihui 列表所有按钮点击响应
   *  Modify by
   */
  tablecallback(data) {
    this[data.type](data)
  }


  /* author by huihui 翻页功能
   *  Modify by
   */
  handlePageChange(data) {
    this.searchData['nowPage'] = data.rowVal
    this.getListData()
  }
  /* author by chengyun 查看跳转
   *  Modify by
   */
  drafDetail() {
    this.$router.push({ path: '/dutyManagement/draftDocumentDetail',query: { id: 'report22222', title: '查看草稿箱' }})
  }

}
