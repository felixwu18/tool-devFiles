import { ControllerBase, Inject, Prop } from 'prism-web'
import { timeFormat } from '../../../../assets/libs/commonUtils'

export class detailsKnowledgeController extends ControllerBase {
  constructor() {
    super()
  }
  @Inject("http") http: any
  @Prop() knowledgedata

  private showscroll: boolean = false
  private showtable: boolean = false

  private list = {
    "eventType": "",
    "keyWord": "",
    "nowPage": 1,
    "pageSize": 10
  }
  //外网时显示格式
  private datalist = []
  //内网时显示格式
  private propData = {
    pageSize: 10,
    total: 0,
    config: [
      {
        type: 'directive',
        label: '名称',
        emit: 'linkTo',
        width: '/',
        prop: 'knotitle'
      },
      {
        type: 'string',
        label: '时间',
        width: '180',
        prop: 'updatetime'
      }
    ],
    data: [

    ]
  }
  private temp = {
    style: require('../../style/infoManage/detailsKnowledge.less')
  }
  //获取知识列表信息
  private getHandleList() {
    this.$set(this.list, 'eventType', this.knowledgedata.eventType)
    this.http.GempInfoBaseRequest.getknowledge(this.list).then(res => {
      if (res.status == 200) {
        if (res.data.httpStatus == "2") {
          this.showtable = true
          this.showscroll = false
          this.propData.total = res.data.pageResult.total
          this.propData.pageSize = res.data.pageResult.pageSize
          let resourceData = res.data.pageResult.list.map((item) => {
            item.updatetime = timeFormat(item.updatetime)
            return item
          })
          this.$set(this.propData, 'data', resourceData)
        } else if (res.data.httpStatus == "1") {
          this.showscroll = true
          this.showtable = false
          this.datalist = res.data.pageResult.list.map((item) => {
            item.updatetime = timeFormat(item.updatetime)
            return item
          })
        }
      }
    })
  }
  // 列表按钮点击响应
  tablecallback(data) {
    this[data.type](data)
  }
  //搜索功能
  /**
   * Modify by chenzheyu  相关知识检索传空查询信息关联知识
   */
  searchHandle() {
    this.getHandleList()
  }
  //翻页功能
  handlePageChange(data) {
    this.list['nowPage'] = data.rowVal
    // debugger
    this.getHandleList()
  }

   /**
   * @Author: chengyun
   * @Descripttion: 点击跳转到相关知识
   * @param 
   * {
   *   type:判断标识,
   *   infotype: 编号
   *   infoId: 详情id
   *   urlList: 详情页面的列表路由
   *   urlDetails: 详情页面路由
   *   memuId: 菜单id
   * }
   */
  linkTo(val) {
    let data = {
      type:"linkTo",
      infotype: 3,
      infoId: val.rowVal.knoid || '',
      urlList:'/gemp-knowledge/#/knowledge/caseList',
      urlDetails:'/gemp-knowledge/#/knowledge/caseDetails',
      memuId:"2c9287db6ed0e64b016ed3bea6660040"    
    }
    window.parent.postMessage(data,"*")
  }
}
