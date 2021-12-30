import { ControllerBase, Inject, Watch, Prop } from 'prism-web'
import { Dialog } from 'element-ui'
import searchSession from '../../../../../assets/libs/searchData';
export class ReceiptDocumentListController extends ControllerBase {
  private temp = {
    style: require('../../../style/documentHandle/receiptDocument/receiptDocumentList.less')
  }
  private showSearch: Boolean = false
  //当前登录默认的机构
  private defaultchecked = JSON.parse(window.sessionStorage.getItem('role'))['orgCode']
  //记录当前页用户的单位Code
  private currentRole = JSON.parse(window.sessionStorage.getItem('role'))['orgCode']
  //记录当前用户的Code
  private activeUserId = JSON.parse(window.sessionStorage.getItem('role'))['userId']
  //根据用户判断是否显示操作列
  private showEdit: boolean = false
  //下拉框筛选
  private selectDocument = '0'
  //操作列是否显示
  private showbutton = false
  // 默认显示查看未读
  private readSign: string = '查看未读'
  // 列表时间查询参数
  private search_time: Array<any> = []
  // 列表查询参数
  private searchData: object = {
    documentTitle: '', //公文标题
    endTime: '', //公文接受结束时间
    nowPage: 1, //当前页数
    pageSize: 10, //每页条数
    receiveUnitCode: '', //接受单位code
    recevierId: '', //接收人Id
    sendUnitCode: '', //发送单位code
    senderId: '', //发送人id
    startTime: '', //公文接受开始时间
    upDowmType: '' //公文操作类型 公文上报-1 公文下发2
  }
  //按钮控制
  private btnConfig = {
    type: false, //我的工作
    accurate: false,//精准搜索
    search: false,//搜索
  }
  //列表添加操作参数
  private btnGroup: object = {
    edit: { name: '接收', type: 'warning', emit: 'acceptDialog', expression: true },
    delete: { name: '退回', type: 'danger', emit: 'returnDialog', expression: true }
  }
  @Inject('http') http: any
  @Inject('store') store: any
  @Prop() navselectcode: string
  @Watch('navselectcode')
  navselectcodeChange() {
    this.getListData()
  }

  private propData = {
    isCheck: false,
    pageSize: 10,
    total: 0,
    config: [
      {
        type: 'boolean',
        label: '公文标题',
        width: '/',
        // basehref: '',
        // passProp: 'infoId',
        badge: true,
        prop: 'documentTitle',
        emit: 'receiptDetail',
        color: '#66b1ff'
      },
      {
        type: 'string',
        label: '发文单位',
        prop: 'sendingUnitName',
        width: '/'
      },
      {
        type: 'string',
        label: '接收单位',
        prop: 'receiveUnitName',
        width: '/'
      },
      {
        type: 'string',
        label: '公文类型',
        prop: 'documentTypeName',
        width: '/'
      },
      {
        type: 'string',
        label: '发文时间',
        prop: 'createTime',
        width: '/'
      },
      {
        type: 'string',
        label: '创建人',
        prop: 'creator',
        width: '/'
      },
      // {
      //   type: 'string',
      //   label: '更新时间',
      //   prop: 'createTime',
      //   width: '/'
      // },
      {
        type: 'string',
        label: '状态',
        prop: 'documentProgressStatusName',
        width: '100'
      },
      {
        type: 'button',
        label: '操作',
        width: '260',
        prop: 'operate',
        showbutton: true
      }
    ],
    data: []
  }

