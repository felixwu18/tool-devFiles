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
    endTime: "", //结束时间
    roomName: "", //查询关键字,默认查询标题
    listOrder: {},//排序参数
    nowPage: 1,//当前页数
    pageSize: 10,//每页条数
    startTime: "",//开始时间
  }

  // 按钮功能数组
  private btnGroup: object = {
    edit: { name: '编辑', type: 'primary', emit: 'edit', expression: true },
    delete: { name: '删除', type: 'danger', emit: 'delete', expression: true, },
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
        label: '会议室名称',
        basehref: '/conferenceroom/detailManagement',
        passProp: 'roomId',
        width: '/',
        prop: 'roomName',
        emit: 'showDelTip',
        badge: true
      },
      {
        type: 'string',
        label: '是否有多媒体',
        width: '/',
        prop: 'multimediaFlagName'
      },
      {
        type: 'string',
        label: '可容纳人数',
        width: '/',
        prop: 'totalNum'
      },
      {
        type: 'string',
        label: '主席台座席数',
        width: '/',
        prop: 'chairmanNum'
      },
      {
        type: 'string',
        label: '周围座席数',
        width: '/',
        prop: 'surroundingNum'
      },
      {
        type: 'string',
        label: '是否启用',
        width: '/',
        prop: 'enabledFlagName'
      },
      {
        type: 'button',
        label: '操作',
        width: '360',
        prop: 'operate'
      }
    ],

    data: []
  }

  // 获取列表数据
  getListData() {
    this.http.ConferenceroomRequest.manageList(this.searchData).then(res => {
      if (res.status == 200) {
        this.propData.total = res.data.total
        this.propData.pageSize = res.data.pageSize
        this.propData.data = res.data.list.map((item, index) => {
            item.operate = this.btnGroup
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
        path: '/conferenceroom/detailManagement',
        query: { roomId: data.rowVal.roomId },
    });
}
  
  /* 新增
  */
  add(date) {
    this.$router.push({ path: '/conferenceroom/addManagement' })
  }
  
  // 编辑
  edit(date) {
    this.$router.push({ path: `/conferenceroom/detailManagement?type=edit&roomId=${date.rowVal.roomId}` })
  }

  /*  删除
  */
 delete(data) {
    this.$confirm('是否确认删除?', "提示", {
        confirmButtonText: '确定',
        cancelButtonText: "取消",
        confirmButtonClass: 'confirmButtonClass',
        cancelButtonClass: "confirmButtonClass",
    }).then(() => {
        this.http.ConferenceroomRequest.delete({ roomId: data.rowVal.roomId }).then(res => {
            if (res.status == 200) {
                if (this.messageDom) { this.messageDom.close() }
                this.messageDom = this.$message({
                    type: 'success',
                    message: '删除成功'
                })
                this.getListData()
            } else {
                if (this.messageDom) { this.messageDom.close() }
                this.messageDom = this.$message({
                    type: 'warning',
                    message: '删除失败'
                })
            }
        })
    }).catch(() => {
        if (this.messageDom) { this.messageDom.close() }
        this.messageDom = this.$message({
            type: 'warning',
            message: '已取消操作'
        })
    })

}

  // 排序功能
  sort(data) {
    this.$set(this.searchData, 'listOrder', data.rowVal)
    this.getListData()
  }

  //精准搜索功能
  getListDataByExact() {
    if (this.search_time && this.search_time.length > 0) {
      this.searchData['startTime'] = dateStandard(this.search_time[0],"start");
      this.searchData['endTime'] = dateStandard(this.search_time[1],"end");
    } else {
      this.searchData['startTime'] = ''
      this.searchData['endTime'] = ''
    }
    this.getListData()
  }
}
