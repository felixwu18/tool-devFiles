import { ControllerBase, Inject, Watch } from 'prism-web';

export class ReportInformation extends ControllerBase {

  constructor() {
    super();
  }

  private temp = {
    style: require('../../style/reportInformation/reportInformationList.less'),
  };

  private viewDialogPreview: boolean = false; // 预览页面标志
  private templateName: string = '';
  private showSearch: Boolean = false;
  private propsData: Object = {};
  private handleSelectList = []; //选中列表参数 程云
  private handleSelectSketch = []; //选中草稿列表参数 程云
  //按钮控制
  private btnConfig = {
    accurateSearch: false, //精准搜索
  };
  // 列表时间查询参数
  private search_time: Array<any> = [];
  // 列表查询参数
  private searchData = {
    eventType: [],
    infoStatus: '',
    isReadCode: '',
    keyWord: '',
    nowPage: 1,
    pageSize: 10,
    reportDateStrEnd: '',
    reportDateStrStart: '',
    listOrder: {},
  };

  // 当前角色信息
  private role: object;
  // 按钮功能数组
  private btnGroup: object = {
    preview: {
      name: '预览',
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
    this.role = JSON.parse(sessionStorage.getItem('role'));
    this.store.dispatch('infomanage/setReportment', this.searchData)
    this.getListData();
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
        type: 'tagtype',
        label: '',
        width: '100',
        prop: 'eventLevelCode',
        tagArray: {
          '1': { name: '特大', color: 'best' },
          '2': { name: '重大', color: 'better' },
          '3': { name: '较大', color: 'good' },
          '4': { name: '一般', color: 'normal' },
          '5': { name: '其他', color: 'other' },
          '6': { name: '未知', color: 'not' },
        },
      },
      {
        type: 'string',
        label: '标题',
        // basehref: '/information/detailsManage',
        // passProp: 'infoId',
        width: '240',
        prop: 'infoTitle',
        badge: true,
        styles: {
          width: '100%'
        }
      },
      // {
      //   type: 'tag',
      //   label: '状态',
      //   width: '100',
      //   prop: 'handleStatus'
      // },
      // { // 暂时屏蔽 事件来源
      //   type: 'string',
      //   label: '事件来源',
      //   width: '200',
      //   prop: 'eventSource'
      // },
      {
        type: 'string',
        label: '事件类型',
        width: '/',
        prop: 'infoTypeName',
        unsortable: true
      },
      {
        type: 'string',
        label: '上报时间',
        width: '250',
        prop: 'reportDate',
      },
      {
        type: 'string',
        label: '上报人',
        width: '/',
        prop: 'reportPerson',
        unsortable: true
      },
      {
        type: 'string',
        label: '签收状态',
        width: '/',
        prop: 'signStatus',
        unsortable: true
      },
      {
        type: 'string',
        label: '签收单位',
        width: '/',
        prop: 'signOrgName',
        unsortable: true
      },
      {
        type: 'string',
        label: '签收时间',
        width: '250',
        prop: 'signTime',
        unsortable: true
      },
      {
        type: 'button',
        label: '操作',
        width: '100',
        prop: 'operate',
      },
    ],
    // tag展示列表 type 属性是tag 才加tagArray属性
    // tagArray: { '0': { name: '待签', type: 'danger' }, '1': { name: '待办', type: 'primary' }, '9': { name: '退回', type: 'info' } },
    data: [],
  };

  changeEvent(val) {
    this.$set(this.searchData, 'eventType', val);
  }


  // 获取列表数据
  /**
   * Modify by chenzheyu 去除退回按钮判断
   */
  getListData() {
    let searchparam = JSON.parse(JSON.stringify(this.store.getters['infomanage/getReportment']))
    if (this.search_time) {
      let arr = [];
      this.search_time.forEach(item => {
        arr.push(item);
      });
      searchparam['reportDateStrStart'] = arr[0];
      searchparam['reportDateStrEnd'] = arr[1];
    } else {
      searchparam['reportDateStrStart'] = '';
      searchparam['reportDateStrEnd'] = '';
    }

    this.http.GempInfoBaseRequest.getReInformation({ ...searchparam }).then(item => {
      let data = {
        total: 0,
        pageSize: 10,
        data: [],
        nowPage: 1,
      };
      if (item.status !== 200) {
        let dataObj = Object.assign({}, this.propData, data);
        this.$set(this, 'propData', dataObj);
        this.propData.emptyText = "暂无数据"
        return;
      }
      if (item.data.list.length == 0) {
        this.propData.emptyText = "暂无数据"
      }
      data.total = item.data.total;
      data.pageSize = item.data.pageSize;
      data.nowPage = item.data.nowPage;
      data.data = item.data.list.map((item, index) => {
        let obj = JSON.parse(JSON.stringify(this.btnGroup));
        obj['preview'].expression = true
        item.operate = obj;
        item.signTime = item.signTime ? item.signTime : '/'
        item.signOrgName = item.signOrgName ? item.signOrgName : '/'
        return item;
      });
      data = Object.assign({}, this.propData, data);
      //未选择事件等级时，判断
      data.data.map(it => {
        if (it.eventLevelName == '未知') {
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
    this.store.dispatch('infomanage/setReportment', { nowPage: data.rowVal })
    this.getListData();
  }


  // 预览功能
  preview(data) {
    this.viewDialogPreview = true;
    this.templateName = data.buttonItem.el;
    // this.tilteName = data.buttonItem.name;
    this.propsData = {
      infoId: data.rowVal.infoId,
      type: 're'
    };
  }


  //关闭
  closeDialogCall(callInfo) {
    //关闭弹框
    this.viewDialogPreview = false;
    //重新刷新当前页面数据
    this.getListData();
  }

  // 排序功能
  sort(data) {
    this.$set(this.searchData, 'listOrder', data.rowVal);
    this.store.dispatch('infomanage/setReportment',this.searchData)
    this.getListData();
  }

  // tab组件展示未读数功能
  tabUnread(obj: object) {
    this.emit('unread', obj);
  }


  /*
   * Author by chengyun 获取选中列表
   * Modify by chengyun
   */
  handleselection(data) {
    this.handleSelectList = [];
    this.handleSelectSketch = [];
    data.type.forEach(el => {
      if (el.infoStatus == 1) {
        this.handleSelectList.push(el.infoId);
      } else {
        this.handleSelectSketch.push(el.infoId);
      }
    });
  }


  /**
   * 重置清空按钮
   */
  deleteSearch() {
    this.search_time = []
    this.searchData.eventType = []
    // this.searchData.orgCode = []
    if (this.$refs.eventType) {
      this.$refs.eventType['slideValue'] = ""
      this.$refs.eventType['$refs'].tree.setCheckedKeys([])
      this.$refs.eventType['commonSelectIndex'] = -1
    }
    this.quickSearch()
  }

  /**
   * 快速搜索
   */
  quickSearch() {
    this.searchData.nowPage = 1
    this.store.dispatch('infomanage/setReportment', this.searchData)
    this.getListData()
  }
}
