// author by 刘文磊
import { ControllerBase, Prop, Inject, Emit, Watch } from 'prism-web'

export class deleteBriefController extends ControllerBase {
    constructor() {
        super()
    }
    private temp = {
        style: require('../../briefReport/style/deleteBrief.less')
    }
    @Inject("http") http: any
    @Prop() propdata
    // 弹框表单数据
    private description = ""
    private messageDom: any = null //message实体

    created() {

    }

    /**
     *
     * 关闭弹窗
     * @memberof deleteBriefController
     */
    handleCancel() {
        this.description = ""
        this.closeDialogCall()
    }

    // author by 刘文磊 保存按钮
    saveFun() {
        if (!this.description){
            if (this.messageDom)
            this.messageDom.close()
            return this.messageDom = this.$message.warning("请说明删除原因")
        }
        let params={}
        params['briefId']=this.propdata.id
        params['description'] = this.description
        this.http.briefReportRequest.delete(params).then(res => {
            if (res.status == 200) {
                if(!res.data) {
                    this.$message.error("请输入文本文字，说明删除原因")
                    return
                }

                this.$message.success("删除成功")
                this.description = ""
                this.closeDialogCall()
            } else {
                this.$message.error("删除失败")
            }
        })
    }
    /* author by 刘文磊 关系弹出呢个操作
     *
     *
     */
    @Emit('dialogcallback')
    closeDialogCall() {
    }

    @Watch('propdata')
    getpropdata(val){
        this.description=""
    }
    mounted(){
        let dialog = document.querySelector(".preservation").parentNode.parentNode
        dialog['style'].width = '500px'
    }

}
