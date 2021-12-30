// author by 刘文磊
import { ControllerBase, Inject, Prop, Emit } from 'prism-web'

export class ReportDetailController extends ControllerBase {
    constructor() {
        super()
    }
    private temp = {
        style: require('../../style/textFile/textFileAdd.less')
    }
    @Inject('http') http: any
    @Inject('store') store: any
    private type = 'REPORT'
    // 附件参数
    private openDocByurl = ""
    private handlelist = [] //处理过程
    private breifDownloadData = { reportType: '', issueInfo: '' }

    // 弹窗配置
    private dialogOption = {
        titleName: "",
        flag: false,
        templateName: "",
        propsData: {
            materialId: "",//附件id
            reportType: "REPORT", //简报类型
            id: "",//简报id
            reportTitle: "",//标题
            comments: "",//说明
        },
    }

    created() {
        let id = this.$route.query.id
        this.getBrifeInfo(id) //基本信息
        this.getBrifeProcess(id) //处理过程

    }

    /* author by 刘文磊 查询简报基本信息

    */
    getBrifeInfo(id) {
        let briefDetail = { briefId: id }
        this.http.briefReportRequest.dutyBrief(briefDetail).then(res => {
            if (res.status == 200) {
                this.dialogOption.propsData.reportTitle = res.data.reportTitle
                this.dialogOption.propsData.comments = res.data.reportContent,
                this.dialogOption.propsData.id = res.data.id
                Object.keys(this.breifDownloadData).forEach(item => {
                    if (res.data[item]) {
                        this.breifDownloadData[item] = res.data[item]
                    }
                })
                if (this.store.state.SYSTEMOFFICE === 'ONLYOFFICE') {
                    this.openDocByurl = res.data.onlyOfficeUrlRead
                } else {
                    this.openDocByurl = res.data.attachUrl
                }
            }
        })
    }
    /* author by 刘文磊  根据id查询简报处理过程
    *  Modify by chengyun
    */
    getBrifeProcess(id) {
        let briefProcessDetail = { briefId: id }
        this.http.briefReportRequest.briefProcess(briefProcessDetail).then(res => {
            if (res.status == 200) {
                this.handlelist = res.data
            }
        })
    }

}