import { ControllerBase, Inject, Prop } from 'prism-web'
import { timeFormat } from '../../../../assets/libs/commonUtils'

export class detailsLawController extends ControllerBase {
  constructor() {
    super()
  }

  @Inject("http") http: any
  @Prop() lawdata

  private list = {
    "eventType": "",//信息类型代码
    "keyWord": "",
    "nowPage": 1,
    "pageSize": 10,
  }
  private propData = {
    pageSize: 10,
    total: 0,
    config: [
      {
        type: 'directive',
        label: '信息标题',
        emit: 'linkTo',
        width: '/',
        prop: 'knotitle'
      },
      {
        type: 'string',
        label: '接报时间',
        width: '180',
        prop: 'updatetime'
      }
    ],
    data: [

    ]
  }
  private getHandleList() {
    this.$set(this.list,'eventType',this.lawdata.eventType)
    
    this.http.GempInfoBaseRequest.lawsReg(this.list).then((res) => {
      if (res.status == 200) {
        this.propData.total = res.data.total
        this.propData.pageSize = res.data.pageSize
        let resourceData = res.data.list.map((item) => {
          item.updatetime = timeFormat(item.updatetime)
            return item
        })
        this.$set(this.propData, 'data', resourceData)
      }
    })
  }
  // 列表按钮点击响应
  tablecallback(data) {
    this[data.type](data)
  }
  private temp = {
    style: require('../../style/infoManage/detailsLaw.less')
  }
  //搜索功能
  /**
   * Modify by chenzheyu  法律法规检索传空查询信息关联法规
   */
  searchHandle(){
    this.getHandleList()
  }
  //排序功能
  sort(data){
    this.$set(this.list,'listOrder',data.rowVal)
  }
  //翻页功能
  handlePageChange(data) {
    this.list['nowPage'] = data.rowVal
    // debugger
    this.getHandleList()
  }

  /**
   * @Author: chengyun
   * @Descripttion: 点击跳转到法律法规
   * @param 
   * {
   *   type:判断标识,
   *   infotype: 编号
   *   infoId: 详情id
   *   urlList: 详情页面的列表路由
   *   urlDetails: 详情页面路由
   *   memuId: 菜单id
   * }
   * @return: 
   */
  linkTo(val) {
    let data = {
      type:"linkTo",
      infotype: 2,
      infoId: val.rowVal.knoid || '',
      urlList:'/gemp-knowledge/#/knowledge/lawsList',
      urlDetails:'/gemp-knowledge/#/knowledge/lawsDetails',
      memuId:"2c9287db6ec9d765016ecb1c40220229"    
    }
    window.parent.postMessage(data,"*")
  }
}