  created() {
    const selectDocument = localStorage.getItem('selectDocument');
    if (selectDocument == '' || selectDocument == undefined || selectDocument == null) {
      this.selectDocument = '1';
      this.searchData['upDowmType'] = '1';
    } else {
      this.selectDocument = selectDocument;
      this.searchData['upDowmType'] = selectDocument;
    }
    this.store.dispatch('dutymanage/setReceipt',this.searchData)
    this.getPermissions()
    this.btnManagement()
    this.changeDuty(this.selectDocument);
    // console.log(this.propData.config[0].basehref, 888)
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
            case '公文类型':
              this.btnConfig.type = true
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
      // this.showReportButton = true
      this.showEdit = true
      this.searchData['recevierId'] = this.activeUserId
    }
  }
  //弹框
  private dialogConfig = {
    flag: false,
    titleName: '退回原因',
    componentName: '',
    propsData: {}
  }
  closeDialogCall(callInfo) {
    //关闭弹框
    this.dialogConfig.flag = false
    //重新刷新当前页面数据
    this.getListData()
  }

  query() {
    this.searchData['nowPage'] = 1
    this.store.dispatch('dutymanage/setReceipt',this.searchData)
    this.getListData()
  }
  // 获取列表数据 by xinglu
  getListData() {
    //显示操作列的按钮
    if (this.selectDocument == '1' && this.showEdit) {
      this.propData.config[6].showbutton = false
    } else {
      this.propData.config[6].showbutton = true
    }
    //获取登录人的OrgCode
    if (this.searchData['receiveUnitCode'] == '') {
      if (window.sessionStorage.getItem('role')) {
        let role = JSON.parse(window.sessionStorage.getItem('role'))
        this.searchData['receiveUnitCode'] = role.orgCode
        this.store.dispatch('dutymanage/setReceipt',{receiveUnitCode:role.orgCode})
      }
    }
    this.http.DocumentHandleRequest.documentHandleList(this.store.getters['dutymanage/getReceipt']).then((res) => {
      if (res.status == 200) {
        //获取分页
        this.propData.total = res.data.total
        this.propData.pageSize = res.data.pageSize
        let propDatas = res.data.list.map((item, index) => {
          item.operate = this.btnGroup
          if (
            (item.documentProgressStatus == '1' && this.selectDocument == '1' && this.showEdit) ||
            (item.documentProgressStatus == '4' && this.selectDocument == '1' && this.showEdit)
          ) {
            item.operate = this.btnGroup
          } else {
            item.operate = {}
          }
          if (item.documentType == "1") {
            item.documentTypeName ="其他公文"
          }
          return item
        })
        this.$set(this.propData, 'data', propDatas)
      }
    })
  }

  getOrg(val) {
    let orgCode = val.prop.id
    this.$set(this.searchData, 'receiveUnitCode', orgCode)
    //过滤列表
    if (this.currentRole == orgCode) {
      this.showEdit = true
      this.searchData['recevierId'] = this.activeUserId
    } else {
      this.showEdit = false
      this.searchData['recevierId'] = ''
    }
    this.getListData()
  }

  /**
   * author by chengyun 选择公文类型
   */
  changeDuty(val) {
    this.selectDocument = val
    localStorage.setItem('selectDocument', val);
    if(this.selectDocument=="2"){
      this.searchData['recevierId'] = ""
      // this.searchData['senderId']= this.activeUserId
    }else{
      this.searchData['recevierId'] = this.activeUserId
    }
    this.searchData['upDowmType'] = val
    this.getListData()
  }
  // 列表按钮点击响应
  tablecallback(data) {
    this[data.type](data)
  }

  // 翻页功能
  handlePageChange(data) {
    this.searchData['nowPage'] = data.rowVal
    this.store.dispatch('dutymanage/setReceipt',{nowPage: data.rowVal})
    this.getListData()
  }
  //排序
  sort(data) {
  }

  // // tab组件展示未读数功能
  // tabUnread(obj: object) {
  //   this.emit('unread', obj);
  // }
  /* author by chengyun 查看跳转
   *  Modify by xinglu
   */
  //公文类型  1-值班信息 2-外出报备 3-请假报告 4-批示下发 5-下发公文
  receiptDetail(data) {
    let dataInfo = { id: data.rowVal.publicId, tab: '1' }
    // if (this.selectDocument == '2') {
      if (data.rowVal.documentProgressStatus == '1') {
        this.acceptDialogUpdate(data)
      }
    // }
    if (data.rowVal.documentType == '1') {
      // this.$router.push({ path: '/dutyManagement/dutyInfoDetail', query: dataInfo })
      this.$router.push({ path: '/dutyManagement/otherDocumnetDetail', query: dataInfo })
      // this.propData.config
    }
    if (data.rowVal.documentType == '2') {
      this.$router.push({ path: '/dutyManagement/outgoingReportDetail', query: dataInfo })
    }
    if (data.rowVal.documentType == '3') {
      this.$router.push({ path: '/dutyManagement/leaveReportDetail', query: dataInfo })
    }
    if (data.rowVal.documentType == '4') {
      this.$router.push({ path: '/dutyManagement/lowerInstructsDetail', query: dataInfo })
    }
    if (data.rowVal.documentType == '5') {
      this.$router.push({ path: '/dutyManagement/lowerHairIssueDetail', query: dataInfo })
    }
  }
  /* author by chengyun 接受
   *  Modify by
   */

  private lists = {
    documentProgressStatus: '',
    publicId: ''
  }
  acceptDialog(val) {
    this.$set(this.lists, 'documentProgressStatus', '2')
    this.$set(this.lists, 'publicId', val.rowVal.publicId)
    this.http.DocumentHandleRequest.dealEvent(this.lists).then((res) => {
      if (res.status == 200) {
        this.getListData()
      }
    })
  }

  acceptDialogUpdate(val) {
    let dataInfo = { id: val.rowVal.publicId, tab: '1' }
    this.$set(this.lists, 'documentProgressStatus', '2')
    this.$set(this.lists, 'publicId', val.rowVal.publicId)
    this.http.DocumentHandleRequest.dealEvent(this.lists).then((res) => {
      if (res.status == 200) {
        this.getListData()
        if (val.rowVal.documentType == '4') {
          this.$router.push({ path: '/dutyManagement/lowerInstructsDetail', query: dataInfo })
        }
        if (val.rowVal.documentType == '5') {
          this.$router.push({ path: '/dutyManagement/lowerHairIssueDetail', query: dataInfo })
        }
      }
    })
  }


  accept(val) {
    this.$set(this.lists, 'documentProgressStatus', '2')
    this.$set(this.lists, 'publicId', val)
    this.http.DocumentHandleRequest.dealEvent(this.lists).then((res) => {
      if (res.status == 200) {
        this.getListData()
      }
    })
  }
  /* author by chengyun 退回
   *  Modify by xinglu
   */

  returnDialog(val) {
    this.dialogConfig.flag = true
    this.dialogConfig.titleName = '退回原因'
    this.dialogConfig.componentName = 'send-back'
    this.dialogConfig.propsData = val.rowVal
  }
}
