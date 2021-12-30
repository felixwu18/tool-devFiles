import { ControllerBase, Prop, Inject, Emit, Watch } from 'prism-web'

export class MsgAppendSendDialogController extends ControllerBase {
  constructor() {
    super()
  }

  @Prop() propdata
  @Prop() infodisposeid
  @Prop() infocontent

  @Inject('http') http: any
  private templateName: string = ''
  private tilteName: string = ''
  private propsData: Object = { infoDisposeId: '' }
  private propId
  private defaultchecked
  private reviceOrgdata: Array<any> = [] //接收单位
  private flag: Boolean = false
  private click(el: string, name: string) {
    this.flag = true
    this.templateName = el
    this.tilteName = name
  }
  private temp = {
    style: require('../../style/transfer/msgAppendSendDialog.less')
  }
  private rules = {
    orgCodes: [{ required: true, message: '请选择接收单位', trigger: ['change', 'blur'] }],
    opinionContent: [{ required: true, message: '请输入转办意见', trigger: ['change', 'blur'] }]
  }
  //接收单位配置参数
  private optionProps = {
    value: 'id',
    label: 'label',
    children: 'children',
    disabled: "virtualNode",
    multiple: true,
    checkStrictly: true

  }
  private reviceUserdata: Array<any> = [] //接收人
  private transferData = {
    infoId: '', //事件id
    opinionContent: '', //内容
    title: '', //转办事项
    userids: [], //接受人id
    orgCodes: [], //接受机构
    instructionId: [], //领导批示id
    disposePriority: this.propdata['disposePriority'], //紧急程度
    attachmentList: [] // 上传附件列表
  }
  private messageDom: any = null

  //追加发送确定按钮
  // by 刘文磊 表单校验逻辑修改
  private saveTransfer() {
    if (this.transferData.orgCodes.length == 0 && this.transferData.userids.length == 0) {
      if (this.messageDom) { this.messageDom.close() }
      this.messageDom = this.$message.warning('请选择接收单位或接收人')
    } else {

      let userids = []
      if (this.transferData.userids.length !== 0) {
        userids = this.transferData.userids.map(item => item[1])
      }
      // let transferDataOrg = this.transferData.orgCodes
      // this.transferData.orgCodes = transferDataOrg
      let orgCodes = []
      this.transferData.orgCodes.forEach(item => {
        orgCodes.push(item.pop())
      })
      this.http.GempInfoBaseRequest.msgAppendSend({ ...this.transferData, userids,orgCodes }).then((res) => {
        if (res.status == 200) {
          this.$message.success(res.msg)
          this.emit('setTransferProcess', '')
          this.closeDialogCall(this.propdata)
        } else {
          return this.$message.warning(res.msg)
        }
      })
    }
  }

  created() {
    this.propsData = { infoDisposeId: this.$route.query.id }/* author by rendaming */
    if (this.propdata.orgCodes) {
      this.defaultchecked = JSON.parse(JSON.stringify(this.propdata.orgCodes))
      // this.transferData.orgCodes.concat(this.defaultchecked)
    }
    this.getTreeData()
    this.transferData['infoId'] = this.$route.query.id.toString()
    this.transferData['title'] = this.infocontent.infoTitle.toString()
    // this.transferData['opinionContent'] = this.infocontent.infoDescription.toString()
    // this.http.InfoDutyRequest.findReviceUser().then((res) => {
    //   //获取信息追加发送接收人
    //   if (res.data) { this.reviceUserdata = res.data }
    //   // 信息追加发送参数赋值
    //   this.transferData.title = this.propdata.infoTitle
    //   // this.transferData.orgCodes.push(this.propdata.orgCode)
    //   // this.transferData.orgCodes = this.propdata.orgCode
    //   // this.transferData.userids.push(this.propdata.createPerson)
    //   // this.transferData.userids = this.propdata.createPerson
    // })

  }
  /**
 *
 * 获取机构接收单位列表
 * @param {*} orgCodes
 * @return
 */
  async getTreeData() {
    const res = await this.http.TreeNode.getTreeByTenantId()
    if (res.status == 200) {
      if (res.data.treeData[0].label == '国家') {
        this.reviceOrgdata = this.getTreeList(res.data.treeData[0].children)
      } else {
        this.reviceOrgdata = this.getTreeList(res.data.treeData)
      }
    }
  }

  getTreeList(data) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].children.length < 1) {
        // children若为空数组，则将children设为undefined
        data[i].children = undefined;
      } else {
        // children若不为空数组，则继续 递归调用 本方法
        this.getTreeList(data[i].children);
      }
    }
    return data;
  }
  @Emit('dialogcallback')
  closeDialogCall(propdata) {

  }

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
   * 获取机构接收人列表
   * @param {*} orgCodes
   * @returns
   * @memberof transferDialogController
   */
  async getReviceUserData(orgCodes) {
    this.transferData.userids = []
    const res = await this.http.InfoDutyRequest.getTransactGetusers(orgCodes)

    if (res.status !== 200) {
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

  handleListData(list) {
    const arr = []
    if (Array.isArray(list)) {
      list.forEach(element => {
        let num: number = -1
        if (arr.length != 0) {
          num = arr.findIndex(item => {
            return item.value === element.orgCode
          })
        }
        if (num !== -1) {
          arr[num].children.push({
            value: element.userId,
            label: element.name,
          })
        } else {
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
    }
    return arr
  }
}
