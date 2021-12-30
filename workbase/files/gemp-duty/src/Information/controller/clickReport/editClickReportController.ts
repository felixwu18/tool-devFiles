import { ControllerBase, Inject } from 'prism-web';

export class EditClickReportController extends ControllerBase {

    constructor() {
        super();
    }

    @Inject('http') http: any;
    private temp = {
        style: require('../../style/clickReport/oneClickReport.less'),
    };
    private pickerOptions = {
        disabledDate: (time) => {
            return time.getTime() < Date.now() - 60 * 60 * 24 * 1000;
        },
    };
    private reportParams = {
        eventName: "",//事件标题
        eventTime: new Date(),//上报日期
        eventCentent: "",//内容
        attachmentList: []//信息附件
    }
    private rules = {
        eventName: [
            { required: true, message: "请输入事件标题", trigger: "blur" }
        ],
        eventTime: [
            { required: false, message: "请输入上报日期", trigger: "blur" }
        ],
        eventCentent: [
            { required: false, message: "请输入内容", trigger: "blur" }
        ],
        // attachmentList: [
        //     { required: true, message: "请输入事件标题", trigger: "blur" }
        // ],
    }
    created() {
    }
    /**
     * 一键上报
     */
    addReport() {
        this.$refs.reportform["validate"]((valid) => {
            if (valid) {
            }
        })
    }
    /**
     * 下载模板
     */
    downloadFiles(e) {
        e.preventDefault()
        // let data = encodeURI()
        // this.http.Resource.ResourceDownloadFlie(data).then((res) => {
        //     if (res.url) {
        //         downloadFuncs(res)
        //     } else {
        //         hideLoading()
        //     }
        // })

    }
}