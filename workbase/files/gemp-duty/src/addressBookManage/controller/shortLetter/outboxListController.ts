import { ControllerBase,Inject } from 'prism-web'

export class OutboxListController extends ControllerBase {
  private temp = {
    style: require('../../style/shortLetter/outboxList.less')
  }
  constructor() {
    super()
  }

  @Inject('http') http: any

  private workStatus = true;//系统的状态
  private showSearch: Boolean = false
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

  //列表添加操作参数
  private btnGroup: object = {
    edit: { name: '删除', type: 'warning', emit: 'deleteDialog', expression: true },
  }

  private defaultchecked = ''
  private parentprop = {name:"", data:""}
  private propData = {
    isCheck: false,
    pageSize: 10,
    total: 0,
    config: [
      {
        type: 'link',
        label: '公文标题',
        basehref: '/addressBookManage/outboxDetail',
        passProp: 'infoId',
        width: '/',
        prop: 'infoTitle',

        // type: 'string',
        // label: '名称',
        // width: '/',
        // prop: 'infoTitle',
        // emit: 'boxDetail'
      },
      {
        type: 'string',
        label: '下发单位',
        prop: 'infoTypeName'
      },
      {
        type: 'string',
        label: '公文类型',
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
      {
        type: 'string',
        label: '公文期号',
        prop: 'orgName'
      },
      {
        type: 'button',
        label: '操作',
        width: '/',
        prop: 'operate'
      }
    ],
    data: [
      {
        infoTitle:'我是无敌帅',
        infoTypeName:'辰安科技',
        reportDate:'上级',
        orgName:"101",
        people:"哈哈",
        newdate:"2019-9-27",
        status:"已接受"
      },
      {
        infoTitle:'我是无敌帅',
        infoTypeName:'辰安科技',
        reportDate:'上级',
        orgName:"101",
        people:"哈哈",
        newdate:"2019-9-27",
        status:"已接受"
      },
      {
        infoTitle:'我是无敌帅',
        infoTypeName:'辰安科技',
        reportDate:'上级',
        orgName:"101",
        people:"哈哈",
        newdate:"2019-9-27",
        status:"已接受"
      },
      {
        infoTitle:'我是无敌帅',
        infoTypeName:'辰安科技',
        reportDate:'上级',
        orgName:"101",
        people:"哈哈",
        newdate:"2019-9-27",
        status:"已接受"
      },
      {
        infoTitle:'我是无敌帅',
        infoTypeName:'辰安科技',
        reportDate:'上级',
        orgName:"101",
        people:"哈哈",
        newdate:"2019-9-27",
        status:"已接受"
      }

    ]
  }


  created() {
    this.getListData()
  }


  // 获取列表数据
  getListData() {
    let data = this.propData.data.map((item) => {
      item['operate'] = this.btnGroup
      return item
    })
    this.$set(this.propData, 'data', data)
    this.propData.total = this.propData.data.length+1

  }
  getListDataAll(){
    
  }
  /* author by chengyun 机构的回调
   *  Modify by
   */
  getOrg(val) {
    this.$set(this.searchData, 'orgCode', val)
  }

  /* author by chengyun 列表所有按钮点击响应
   *  Modify by
   */
  tablecallback(data) {
    this[data.type](data)
  }


  /* author by chengyun 翻页功能
   *  Modify by
   */
  handlePageChange(data) {
    this.searchData['nowPage'] = data.rowVal
    this.getListData()
  }

  /* author by chengyun 新增按钮
   *  Modify by
   */
  boxAdd(){
    this.$router.push({ path: '/addressBookManage/outboxAdd', query: { title: '新增下级公文' } })
  }

    /* author by chengyun 查看跳转
   *  Modify by
   */
  boxDetail() {
    // this.$router.push({ path: '/dutyManagement/lowerHairDocumentDetail', query: { id: 'lower22222', title: '查看下级公文' } })
  }

  /* author by chengyun 删除
   *  Modify by
   */
  deleteDialog(){
    this.$message('操作了删除')

  }

  getListCode(val){
    debugger
  }



}
