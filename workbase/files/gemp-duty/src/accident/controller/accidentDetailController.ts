/**
 * author by xinglu
 */
import { ControllerBase, Inject } from 'prism-web'

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
        accName: [{ required: true, message: '请输入事故名称', trigger: 'blur' }]
    }
    private accidentType = []
    private accidentLevel = []
    private showNode: boolean = true
    private disabled: Boolean = true
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
        { value:"accSurveySummary",name: "事故描述", id: "1",flag: true },
        { value:"accInvolvedUnits",name: "涉事单位情况", id: "2", flag: false },
        { value:"accInvolvedDevice",name: "涉事装置情况", id: "3",flag: false },
        { value:"accHappenTreatment",name: "事故发生经过及应急处置情况", id: "4",flag: false },
        { value:"accReasonNature",name: "事故原因和事故性质", id: "5", flag: false },
        { value:"accZrfTreatmentSug",name: "对相关责任人和责任单位处理建议", id: "6",flag: false },
        { value:"accPreventRectificatCs",name: "事故防范和整改措施", id: "7",flag: false },
    ]
    created() {
        this.getRouteId()
        this.getEventLevel()
        this.getEventType()
    }
    getRouteId() {
        if (this.$route.query.id) {
            this.ruleForm.accSurveyId = this.$route.query.id.toString()
            this.getDetailById(this.ruleForm.accSurveyId)
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
                Object.assign(this.tableform,this.ruleForm)
            }
        })
    }
}