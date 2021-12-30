// author by 刘文磊
import { ControllerBase, Prop, Inject, Emit, Watch } from 'prism-web'

export class modiftyIssueController extends ControllerBase {
    constructor() {
        super()
    }
    private temp = {
        style: require('../../briefReport/style/modiftyIssue.less')
    }
    @Inject("http") http: any
    @Prop() propdata
    // 弹框表单数据
    private formData = {}
    private rules = {
      issueNumber: [{ validator: this.validateNum, trigger: 'change' }, { max: 3, message: "长度最大为3位", trigger: 'change' }]
    }
    created() {
        let _this = this;
        _this.propdata.issueNumber=String(_this.propdata.issueNumber)
        this.formData = JSON.parse(JSON.stringify(_this.propdata))
    }

    // author by 刘文磊 保存按钮
    saveFun() {
        this.$refs['formData']['validate'](vaild=>{
            // console.log(this.formData)
            if (vaild){
                let params = {}
                params['briefId'] = this.formData['id']
                params['issueNumber'] = this.formData['issueNumber']
                this.http.briefReportRequest.issue(params).then(res => {
                    if (res.status == 200) {
                        this.$message.success("修改成功")
                        this.closeDialogCall(this.formData)
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            }
        })

    }
    /* author by 刘文磊 关系弹出呢个操作
     *
     *
     */
    @Emit('dialogcallback')
    closeDialogCall(infoId) {
        return infoId
    }
    //校验正整数
    validateNum(rule, value, callback) {
        if (!value) {
            return callback(new Error("请输入正整数"))
        }
        else {
            if (!/^[+]{0,1}(\d+)$/.test(value)) {
                return callback(new Error("请输入正整数"))
            } else {
                return callback()
            }
        }
    }
    @Watch('propdata')
    getformData(val){
        this.formData = JSON.parse(JSON.stringify(val))
    }

}
