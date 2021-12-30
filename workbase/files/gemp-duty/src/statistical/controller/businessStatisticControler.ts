import { ControllerBase, Prop, Inject, Emit } from 'prism-web'
import { timeFormat, downloadFuncs } from '../../../assets/libs/commonUtils'
import searchSession from '../../../assets/libs/searchData'

export class businessStatisticControler extends ControllerBase {
  @Inject('http') http: any

  private temp = {
    style: require('../style/bussinessStatistic.less')
  }
  private defaultchecked = ''

  // private value1 = new Date(new Date().setHours(0, 0, 0, 0)).toJSON()
  // private value2 = new Date(new Date().setHours(23, 59, 59, 0)).toJSON()
  //左侧机构树按钮参数
  private configtree = {
    setParameters: {
      tenantId: ''
    }
  }
  private searchlist = {
    distCode: '',
    endTime: '',
    startTime: ''
  }

  private propData = {
    isCheck: false,
    // pageSize: 8,
    nopagination: true, //不分页
    emptyText: '加载中',
    // total: 0,
    config: [
      {
        type: 'string',
        label: '行政区划',
        width: '/',
        prop: 'distName'
      },
      {
        type: 'string',
        label: '登录次数',
        prop: 'registerNum',
        width: '/'
      },
      {
        type: 'string',
        label: '信息录入',
        width: '/',
        prop: 'infoReportedNum'
      },
      {
        type: 'string',
        label: '值班排班',
        prop: 'arrangeNum',
        width: '/'
      },
      {
        type: 'string',
        label: '公文收发',
        prop: 'publicDocumentNum',
        width: '/'
      },
      {
        type: 'string',
        label: '信息呈报',
        width: '/',
        prop: 'infoRenderNum'
      },
      {
        type: 'string',
        label: '一键上报',
        width: '/',
        prop: 'reportQuickNum'
      },
      {
        type: 'string',
        label: '上报平安',
        width: '/',
        prop: 'reportDailyNum'
      }
    ],
    data: []
  }
  // 开始时间小于结束时间
  private value1: any = ''
  private value2: any = ''
  async created() {
    this.getToday()
    this.configtree.setParameters.tenantId = JSON.parse(JSON.stringify(searchSession.getter({ name: 'role' }))).tenantId
    await this.getuserGroupOrg()
  }
  getToday() {
    let now = new Date()
    let Y = now.getFullYear()
    let M = now.getMonth() + 1
    let D = now.getDate()
    let Mdate = now.getMonth() >= 10 ? Number(now.getMonth()) + 1 : '0' + Number(now.getMonth() + 1)
    let firstday = Y + '-' + Mdate + '-01'
    this.value1 = firstday
    this.value2 = Y + '-' + Mdate + '-' + D
  }
  mounted() {
    // setTimeout(() => {
    //   this.$nextTick(() => {
    //     this.getuserGroupOrg()
    //   })
    // }, 1000)
  }
  // 获取列表数据
  getDate() {
    let data = {
      total: 0,
      pageSize: 10,
      data: []
    }
    this.searchlist.startTime = timeFormat(this.value1).substr(0, 10)
    this.searchlist.endTime = timeFormat(this.value2).substr(0, 10)
    this.http.StatisticalReportRequest.getBussinessList(this.searchlist).then((item) => {
      if (item.status !== 200) {
        let dataObj = Object.assign({}, this.propData, data)
        this.$set(this, 'propData', dataObj)
        this.propData.emptyText = '暂无数据'
        return
      }
      if (!item.data || item.data.length == 0) {
        this.propData.emptyText = '暂无数据'
      }
      data.data = item.data.map((item, index) => {
        return item
      })
      data = Object.assign({}, this.propData, data)
      this.$set(this, 'propData', data)
    })
  }
  getuserGroupOrg() {
    this.http.TreeNode.getBussinessTree(this.configtree.setParameters).then((res) => {
      if (res.status == 200) {
        this.defaultchecked = res.data[0].id
        this.searchlist.distCode = res.data[0].id
        console.log(this.searchlist.distCode)
        this.$refs.searchtree['handleTree']('setCurrentKey', res.data[0].id)
        this.getDate()
      }
    })
  }
  treecallback(data) {
    this[data.type](data)
  }
  // 查询
  inquire() {
    this.getDate()
  }

  //  选择机构
  getOrg(val) {
    this.searchlist.distCode = val.prop.id
    this.getDate()
  }
  // 导出
  exportAll() {
    this.searchlist.startTime = timeFormat(this.value1).substr(0, 10)
    this.searchlist.endTime = timeFormat(this.value2).substr(0, 10)
    this.http.StatisticalReportRequest.bussinessListExport(this.searchlist).then((res) => {
      if (res.url) {
        downloadFuncs(res)
      } else {
        this.$message.error('下载失败')
      }
    })
  }

  // 刷新
  // renovate() {
  //     this.http.StatisticalReportRequest.getBussinessRenovate().then((res) => {
  //         if (res.status == 200) {
  //             this.$message({
  //                 message: '刷新成功',
  //                 type: 'success'
  //             });
  //             this.getDate()
  //         }
  //     })
  // }
}
