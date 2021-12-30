import { ControllerBase, Inject } from 'prism-web';

export class BaseViewController extends ControllerBase {
  constructor() {
    super();
  }
  @Inject('http') http: any;

  created() {
    // this.initUnread()
    // this.onNotify()
    // this.unreadOnNotify()
  }
  private childrenList: Array<any> = [
    {
      name: '会议室预定',
      router: '/conferenceroom/conferencereserve',
      unread: 0,
      children: ['add-destine', 'edit-destine', 'detail-destine'],
    },
    {
      name: '会议室管理',
      router: '/conferenceroom/management',
      unread: 0,
      children: ['add-management', 'detail-management'],
    },
    {
      name: '历史预定',
      router: '/conferenceroom/history',
      unread: 0,
      children: ['detail-history'],
    },
    {
      name: '会议室预定申请',
      router: '/conferenceroom/applyList',
      unread: 0,
      children: ['detail-apply'],
    },
  ];

  // 列表页未读数通知
  onNotify() {
    this.on('unread', data => {
      this.childrenList.forEach((item, index) => {
        if (item.name == data[0].name) {
          this.$set(this.childrenList[index], 'unread', data[0].unreadCount);
        }
      });
    });
  }

  unreadOnNotify() {
    this.on('initUnreadOnNotifyeRport', () => {
      this.initUnread();
    });
  }

  // 初始化列表未读数
  initUnread() {
    // 获取保平安列表唯独总数
    this.http.ClickReportRequest.getUnread().then(res => {
      // this.reportFlagType = res.data
      if (res.status == 200) {
        this.childrenList[0].unread = res.data[0];
        // console.log(this.childrenList[0].unread, 999)
      }
    });
  }
}
