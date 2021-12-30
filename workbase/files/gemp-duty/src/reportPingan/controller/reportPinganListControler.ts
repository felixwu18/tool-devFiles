import { ControllerBase, Inject, Watch } from 'prism-web';

export class reportPinganList extends ControllerBase {

  constructor() {
    super();
  }

  private temp = {
    style: require('../style/reportPinganList.less'),
  };

  private pickerOptions = {
    disabledDate:(time)=>{
        return time.getTime() < new Date(new Date().setHours(0, 0, 0, 0)).getTime()
    }
};
private messageDom:any = null // message对象实体
  private value1 = new Date(new Date().setHours(0, 0, 0, 0)).toJSON()
  private value2 = new Date(new Date().setHours(23, 59, 59, 0)).toJSON()
  // private viewDialogPreview: boolean = false; // 预览页面标志
  private templateName: string = '';
  // private propsData: Object = {};
  private roleLevel: Boolean = false;
  private reportFlag: Boolean = false;
  private isRolesIncludeDuty: Boolean= false //值班员角色
  private handleSelectList = []; //选中列表参数 程云
  private handleSelectSketch = []; //选中草稿列表参数 程云
  // 列表时间查询参数
  // private search_time: Array<any> = [new Date(new Date().setHours(0, 0, 0, 0)).toJSON(),new Date(new Date().setHours(23, 59, 59, 0)).toJSON()];
  // 列表查询参数
  private searchData = {
    // eventType: [],
    // infoStatus: '',
    // isReadCode: '',
    // keyWord: '',
    nowPage: 1,
    tenantCode: '',
    pageSize: 10,
    reportDateStrEnd: '',
    reportDateStrStart: '',
    // listOrder: {},
  };


  @Watch('value1')
  timeValue1(val) {
      if(val) {
          this.searchData.reportDateStrStart =  new Date(val).toJSON()
          this.pickerOptions['disabledDate'] = (time) => {
                  return time.getTime() < val.getTime()
          }
      }
  }
  @Watch('value2')
  timeValue2(val) {
      if(val) {
          this.searchData.reportDateStrEnd =  new Date(val.setHours(23, 59, 59, 0)).toJSON()
    //       this.pickerOptions['disabledDate'] = (time) => {
    //         return val < this.value1
    // }
      }
  }
  // 当前角色信息
  private role: object;
  // 按钮功能数组
  private btnGroup: object = {
    preview: {
      name: '查看',
      emit: 'preview',
      el: 'preview',
      type: 'primary',
      expression: true,
    },
  }
  // 事件类型列表
  typeList: Array<any> = [];

  @Inject('http') http: any;
  @Inject('store') store: any;
  created() {
    this.searchData.reportDateStrStart =  this.value1
    this.searchData.reportDateStrEnd =  this.value2
    this.role = JSON.parse(sessionStorage.getItem('role'));
    this.roleLevel = this.role['isYjb'];
    this.isRolesIncludeDuty = this.role['roleRelationDTO'].isRolesIncludeDuty || false //值班员角色
    this.store.dispatch("reportsafety/setSearch",this.searchData)
    this.getListData();
    this.getReportFlag();
    // this.getInfoData(this.propId);
  }

  activated() { }
  /**
   *  author by xinglu 获取当前菜单的按钮权限
   *  @param{
   *    menuId: "",  //菜单id
   *    userId: "", //当前登录用户的id
   *  }
   */

  private propData = {
    isCheck: false,
    pageSize: 0,
    total: 0,
    emptyText: "加载中",
    config: [
      {
        type: 'link',
        label: '标题',
        width: '/',
        basehref: '/reportPingan/detailsManage',
        passProp: 'dailyId',
        prop: 'dailyTitle',
        //badge: true,
        unsortable: true
      },
      {
        type: 'string',
        label: '单位',
        // basehref: '/information/detailsManage',
        // passProp: 'infoId',
        width: '/',
        prop: 'dailyOrgCode',
        // badge: true,
        unsortable: true
      },
      {
        type: 'string',
        label: '上报日期',
        width: '/',
        prop: 'dailyTime',
        unsortable: true
      },
      {
        type: 'string',
        label: '创建时间',
        width: '/',
        prop: 'createTime',
        unsortable: true
      },
      {
        type: 'button',
        label: '操作', 
        width:  '200',
        prop: 'operate',
      },
    ],
    // tag展示列表 type 属性是tag 才加tagArray属性
    // tagArray: { '0': { name: '待签', type: 'danger' }, '1': { name: '待办', type: 'primary' }, '9': { name: '退回', type: 'info' } },
    data: [],
  };


