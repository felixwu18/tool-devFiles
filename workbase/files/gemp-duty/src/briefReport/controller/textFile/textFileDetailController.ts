import { ControllerBase, Inject, Prop } from 'prism-web'

export class TextFileDetailController extends ControllerBase {
    constructor() {
        super()
    }
    
    private temp = {
        style: require('../../style/textFile/textFileDetails.less')
    }
    @Inject('http') http: any
    private activeNamex = 'first' //tab栏选中
    private textid: string = '' //文本文件标题
    private flag: boolean = false //控制弹窗显示
    private templateName: string = ''//弹框模板名称
    private tilteName: string = '' //弹出框标题
    private propsData: Object = {} //弹框数据
    private dialogContent = false
    private dialogVisible: boolean = false //控制处理过程弹出框
    private handlelist = []  //处理过程参数 程云
    private typereport = {  //弹框参数
        reportType: ''
    }
    private click(el: string, name: string) {
        this.flag = true
        this.templateName = el
        this.tilteName = name
        this.propsData
    }
    //关闭弹框
    closeDialogCall(callInfo) {
        this.flag = false
    }
    //请求参数
    private listParams = {
        gempBriefInstructDTOs: [
            {
                instructContent: "",//	批示内容
                instructTitle: ""//批示标题
            }
        ],
        id: "", //简报Id
        infoId: "", //事件id
        reportContent: "",//简报内容
        reportTitle: ""//简报标题
    }
    
    //处理过程tab栏处理
    private handleClick(val) {

    }
    
    created() {
        this.textid = this.$route.query.id.toString()
        this.getDetail(this.textid)
        this.briefProcess(this.textid)
    }

    //文本详情 author by xinglu
    getDetail(id) {
        let briefDetail = {briefId:id}
        this.http.briefReportRequest.documentById(briefDetail).then(res => {
            // console.log(res);
            if (res.status == 200) {
                this.listParams = res.data
            }
        })
    }
    //文本详情

    /*
    * Author by chengyun 获取处理过程
    * Modify by chengyun
    */
    briefProcess(id) {
        let briefProcessDetail = {briefId:id}
        this.http.briefReportRequest.briefProcess(briefProcessDetail).then(res => {
            // console.log(res);
            if(res.status==200){
                this.handlelist = res.data
            }
        })
    }

    /*
    * Author by chengyun 处理过程弹框事件
    * Modify by chengyun
    */
    textDialog(data){
        this.dialogVisible = true
        this.dialogContent = data
      }

}