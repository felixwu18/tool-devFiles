import { ControllerBase, Inject } from 'prism-web'
import { timeFormat } from '../../../../../assets/libs/commonUtils'
export class ReplacementController extends ControllerBase {
  private temp = {
    style: require('../../../style/substitute/replacement/replacement.less')
  }
  @Inject('http') http: any
  constructor() {
    super()
  }
  private orgCode = ""
  //关键字
  private keyWord = ""
  private messageDom: any = null // message实体
  //换班时间
  private search_time = []
  //是否显示高级搜索框
  private showSearch: boolean = false
  //请求参数
  private listParams = {
    applicantName: "",//申请人
    endTime: "",	//结束时间
    nowPage: 1,	//当前页数
    pageSize: 8,//每页条数
    peopleName: "",//换班/替班人
    startTime: "",//开始时间
    swapInsteadType: "1",//替班or换班
    orgCode:""
  }
  //表格数据
  private propData = {
    isCheck: false,
    pageSize: 10,
    total: 1,
    config: [
      {
        type: 'string',
        label: '申请人',
        width: '/',
        prop: 'applicantName'
      },
      {
        type: 'string',
        label: '替班人',
        width: '/',
        prop: 'peopleName'
      },
      {
        type: 'string',
        label: '替班时间',
        width: '/',
        prop: 'swapInsteadTime'
      },
      {
        type: 'string',
        label: '替班类型',
        width: '/',
        prop: 'exchangeTypeName'
      },
      {
        type: 'string',
        label: '替班原因',
        width: '/',
        prop: 'exchangeReason'
      },
      {
        type: 'button',
        label: '操作',
        width: '200',
        prop: 'operate'
      }
    ],
    data: []
  }
  //操作按钮
  private btnGroup = {
    edit: { name: '编辑', type: 'warning', emit: 'edit', expression: true },
    delete: { name: '删除', type: 'danger', emit: 'delete', expression: true, },
  }
  //添加弹框
  private dialogOption = {
    flag: false,
    titleName: "替班",
    componentName: "",
    propsData: {}
  }
  //关闭弹框
  closeDialogCall(callInfo) {
    //关闭弹框
    this.dialogOption.flag = false
    //重新刷新当前页面数据
    this.getListData()
  }
  //添加按钮事件
  addchangeduty() {
    var data = ""
    setTimeout(() => {
      this.dialogOption.flag = true
      this.dialogOption.titleName = "新增信息"
      this.dialogOption.componentName = "replacement-add"
      this.dialogOption.propsData = data
    }, 350)
  }

  // 列表按钮点击响应
  tablecallback(data) {
    this[data.type](data)
  }
  //获取数据
  getListData() {
    this.http.WorkforceManagementRequest.getSubstituteList(this.listParams).then(res => {
      if (res.status == 200) {
        this.propData.pageSize = res.data.pageSize
        this.propData.total = res.data.total
        this.propData.data = res.data.list.map(item => {
          // item.deleteFlag = Number(item.deleteFlag)
          // if (item.deleteFlag != "1") {    
          item.operate = this.btnGroup
          // }
          return item
        })
      } else {
        if (this.messageDom) { this.messageDom.close() }
        this.messageDom = this.$message({
          type: 'warning',
          message: '查询失败'
        })
      }
    })
  }
  created() {
    this.orgCode = JSON.parse(window.sessionStorage.getItem('role')).orgCode
    this.listParams.orgCode = JSON.parse(window.sessionStorage.getItem('role')).orgCode
    this.getListData()
    this.onNotify()
  }
  //编辑事件
  edit(data) {
    setTimeout(() => {
      this.dialogOption.flag = true
      this.dialogOption.titleName = "编辑信息"
      this.dialogOption.componentName = "replacement-edit"
      this.dialogOption.propsData = data.rowVal
    }, 350)
  }
  onNotify() {
    this.on("replacementEditWindow", (data) => {
      this.closeDialogCall(data)
      this.getListData()
    })
  }
  //删除事件
  delete(data) {
    let deleteInfo = {
      "applicantName": "",
      "endTime": "",
      "exchangeId": data.rowVal.exchangeId,
      "nowPage": 1,
      "pageSize": 10,
      "peopleName": "",
      "startTime": "",
      "swapInsteadType": "1"
    }
    this.$confirm('删除后不可恢复，是否继续?','提示').then(() => {
      this.http.WorkforceManagementRequest.Substitutedelete(deleteInfo).then(res => {
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
          this.getListData()
        }
      })
    }).catch(() => { })
  }
  //高级搜索全部按钮事件
  getAllDataBytime() {
    this.search_time = []
    // this.getListData()
  }
  //高级搜索确定按钮
  getdata() {
    if (this.search_time) {
      this.listParams['startTime'] = this.search_time[0]
      this.listParams['endTime'] = this.search_time[1]
    } else {
      this.listParams['startTime'] = ''
      this.listParams['endTime'] = ''
    }
    this.getListData()
  }
  //翻页按钮
  handlePageChange(data) {
    this.listParams['nowPage'] = data.rowVal
    this.getListData()
  }
  //排序
  sort(data) {
    // console.log(data);
  }
 
  // 选择机构
  getOrg(val){
    this.orgCode = val.prop.id
    this.listParams.orgCode=val.prop.id
    this.getListData()
  }
}
