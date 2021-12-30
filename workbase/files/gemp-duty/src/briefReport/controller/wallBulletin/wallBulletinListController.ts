import { ControllerBase, Inject } from 'prism-web'
import searchSession from '../../../../assets/libs/searchData'

export class WallBulletinListController extends ControllerBase {
  constructor() {
    super()
  }

  private temp = {
    style: require('../../style/specialReport/specialReportList.less')
  }

  @Inject('http') http: any
  @Inject('store') store: any
  private showSearch: Boolean = false
  private alreadyRead: string = 'BRIEF'
  // 默认显示查看未读
  private readSign: string = '查看全部'

  private messageDom: any = null //message实体
  //按钮控制
  private btnConfig = {
    add: false, //新增
    all: false,//查看未读
    read: false,//标为已读
    search: false,//搜索
    accurateSearch: false//精准搜索
  }
  // 列表时间查询参数
  private search_time: Array<any> = []
  // 列表查询参数
  private searchData: object = {
    deleteFlag: "0",//查看删除/所有
    endTime: "", //结束时间
    keyWord: "", //查询关键字,默认查询标题
    listOrder: {},//排序参数
    nowPage: 1,//当前页数
    pageSize: 10,//每页条数
    reportType: [
      "BRIEF"//简报类型
    ],
    startTime: "",//开始时间
    unreadStatus: ""//是否未读
  }
  // 修改期号弹框参数
  private dialogOption = {
    flag: false,
    titleName: "删除原因",
    componentName: "modiftyIssue-brief",
    propsData: {}
  }
  // 按钮功能数组
  //  by 刘文磊  显示字段用boolean
  private btnGroup: object = {
    edit: { name: '编辑', type: 'primary', emit: 'edit', expression: true },
    delete: { name: '删除', type: 'danger', emit: 'delete', expression: true, },
    modiftyIssue: { name: '修改期号', type: 'primary', emit: 'update', expression: true },
  }
  /** author by 刘文磊 影藏期号功能按钮
   *
   */
  private btnGroup1: object = {
    edit: { name: '编辑', type: 'primary', emit: 'edit', expression: true },
    delete: { name: '删除', type: 'danger', emit: 'delete', expression: true, },
    modiftyIssue: { name: '修改期号', type: 'primary', emit: 'update', expression: false },
  }


