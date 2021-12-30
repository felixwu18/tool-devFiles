import { ControllerBase, Inject } from 'prism-web'
import searchSession from '../../../../../assets/libs/searchData';

export class LowerHairDocumentListController extends ControllerBase {
  private temp = {
    style: require('../../../style/documentHandle/lowerHairDocument/lowerHairDocumentList.less')
  }
  constructor() {
    super()
  }

  @Inject('http') http: any

  private hadleData: any //当前展开的数据
  private showSearch: Boolean = false
  private defaultchecked = JSON.parse(window.sessionStorage.getItem("role"))['orgCode']
  //记录当前页用户的单位Code
  private currentRole = JSON.parse(window.sessionStorage.getItem("role"))['orgCode']
  //记录当前用户的Code
  private activeUserId = JSON.parse(window.sessionStorage.getItem("role"))['userId']
  //判断是否显示上报按钮
  private showReportButton: boolean = true
  // 默认显示查看未读
  private readSign: string = '查看未读'
  // 列表时间查询参数
  private search_time: Array<any> = []
  //按钮控制
  private btnConfig = {
    add: false, //下发
    accurate: false,//精准搜索
    search: false,//搜索
  }
  // 列表查询参数
  private searchData: object = {
    documentTitle: "",//公文标题
    endTime: '',//公文接受结束时间
    nowPage: 1,//当前页数
    pageSize: 10,//每页条数
    receiveUnitCode: '',//接受单位code
    recevierId: "",//接收人Id
    sendUnitCode: '',//发送单位code
    senderId: "",//发送人id
    startTime: '',//公文接受开始时间
    upDowmType: '2'//公文操作类型 公文上报-1 公文下发2
  }

  private searchChildrenParams: object = {
    "detailLinkId": "",
    "documentTitle": "",
    "documentType": "",
    "endTime": "",
    "nowPage": 1,
    "pageSize": 10,
    "receiveUnitCode": "",
    "recevierId": "",
    "sendUnitCode": "",
    "senderId": "",
    "senderName": "",
    "startTime": "",
    "upDowmType": ""
  }

  private handleSelectList = []; //选中列表参数 

  private propData = {
    // isCheck: false,
    isCheck: true,
    pageSize: 10,
    total: 0,
    config: [
      {
        type: 'string',
        label: '公文标题',
        width: '/',
        prop: 'documentTitle',
        emit: 'lowerDetail',
        color: '#66b1ff'
      },
      {
        type: 'string',
        label: '接收单位',
        prop: 'receiveUnitName'
      },
      {
        type: 'string',
        label: '公文类型',
        prop: 'documentTypeName'
      },
      {
        type: 'string',
        label: '创建人',
        prop: 'creator',
        width: '/',
      },
      {
        type: 'string',
        label: '更新时间',
        prop: 'createTime'
      },
      {
        type: 'string',
        label: '状态',
        prop: 'documentProgressStatusName',
        width: '120',
      },
      // {
      //   type: 'string',
      //   label: '公文期号',
      //   prop: 'orgName'
      // },
      {
        type: 'button',
        label: '操作',
        width: '180',
        prop: 'operate'
      }
    ],
    // tag展示列表
    tagArray: { '0': { name: '待签', type: 'danger' }, '1': { name: '待办', type: 'primary' }, '9': { name: '退回', type: 'info' } },
    data: []
  }

  private btnGroup: object = {
    copyedit: { name: '同文下发', type: 'primary', emit: 'copyedit', expression: false },
    handle: { name: '撤回', emit: 'handle', type: 'success', expression: true },
  }

  private activeNames: Array<any> = []

  private listData: Array<any> = []

  private listPageParams: object = {
    currentPage: 1,
    pageSize: 10,
    total: 0
  }

  openCollapse(item: any) {
    this.hadleData = item
    if (this.activeNames.indexOf(item.detailLinkId) < 0) return false;
    this.activeNames = [item.detailLinkId]
    item.searchParams = {
      ...item.searchParams,
      sendid: item.sendid,
      detailLinkId: item.detailLinkId
    }
    this.http.DocumentHandleRequest.documentHairDownChildren(item.searchParams).then(res => {
      if (res.status == 200) {
        item.propData.total = res.data.total
        item.propData.data = res.data.list.map((item, index) => {
          let obj = JSON.parse(JSON.stringify(this.btnGroup));
          if (item.documentType == '5') {
            obj['copyedit'].expression = true
          }
          if (item.documentProgressStatus == '1') {
            obj['handle'].expression = true
          } else {
            obj['handle'].expression = false
          }
          item.operate = obj
          return item
        })
      }
    })
  }

