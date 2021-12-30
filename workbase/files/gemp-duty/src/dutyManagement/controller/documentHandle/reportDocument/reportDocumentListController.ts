import { ControllerBase, Inject } from 'prism-web'
import searchSession from '../../../../../assets/libs/searchData';

export class ReportDocumentListController extends ControllerBase {
  private temp = {
    style: require('../../../style/documentHandle/reportDocument/reportDocumentList.less')
  }
  constructor() {
    super()
  }
  @Inject('http') http: any

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
  // 列表查询参数
  private searchData: object = {
    documentTitle: "",//公文标题
    endTime: '',//公文接受结束时间
    nowPage: 1,//当前页数
    pageSize: 8,//每页条数
    receiveUnitCode: '',//接受单位code
    recevierId: "",//接收人Id
    sendUnitCode: '',//发送单位code
    senderId: "",//发送人id
    startTime: '',//公文接受开始时间
    upDowmType: '1'//公文操作类型 公文上报-1 公文下发2
  }
  //按钮控制
  private btnConfig = {
    add: false, //上报
    accurate: false,//精准搜索
    search: false,//搜索
  }
  // //列表添加操作参数
  private btnGroup: object = {
    // edit: { name: '接受', type: 'warning', emit: 'acceptDialog', expression: true },
    // delete: { name: '退回', type: 'danger', emit: 'returnDialog', expression: true }
    handle: { name: '撤回', emit: 'handle', type: 'success', expression: true }
  }
  private handleSelectList = []; //选中列表参数 

  private propData = {
    isCheck: true,
    pageSize: 8,
    total: 0,
    config: [
      {
        type: 'string',
        label: '公文标题',
        width: '/',
        prop: 'documentTitle',
        emit: 'reportDetail',
        color: '#66b1ff'
      },
      {
        type: 'string',
        label: '上报单位',
        prop: 'sendingUnitName'
      },
      {
        type: 'string',
        label: '公文类型',
        prop: 'documentTypeName'
      },
      // {
      //   type: 'string',
      //   label: '公文期号',
      //   prop: 'orgName'
      // },
      {
        type: 'string',
        label: '创建人',
        prop: 'creator',
        width:'/'
      },
      {
        type: 'string',
        label: '更新时间',
        prop: 'updateTime'
      },
      {
        type: 'string',
        label: '状态',
        prop: 'documentProgressStatusName',
        width:'120'
      },
      // 先暂时隐藏这一列
      {
        type: 'button',
        label: '操作',
        width: '100',
        prop: 'operate'
      }
    ],
    // tag展示列表
    tagArray: { '0': { name: '待签', type: 'danger' }, '1': { name: '待办', type: 'primary' }, '9': { name: '退回', type: 'info' } },
    data: []
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
        res.data.forEach((data) => {
          switch (data.privName) {
            case '上报':
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
  //角色权限
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

  // 获取列表数据
  getListData() {
    //获取登录人的OrgCode
    if (this.searchData['sendUnitCode'] == "") {
      if (window.sessionStorage.getItem("role")) {
        let role = JSON.parse(window.sessionStorage.getItem("role"))
        this.searchData['sendUnitCode'] = role.orgCode
      }
    }
    this.http.DocumentHandleRequest.documentHandleList(this.searchData).then(res => {
      if (res.status == 200) {
        this.propData.total = res.data.total
        this.propData.pageSize = res.data.pageSize
        let propDatas = res.data.list.map((item, index) => {
          if(item.documentTypeName=="值班信息"){
            item.documentTypeName="其他公文"
          }
          // item.operate = this.btnGroup
          // if (
          //   (item.documentProgressStatus == '1') ||
          //   (item.documentProgressStatus == '4')
          // ) {
          //   this.propData.config[6].showbutton = false
          //   item.operate = this.btnGroup
          // } else {
          //   // this.propData.config[6].showbutton = true
          //   item.operate = {}
          // }
          return item
        })
        this.propData.data = res.data.list.map((jtem, index) => {
          let obj =  JSON.parse(JSON.stringify(this.btnGroup));
            if(jtem.documentProgressStatus == '1') {
              obj['handle'].expression = true
            } else {
              obj['handle'].expression = false
            }
            jtem.operate = obj
          return jtem
        })
        this.$set(this.propData, 'data', propDatas)
      }
    })

  }
  getOrg(val) {
    let orgCode = val.prop.id
    this.$set(this.searchData, 'sendUnitCode', orgCode)
    //判断是否显示上报按钮
    if (this.currentRole == orgCode) {
      this.showReportButton = true
      this.searchData['senderId'] = this.activeUserId
    } else {
      this.showReportButton = false
      this.searchData['senderId'] = ''
    }
    this.getListData()
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
  //排序
  sort(data) {
    // console.log(data);
  }
  /* author by chengyun 上报按钮
   *  Modify by
   */
  reportAdd() {
    let code = this.searchData['sendUnitCode']
    this.$router.push({ path: '/dutyManagement/reportDocumentAdd', query: { tab: "2", code: code } })
  }
  /* author by chengyun 下发按钮
   *  Modify by
   */
  reportIssue() {
    this.$router.push({ path: '/dutyManagement/lowerHairDocumentAdd', query: { title: '新增下发公文' } })
  }
  /* author by chengyun 查看
   *  Modify by xinglu
   */
  //1-值班信息 2-外出报备 3-请假报告  
  reportDetail(data) {
    let code = this.searchData['sendUnitCode']
    let dataInfo = { id: data.rowVal.publicId, tab: "2", code: code }
    if (data.rowVal.documentProgressStatus && data.rowVal.documentProgressStatus == "4") {
      if (data.rowVal.documentType == "1") { this.$router.push({ path: '/dutyManagement/otherDocumnetEdit', query: dataInfo }) }
     // if (data.rowVal.documentType == "2") { this.$router.push({ path: '/dutyManagement/outgoingReport', query: dataInfo }) }
     
     if (data.rowVal.documentType == "2") { this.$router.push({ path: '/dutyManagement/outgoingReportEdit', query: dataInfo }) }
     if (data.rowVal.documentType == "3") { this.$router.push({ path: '/dutyManagement/leaveReportEdit', query: dataInfo }) }
    } else {
      if (data.rowVal.documentType == "1") { this.$router.push({ path: '/dutyManagement/otherDocumnetDetail', query: dataInfo }) }
      if (data.rowVal.documentType == "2") { this.$router.push({ path: '/dutyManagement/outgoingReportDetail', query: dataInfo }) }
      if (data.rowVal.documentType == "3") { this.$router.push({ path: '/dutyManagement/leaveReportDetail', query: dataInfo }) }
    }
  }

  /* author by chengyun 接受
   *  Modify by
   */
  acceptDialog() {
    this.$message('操作了接受')

  }

  /* author by chengyun 退回
   *  Modify by
   */
  returnDialog() {
    this.$message('操作了退回')
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
  // 单个撤回
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
            this.getListData();
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
      let paramRecall = {publicIds: this.handleSelectList}
      this.http.DocumentHandleRequest.getRecall(paramRecall).then(res => {
        if (res.status == 200) {
          this.$message({
            message: res.data,
            type: 'success'
          })
          this.getListData();
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
      // console.log(this.handleSelectList, 9999)
    });
  }
}
