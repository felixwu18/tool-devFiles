import { ControllerBase, Inject, Prop } from 'prism-web'

export class ProcessPageController extends ControllerBase {
    constructor() {
        super()
    }

    @Prop() propdata
    @Inject('http') http: any

    private stepData: Array<any> = []

    private temp = {
        style: require('../../../style/infoManage/detailsProcess.less')
    }

    created() {
        this.getProcessList()
        this.onNotify()
    }

    getProcessList() {
        let disposeId = { disposeId: this.propdata.infoDisposeId }
        // 转办督办详情-转办督办处理过程
        this.http.InfoDutyRequest.transactProgressList(disposeId).then((res) => {
            if (res.status !== 200) {
                this.$message(res.msg)
                return
            }
            this.stepData = res.data;
        })
    }

    onNotify() {
        this.on("setTransferProcess", () => {
            this.getProcessList()
        })
    }
}