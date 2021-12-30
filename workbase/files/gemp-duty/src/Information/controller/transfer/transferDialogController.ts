import { ControllerBase, Prop, Inject, Emit, Watch } from 'prism-web'

export class transferDialogController extends ControllerBase {
  constructor() {
    super()
  }

  @Prop() propdata
  @Prop() infodisposeid
  @Emit('dialogcallback')
  closeDialogCall(infoId) {}
  @Inject('http') http: any

  //接收单位配置参数
  private optionProps = {
		value: 'id',
		label: 'label',
    children: 'children',
    disabled: "virtualNode",
    multiple: true,
    checkStrictly: true

	}
  // 图片查看弹框
  private showImage:Boolean = false
  // 图片查看url
  private checkImage:string = ''

  private temp = {
    style: require('../../style/transfer/transferDialog.less')
  }
  private rules = {
    orgCodes: [{ required: true, message: '请选择接收单位', trigger: 'change' }],
    // userids: [{ required: true, message: '请选择接收人', trigger: 'change' }],
    disposePriority: [{ required: true, message: '请选择紧急程度', trigger: 'change' }],
    opinionContent: [{ required: true, message: '请输入转办内容', trigger: 'change' }],
  }
  private reviceUserdata: Array<any> = [] //接收人
  private reviceOrgdata: Array<any> = [] //接收单位
  private transferData = {
    infoId: '', //事件id
    opinionContent: '', //内容
    title: '' , //转办事项
    userId:JSON.parse(sessionStorage.getItem('role')).userId,
    userids: [], //接受人id
    orgCodes: [], //接受机构
    instructionIds: [], //领导批示id
    disposePriority: '', //紧急程度
    attachmentList:[] // 上传附件列表
  }
  //紧急程度参数
  private disposePriorityData: Array<any> = []

  private messageDom:any = null
  //转办督办保存按钮
  // by 刘文磊 弹框校验交互
  private saveTransfer() {
    this.$refs.transferDialog['validate'](valid=>{
      if(valid){
        if (this.infodisposeid) {
          this.transferData.instructionIds = this.infodisposeid
        }
        let userids = []
        if(this.transferData.userids.length !== 0) {
          userids = this.transferData.userids.map(item => item[1])
        }

        let orgCodes = []
        this.transferData.orgCodes.forEach(item => {
          orgCodes.push(item.pop())
        })
        // console.log(this.transferData.orgCodes)
        // if(this.transferData.orgCodes.length !== 0) {
        //   orgCodes = this.transferData.orgCodes[0].splice(-1)
        // }
        this.http.InfoDutyRequest.transactAdd({ ...this.transferData, userids,orgCodes }).then((res) => {
          // 信息详情-新增转办督办
          if (res.status !== 200) {
            return this.$message(res.msg)
          }
          // 成功后，关闭弹框, 并加载信息详情信息
          this.$message('转办成功')
          this.emit('setprocess', '')
          this.closeDialogCall(this.propdata.infoId)
        })
      }else{
        if (this.messageDom) { this.messageDom.close() }
        this.messageDom = this.$message.warning('请按提示正确填写信息！')
        return false
      }
    })

  }
  private cancleTransfer() {
    this.closeDialogCall(this.propdata.infoId)
  }

  created() {
    // this.transferData.attachmentList = this.propdata.attachmentList
    this.http.InfoDutyRequest.findReviceUserByOrg().then((res) => {
      //获取转办督办接收人
    //   if (res.data) { this.reviceUserdata = res.data }
      // 转办督办参数赋值
      this.transferData.infoId = this.propdata.infoId
      this.transferData.title = this.propdata.infoTitle
      // this.transferData.attachmentList = this.propdata.attachmentList
      // this.transferData.orgCodes.push(this.propdata.orgCode)
      // this.transferData.userids.push(this.propdata.createPerson)
      this.geturgencyLevel()
      this.getTreeData()
    })
    
  }

  // //选中机构的返回值
  // getOrg(val) {
  //     this.transferData.orgCodes = val
  // }

  @Watch('transferData.orgCodes')
  orgCodesWatch(val) {
    if(val) {
      let OrgStr = ''
      val.forEach((el,index) =>{
        if(this.transferData.orgCodes[index].length == 1) {
          this.transferData.orgCodes[index].push(this.transferData.orgCodes[index][0])
        }
        OrgStr += index < val.length - 1? el[el.length - 1] + ',' :  el[el.length - 1]
      }) 
      this.getReviceUserData(OrgStr)
    }
  }

  /**
   *
   * 获取机构接收单位列表
   * @param {}
   * @return
   */
  async getTreeData() {
    const res = await  this.http.TreeNode.getAllTreeByTenantId()
    if(res.status == 200) {
      if(res.data.treeData[0].label == '国家') {
        this.reviceOrgdata = this.childrenData(res.data.treeData[0].children)
      }else {
        this.reviceOrgdata = this.childrenData(res.data.treeData)
      }
    }
  }

  /**
   *
   * 递归遍历机构接收单位列表，children为[]时，赋值为underfinded
   * @param  {data:"json数据"} 
   * @return data
   */
  childrenData(data){
    // 循环遍历json数据
    for(var i=0;i<data.length;i++){
        if(data[i].children.length<1){
            // children若为空数组，则将children设为undefined
            data[i].children=undefined;
        }else {
            // children若不为空数组，则继续 递归调用 本方法
            this.childrenData(data[i].children);
        }
    }
    return data;
}

  /**
   *
   * 获取机构接收人列表
   * @param {*} orgCodes
   * @returns
   * @memberof transferDialogController
   */
  async getReviceUserData(orgCodes) {
    this.transferData.userids = []
    const res = await this.http.InfoDutyRequest.getTransactGetusers(orgCodes)
    if(res.status !== 200) {
        this.$message.error('获取机构接收人列表失败！')
        return
    }
    if(Array.isArray(this.transferData.orgCodes)) {
        this.reviceUserdata = this.handleListData(res.data)
        return true
    }else {
        if(this.transferData.orgCodes === orgCodes) {
            this.reviceUserdata = this.handleListData(res.data)
            return true
        }
    }


    return false
  }

  // 查看图片方法
  viewImageCheck(url) {
      this.showImage = true
      this.checkImage = url
  }

  handleListData(list) {
    if(!list) return
    const arr = []
    list.forEach(element => {

      let num: number = -1
      if(arr.length != 0) {
        num = arr.findIndex(item => {
          return item.value === element.orgCode
        })
      }

      if(num !== -1) {
        arr[num].children.push({
          value: element.userId,
          label: element.name,
        })
      }else {
        arr.push({
          value: element.orgCode,
          label: element.orgName,
          children: [
            {
              value: element.userId,
              label: element.name,
            }
          ]
        })
      }
    })
    return arr
  }

  /**
 *  author by 刘文磊 获取紧急程度列表
 */
  geturgencyLevel() {
    this.http.InfoDutyRequest.urgencyLevel().then(res => {
      if (res.status == 200) {
        this.disposePriorityData = res.data
      } else
        this.$message.error(res.msg)
    })
  }
}
