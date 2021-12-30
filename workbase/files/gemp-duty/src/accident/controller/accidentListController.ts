/**
 * author by xinglu
 */
import { ControllerBase, Inject } from 'prism-web'
import { timeFormat, downloadFuncs } from '../../../assets/libs/commonUtils'

export class AccidentListController extends ControllerBase {
    constructor() {
        super()
    }
    @Inject('http') http: any
    private temp = {
        style: require('../style/accidentList.less')
    }
    // 事件类型列表
    typeList: Array<any> = []
    private handleClick(val) { }
    private activeNamex = 'first'
    private messageDom: any = null // message实体
    private typevalue = ''
    private levelvalue = ''
    private accidentName = ''
    private showSearch: Boolean = false
    private accidentType = [
        {
            value: "1",
            label: "请选择事故类型"
        },
        {
            value: "2",
            label: "危化品事故1"
        },
        {
            value: "3",
            label: "危化品事故2"
        },
        {
            value: "4",
            label: "危化品事故3"
        },
        {
            value: "5",
            label: "危化品事故4"
        }
    ]

    private accidentLevel = []

    private propData = {
        isCheck: true,
        pageSize: 10,
        total: 1,
        config: [
            {
                type: 'link',
                label: '事故名称',
                basehref: '/accident/accidentDetail',
                passProp: 'accSurveyId',
                width: '/',
                prop: 'accName',
                // badge: true,
            },
            {
                type: 'string',
                label: '事故类型',
                width: '300',
                prop: 'accTypeName'
            },
            {
                type: 'string',
                label: '事故级别',
                width: '320',
                prop: 'accLevelName'
            },
            {
                type: 'string',
                label: '所属单位',
                width: '320',
                prop: 'accOrgName'
            },
            {
                type: 'button',
                label: '操作',
                width: '/',
                prop: 'operate'
            }
        ],
        data: [
        ]
    }
    private btnGroup = {
        edit: { name: '编辑', type: 'warning', emit: 'edit', expression: true },
        delete: { name: '删除', type: 'danger', emit: 'delete', expression: true, },
    }
    //列表请求参数
    private listParams = {
        orgcode: [],
        accEventId: "", //事故ID
        accHappenTreatment: "", //事故发生经过及应急处置情况
        accInvolvedDevice: "", //事故涉事装置情况
        accInvolvedUnits: "", //事故涉事单位情况
        accLevelCode: "",//事故等级编码
        accName: "", //事故名称
        accOrgCode: "",//事故责任所属单位编码
        accPreventRectificatCs: "", //事故防范和整改措施
        accReasonNature: "",//事故原因及性质
        accSurveyId: "", //事故调查ID
        accSurveySummary: "",//事故调查概述
        accTypeCode: "",//事故类型编码
        accZrfTreatmentSug: "", //对相关责任人和责任单位处理建议
        createTime: "", //创建时间
        createUser: "", //创建人
        deleteFlag: "", //是否删除，0-未删除，1-已删除
        nowPage: 1, //当前页数
        pageSize: 10,//每页条数
        updateTime: "", //修改时间
        updateUser: ""//修改人
    }
    created() {
        this.getEventLevel()
        this.getEventType()
        this.getListData()
    }

    // 列表按钮点击响应
    tablecallback(data) {
        this[data.type](data)
    }
    //排序
    sort(data) {
        console.log(data);
    }
    //重置
    reset() {
        this.listParams.accName = ''
        this.listParams.accTypeCode = ''
        this.listParams.accLevelCode = ''
    }
    //导出参数
    private exportFile = {
        orgcode: []
    }
    //事故列表
    getListData() {
        this.http.accidentRequest.getList(this.listParams).then(res => {
            if (res.status == 200) {
                this.propData.pageSize = res.data.pageSize
                this.propData.total = res.data.total
                this.propData.data = res.data.list.map(item => {
                    // item.deleteFlag = Number(item.deleteFlag)
                    // if (item.deleteFlag != "1") {    
                    item.operate = this.btnGroup
                    // }
                    return item
                })
            } else {
                if (this.messageDom) { this.messageDom.close() }
                this.messageDom = this.$message({
                    type: 'warning',
                    message: '查询失败'
                })
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
    //编辑事故信息
    edit(data) {
        this.$router.push({ path: '/accident/accidentEdit', query: { id: data.rowVal.accSurveyId } })
    }
    //删除事故信息
    delete(data) {
        console.log(data);
        
        this.$confirm('是否确认删除?', "提示", {
            confirmButtonText: '确定',
            cancelButtonText: "取消",
            confirmButtonClass: 'confirmButtonClass',
            cancelButtonClass: "confirmButtonClass",
        }).then(() => {
            this.http.accidentRequest.delete({ accSurveyId: data.rowVal.accSurveyId }).then(res => {
                if (res.status == 200) {
                    if (this.messageDom) { this.messageDom.close() }
                    this.messageDom = this.$message({
                        type: 'success',
                        message: '删除成功'
                    })
                    this.getListData()
                } else {
                    if (this.messageDom) { this.messageDom.close() }
                    this.messageDom = this.$message({
                        type: 'warning',
                        message: '删除失败'
                    })
                }
            })
        }).catch(() => {
            if (this.messageDom) { this.messageDom.close() }
            this.messageDom = this.$message({
                type: 'warning',
                message: '已取消操作'
            })
        })

    }
    //导出接口
    exportList() {
        this.http.accidentRequest.exportAccident(this.exportFile).then(res => {
            if (res.url) {
                downloadFuncs(res)
            }
            else {
                this.$message.error("下载失败")
            }
        })
    }
}