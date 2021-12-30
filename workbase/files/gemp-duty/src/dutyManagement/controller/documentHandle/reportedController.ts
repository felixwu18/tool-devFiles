import { ControllerBase, Prop, Emit, Watch, Inject } from 'prism-web'
/**
 * Modify by huihui 修改点击常用语功能
 */
export class ReportedController extends ControllerBase {
    private activeLeader: Array<any> = []; //选择的领导
    private approvalContent: String = '';//建议
    private leaderList: Array<any> = [{ reportId: '1', reportName: '名师红', reportType: '2' }];
    private messageDom: any = null // message实体
    private reviceUserdata: Array<any> = [] //接受人

    constructor() {
        super()
    }
    @Inject("http") http: any
    @Prop() propdata

    private temp = {
        style: require('../../style/documentHandle/reported.less')

    }
    private tab: string
    private rules = {
        orgCodes: [{ required: true, message: '请选择接收单位', trigger: 'change' }],
        userids: [{ required: true, message: '请选择接收人', trigger: 'change' }],
        // disposePriority: [{ required: true, message: '请选择紧急程度', trigger: 'change' }],
        // opinionContent: [{ required: true, message: '请输入转办内容', trigger: 'change' }],
    }
    //请求参数
    private listParams
    //接收单位列表
    private getOrgList = []
    private SJDW: any = ''; // 上级主管单位名
    // 拼接上级单位字段
    // @Watch('transferData', { deep: true })
    // private FnSJDW(): void {
    //     for (const iterator of this.getOrgList) {
    //         if (iterator.orgCode == this.transferData.orgCodes.orgCode) {
    //             //   this.SJDW = iterator.parentName + iterator.orgName;
    //             this.SJDW = iterator.fullOrgName;
    //             debugger
    //         }
    //     }
    // }
    //接收人列表
    private getOrgPeopleList = []
    created() {
        this.listParams = JSON.parse(JSON.stringify(this.propdata))

        this.getOrg()
    }
    getRecipient() {

    }
    /**
    * author by xinglu 获取上级单位
    */
    getOrg() {
        this.http.DocumentHandleRequest.getdutyInfo().then(res => {
            if (res.status == 200) {

                this.getOrgList = res.data
                // this.getOrgList = [res.data]
            }
        })
    }
    /**
    * author by xinglu 获取接收单位和接收人、
    */
    getOrgName(val) {
        this.listParams.receiveUnitCode = val
        this.getOrgList.forEach(it => {
            if (it.orgCode == val) {
                this.listParams.receiveUnitName = it.fullOrgName
            }
        })
        let orgCodes = val
        this.http.DocumentHandleRequest.getdutyPeopleList(orgCodes).then(res => {
            if (res.status == 200) {
                this.getOrgPeopleList = []
                this.getOrgPeopleList = res.data
            }
        })

    }
    /**
     * Modify by huihui 修改点击常用语功能
     * 点击获取常用语的值
     * @param e 
     */
    getDomData(e) {
        this.$refs.emoticon['updateContent'](e.currentTarget.innerHTML)
    }
    /**
    * author by xinglu 保存按钮
    */
    saveFun() {
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
            var objInfo = this.listParams
            objInfo['documentProgressStatus'] = "1"
            // objInfo.receiveUnitName = this.SJDW
            let receivecontent = this.approvalContent
            objInfo.receivecontent = receivecontent.replace(/"/g, '\'')
            objInfo['endTime'] = new Date(this.listParams['endTime'])
            objInfo['startTime'] = new Date(this.listParams['startTime'])
            objInfo.type = objInfo.documentType

            if (objInfo.publicId) {
                switch (objInfo.type) {
                    case "1":
                        this.reportEdit('dutyInformationEdit', objInfo)
                        break;
                    case "2":
                        this.reportEdit('outgoingReportEdit', objInfo)
                        break;
                    case "3":
                        this.reportEdit('leaveReportEdit', objInfo)
                        break;
                }
            } else {
                switch (objInfo.reportType) {
                    case "1":
                        this.reportAdd('dutyInformationAdd', objInfo)
                        break;
                    case "2":
                        this.reportAdd('outgoingReportAdd', objInfo)
                        break;
                    case "3":
                        this.reportAdd('leaveReportAdd', objInfo)
                        break;
                }
            }
        })
    }
    /** 
     * author by xinglu 上报请求地址
    */
    reportAdd(requestUrl, params) {
        this.http.DocumentHandleRequest[requestUrl](params).then(res => {
            if (res.status == 200) {
                if (res.status == 200) {
                    this.$router.push(`/dutyManagement/documentHandle?tab=${this.tab}`)
                    if (this.messageDom) { this.messageDom.close() }
                    this.messageDom = this.$message({
                        type: 'success',
                        message: '新增上报成功'
                    })
                }
            }
        });
    }
    /** 
      * author by xinglu 修改请求地址
     */
    reportEdit(requestUrl, params) {
        this.http.DocumentHandleRequest[requestUrl](params).then(res => {
            if (res.status == 200) {
                this.$router.push(`/dutyManagement/documentHandle?tab=${this.tab}`)
                if (this.messageDom) { this.messageDom.close() }
                this.messageDom = this.$message({
                    type: 'success',
                    message: '上报成功'
                })
            }
        });
    }
    /**
    * author by xinglu 关闭弹框
    */
    @Emit('dialogcallback')
    closeDialogCall(infoId) {
        return infoId
    }

    private transferData: any = {
        // userids: [], //接受人id
        orgCodes: "", //接受机构
        receiveName: "", //接受人姓名
        receiveUnitCode: "", //接受机构
        recevierId: "", // 接收人id
        receiveUnitName: '', //公文接收单位名称
    }
    //选中机构的返回值
    // getOrg(val) {
    //   this.transferData.orgCodes = val
    // }
    /**
     * author by xinglu 切换接收人
     */
    selectpeople(val) {
        this.listParams['recevierId'] = val
        for (let i = 0, length = this.getOrgPeopleList.length; i < length; i++) {
            if (val == this.getOrgPeopleList[i].userId)
                this.listParams['receiveName'] = this.getOrgPeopleList[i].name
        }
    }
}
