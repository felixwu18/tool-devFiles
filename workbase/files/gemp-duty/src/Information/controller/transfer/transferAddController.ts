import { ControllerBase, Watch, Inject } from 'prism-web'

export class TransferAddController extends ControllerBase {
  constructor() {
    super()
  }

  @Inject('http') http: any

  private leaderCfg = {
    isOnlyCheck: true,
    defaultCheckAll: true
  }
  private messageInfo: any = null//提示消息
  private detailsFlag = false //是否展示详情
  private detailsInfo = {} //详情展示
  private selected: Object = {}
  private reviceUserdata: Array<any> = [] //接收人
  private propdata = {
    isCheck: true,
    isSingleSelect: true,
    nowPage: 1,
    pageSize: 5,
    total: 0,
    config: [{
      type: 'string',
      label: '信息标题',
      width: '/',
      prop: 'infoTitle',
      badge: true
    }, {
      type: 'string',
      label: '报送单位',
      width: '320',
      prop: 'reportPerson'
    }, {
      type: 'string',
      label: '事件类型',
      width: '200',
      prop: 'infoTypeName'
    }, {
      type: 'string',
      label: '接报时间',
      width: '250',
      prop: 'reportDate'
    }],
    data: []
  }
  // 分页条件
  private serachItem = {
    nowPage: 1,
    total: 0,
    pageSize: 5,
    keyWord: ""
  }
  //紧急程度参数
  private disposePriorityData: Array<any> = []

  private rules = {
    title: [{ required: true, message: '请输入标题', trigger: 'change' }],
    orgCodes: [{ required: true, message: '请选择接收单位', trigger: 'change' }],
    userids: [{ required: true, message: '请选择接收人', trigger: 'change' }],
    disposePriority: [{ required: true, message: '请选择紧急程度', trigger: 'change' }],
    opinionContent: [{ required: true, message: '请输入转办内容', trigger: 'change' }],
  }

  private transferData: object = {
    infoId: '', //事件id
    opinionContent: '', //内容
    title: '', //转办事项
    userids: [], //接受人id
    orgCodes: [], //接受机构
    instructionIds: [], //领导批示id
    disposePriority: '', //紧急程度
    attachmentList: [], // 上传附件列表
    instruction: [], //领导批示
  };

  private messageDom: any = null
  created() {
    //获取转办督办-转办事项表格数据
    this.getTransactAddlist();
    //获取转办督办接收人
    this.http.InfoDutyRequest.findReviceUserByOrg().then((res) => {
      this.reviceUserdata = res.data  //全部
    })

    this.geturgencyLevel()
  }
  //获取转办督办-转办事项表格数据
  /**
   * Modify by chenzheyu  取消设置默认接收人
   * by 刘文磊 表格改卡片块  分页单独使用
   */
  getTransactAddlist() {
    this.http.InfoDutyRequest.transactAddlist(this.serachItem).then((res) => {
      if (res.status == 200) {
        this.$set(this.propdata, 'data', res.data.list);
        this.$set(this.serachItem, 'total', res.data.total);
      } else {
        this.$message.error(res.msg)
      }
    })
  }
  //分页
  handlePageChange(val) {
    this.serachItem['nowPage'] = val
    this.getTransactAddlist()
  }

  get showInstruction(): Boolean {
    let bool = JSON.stringify(this.selected) == "{}"
    return bool
  }

  getItem(data) {
    this.selected = data
  }

  // 列表按钮点击响应
  tablecallback(data) {
    this[data.type](data)
  }
  //领导批示复选框变更
  checkChange(checkedList) {
    this.$set(this.transferData, 'instructionIds', checkedList)
  }
    //列表排序
    sort(val) {
        console.log(val)
    }
    //表格行单选事件
    /**
     * Modify by chenzheyu 修改表单选中接收人
     * @param data 
     * by 刘文磊 点击后展示详情  转办内容及意见
     * by chenzheyu 转办内容删除
     */
    trSelectChange(data) {
        let curTr = data;
        this.$set(this.transferData, 'title', curTr.infoTitle);
        this.$set(this.transferData, 'infoId', curTr.infoId);
        this.$set(this.transferData, 'instruction', curTr.disposeList || [])
        let that = this;
        this.$nextTick(() => {
            that.$refs.leaderWrap['checkAll']();
        })
        
        this.detailsInfo = curTr
        this.detailsFlag = true
    }

    private temp = {
      style: require("../../style/transfer/transferAdd.less")
    }

  //转办督办保存按钮
  // by 刘文磊 关联事件提示 表单校验 获取附件
  private saveTransfer() {
    if (!this.detailsFlag) {
      if (this.messageInfo)
        this.messageInfo.close()
      return this.messageInfo = this.$message.warning("请先选择事件")
    }
    this.$refs.fomdata['validate']((valid) => {
      if (!valid) {
        if (this.messageInfo)
          this.messageInfo.close()
        return this.messageInfo = this.$message.warning("请将信息填写完整")
      }
      if (valid) {
        this.http.InfoDutyRequest.transactAdd(this.transferData).then((res) => {
          // 信息详情-新增转办督办
          if (res.status !== 200) {
            return this.$message({ type: "error", message: "保存失败" })
          }
          // 成功后，关闭弹框, 并加载信息详情信息
          this.$message({ type: "success", message: "保存成功" })
          this.$router.push('/information/transfer');
        })
      }
    })
  }
  /**
   * author by 刘文磊 返回事件列表
   */
  backlist() {
    this.detailsFlag = false
    this.transferData = {
      infoId: '',
      opinionContent: '',
      title: '',
      userids: [],
      orgCodes: [],
      instructionIds: [],
      disposePriority: '',
      attachmentList: [],
      instruction: [],
    };
    this.$refs.fomdata['resetFields']();

  }


  /**
   *  author by 刘文磊 获取紧急程度列表
   */
  geturgencyLevel() {
    this.http.InfoDutyRequest.urgencyLevel().then(res => {
      if (res.status==200) {
        this.disposePriorityData=res.data
      }else
      this.$message.error(res.msg)
    })
  }
}
