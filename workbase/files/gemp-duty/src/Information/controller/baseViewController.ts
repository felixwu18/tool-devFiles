import { ControllerBase, Inject, Emit, Prop, Watch  } from 'prism-web'

export class BaseViewController extends ControllerBase {

    constructor(){
        super()
    }
    @Inject('http') http:any

    private topUser :any
    private reportFlag:boolean
    private navtab: string = ''
    private childrenList: any[] = [];

    created(){
        this.initChildrenList();
    }

    mounted() {
        this.initUnread();
        this.onNotify();
        this.unreadOnNotify();
    }

    // private childrenList:Array<any> = [
    //     {name:'信息呈报',router:'/information/infoManage',unread:0,children:['detailsManage','detailsEdit','repeat','submitReport']},
    //     {name:'转办督办',router:'/information/transfer',unread:0,children:['transferAdd','transferView']},
    //     {name:'已报信息',router:'/information/reportInformation',unread:0,children:['reportInformation']},
    //     {name:'一键上报',router:'/information/oneclickReport',unread:0,children:['addClickReport','editClickReport','clickReport','detailsClickReport']},
    //     // {name:'公文办理',router:'/information/documentProcessed',unread:0},
    // ]

    private initChildrenList() {
        const role = JSON.parse(sessionStorage.getItem('role'))

        if(role['tenantId'] == 'GJ.JSS') {
            this.childrenList = [
                {name:'信息呈报',router:'/information/infoManage',unread:0,children:['detailsManage','detailsEdit','repeat','submitReport']},
                {name:'转办督办',router:'/information/transfer',unread:0,children:['transferAdd','transferView']},
                {name:'已共享信息',router:'/information/sharedPage',unread:0,children:[]},
                //{name:'一键上报',router:'/information/oneclickReport',unread:0,children:['addClickReport','editClickReport','clickReport','detailsClickReport']},
            ]
        }
        if(role['sharestatus']){
            this.childrenList = [
                {name:'信息呈报',router:'/information/infoManage',unread:0,children:['detailsManage','detailsEdit','repeat','submitReport']},
                {name:'转办督办',router:'/information/transfer',unread:0,children:['transferAdd','transferView']},
                {name:'已报信息',router:'/information/reportInformation',unread:0,children:['reportInformation']},
                {name:'已共享信息',router:'/information/sharedPage',unread:0,children:[]},
                //{name:'一键上报',router:'/information/oneclickReport',unread:0,children:['addClickReport','editClickReport','clickReport','detailsClickReport']},
            ]
        } else {
            this.childrenList = [
                {name:'信息呈报',router:'/information/infoManage',unread:0,children:['detailsManage','detailsEdit','repeat','submitReport']},
                {name:'转办督办',router:'/information/transfer',unread:0,children:['transferAdd','transferView']},
                {name:'已报信息',router:'/information/reportInformation',unread:0,children:['reportInformation']},
                // {name:'已共享信息',router:'/information/sharedPage',unread:0,children:[]},
                //{name:'一键上报',router:'/information/oneclickReport',unread:0,children:['addClickReport','editClickReport','clickReport','detailsClickReport']},
            ]
        }

    }

    // 列表页未读数通知
    onNotify(){
        this.on("unread", (data)=> {
            this.childrenList.forEach((item,index) => {
                if (item.name == data[0].name) {
                    this.$set(this.childrenList[index],'unread',data[0].unreadCount)
                }
            })
        })
    }

    unreadOnNotify() {
        this.on("initUnreadOnNotify", () => {
            this.initUnread()
        })
    }

    // 初始化列表未读数
    initUnread(){
        this.http.GempInfoBaseRequest.baseInfoUnread().then(res => {
            if(res.status == 200) {
                res.data.forEach( (el,index) => {
                    this.$set(this.childrenList[index], 'unread', el)
                });

            }
        })
        // 获取一键上报列表唯独总数
        // this.http.ClickReportRequest.getAllUnread().then(res => {
        //     // this.reportFlagType = res.data
        //     if(res.status == 200) {
        //         this.childrenList[3].unread = res.data[0];
        //     }
        // })
    }
    fromchild(item) {
        this.navtab=item;
        this.$route.path = '/information/oneclickReport';
    }

}