import { ControllerBase, Inject, Watch,Prop } from 'prism-web'

export class AddSubstituteController extends ControllerBase {
    private temp = {
        style: require("../../../style/substitute/changeduty/changeduty.less")
    }

    constructor() {
        super()
    }
    @Inject("http") http: any
    @Prop() orgcode
    @Watch('orgCode')
    getOrgCode(val){
      this.replacePeople.orgCode = val
      this.listparams.orgCode=val
    }
    //选项列表
    private selectLiat={}
    private listparams = {
        "applicantId": "",//申请人id
        "applicantName": "",//申请人姓名
        "exchangeId": "",//替换班记录id
        "exchangeReason": "",//换班/替班原因
        "exchangeType": "",//换班/替班类型
        "peopleid": "",//换班/替班人
        "peopleName": "",//换班/替班人姓名
        "remarksInformation": "",//备注信息
        "returnTime": "",//还班时间
        "returnType": "",//还班类型
        "swapInsteadTime": "",//换班/替班时间
        "swapInsteadType": "0",//替班or换班
        orgCode:""
    }
    //规则
    private rules = {
      applicantId: [{ required: true, message: '请选择申请人', trigger: 'blur' }, { max: 50, message: "最大长度为50", trigger: ['blur','change'] }],
      peopleId: [{ required: true, message: '请选择换班人', trigger: ['change', 'blur'] }],
      swapInsteadTime: [{ required: true, message: '请输入换班时间', trigger: ['change', 'blur'] }],
      exchangeType: [{ required: true, message: '请输入换班类型', trigger: ['change', 'blur'] }],
      returnTime: [{ required: true, message: '请输入还班时间', trigger: ['change', 'blur'] }],
      returnType: [{ required: true, message: '请输入还班时间', trigger: ['change', 'blur'] }],
        exchangeReason: [{ required: true, message: '请输入换班原因', trigger: ['change','blur'] }],
        remarksInformation: [{ required: false, message: '请输入备注信息', trigger: ['blur'] }]
    }
    //申请人列表
    private scaleList: Array<any> = []
    private initTime = new Date()
    private editId
    private isAdd: boolean = false
    private messageDom: any = null // message实体
    created() {
        this.replacePeople.orgCode=this.orgcode
        this.listparams.orgCode=this.orgcode
        this.getReplacementPeople()
    }
    /**
    * author by xinglu
    * 换班人/替班人请求信息
    */
    private replacePeople = {
        "orgCode": "",//组织机构code
        "userName": ""//人员姓名
    }

    /**
     * author by xinglu
     * 获取换班人/替班人列表
     */
    getReplacementPeople() {
        this.http.WorkforceManagementRequest.getSubstitutePeople(this.replacePeople).then(res => {
            if (res.status == 200) {
                this.scaleList = res.data
            }
        })
    }
    /** 
     * author by xinglu
     *  提交上报信息
    */
    private addReportInfo() {
        this.$refs.listparams['validate'](valid => {
            if (!valid) {
                if (this.messageDom) { this.messageDom.close() }
                this.messageDom = this.$message({
                    type: 'warning',
                    message: '请按提示正确填写信息'
                })
                return false
            } else {
                this.http.WorkforceManagementRequest.SubstituteAdd(this.listparams).then(res => {
                    if (res.status == 200) {
                        this.emit('substituteEditWindow');
                        this.$refs.listparams['resetFields']()
                      this.selectLiat = { applicantId: "", applicantName: ""}
                        if (this.messageDom) { this.messageDom.close() }
                        this.messageDom = this.$message({
                            type: 'success',
                            message: res.msg
                        })

                    }
                })
            }
        })
    }

    // 获取编辑信息数据
    getEditData() {

    }
    /**
     * author by xinglu
     * 处理申请人列表
     * by 刘文磊 下拉选change事件
     */
    select(val,prop) {
      for (let i = 0, length = this.scaleList.length;i<length;i++){
         if(val==this.scaleList[i].userId)
           this.listparams[prop] = this.scaleList[i].userName
      }
        // this.listparams.applicantId = val.userId
        // this.listparams.applicantName = val.userName
    }
    /**
     * author by xinglu
     * 处理换班人列表
     * by 刘文磊 注释改功能
     */
    // selectpeople(val) {
    //     this.listparams.peopleid = val.userId
    //     this.listparams.peopleName = val.userName
    // }
}
