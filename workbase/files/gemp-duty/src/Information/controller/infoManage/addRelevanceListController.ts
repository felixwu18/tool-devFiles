import { ControllerBase, Inject, Emit, Prop, Watch } from 'prism-web'

export class addRelevanceListController extends ControllerBase {
  private searchKey: String = ''

  private showSearch: Boolean = false

  private infoId: string = '' // 主信息ID

  private secondInfos: Array<string> = [] // 关联信息ID数组

  private messageDom: any = null   // message提醒框实体对象

  // 列表查询参数
  private searchData = {
    // "infoId": this.infoId,
    // "infoTitle": "",
    // "nowPage": 1,
    // "pageSize": 10,
    // "reportDateStr": "",
    // "reportOrgName": "",
    // "infoType": ""
    "eventTypes": '',
    "infoId": this.infoId,
    "infoTitle": "",
    "nowPage": 1,
    "pageSize": 10,
    "secondInfos": [
      ""
    ]
  }

  @Watch('searchData.eventTypes')
  eventTypesChange(newVal, oldVal) {
    if (newVal != oldVal) {
      this.getMessageList()
    }
  }



  @Inject("http") http: any


  created() {
    if (this.$route.query.id == undefined) {
      this.infoId = this.$route.query.detailUrlId.toString()
    } else {
      this.infoId = this.$route.query.id.toString()
    }

    this.searchData['infoId'] = this.infoId
    this.getMessageList()
  }

  // 列表按钮点击响应
  tablecallback(data) {
    this[data.type](data);
  }

  handlePageChange(data) {
    this.searchData["nowPage"] = data.rowVal
    this.getMessageList()
  }

  // 获取关联信息列表
  getMessageList(page?) {
    const searchData = JSON.parse(JSON.stringify(this.searchData));
    if(!!page && typeof(page) === 'number') {
      searchData.nowPage = page
    }
    searchData.infoTitle = searchData.infoTitle.trim()
    this.http.GempInfoBaseRequest.getConnectList({
      ...searchData,
      eventTypes: searchData.eventTypes.length > 0 ? [searchData.eventTypes] : []
    }).then(item => {
      this.propData.total = item.data.total
      this.propData.pageSize = item.data.pageSize
      this.$set(this.propData, 'data', item.data.list)
    })
  }

  // 关联信息接口
  addMessage() {
    this.secondInfos = []
    this.$refs.getListData['selecteddata'].map((item, index) => {
      this.secondInfos.push(item.infoId)
    })
    if (this.secondInfos.length > 0) {
      const data = {
        "infoId": this.infoId,
        "secondInfos": this.secondInfos
      }
      this.getAssocciationInfo(data)
    } else {
      if (this.messageDom) {
        this.messageDom.close()
      }
      this.messageDom = this.$message({
        type: 'warning',
        message: '您还未选择关联信息'
      })
      return
    }
  }

  // 得到关联信息
  getAssocciationInfo(data) {
    this.http.GempInfoBaseRequest.addAssocciation(data).then(item => {
      if (item.status === 200) {
        this.$message.success('关联信息成功！')
        this.updateAssocciationInfoViewData()
        this.closeDialogCall();
      } else {
        this.$message({
          type: 'error',
          message: item.msg
        })
      }
    })
  }

  // 更新相关信息下的数据
  updateAssocciationInfoViewData() {
    this.emit("udpateassocciationinfoview", '');
  }

  // 关闭弹窗
  @Emit('dialogcallback')
  closeDialogCall() {
  }

  // 关闭弹窗
  // closeDialog() {
  //     this.operatBtnClick();
  // }
  // @Emit('tableCallBack')
  // operatBtnClick() {
  //     return false
  // }
  private propData = {
    isCheck: true,
    pageSize: 10,
    total: 0,
    config: [
      {
        type: 'string',
        label: '标题',
        width: '/',
        prop: 'infoTitle'
      },
      {
        type: 'string',
        label: '事件类型',
        width: '/',
        prop: 'infoTypeName'
      },
      {
        type: 'string',
        label: '接报时间',
        width: '/',
        prop: 'reportDate'
      },
      {
        type: 'string',
        label: '报送单位',
        width: '/',
        prop: 'reportOrgName'
      }
    ],
    data: [

    ]
  }

  constructor() {
    super()
  }

  private temp = {
    style: require('../../style/infoManage/addRelevanceList.less')
  }

  /**
   * Author by chenzheyu 列表点击事件 判断是否有关联子信息
   * @param data 
   */
  selectionChange(data) {
    // data.type.forEach(item => {
    //   if (item.chainId != null) {
    //     if (this.messageDom) {
    //       this.messageDom.close()
    //     }
    //     this.messageDom = this.$message({
    //       type: 'warning',
    //       message: '该信息已有子信息,无法被关联'
    //     })
    //     this.$refs.getListData['$refs'].table.toggleRowSelection(item, false)
    //   }
    // })
  }

  searchUnread() {

  }

  selectEventType(val) {
    console.log(val)
  }

}
