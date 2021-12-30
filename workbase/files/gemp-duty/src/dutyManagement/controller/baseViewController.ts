import { ControllerBase, Inject } from 'prism-web'
import searchData from '../../../assets/libs/searchData'

export class BaseViewController extends ControllerBase {

    constructor(){
        super()
    }

    @Inject('http') http:any

    private childrenList:Array<any> = [
        // {name: '值班记录单',router:'/dutyManagement/dutyRecordSheet', unread: 0, children: ['dutyRecordSheet'] },
        // {name: '值班要情' , router:'/dutyManagement/dutySituation',unread:0,children:['dutySituation']},
        // {name: '值班统计' , router:'/dutyManagement/dutyStatistics',unread:0,children:['dutyStatistics']},
        {name: '公文收发' , router:'/dutyManagement/documentHandle',unread:0,children:['documentHandle','leaveReport', 'outgoingReport','otherDocumnet','lowerHairDocumentAdd','reportDocumentAdd','receiptDocumentAdd']},
    ]

    created(){
        // this.initUnread()
        // this.onNotify()
    }

    memuchildrenList(){
        let data = searchData.getter({ name: 'menuData' })? searchData.getter({ name: 'menuData' }):""
        this.childrenList
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