import { ControllerBase, Prop, Emit, Watch, Inject } from 'prism-web'
/**
 * Modify by huihui 修改点击常用语功能
 */
export class LowerHaireReportController extends ControllerBase {
    private activeLeader: Array<any> = []; //选择的领导
    private approvalContent: String = '';//建议
    private leaderList: Array<any> = [{ reportId: '1', reportName: '名师红', reportType: '2' }];
    private messageDom: any = null // message实体
    private reviceUserdata: Array<any> = [] //接受人
    private checkedOrgs:string = ''

    constructor() {
        super()
    }
    @Inject("http") http: any
    @Prop() propdata
    @Watch("propdata",{deep:true})
    watchProp(val) {
        this.$set(this,'listParams',val)
    }
    private listParams
    private temp = {
        style: require('../../style/documentHandle/reported.less')

    }
    private tab: string
    private rules = {
        orgCodes: [{ required: true, message: '请选择接受单位', trigger: 'change' }],
        userids: [{ required: true, message: '请选择接收人', trigger: 'change' }]
    }


      //接收单位配置参数
    private optionProps = {
        value: 'id',
        label: 'label',
        children: 'children',
        disabled: "",
        multiple: true,
        checkStrictly: false
    }
    private reviceOrgdata: Array<any> = [] //接收单位
    //接收单位列表
    private getOrgList = []
    private role
    //接收人列表
    private getOrgPeopleList = []
    private SJDW: any = ''; // 上级主管单位名
    
    created() { 
        this.listParams = JSON.parse(JSON.stringify(this.propdata))
        this.role = JSON.parse(sessionStorage.getItem("role"))
        this.getRoleInfo()
        this.getgroupOrgList()
    }
    //获取用户信息
    getRoleInfo() {
        let unitOrgCode = ""
        if (window.sessionStorage.getItem("role")) {
            let role = JSON.parse(window.sessionStorage.getItem("role"))
            unitOrgCode = role.orgCode
            this.listParams.recevierId = role.userId
        }
    }

    // 点击获取常用语的值
    /**
     * Modify by huihui 修改点击常用语功能
     * @param e 
     */
    getDomData(e) {
        this.$refs.emoticon['updateContent'](e.currentTarget.innerHTML)
    }

  /**
   *
   * 获取分组机构接收单位列表
   * @param {}
   * @return
   */
    async getgroupOrgList(){
        let params = {
            "orgCode":this.role.orgCode
        }
        const res = await this.http.DocumentHandleRequest.getGroupOrg(params)
        if(res.status == 200) { 
            this.reviceOrgdata = res.data.filter(it => !it.children == false);
        }
    }

  /**
   *
   * 获取机构接收单位列表
   * @param {}
   * @return
   */
  async getTreeData() {
    const res = await  this.http.TreeNode.getTreeByTenantId()
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

    //保存按钮
    saveFun() {
        if (!this.transferData.receiveUnitCode) {
            this.$message({
                type: 'warning',
                message: '请选择单位'
            })
        } else {
            if (this.$route.query.tab) {
                this.tab = this.$route.query.tab.toString()
            }
            this.$refs.documentReported['validate'](valid => {
                if (!valid) {
                    if (this.messageDom) { this.messageDom.close() }
                    this.messageDom = this.$message({
                        type: 'warning',
                        message: '您还有未填字段'
                    })
                    return false
                }
                let objInfo = JSON.parse(JSON.stringify(this.listParams) ) 
                
                objInfo['documentProgressStatus'] = "1"
                Object.assign(objInfo, this.transferData)
                objInfo.receiveUnitName = this.SJDW
                delete objInfo.receiveUnitCode
                //单选方法
                // this.$set(objInfo,'receiveUnitCode',this.transferData.receiveUnitCode[this.transferData.receiveUnitCode.length-1])
                let receivecontent = this.approvalContent
                objInfo.receivecontent = receivecontent.replace(/"/g, '\'')
                //多选方法
                let codeData =  this.$refs.cascader['getCheckedNodes'](false)
                let codeArr = []
                codeData.map((it,index) =>{
                    if(!it.data.children) {
                        codeArr.push( {
                            $type:"DutyDoucmentExtend,http://www.dv.com",
                            receiveUnitCode: it.data.id,
                            receiveUnitName: it.data.label,
                          })
                    }
                })
                this.$set(objInfo,'batchReceiveUnit',codeArr)
                if (objInfo['reviewLeaderId']) {
                    if (objInfo.downSendingId) {
                        // 修改下发批示
                        let arr = Object.getOwnPropertyNames(objInfo)
                        arr.forEach(item => {
                            if (item.indexOf("Time") > 0 || item.indexOf("Date") > 0) {
                                objInfo[item] = new Date(objInfo[item])
                            }
                        })
                        this.http.DocumentHandleRequest.receipInstructsIssueEdit(objInfo).then(res => {
                            if (res.status == 200) {
                                this.$message({
                                    type: "success",
                                    message: "下发批示成功"
                                })
                                this.goback()
                            }
                        })
                    } else {
                        // 新增下发批示
                        this.http.DocumentHandleRequest.receipInstructsIssueAdd(objInfo).then(res => {
                            if (res.status == 200) {
                                this.$message({
                                    type: "success",
                                    message: "下发批示成功"
                                })
                                this.goback()
                            }
                        })
                    }
                } else {
                    if (objInfo.downSendingId) {
                        // 修改下发公文
                        let arr = Object.getOwnPropertyNames(objInfo)
                        arr.forEach(item => {
                            if (item.indexOf("Time") > 0 || item.indexOf("Date") > 0) {
                                objInfo[item] = new Date(objInfo[item])
                            }
                        })
                        this.http.DocumentHandleRequest.receipIssueEdit(objInfo).then(res => {
                            if (res.status == 200) {
                                this.$message({
                                    type: "success",
                                    message: "修改下发公文成功"
                                })
                                this.goback()
                            }else{
                                this.$message({
                                    type: "warning",
                                    message: res.msg
                                })
                            }
                        })
                    } else {
                        // 新增下发公文
                        this.http.DocumentHandleRequest.receipIssueAdd(objInfo).then(res => {
                            if (res.status == 200) {
                                this.$message({
                                    type: "success",
                                    message: "下发公文成功"
                                })
                                this.goback()
                            }else{
                                this.$message({
                                    type: "warning",
                                    message: res.msg
                                })
                            }
                        })
                    }
                }
            })
        }

    }

    @Emit('dialogcallback')
    closeDialogCall(infoId) {
        return infoId
    }
    private transferData: any = {
        receiveName: "", //接受人姓名
        receiveUnitCode: [], //接受机构
        recevierId: "", // 接收人id
        receiveUnitName: '', //公文接收单位名称
    }

    selectpeople(val) {
        let currentVal = this.getOrgPeopleList.filter(item => {
            return item.userId == val
        })[0]
        this.$set(this.transferData, "receiveName", currentVal['name'])
    }
    // 返回按钮 by xinglu
    goback() {
        if (this.$route.query.tab) {
            this.tab = this.$route.query.tab.toString();
            this.$router.push(`/dutyManagement/documentHandle?tab=${this.tab}`);
        } else {
            // this.$router.go(-1);
            this.tab = this.$route.query.tab.toString();
            this.$router.push(`/dutyManagement/documentHandle?tab=${this.tab}`);
        }
    }

    // 设置选中机构名字
    setCheckedOrgs(node) {
        let checkeList:Array<any> = this.$refs.cascader['getCheckedNodes']()
        this.checkedOrgs = checkeList.map(item => item.label).toString()
    }
}
