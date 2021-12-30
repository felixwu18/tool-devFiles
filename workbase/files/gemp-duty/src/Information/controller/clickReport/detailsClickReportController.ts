import { ControllerBase, Inject, Emit } from 'prism-web';
import { getRequestUrl } from '../../../../assets/libs/commonUtils'


export class DetailsClickReportController extends ControllerBase {

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
    private disabledFalse = true
    private reportParams = {
        quickTitle: "",//事件标题 
        quickTime: new Date(),//上报日期
        quickContent: "",//内容
        attachmentList: []//信息附件
    }
    private navselectcode: string = ''
    //页面的信息详情id
    private detailUrlinfoId: any
    // 已签收单位数
    private signOrgNum: string = ''
    // 所有单位数
    private totalOrgNum: string = ''
    // 未签收单位
    private unOrgName: string = ''
    // 及时签收单位
    private isOrgName: string = ''
    private isSignFlag: boolean = true;
    private signdisabled: boolean = false;
    private signword: string = '签收';

    created() {
        if (this.$route.query.id) {
            this.getDedailsData();
            // this.getReceiptData();
        } else {
            // 从新消息提醒进入
            this.fromNemMessage()
        }
        this.updateMessageRemindData();
    }

    // 从新消息提醒进入
    fromNemMessage() {
        var url = window.location.href;
        let urlCode = getRequestUrl(url)
        if (urlCode && urlCode['detailUrlId']) {
            this.detailUrlinfoId = urlCode['detailUrlId'];
            let publi = { quickId: this.detailUrlinfoId }
            this.http.ClickReportRequest.oneQuickOver(publi).then(res => {
                if (res.status == 200) {
                    if (res.data) {
                        if (!res.data.attachmentList) {
                            res.data.attachmentList = []
                        }
                        this.isSignFlag = res.data.isSignFlag
                        this.$set(this, 'reportParams', res.data)
                    }

                }
            })
            this.http.ClickReportRequest.oneQuickReceipte(publi).then(res => {
                if (res.status == 200) {
                    this.signOrgNum = res.data.signOrgNum;
                    this.totalOrgNum = res.data.totalOrgNum;
                    // console.log(this.signOrgNum, 788)
                    if (this.signOrgNum == '0') {
                        // console.log(this.signOrgNum, 788)
                        this.unOrgName = res.data.gempReceiptOrgDTO[0].orgName
                        this.isOrgName = '无'
                    } else {
                        // console.log(this.signOrgNum, 78866)
                        this.unOrgName = '无'
                        this.isOrgName = res.data.gempReceiptOrgDTO[0].orgName
                        this.signdisabled = true;
                        this.signword = "已签收"
                    }
                }
            })
            this.getTabUnread();
            // 判断tab栏
            this.$emit('fromchild', '1')
        }
    }
    /**
     * 获取详情数据
     */
    async getDedailsData() {
        let params = {
            quickId: this.$route.query.id || ''
        }
        console.log(this.$route.query.id)
        await this.http.ClickReportRequest.oneQuickOver(params).then(res => {
            if (res.status == 200) {
                if (res.data) {
                    if (!res.data.attachmentList) {
                        res.data.attachmentList = []
                    }
                    this.isSignFlag = res.data.isSignFlag
                    this.$set(this, 'reportParams', res.data)
                }

            }
        })
        this.getTabUnread();
    }
    // 获取签收记录
    // async getReceiptData() {
    //     // if ()
    //     let params = {
    //         quickId: this.$route.query.id || ''
    //     }
    //     await this.http.ClickReportRequest.oneQuickReceipte(params).then(res => {
    //         if (res.status == 200) {
    //             this.signOrgNum = res.data.signOrgNum;
    //             this.totalOrgNum = res.data.totalOrgNum;
    //             // console.log(this.signOrgNum, 788)
    //             if (this.signOrgNum == '0') {
    //                 // console.log(this.signOrgNum, 788)
    //                 this.unOrgName = res.data.gempReceiptOrgDTO[0].orgName
    //                 this.isOrgName = '无'
    //             } else {
    //                 // console.log(this.signOrgNum, 78866)
    //                 this.unOrgName = '无'
    //                 this.isOrgName = res.data.gempReceiptOrgDTO[0].orgName
    //                 this.signdisabled = true;
    //                 this.signword = "已签收"
    //             }
    //         }
    //     })
    // }
    // tab组件展示未读数功能
    tabUnread(obj: object) {
        this.emit('unread', obj);
    }
    getTabUnread() {
        // 进入详情重新请求tab未读数
        // this.http.ClickReportRequest.getAllUnread().then(res => {
        //     this.tabUnread({
        //       name: '一键上报',
        //       unreadCount: res.data[0],
        //     });
        // // console.log(res.data[0], 999)
        // })
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
    //返回按钮 by xinglu
    goback() {
        if (this.$route.query.transferId) {
            this.$router.go(-1)
        } else {
            this.go('/information/infoManage');
        }
    }

    // 更新消息提醒的滚动条，弹框，铃铛
    updateMessageRemindData() {
        let data = {
            type: "updateMessageRemind",
        }
        setTimeout(() => {
            parent.postMessage(data, "*")
        }, 2000);
    }
    // 点击签收
    getsign() {
        if (this.$route.query.id) {
            let signparams = { quickId: this.$route.query.id || '' }
            this.http.ClickReportRequest.getSign(signparams).then(res => {
                if (res.status == 200) {
                    this.$message.success("签收成功")
                    this.getDedailsData();
                    // this.getReceiptData();
                }
            })
        } else {
            var url = window.location.href;
            let urlCode = getRequestUrl(url)
            if (urlCode && urlCode['detailUrlId']) {
                let publi = { quickId: this.detailUrlinfoId }
                this.http.ClickReportRequest.getSign(publi).then(res => {
                    if (res.status == 200) {
                        this.$message.success("签收成功")
                        this.fromNemMessage()
                    }
                })
            }
        }


    }
}