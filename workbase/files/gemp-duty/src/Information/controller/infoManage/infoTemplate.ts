import { ControllerBase, Watch ,Inject ,Emit} from 'prism-web'

export class InfoTemplate extends ControllerBase {
    constructor(){
        super()
    }

    private temp = {
        style: require("../../style/infoManage/infoTemplate.less")
    }

    // 输入框内字数
    private num = 0

    @Inject("http") http:any

    // 选择事件弹框控制
    private selectEventType:boolean = false
    // 情况描述弹框控制
    private templateExample:boolean = false
    // 是否选择模板
    private templateChecked:boolean = false
    
    private templateData:object = {
        createTime: "",
        eventTypeCode: "",
        nowPage: 0,
        pageSize: 0,
        templateContent: "",
        templateExample: "",// 模板示例内容
        templateId: "",
        updateTime: ""
    }
    @Watch('templateData',{deep:true})
    watchTemplate(val) {
        this.num = val['templateContent'].length
        this.templateData['templateContent'] = val['templateContent'].substring(0,1000)
    }

    created(){

    } 

    // 选择模板点击事件
    selectTemplate(){
        if(this.templateData['eventTypeCode'].trim()) {
            this.http.GempInfoBaseRequest.getTemplateContent(this.templateData['eventTypeCode']).then(res => {
                if(res.status == 200) {
                    this.$set(this,'templateData',res.data)
                    // 关闭弹框~
                    this.selectEventType = false
                } else {
                    this.$message({
                        type: 'error',
                        message: '该事件类型模板还未配置'
                    })
                }
            })
        } else {
            this.$message({
                type: 'error',
                message: '请选择模板'
            })
            return 
        }
       
    }

    // 事件选择
    selectEvent(val) {
        // 切换选择模板flag
        this.templateChecked = true
        // 选择事件类型
        // this.$set(this.templateData,'eventTypeCode',val)
    }


    // 模板解析
    parseTemplate(){
        this.http.GempInfoBaseRequest.intellectParse(this.templateData).then(res => {
            if(res.status == 200) {
                this.getData(res.data)
                this.$message({
                    type:'success',
                    message: '解析成功'
                })
            } else {
                this.$message({
                    type:'error',
                    message: '模板解析失败'
                })
            }
        })
    }

    // 取消按钮
    cancleTemplate(){
        this.$parent['showTemplate'] = false
    }

    @Emit('getparsedata')
    getData(value) {
        return value
    }
}