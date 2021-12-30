import { ControllerBase, Inject, Prop } from 'prism-web'

export class detailsPlanController extends ControllerBase {
  constructor() {
    super()
  }
  
  @Inject('http') http: any

  @Prop() plandata
  //请求带入参数
  private listParams={
      eventType:'',
      keyWord:'',
      nowPage:1,
      pageSize:10
  }

   private propData = {
    pageSize: 0,
    total:0,
    config: [
      {
        type: 'directive',
        label: '名称',
        emit: 'linkTo',
        width: '/',
        prop: 'planName'
      },
      {
        type: 'string',
        label: '时间',
        width: '180',
        prop: 'updateTime'
      }
    ],
    data: [
      
    ]
  }
  private temp = {
    style: require('../../style/infoManage/detailsPlan.less')
  }
  
   // 列表按钮点击响应
   tablecallback(data){
    this[data.type](data)
  }
 
   created(){
  // this.getDetailsPlanList()
  }

 //获取预案列表，赋值给propData.data
 getDetailsPlanList(){
  // this.$set(this.listParams,'keyWord',this.plandata.infoTypeName)
  this.$set(this.listParams,'eventType',this.plandata.eventType)
    this.http.DetailOperationsRequest.detailsPlan(this.listParams).then((res) => {
      if (res.status == 200) {
        this.propData.total = res.data.total
        this.propData.pageSize = res.data.pageSize
        let resourceData = res.data.list
        this.$set(this.propData, 'data', resourceData)
      }
    })
 } 

 //排序
sort(data){
this.$set(this.listParams,'listOrder',data.rowVal)
}
//搜索功能
/**
 * Modify by chenzheyu  应急预案检索传空查询信息关联预案
 */
searchHandle(){
    this.getDetailsPlanList()
}
//翻页功能
  handlePageChange(data) {
    this.listParams['nowPage'] = data.rowVal
    // debugger
    this.getDetailsPlanList()
  }

   /**
   * @Author: chengyun
   * @Descripttion: 点击跳转到应急预案页面
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
      infotype: 1,
      infoId: val.rowVal.planId || '',
      urlList:'/gemp-plan/#/planManagement/planList',
      urlDetails:'/gemp-plan/#/planManagement/planDetail',
      memuId:"2c9287db6ec9d765016ecb143e4b0227"    
    }
    window.parent.postMessage(data,"*")
  }
}
