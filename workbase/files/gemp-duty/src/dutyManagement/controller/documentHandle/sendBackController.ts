import { ControllerBase, Prop, Inject, Emit, Watch } from 'prism-web'

export class SendBackController extends ControllerBase {
    constructor() {
        super()
    }
    private temp = {
        style: require('../../style/documentHandle/sendBack.less')
    }
    @Inject("http") http: any
    @Prop() propdata
    // 弹框表单数据
    private description = ""
    private messageDom: any = null //message实体

    created() {
        // console.log(this.propdata);
        
    }
    // author by xinglu 保存按钮
    saveFun() {
        if (!this.description) {
            if (this.messageDom)
                this.messageDom.close()
            return this.messageDom = this.$message.warning("请说明退回原因")
        }
        let lists = {
            documentProgressStatus: "",//状态
            publicId: "",//id
            regression: this.description
        }
        this.$set(lists, 'documentProgressStatus', '3')
        this.$set(lists, 'publicId', this.propdata.publicId)
        this.$set(lists, 'regression', this.description)
        this.http.DocumentHandleRequest.dealEvent(lists).then(res => {
            if (res.status == 200) {
                this.$message.success("退回成功")
                this.description = ""
                this.closeDialogCall()
            } else {
                this.$message.error("退回失败")
            }
        })
    }
    /* author by 刘文磊 
     *
     *
     */
    @Emit('dialogcallback')
    closeDialogCall() {
        // debugger
    }

    @Watch('propdata')
    getpropdata(val) {
        this.description = ""
    }
    mounted() {
        let dialog = document.querySelector(".preservation").parentNode.parentNode
        dialog['style'].width = '500px'
    }

}