  // getOrg(val) {
  //   this.$set(this.searchData, 'orgCode', val);
  // }

  // changeEvent(val) {
  //   console.log(val);
  //   this.$set(this.searchData, 'eventType', val);
  // }


  // 获取列表数据
  /**
   * Modify by chenzheyu 去除退回按钮判断
   */
 
  async getListData() {
    if(this.searchData.reportDateStrEnd<=this.searchData.reportDateStrStart){
     this.messageDom = this.$message({
          type:"warning",
          message:"结束时间不得早于开始时间"
          })
     return false
    }

    await this.http.GempInfoBaseRequest.getReportPingan(this.store.getters['reportsafety/getSearch']).then(item => {
      let data = {
        total: 0,
        pageSize: 10,
        data: [],
      };
      if (item.status !== 200) {
        let dataObj = Object.assign({}, this.propData, data);
        this.$set(this, 'propData', dataObj);
        this.propData.emptyText = "暂无数据"
        return;
      }
      if (!item.data || !item.data.list || item.data.list.length == 0) {
        this.propData.emptyText = "暂无数据"
      }
      data.total = item.data.total;
      data.pageSize = item.data.pageSize;
      data.data = item.data.list.map((item, index) => {
        let obj = JSON.parse(JSON.stringify(this.btnGroup));
        obj['preview'].expression =true 
        item.operate = obj;
        return item;
      });
      data = Object.assign({}, this.propData, data);
      //未选择事件等级时，判断
      data.data.map(it=>{
        if(it.eventLevelName == '未知') {
           it['eventLevelCode'] = '6'
        }
      })
      this.$set(this, 'propData', data);
    });
  }

  // 列表按钮点击响应
  tablecallback(data) {
    this[data.type](data);
  }

  // 翻页功能
  handlePageChange(data) {
    this.searchData['nowPage'] = data.rowVal;
    this.store.dispatch("reportsafety/setSearch",{nowPage: data.rowVal})
    this.getListData();
  }


  // 查看功能
  preview(data) {
    this.$router.push({
      path: '/reportPingan/detailsManage',
      query: { id: data.rowVal.dailyId },
    });
  }


  //关闭
  // closeDialogCall(callInfo) {
  //   //关闭弹框
  //   this.viewDialogPreview = false;
  //   //重新刷新当前页面数据
  //   this.getListData();
  // }

  // 排序功能
  sort(data) {
    this.$set(this.searchData, 'listOrder', data.rowVal);
    this.store.dispatch("reportsafety/setSearch",{listOrder: data.rowVal})
    this.getListData();
  }

  // tab组件展示未读数功能
  tabUnread(obj: object) {
    this.emit('unread', obj);
  }

   /**
   * 报平安
   */
  reportPa() {
    this.$router.push({
      path: '/reportPingan/addReportPa',
    });
  }

  // 获取保平安权限
  getReportFlag() {
      this.http.GempInfoBaseRequest.getReportPromiss().then(res => {
      this.reportFlag = res.data
      // console.log(this.reportFlag, 999)
      }
    );
  }
  // getInfoData(id) {
  //   let infoParams = { infoId: id };
  //   this.http.GempInfoBaseRequest.getInfoById(infoParams).then(res => {
  //     this.reportFlag = res.data.reportFlag
  // }
  // 更新消息提醒的滚动条，弹框，铃铛
  updateMessageRemindData() {
    let data = {
      type:"updateMessageRemind",
    }
    setTimeout(() => {
      parent.postMessage(data,"*")
    }, 2000);
  }
  // 标为已读
  toread() {
    this.$confirm('此操作将把所有未读消息一键标为已读，是否继续?', "提示", {
          confirmButtonText: '确定',
          cancelButtonText: "取消",
          confirmButtonClass: 'confirmButtonClass',
          cancelButtonClass: "confirmButtonClass",
      }).then(() => {this.sureReport()})
      .catch(() => {
        this.$message({
          message: '已取消操作'
        })
      })
}
  sureReport() {
    this.http.GempInfoBaseRequest.getAllRead().then(res => {
      if (res.status == 200) {
        this.$message({
          type: 'success',
          message: '一键已读成功',
          duration: 1000
        })
        this.tabUnread({
            name: '上报平安',
            unreadCount: 0,
        });
        this.getListData();
        this.updateMessageRemindData();
      }
    })
  }

  /** 快速检索 */
  quickSearch() {
    this.searchData['nowPage'] = 1
    this.store.dispatch("reportsafety/setSearch",this.searchData)
    this.getListData()
  }
}
