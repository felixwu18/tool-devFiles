import { ControllerBase, Inject } from 'prism-web'

export class BaseViewController extends ControllerBase {

    constructor(){
        super()
    }

    @Inject('http') http:any

    private childrenList:Array<any> = [
      { name: '领导带班表', router: '/workforceManagement/festivalList', unread: 0, children: ['leader-list'] },
      { name: '政务值班表', router:'/workforceManagement/govermentBaseview',unread:0,children:['govermentduty']},
      { name: '值班设置', router:'/workforceManagement/group',unread:0,children:['setonduty']},
      { name: '换班替班' , router:'/workforceManagement/substitute',unread:0,children:['substitute']},
    ]

    created(){
        // this.initUnread()
        // this.onNotify()
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

    // 初始化列表未读数
    initUnread(){
        this.http.GempInfoBaseRequest.baseInfoUnread().then(res => {
            if(res.status == 200) {
                res.data.forEach( (el,index) => {
                    this.childrenList[index].unread = el
                });
            }
        })
    }
}