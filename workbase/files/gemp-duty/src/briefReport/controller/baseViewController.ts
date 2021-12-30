
import { ControllerBase, Inject } from 'prism-web'

export class BaseViewController extends ControllerBase {

    constructor(){
        super()
    }
    // @Watch
    created(){
        this.initUnread()
        this.onNotify()
        this.read()
    }

    private childrenList:Array<any> = [
        {name:'专报',router:'/briefReport/specialReport',unread:0,children:['specialReportAdd','specialReportEdit','specialReportDetail']},
        {name:'快报',router:'/briefReport/wallBulletin',unread:0,children:['wallBulletinAdd','wallBulletinEdit','wallBulletinDetail']},
        {name:'报告',router:'/briefReport/informationReport',unread:0, children:['reportAdd','reportEdit','reportDetail']},
        {name:'文本文件',router:'/briefReport/textFile',unread:0, children:['textFileAdd','textFileEdit','textFileDetail']},
    ]

    @Inject('http') http:any
    // 列表页未读数通知
    onNotify(){
        this.on("briefunread", (data)=> {
            this.childrenList.forEach((item,index) => {
                if (item.name == data[0].type) {
                    this.$set(this.childrenList[index],'unread',data[0].unReadTotalCount)
                }
            })
            this.initUnread()
        })
    }
    read(){
        this.on('read',data=>{
            this.initUnread()
            this.onNotify()
        })
    }
    // 初始化列表未读数
    initUnread(){
        this.http.briefReportRequest.baseUnread().then(res => {
            if(res.status == 200) {
                res.data.forEach( (el,index) => {
                    if(el.reportType=="TEXT")
                    this.childrenList[3].unread=el.unreadTotal
                    if(el.reportType=="REPORT")
                    this.childrenList[2].unread=el.unreadTotal
                    if(el.reportType=="SPECIAL")
                    this.childrenList[0].unread=el.unreadTotal
                    if(el.reportType=="BRIEF")
                    this.childrenList[1].unread=el.unreadTotal
                });
            }
        })
    }
}