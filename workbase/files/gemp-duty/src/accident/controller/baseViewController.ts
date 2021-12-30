
import { ControllerBase, Inject } from 'prism-web'

export class BaseViewController extends ControllerBase {

    constructor() {
        super()
    }
    // @Watch
    created() {
        this.initUnread()
        this.onNotify()
        this.read()
    }
    private childrenList: Array<any> = [
        { name: '事故调查列表', router: '/accident/accidentList', unread: 0, children: ['accidentEdit', 'accidentDetail'] },
    ]
    @Inject('http') http: any
    // 列表页未读数通知
    onNotify() {
        // this.on("briefunread", (data) => {
        //     this.childrenList.forEach((item, index) => {
        //         if (item.name == data[0].type) {
        //             this.$set(this.childrenList[index], 'unread', data[0].unReadTotalCount)
        //         }
        //     })
        //     this.initUnread()
        // })
    }
    read() {
        // this.on('read', data => {
        //     this.initUnread()
        //     this.onNotify()
        // })
    }
    // 初始化列表未读数
    initUnread() {
        // this.http.briefReportRequest.baseUnread().then(res => {
        //     if (res.status == 200) {
        //         res.data.forEach((el, index) => {
        //             if (el.reportType == "TEXT")
        //                 this.childrenList[3].unread = el.unreadTotal
        //             if (el.reportType == "REPORT")
        //                 this.childrenList[2].unread = el.unreadTotal
        //             if (el.reportType == "SPECIAL")
        //                 this.childrenList[0].unread = el.unreadTotal
        //             if (el.reportType == "BRIEF")
        //                 this.childrenList[1].unread = el.unreadTotal
        //         });
        //     }
        // })
    }
}