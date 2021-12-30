/**
 * author by xinglu
 */
import { ControllerBase, Inject } from 'prism-web'
import { createDecipher } from 'crypto';
import { LOADIPHLPAPI } from 'dns';

export class AccidentListController extends ControllerBase {
    constructor() {
        super()
    }
    private temp = {
        style: require('../style/accidentDetail.less')
    }
    @Inject('http') http: any
    private activeNamex = 'first'
    private editId
    private title = ""
    private ruleForm = {
        accEventId: '', //事故ID
        accHappenTreatment: '',	//事故发生经过及应急处置情况
        accInvolvedDevice: "",//事故涉事装置情况
        accInvolvedUnits: '',// 事故涉事单位情况
        accLevelCode: '', //事故等级编码
        accName: "",//事故名称
        accOrgCode: '',//事故责任所属单位编码
        accPreventRectificatCs: "",// 事故防范和整改措施
        accReasonNature: "",//事故原因及性质
        accSurveyId: '',//事故调查ID
        accSurveySummary: '',//事故调查概述
        accTypeCode: '',//事故类型编码
        accZrfTreatmentSug: '',//对相关责任人和责任单位处理建议
        createTime: '',//创建时间
        createUser: '',//创建人
        deleteFlag: '',//是否删除，0-未删除，1-已删除
        updateTime: '',//修改时间
        updateUser: '',// 修改人
    }
    private messageDom: any = null // message实体
    private rules = {
        accLevelCode: [{ required: true, message: '请输入事故等级', trigger: 'change' }],
        accTypeCode: [{ required: true, message: '请输入事故类型', trigger: 'change' }],
        accName: [{ required: true, message: '请输入事故名称', trigger: 'blur' }],
        // accHappenTreatment: [{ required: true, message: '请输入事件发生过程', trigger: 'blur' }],
        // accInvolvedDevice: [{ required: true, message: '请输入事故涉事装置情况', trigger: 'blur' }],
        // accInvolvedUnits: [{ required: true, message: '请输入事故涉事单位情况', trigger: 'blur' }],
        // accPreventRectificatCs: [{ required: true, message: '事故防范和整改措施', trigger: 'blur' }],
        // accReasonNature: [{ required: true, message: '请输入事故原因及性质', trigger: 'blur' }],
        // accZrfTreatmentSug: [{ required: true, message: '请输入对相关责任人和责任单位处理建议', trigger: 'blur' }],
        // accSurveySummary: [{ required: true, message: '请输入事故描述', trigger: 'blur' }],
    }
    private accidentType = []
    private accidentLevel = []
    private showNode: boolean = true
    private nodeIndex = 0
    spreadNode() {
        this.showNode = !this.showNode
    }
    private tableform: object = {
        accSurveySummary: "",
        accInvolvedUnits: "",
        accInvolvedDevice: "",
        accHappenTreatment: "",
        accReasonNature: "",
        accZrfTreatmentSug: "",
        accPreventRectificatCs: ""
    }
    private childrenNodeData = [
        { value: "accSurveySummary", name: "事故描述", id: "1", flag: true },
        { value: "accInvolvedUnits", name: "涉事单位情况", id: "2", flag: false },
        { value: "accInvolvedDevice", name: "涉事装置情况", id: "3", flag: false },
        { value: "accHappenTreatment", name: "事故发生经过及应急处置情况", id: "4", flag: false },
        { value: "accReasonNature", name: "事故原因和事故性质", id: "5", flag: false },
        { value: "accZrfTreatmentSug", name: "对相关责任人和责任单位处理建议", id: "6", flag: false },
        { value: "accPreventRectificatCs", name: "事故防范和整改措施", id: "7", flag: false },
    ]
    created() {
        this.getRouteId()
        this.getEventLevel()
        this.getEventType()
    }
    getRouteId() {
        if (this.$route.query.id) {
            this.ruleForm.accSurveyId = this.$route.query.id.toString()
            this.title = "编辑"
            this.getDetailById(this.ruleForm.accSurveyId)
            return
        } else {
            this.title = "新增"
        }
    }
    //更改选中状态
    changeClassName(index, item) {
        this.nodeIndex = index
        this.childrenNodeData.forEach((children, childrenIndex) => {
            children.flag = false
            if (childrenIndex == index) {
                children.flag = true
            }
        })
    }
    //保存按钮
    saveInfo() {
        Object.assign(this.ruleForm, this.tableform)
        this.$refs.ruleForm['validate'](valid => {
            if (!valid) {
                if (this.messageDom) { this.messageDom.close() }
                this.messageDom = this.$message({
                    type: 'warning',
                    message: '您还有未填字段'
                })
                return false
            } else if (this.ruleForm.accSurveySummary.trim() == '' || this.ruleForm.accInvolvedUnits.trim() == '' || this.ruleForm.accInvolvedDevice.trim() == '' || this.ruleForm.accHappenTreatment.trim() == '' || this.ruleForm.accReasonNature.trim() == '' || this.ruleForm.accZrfTreatmentSug.trim() == '' || this.ruleForm.accPreventRectificatCs.trim() == '') {
                if (this.messageDom) { this.messageDom.close() }
                this.messageDom = this.$message({
                    type: 'warning',
                    message: '您还有调查报告信息未填'
                })
            }
            else {
                //编辑
                if (this.ruleForm.accSurveyId) {
                    this.http.accidentRequest.accidentEdit(this.ruleForm).then(res => {
                        if (res.status == 200) {
                            this.$router.push("accidentList")
                            this.$message({ type: 'success', message: "修改成功" })
                        }
                    })
                } else {
                    //新增
                    this.http.accidentRequest.accidentAdd(this.ruleForm).then(res => {
                        if (res.status == 200) {
                            this.$router.push("accidentList")
                            this.$message({ type: 'success', message: "添加成功" })
                        }
                    })
                }
            }
        })

    }
    //事件级别
    getEventLevel() {
        this.http.accidentRequest.getEventLevel().then(res => {
            if (res.status == 200) {
                this.accidentLevel = res.data
            }
        })
    }
    //事件类型
    getEventType() {
        this.http.accidentRequest.getEventType().then(res => {
            if (res.status == 200) {
                this.accidentType = res.data
            }
        })
    }
    //根据id获取文本具体内容
    getDetailById(id) {
        this.http.accidentRequest.getDetailById(id).then(res => {
            // console.log(res);
            if (res.status == 200) {
                this.ruleForm = res.data
                Object.assign(this.tableform, this.ruleForm)
            }
        })
    }
}