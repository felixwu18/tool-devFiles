import { ControllerBase, Inject, Watch } from 'prism-web'
import { timeFormat, getRequestUrl } from '../../../../assets/libs/commonUtils'
import searchSession from '../../../../assets/libs/searchData'
const $ = require('jquery')

export class EditDestineControler extends ControllerBase {
  constructor() {
    super()
  }
  @Inject("http") http: any
  private temp = {
    style: require('../../style/conferencereserve/editDestine.less')
  }

  private searchData: object = {
    dtime: "",
    roomId: "", //
    listOrder: {},//排序参数
    nowPage: 1,//当前页数
    pageSize: 3//每页条数
  }
  
  private ruleForm: any = {
    roomName:'',
    totalNum: 0,
    chairmanNum: 0,
    surroundingNum:0,
    multimediaFlag: '',
    enabledFlag: ''
  }

  private propData = {
    isCheck: false,
    pageSize: 10,
    total: 0,
    config: [
      {
        type: 'string',
        label: '预定时间',
        width: '/',
        prop: 'scheduledTime',
        unsortable: true
      },
      {
        type: 'string',
        label: '预定人',
        width: '/',
        prop: 'reserveName',
        unsortable: true
      },
      {
        type: 'string',
        label: '使用人',
        width: '/',
        prop: 'usingLeader',
        unsortable: true
      },
      {
        type: 'string',
        label: '参会人数',
        width: '/',
        prop: 'participantNum',
        unsortable: true
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

  private messageDom: any = null // message实体
  private viewDialog: boolean = false;
  private templateName: string = '';
  private titleName: string = '';
  private propsData: Object = {};
  private historyList: any = []

  private btnGroup: object = {
    edit: { name: '编辑', type: 'primary', emit: 'edit', expression: true },
    history: { name: '历史', type: 'primary', emit: 'history', expression: true, },
    delete: { name: '删除', type: 'danger', emit: 'delete', expression: true, },
  }

  private rules = {
    meetingStartTime: [{ required: true, message: '请选择会议开始时间', trigger: ['change', 'blur'] }],
    participantNum: [{ required: true, type: 'number', message: '请输入数字', trigger: ['change', 'blur'] }],
    meetingEndTime: [{ required: true, message: '请选择会议结束时间', trigger: ['change', 'blur'] }],
    reserveName: [{ required: true, message: '请输入预订人', trigger: ['change', 'blur'] }],
    reserveDept: [{ required: true, message: '请输入预订人处室', trigger: ['change', 'blur'] }],
    reservePhone: [{ required: true, message: '请输入预订人电话', trigger: 'change' },{ validator: this.validatePhone, trigger:  ['change', 'blur'] },],
    meetingAgenda: [{ required: true, message: '请输入会议议题', trigger: ['change', 'blur'] }],
  }

  created() {
    this.searchData['roomId'] = this.$route.query.roomId
    this.searchData['dtime'] = this.$route.query.dtime
    this.getListData()
  }

   //编辑
   edit(data) {
    this.viewDialog = true;
    this.titleName = data.rowVal?"会议室预定编辑":"会议室预定查看"
    this.templateName = 'detail-destine';
    this.propsData = data.rowVal?data.rowVal:data
    this.propsData['isShow'] = data.rowVal?false:true
  }

  //历史
  async history(data) {
   let reserveId = data.rowVal.reserveId
   const res = await this.http.ConferenceroomRequest.reserveHistory({reserveId:reserveId})
      if (res.status !== 200) {
        return
      }
      this.historyList = res.data
  }

  //删除
  delete(data) {
       this.$confirm('此操作将删除该条预定记录,是否确认?', {title: '提示', confirmButtonText: '确定', cancelButtonText: '取消', type: "warning" }).then(() => {
        let reserveId = data.rowVal.reserveId
        this.http.ConferenceroomRequest.deleteHistory({reserveId:reserveId}).then(res=>{
          if (res.status!==200) {
            return
          }
          this.$message.success('删除成功！')
          this.getListData();
        })
           
     }).catch(() => {
         this.$message({ type: "info", message: "已取消删除" })
     })
     
   }

  //关闭弹框的回调函数
  closeDialogCall(callInfo) {
    //关闭弹框
    this.viewDialog = false;
    //重新刷新当前页面数据
    this.getListData();
  }

  getListData() {
    this.http.ConferenceroomRequest.editDestine(this.searchData).then(res => {
      if (res.status == 200) {
        this.ruleForm['roomName'] = res.data.roomName
        this.ruleForm['totalNum'] = res.data.totalNum
        this.ruleForm['chairmanNum'] = res.data.chairmanNum
        this.ruleForm['surroundingNum'] = res.data.surroundingNum
        this.ruleForm['multimediaFlag'] = res.data.multimediaFlag
        this.ruleForm['enabledFlag'] = res.data.enabledFlag

        this.propData.total = res.data.reserveInfoPages.total
        this.propData.pageSize = res.data.reserveInfoPages.pageSize
        this.propData.data = res.data.reserveInfoPages.list.map((item, index) => {
            item['scheduledTime'] = item.meetingStartTime + "-" + item.meetingEndTime
            item.operate = this.btnGroup
            return item
        })
      }

    })
  }

  //校验手机号
  validatePhone(rule, value, callback) {
    if (!value) {
          return callback(new Error("请输入正确的联系电话"))
        }else {
          if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) {
          return callback(new Error("请输入正确的联系电话"))
        } else {
          return callback()
        }
      }
    }

    async saveDraftPr() {
      let drafsform = this.ruleForm;
      const res = await this.http.ConferenceroomRequest.addDestine(drafsform)
      if (res.status !== 200) {
        return
      }
      this.$message.success('添加成功！')
      this.$router.push('/conferenceroom/conferencereserve')
    }

  saveDraft() {
    if (!this.ruleForm['roomName']) {
      if (this.messageDom) {
        this.messageDom.close();
      }
      this.messageDom = this.$message({
        type: 'warning',
        message: '请填写会议室名称',
      });
      return false;
    } else {
      if (this.ruleForm['roomName'].length > 50) {
        if (this.messageDom) {
          this.messageDom.close();
        }
        this.messageDom = this.$message({
          type: 'warning',
          message: '会议室名称最大长度为50',
        });
        return false;
      } else {
        let error = document.getElementsByClassName('el-form-item__error')
        if (error.length > 0) {
          if (this.messageDom) {
            this.messageDom.close()
          }
          this.messageDom = this.$message({
            type: 'warning',
            message: '请按提示正确填写信息'
          })
          return false
        }
        this.saveDraftPr()
      }
    }
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


  getBack() {
    this.go('/conferenceroom/conferencereserve')
  }
}
