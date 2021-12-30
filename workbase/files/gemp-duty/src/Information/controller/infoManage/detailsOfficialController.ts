  import { ControllerBase, Inject, Prop } from 'prism-web'

  export class detailsOfficialController extends ControllerBase {
    constructor() {
      super()
    }

    @Inject('http') http: any
    @Inject('store') store:any
    @Prop() detailsoffical
    //请求带入参数
    private listParams={
        infoId: "",
        keyWord: "",
        listOrder: {
          prop: "",
          sort: ""
        },
        nowPage:1,
        pageSize:10
    }

     private propData = {
      pageSize: 0,
      total:0,
      config: [
        {
          type: 'string',
          label: '名称',
          width: '/',
          prop: 'reportTitle',
          emit: 'linkTo',
          color: '#66b1ff'
        },
        {
          type: 'string',
          label: '类型',
          width: '55',
          prop: 'reportTypeName'
        },{
          type: 'string',
          label: '更新时间',
          width: '/',
          prop: 'updateTime'
        }
      ],
      data: []
    }
    private temp = {
      style: require('../../style/infoManage/detailsPlan.less')
    }

    created() {
      this.store.dispatch('infomanage/setDetailoffice',this.listParams)
    }

  /**
   * Author by chenzheyu 列表按钮点击响应
   * @param data
   */
   tablecallback(data){
    this[data.type](data)
  }

   /**
    * Author by chenzheyu  获取相关公文列表，赋值给propData.data
    *  */
   getRelativeBriefList(){
      let params = this.store.getters['infomanage/getDetailoffice']
      this.http.DetailOperationsRequest.relativeBrief(Object.assign({},{...params},{infoId:this.detailsoffical.infoId})).then((res) => {
        if (res.status == 200) {
          this.propData.total = res.data.total
          this.propData.pageSize = res.data.pageSize
          let resourceData = res.data.list
          this.$set(this.propData, 'data', resourceData)
        }
      })
   }

  //搜索功能
  /**
   * Modify by chenzheyu  应急预案检索传空查询信息关联预案
   */
  searchHandle(){
      this.listParams['nowPage'] = 1
      this.store.dispatch('infomanage/setDetailoffice',this.listParams)
      this.getRelativeBriefList()
  }

  /**
   * Author by chenzheyu 翻页功能
   * @param data
   */
    handlePageChange(data) {
      this.listParams['nowPage'] = data.rowVal
      this.store.dispatch('infomanage/setDetailoffice',{nowPage: data.rowVal})
      this.getRelativeBriefList()
    }

  /**
   *Author by chenzheyu 点击跳转到相关公文
   */
  linkTo(val) {
    // /briefReport/specialReportDetail  SPECIAL 专报   /briefReport/wallBulletinDetail  BRIEF 快报  /briefReport/reportDetail REPORT 报告  /briefReport/textFileDetail TEXT 文本
    switch(val.rowVal.reportType){
      case "SPECIAL":
        this.$router.push({path:'/briefReport/specialReportDetail',query:{id:val.rowVal.id}})
        break
      case "BRIEF":
        this.$router.push({path:"/briefReport/wallBulletinDetail",query:{id:val.rowVal.id}})
        break
      case "REPORT":
        this.$router.push({path:"/briefReport/reportDetail",query:{id:val.rowVal.id}})
        break
      case "TEXT":
        this.$router.push({path:"/briefReport/textFileDetail",query:{id:val.rowVal.id}})
        break
    }
  }
}
