import { ControllerBase, Inject } from 'prism-web'

export class BaseViewController extends ControllerBase {

    constructor(){
        super()
    }

    @Inject('http') http:any

    private childrenList:Array<any> = [
        {name: '通讯录'   , router:'/addressBookManage/addressBook', unread: 0, children: ['addressBook'] },
        {name: '电话记录' , router:'/addressBookManage/telephoneMessage',unread:0,children:['telephoneMessage']},
        {name: '短信收发' , router:'/addressBookManage/shortLetter',unread:0,children:['shortLetter','outboxDetail','outboxAdd','inboxDetail']},
        {name: '传真管理' , router:'/addressBookManage/faxManage',unread:0,children:['faxManage','controlFaxAdd','deliverFaxAdd','deliverFaxDetail', 'controlFaxDetail']},
        {name: '常用通讯' , router:'/addressBookManage/commonCommunication',unread:0,children:['commonCommunication']},
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