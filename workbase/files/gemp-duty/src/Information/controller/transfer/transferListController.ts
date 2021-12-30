import { ControllerBase, Inject } from 'prism-web'
import { timeFormat } from '../../../../assets/libs/commonUtils'
import searchSession from '../../../../assets/libs/searchData'
export class TransferListController extends ControllerBase {
  constructor() {
    super()
  }
  @Inject('http') http: any
  @Inject('store') store: any
  // 当前角色级别
  private roleLevel: boolean
  // 当前角色信息
  private role: object
  // 删除原因弹框控制
  private deleteConfig = {
    visible: false,
    reason: ''
  }
  // 按钮组
  private btnArray: object = {
    all: { name: '删除', emit: 'delTransfer', type: 'danger', viewDialog: { title: '删除转办督办', compName: 'transfer-delete', height: '200px', width: '500px' }, expression: true },
    handle: { name: '办理', emit: 'handle', type: 'primary', expression: true },
    delete: { name: '已删除', emit: '', className: 'delete', disabled: true, expression: true },
  }
  created() {
    this.role = JSON.parse(sessionStorage.getItem("role"))
    this.roleLevel = this.role['isYjb']
    this.store.dispatch('infomanage/setTransfer', this.searchData)
    this.getTranferList(0)
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
      menuId: "2c9287db6e7e3851016e8131cd410006",
      userId: userInfo['userId']
    }
    this.http.PowerNodeRequest.btnPowerManagement(params).then((res) => {
      if (res.status == 200) {
        // console.log(res);
        res.data.forEach((data) => {
          switch (data.privName) {
            case '添加转办督办':
              this.btnConfig.add = true
              break
            case '查看所有':
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
  //查看所有传参(传空) 查看未删传参(传0)
  private searchData = {
    deleteFlag: 0,
    startTime: "",
    endTime: "",
    keyWord: "",
    listOrder: {
      prop: "",
      sort: ""
    },
    nowPage: 1,
    pageSize: 10
  }

  //按钮控制
  private btnConfig = {
    add: false, //添加转办督办
    all: false,//查看所有
    read: false,//标为已读
    search: false,//搜索
    accurateSearch: false//精准搜索
  }
  private checkLabel: String = '查看所有'//查看按钮默认文字
  private isCheckAll: boolean = true//查看按钮状态切换
  private searchKey: string = ''
  //精准搜索参数
  private showSearch: boolean = false
  // 列表时间查询参数
  private search_time: Array<any> = []
  //列表参数
  private propData = {
    isCheck: false,
    pageSize: 0,
    total: 0,
    config: [
      //   {
      //     type: 'tag',
      //     label: '',
      //     width: '120',
      //     prop: 'handleStatus',
      //   },
      {
        type: 'link',
        label: '标题',
        basehref: '/information/transferView',
        passProp: 'infoDisposeId',
        width: '240',
        prop: 'infoTitle',
        badge: true,
        emit: 'showDelTip'
      },
      {
        type: 'string',
        label: '接收单位',
        width: '/',
        prop: 'recvOrgNames'
      },
      {
        type: 'string',
        label: '接收人',
        width: '/',
        prop: 'recvPersonNames'
      },
      {
        type: 'string',
        label: '单位签收',
        width: '/',
        prop: 'signForOrg',
        unsortable: true
      },
      {
        type: 'string',
        label: '个人签收',
        width: '/',
        prop: 'signForPerson',
        unsortable: true
      },
      {
        type: 'string',
        label: '转办时间',
        width: '/',
        prop: 'createTimeStr'
      },
      {
        type: 'button',
        label: '操作',
        width: '100',
        prop: 'operate'
      }
    ],
    tagArray: { '0': { name: '待签', type: 'danger' }, '1': { name: '已签', type: 'success' }, '2': { name: '迟签', type: 'warning' } },
    data: []
  }
  //触发按钮的事件
  tablecallback(data) {
    this[data.type](data)
  }

  //分页
  handlePageChange(data) {
    this.searchData['nowPage'] = data.rowVal
    this.store.dispatch('infomanage/setTransfer', { nowPage: data.rowVal })
    this.getTranferList()
  }

  //获取列表
  /**
   * Modify by chenzheyu 修改查询时间传参
   * @param deleteFlag
   */
  getTranferList(deleteFlag?: number) {
    //默认显示列表数量参数
    const $this = this
    // 去除空格
    const searchData = JSON.parse(JSON.stringify(this.store.getters['infomanage/getTransfer']))
    if (this.search_time === null) {
      searchData['startTime'] = ""
      searchData['endTime'] = ""
    } else {
      if (this.search_time.length > 0) {
        searchData['startTime'] = this.search_time[0]
        searchData['endTime'] = this.search_time[1]
      }
    }
    if (String(deleteFlag) == 'null' || deleteFlag == 0) {
      searchData['deleteFlag'] = deleteFlag
    }

    //请求列表数据
    this.http.InfoDutyRequest.findList(searchData).then((res) => {
      //查询转办督办列表
      if (res.data) {
        //获取分页
        this.propData.total = res.data.total
        this.propData.pageSize = res.data.pageSize
        let propData = res.data.list.map((item, index) => {
          if (item.deleteFlag == 1) {
            item.operate = [{ name: '已删除', emit: '', className: 'delete', disabled: true, expression: true }]
          } else {
            if (this.roleLevel) {
              item.operate = [{ name: '删除', emit: 'delTransfer', type: 'danger', expression: true, viewDialog: { title: '删除转办督办', compName: 'transfer-delete', height: '200px', width: '500px' } }]
            } else {
              item.operate = [{ name: '办理', emit: 'handle', type: 'primary', expression: true }]
            }
            item.deleteFlag = false;
          }
          // item.operate = [{ name: '删除', emit: 'delete', icon: 'el-icon-delete'}]

          if (item.deptSign == item.deptTotal) {
            // item.signForOrg = `${item.deptSign || ''}/${item.deptTotal || ''} 已全部签收`
            item.signForOrg = `已全部签收`
          } else {
            item.signForOrg = `${item.deptSign || ''}/${item.deptTotal || ''} 已签收`
          }
          if (item.personSign == item.personTotal) {
            // item.signForPerson = `${item.personSign || ''}/${item.personTotal || ''} 已全部签收`
            item.signForPerson = `已全部签收`
          } else {
            item.signForPerson = `${item.personSign || ''}/${item.personTotal || ''} 已签收`
          }

          if (item.personSign == null && item.personTotal == null) {
            item.signForPerson = ``
          }

          item.status = ''
          return item
        })
        this.tabUnread({ name: '转办督办', unreadCount: res.data['unReadTotalCount'] })
        console.log(propData)
        this.$set($this.propData, 'data', propData)
      }
    })
  }

  //查看跳转
  getTransferDetails(id) {
    this.$router.push({ path: '/information/transferView', query: { id: id, a: 'edit' } })
  }

  // 办理功能
  handle(data) {
    this.$router.push({
      path: '/information/transferView',
      query: { id: data.rowVal.infoDisposeId },
    })
  }

  private temp = {
    style: require('../../style/transfer/transferList.less')
  }

  // 列表排序
  sort(data) {
    this.$set(this.searchData, 'listOrder', data.rowVal)
    this.store.dispatch('infomanage/setTransfer', this.searchData)
    this.getTranferList()
  }

  //关闭删除弹框
  closeDialogCall() {
    this.getTranferList()
  }


  //查看所有和未删事件处理,查看所有--传参(传空) 查看未删--传参(传0)
  checkEventHandel() {
    this.isCheckAll = !this.isCheckAll
    this.checkLabel = this.isCheckAll ? '查看所有' : '查看未删'
    if (this.checkLabel === '查看未删') {

      this.getTranferList(null)

    } else if (this.checkLabel === '查看所有') {
      this.getTranferList(0)
    }
  }

  // 标记已读
  haveRead() {
    this.$confirm('此操作将把所有未读消息一键标为已读，是否继续?', "提示", {
      confirmButtonText: '确定',
      cancelButtonText: "取消",
      type: 'warning',
      confirmButtonClass: 'confirmButtonClass',
      cancelButtonClass: "confirmButtonClass",
    }).then(() => {
      this.http.InfoDutyRequest.findHaveRed().then(res => {
        if (res.status == 200) {
          this.getTranferList();
          this.$message({
            type: 'success',
            message: res.msg
          })
        }
      })
    }).catch(() => {
      this.$message({
        message: '已取消操作'
      })
    })
  }

  tableRowClassName({ row, rowIndex }) {
    if (row.deleteFlag == 1) {
      return 'warning-row'
    }

  }

  showDelTip(data) {
    if (data.rowVal.deleteFlag == 1) {
      this.deleteConfig = { visible: true, reason: data.rowVal.deleteReason }
    } else {
      this.$confirm('该信息已被删除!未填写原因', '删除原因', { showCancelButton: false })
    }
  }

  // tab组件展示未读数功能
  tabUnread(obj: object) {
    this.emit('unread', obj)
  }

  // 快速检索
  searchKeyword() {
    this.searchData.nowPage = 1
    this.store.dispatch('infomanage/setTransfer', this.searchData)
    this.getTranferList()
  }

 /** 
  * 重置按钮
  */
  clearSearch() {
    this.searchData.keyWord = ''
    this.searchData.startTime = ''
    this.searchData.endTime = ''
    this.search_time = []
  } 
}