  created() {
    this.store.dispatch('brief/setWallbulletin',this.searchData)
    this.getListData()
    this.btnManagement()
  }
  activated() {
  }
  /**
  *  author by xinglu 获取当前菜单的按钮权限
  *  @param{
  *    menuId: "",  //菜单id
  *    userId: "", //当前登录用户的id
  *  }
  */
  btnManagement() {
    var userInfo = searchSession.getter({ name: 'role' })
    let params = {
      menuId: "2c9287db6e7e3851016e82953ac403ab",
      userId: userInfo['userId']
    }
    this.http.PowerNodeRequest.btnPowerManagement(params).then((res) => {
      if (res.status == 200) {
        res.data.forEach((data) => {
          switch (data.privName) {
            case '新增':
              this.btnConfig.add = true
              break
            case '查看全部':
              this.btnConfig.all = true
              break
            case '标为已读':
              this.btnConfig.read = true
              break
            case '搜索':
              this.btnConfig.search = true
              break
            case '精准搜索':
              this.btnConfig.accurateSearch = true
              break
          }
        })
      }
    })
  }
  private propData = {
    isCheck: false,
    pageSize: 10,
    total: 0,
    config: [
      {
        type: 'link',
        label: '公文标题',
        basehref: '/briefReport/wallBulletinDetail',
        passProp: 'id',
        width: '/',
        prop: 'reportTitle',
        badge: true,
        emit: 'showDelTip'
      },
      {
        type: 'string',
        label: '公文期号',
        width: '/',
        prop: 'issueInfo'
      },
      {
        type: 'string',
        label: '创建人',
        width: '/',
        prop: 'creatorName'
      },
      {
        type: 'string',
        label: '更新时间',
        width: '/',
        prop: 'updateTime'
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


  // 查看未读  查看全部 author by xinglu
  searchUnread() {
    if (this.readSign == "查看全部") {
      this.searchData['deleteFlag'] = ''
      this.readSign = '查看未删'
    } else {
      this.searchData['deleteFlag'] = '0'
      this.readSign = '查看全部'
    }
    this.store.dispatch('brief/setWallbulletin',this.searchData)
    this.getListData()
  }

  // 获取列表数据 author by xinglu
  //修改期号 author by liuwenlei
  getListData() {
    this.http.briefReportRequest.briefList(this.store.getters['brief/getWallbulletin']).then(res => {
      if (res.status == 200) {
        this.propData.total = res.data.total
        this.propData.pageSize = res.data.pageSize
        this.propData.data = res.data.list.map((item, index) => {
          item.deleteFlag = Number(item.deleteFlag)
          let obj = {}
          if (!item.deleteFlag) {
            if (item.modifyIssue == "1")
              obj = JSON.parse(JSON.stringify(this.btnGroup))
            else
              obj = JSON.parse(JSON.stringify(this.btnGroup1))
            item.operate = obj
          }
          return item
        })
        this.tabUnread({ unReadTotalCount: res.data.unReadTotalCount, type: "快报" })
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
    this.store.dispatch('brief/setWallbulletin',{nowPage: data.rowVal})
    this.getListData()
  }
  // 新增  by 刘文磊
  add() {
    this.$router.push({ path: '/briefReport/wallBulletinAdd', query: { type: "add" } })
  }
  // 编辑
  edit(date) {
    this.$router.push({ path: `/briefReport/wallBulletinEdit?id=${date.rowVal.id}` })
  }
  /* author by 刘文磊 删除
  */
  delete(date) {
    setTimeout(() => {
      this.dialogOption.flag = true
      this.dialogOption.titleName = "删除原因"
      this.dialogOption.componentName = "deleteBrief-brief"
      this.dialogOption.propsData = date.rowVal
    }, 350)
  }
  //已删除数据类名更改
  tableRowClassName({ row, rowIndex }) {
    if (row.deleteFlag == 1) {
      return 'delete_data'
    }
  }
  //已删除信息提示
  showDelTip() {
    if (this.messageDom) {
      this.messageDom.close()
    }
    this.messageDom = this.$message('该信息已被删除!');
  }
  // 修改期号
  update(date) {
    this.dialogOption.flag = true
    this.dialogOption.componentName = "modiftyIssue-brief"
    this.dialogOption.titleName = "修改公文期号"
    this.dialogOption.propsData = date.rowVal
  }

  // 查看功能
  handle(data) {
    this.$router.push({ path: '/information/detailsManage', query: { id: data.rowVal.infoId } })
  }

  closeDialogCall(callInfo) {
    //关闭弹框
    this.dialogOption.flag = false
    //重新刷新当前页面数据
    this.getListData()
  }

  // 排序功能
  sort(data) {
    this.$set(this.searchData, 'listOrder', data.rowVal)
    this.store.dispatch('brief/setWallbulletin',this.searchData)
    this.getListData()
  }


  // tab组件展示未读数功能
  tabUnread(obj: object) {
    this.emit('briefunread', obj)
  }

  // 标为已读
  signReaded() {
    this.$confirm('此操作将把所有未读消息一键标为已读，是否继续?', "提示", {
      confirmButtonText: '确定',
      cancelButtonText: "取消",
      type: 'warning',
      confirmButtonClass: 'confirmButtonClass',
      cancelButtonClass: "confirmButtonClass",
    }).then(() => {
      let reportParams = { reportType: this.alreadyRead }
      this.http.briefReportRequest.clean(reportParams).then(res => {
        if (res.status == 200) {
          this.emit('read', true)
          this.getListData()
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        }
      })
    }).catch(() => {
      this.$message({
        message: '已取消操作'
      })
    })
  }
  //精准搜索功能
  getListDataByExact() {
    if (this.search_time) {
      this.searchData['startTime'] = this.search_time[0]
      this.searchData['endTime'] = this.search_time[1]
    } else {
      this.searchData['startTime'] = ''
      this.searchData['endTime'] = ''
    }
    this.store.dispatch('brief/setWallbulletin',this.searchData)
    this.getListData()
  }

  // 快速检索
  quickSearch() {
    this.searchData['nowPage'] = 1
    this.store.dispatch('brief/setWallbulletin',this.searchData)
    this.getListData()
  }
}
