import { ControllerBase,Inject } from 'prism-web'
import { timeFormat } from '../../../../assets/libs/commonUtils'
//电话记录列表
export class TelephoneMessageListController extends ControllerBase {
  private temp = {
    style: require('../../style/telephoneMessage/telephoneMessageList.less')
  }
  constructor() {
    super()
  }

  @Inject('http') http: any

  //向弹出框配置参数
  private dialogConfig: Object = {
    viewDialog: false, //弹框是否显示
    templateName: 'record-play-dialog', //弹框组件名
    tilteName: '播放录音' //标题头
  }
  //向弹出框传递参数
  private propsData: Object = {}
  //查看所有传参(传空) 查看未删传参(传0)

  private searchData = {
    endTime: "",
    keyWord: "",
    nowPage: 1,
    pageSize: 10,
    startTime: ""
  }


  //高级搜索的是否显示
  private showSearch: Boolean = false

  // 列表时间查询参数
  private search_time: Array<any> = []
  // 列表查询参数

  //列表添加操作参数
  private btnGroup: object = {
    delete: { name: '删除', type: 'danger', emit: 'telephoneDelete', expression: true }
  }


  private propData = {
    isCheck: false,
    pageSize: 10,
    total: 0,
    config: [
      {
        type: 'string',
        label: '主叫号码',
        width: '/',
        prop: 'callerNumber'
      },
      {
        type: 'string',
        label: '被叫号码',
        prop: 'calledNumber'
      },
      {
        type: 'string',
        label: '通话开始时间',
        prop: 'startTime'
      },
      {
        type: 'string',
        label: '通话结束时间',
        prop: 'endTime'
      },
      {
        type: 'string',
        label: '通话时长',
        prop: 'talkTime'
      },
      {
        type: 'directive',
        label: '播放录音',
        prop: 'attachName',
        width: '300',
        icon: 'el-icon-caret-right'
      },
      {
        type: 'directive',
        label: '下载录音',
        prop: 'attachUrlName',
        icon: 'el-icon-download'
      },
      {
        type: 'button',
        label: '操作',
        width: '120',
        prop: 'operate'
      }
    ],
    data: []
  }

  created() {
    this.getListData()
  }

  // 获取列表数据
  getListData() {
    if (this.search_time.length >0) {
      let arr = []
      this.search_time.forEach((item) => {
        arr.push(item)
      })
        this.searchData['startTime'] = timeFormat(arr[0])
        this.searchData['endTime'] = timeFormat(arr[1])
    } else {
      this.searchData['startTime'] = ''
      this.searchData['endTime'] = ''
    }
    let data = this.propData.data.map((item) => {
      item['operate'] = this.btnGroup
      return item
    })
    this.$set(this.propData, 'data', data)
    this.propData.total = this.propData.data.length + 1
		this.http.TelephoneMessage.telephoneMessageInfo(this.searchData).then(res =>{
      // debugger
      if(res.status == 200) {
        this.$set(this.propData,'data',res.data.list)
        let data = this.propData.data.map((item) => {
          item['operate'] = this.btnGroup
          item['attachUrlName'] = '下载'
          return item
        })
        // this.propData
      }
		})
  }

  /* author by chengyun 列表所有按钮点击响应
   *  Modify by
   */
  tablecallback(data) {
    this[data.type](data)
  }

  directiveFun(val) {
    if (val.buttonItem == '下载') {
      this.$message('点击了下载')
    }else  {
      this.dialogConfig['viewDialog'] = true
    }
    
  }
  /* author by chengyun 翻页功能
   *  Modify by
   */
  handlePageChange(data) {
    this.searchData['nowPage'] = data.rowVal
    this.getListData()
  }

  /* author by chengyun 删除
   *  Modify by
   */
  telephoneDelete(val) {
    let id = val.rowVal.telRecordId
    this.http.TelephoneMessage.telephoneMessageDelete(id).then(res =>{
      if(res.status == 200) {
        this.$message("删除成功")
        this.getListData()
      }
    })
    
  }

  /* author by chengyun 关闭弹框
   *  Modify by
   */
  closeDialogCall() {
    //关闭弹框
    this.dialogConfig['viewDialog'] = false
  }
}