  created() {
    this.getPermissions()
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
      menuId: '2c9287db6e7e3851016e8328f49b044e',
      userId: userInfo['userId']
    }
    this.http.PowerNodeRequest.btnPowerManagement(params).then((res) => {
      if (res.status == 200) {
        // console.log(res);
        res.data.forEach((data) => {
          switch (data.privName) {
            case '下发':
              this.btnConfig.add = true
              break
            case '高级搜索':
              this.btnConfig.accurate = true
              break
            case '搜索':
              this.btnConfig.search = true
              break
          }
        })
      }
    })
  }
  /* author by chengyun 角色权限
  *  Modify by xinglu
  */
  getPermissions() {
    if (this.currentRole == this.defaultchecked) {
      this.showReportButton = true
      this.searchData['senderId'] = this.activeUserId
    }
  }
  // 查看未读  查看全部
  searchUnread() {
    if (!this.searchData['isReadCode']) {
      this.searchData['isReadCode'] = '1'
      this.readSign = '查看全部'
    } else {
      this.searchData['isReadCode'] = ''
      this.readSign = '查看未读'
    }
    this.getListData()
  }

  /* author by huihui 获取列表数据
   *  Modify by xinglu
   */
  getListData() {
    //获取登录人的OrgCode
    if (this.searchData['sendUnitCode'] == "") {
      if (window.sessionStorage.getItem("role")) {
        let role = JSON.parse(window.sessionStorage.getItem("role"))
        this.searchData['sendUnitCode'] = role.orgCode
      }
    }
    this.http.DocumentHandleRequest.documentHairDown(this.searchData).then(res => {
      if (res.status == 200) {
        this.listPageParams['total'] = res.data.total
        this.listData = res.data.list.map((item: any, index: number) => {
          return {
            ...item,
            propData: { ...this.propData },
            searchParams: {
              ...this.searchChildrenParams
            }
          }
        })
      }
    })

  }

  copyedit(data) {
    let dataInfo = { id: data.rowVal.publicId, tab: "3" }
    // if (data.rowVal.documentType == "5") { 
    // }
    this.$router.push({ path: '/dutyManagement/lowerHairIssueCopy', query: dataInfo })

  }
  /* author by huihui 机构的回调
   *  Modify by xinglu
   */
  getOrg(val) {
    let orgCode = val.prop.id
    this.$set(this.searchData, 'sendUnitCode', orgCode)
    //判断是否显示上报按钮
    if (this.currentRole == orgCode) {
      this.showReportButton = true
      this.searchData['senderId'] = this.activeUserId
    } else {
      this.searchData['senderId'] = ''
      this.showReportButton = false
    }
    this.getListData()
  }

  /* author by huihui 列表所有按钮点击响应
   *  Modify by
   */
  tablecallback(data: any, item: any) {
    this[data.type](data, item)
  }


  /* author by huihui 翻页功能
   *  Modify by
   */
  handlePageChange(data: any, item: any) {
    if (item) {
      item.searchParams.nowPage = data.rowVal
      this.openCollapse(item)
    } else {
      this.searchData['nowPage'] = data
      this.getListData()
    }
  }
  //排序
  sort(data) {
    // console.log(data);
  }
  /* author by huihui 新增按钮
   *  Modify by xinglu
   */
  lowerAdd() {
    this.$router.push({ path: '/dutyManagement/reportDocumentAdd', query: { title: '新增下级公文' } })
  }
  /* author by xinglu 下发按钮
   *  Modify by
   */
  lowIssue() {
    this.$router.push({ path: '/dutyManagement/lowerHairDocumentAdd', query: { tab: "3" } })
  }
  /* author by chengyun 查看跳转
 *  Modify by xinglu
 */
  lowerDetail(data) {
    let dataInfo = { id: data.rowVal.publicId, tab: "3" }
    if (data.rowVal.documentProgressStatus && data.rowVal.documentProgressStatus == "4") {
      if (data.rowVal.documentType == "4") { this.$router.push({ path: '/dutyManagement/receipInstructsIssue', query: dataInfo }) }
      if (data.rowVal.documentType == "5") { this.$router.push({ path: '/dutyManagement/receipIssue', query: dataInfo }) }
    } else {
      if (data.rowVal.documentType == "4") { this.$router.push({ path: '/dutyManagement/lowerInstructsDetail', query: dataInfo }) }
      if (data.rowVal.documentType == "5") { this.$router.push({ path: '/dutyManagement/lowerHairIssueDetail', query: dataInfo }) }
    }

  }
  /** 
   * author by xinglu 高级搜索
  */
  getListDataBytime() {
    if (this.search_time) {
      this.searchData['startTime'] = this.search_time[0]
      this.searchData['endTime'] = this.search_time[1]
    } else {
      this.searchData['startTime'] = ''
      this.searchData['endTime'] = ''
    }
    this.getListData()
  }
  /** 
   * author by xinglu 高级搜索全部按钮
  */
  getAllTime() {
    this.search_time = []
  }

  // 撤回
  handle(data) {
    this.$confirm('此操作将把该条信息撤回，是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'confirmButtonClass',
      cancelButtonClass: 'confirmButtonClass',
    })
      .then(() => {
        let paramsRecall = { publicIds: [data.rowVal.publicId] }
        this.http.DocumentHandleRequest.getRecall(paramsRecall).then(res => {
          if (res.status == 200) {
            this.$message({
              message: res.data,
              type: 'success'
            })
            this.openCollapse(this.hadleData)
          } else {
            this.$message({
              message: res.data,
              type: 'error'
            })
          }
        })
        console.log(data, 888)
      })
      .catch(() => {
        this.$message({
          message: '已取消操作',
        });
      });
  }
  // 选中撤回
  recall() {
    if (this.handleSelectList && this.handleSelectList.length > 0) {
      let paramRecall = { publicIds: this.handleSelectList }
      this.http.DocumentHandleRequest.getRecall(paramRecall).then(res => {
        if (res.status == 200) {
          this.$message({
            message: res.data,
            type: 'success'
          })
          // this.getListData();
          this.openCollapse(this.hadleData)
        } else {
          this.$message({
            message: res.data,
            type: 'error'
          })
        }
      })
    } else {
      this.$message({
        message: '请选择未处理公文进行撤回',
        type: 'warning'
      })
    }
  }
  // 获取选中列表
  handleselection(data) {
    this.handleSelectList = [];
    data.type.forEach(el => {
      if (el.documentProgressStatus == '1') {
        this.handleSelectList.push(el.publicId);
      }
    });
  }
}
