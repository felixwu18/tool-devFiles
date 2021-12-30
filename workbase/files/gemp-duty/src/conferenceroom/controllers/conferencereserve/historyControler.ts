import { ControllerBase, Inject, Watch} from 'prism-web'
import { dateStandard } from '../../../../assets/libs/commonUtils'

export class ManagementControler extends ControllerBase {
  constructor() {
    super()
  }
  
  private temp = {
    style: require('../../style/conferencereserve/destine.less')
  }
  @Inject('http') http: any
  private showSearch = false //精确搜索栏显示

  private messageDom: any = null //message实体

  // 列表时间查询参数
  private search_time: Array<any> = []
  // 列表查询参数
  private searchData: object = {
    meetingEndDate: "", //结束时间
    keyWord: "", //查询关键字,默认查询标题
    listOrder: {},//排序参数
    nowPage: 1,//当前页数
    pageSize: 10,//每页条数
    meetingStartDate: "",//开始时间
  }

  // 按钮功能数组
  //  by 刘文磊  显示字段用boolean
  private btnGroup: object = {
    // edit: { name: '编辑', type: 'warning', emit: 'edit', expression: true },
    // delete: { name: '删除', type: 'danger', emit: 'delete', expression: true, },
  }

  created() {
    this.getListData()
  }
  activated() {
  }

  private propData = {
    isCheck: false,
    pageSize: 10,
    total: 0,
    config: [
      {
        type: 'link',
        label: '会议室时间',
        basehref: '/conferenceroom/detailHistory',
        passProp: 'reserveId',
        width: '/',
        prop: 'meetingDate',
        emit: 'showDelTip',
        badge: true
      },
      {
        type: 'string',
        label: '会议室',
        width: '/',
        prop: 'roomName'
      },
      {
        type: 'string',
        label: '使用领导',
        width: '/',
        prop: 'usingLeader'
      },
      {
        type: 'string',
        label: '预定人',
        width: '/',
        prop: 'reserveName'
      },
      {
        type: 'string',
        label: '预定人处室',
        width: '/',
        prop: 'reserveDept'
      },
      {
        type: 'string',
        label: '预定人电话',
        width: '/',
        prop: 'reservePhone'
      },
      {
        type: 'string',
        label: '更新时间',
        width: '/',
        prop: 'updateTime'
      }
    ],

    data: []
  }

  // 获取列表数据
  getListData() {
    this.http.ConferenceroomRequest.historyList(this.searchData).then(res => {
      if (res.status == 200) {
        this.propData.total = res.data.total
        this.propData.pageSize = res.data.pageSize
        this.propData.data = res.data.list.map((item, index) => {
            // item.operate = this.btnGroup
            return item
        })
      }

    })
  }

 

  // 列表按钮点击响应
  tablecallback(data) {
    this[data.type](data)
  }

  // 翻页功能
  handlePageChange(data) {
    this.searchData['nowPage'] = data.rowVal
    this.getListData()
  }

  // 查看功能
  preview(data) {
    this.$router.push({
        path: '/conferenceroom/detailHistory',
        query: { id: data.rowVal.reserveId },
    });
  }

  // 排序功能
  sort(data) {
    this.$set(this.searchData, 'listOrder', data.rowVal)
    this.getListData()
  }

  //精准搜索功能
  getListDataByExact() {
    if (this.search_time && this.search_time.length > 0) {
      this.searchData['meetingStartDate'] = dateStandard(this.search_time[0],"start");
      this.searchData['meetingEndDate'] = dateStandard(this.search_time[1],"end");
    } else {
      this.searchData['meetingStartDate'] = ''
      this.searchData['meetingEndDate'] = ''
    }
    this.getListData()
  }
}
