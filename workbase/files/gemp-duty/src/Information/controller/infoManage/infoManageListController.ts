import { ControllerBase, Inject } from 'prism-web';
import { jumpLink } from '../../../../service/config/base';
import searchSession from '../../../../assets/libs/searchData';
export class InfoManageListController extends ControllerBase {
  private imgSrc = require('../../../../assets/image/icon-map.png')
  private shareImg = require('../../../../assets/image/share.png')
  private mapInfo: Object = {
    type: 'geometry-location',
  };
  private viewMapDialog: Boolean = false; // 展示地图弹框
  private addType: string = '1'; // 信息录入类型 1是初报 2是续报
  private eventId:any = null; // 选择续报的事件ID
  private eventOptions:any = [];// 续报事件列表
  private dialogNTKO: Boolean = true;
  private showSearch: Boolean = false;
  private viewDialog: boolean = false;
  private viewDialogPreview: boolean = false; // 预览页面标志
  private templateName: string = '';
  private tilteName: string = '';
  private propsData: Object = {};
  private handleSelectList = []; //选中列表参数 程云
  private handleSelectSketch = []; //选中草稿列表参数 程云
  private windowWidth = '370';
  private dayType:any ='1' // 时间类型
  private dataType = 1 // 详情数据类型
  private typeLeft = 0;
  private timeLeft = 0;
  private reportLength = 0; // 续报条数
  private lastId = ''; // 最后一条续报的iD
  // 默认显示查看未读
  private readSign: string = '查看未读';
  // 列表时间查询参数
  private search_time: Array<any> = [];
  // 列表查询参数
  private searchData = {
    eventType: [],
    infoStatus: '',
    isReadCode: '',
    keyWord: '',
    nowPage: 1,
    orgCode: [],
    pageSize: 1, // 默认查最近的一条数据
    reportDateStrEnd: '',
    reportDateStrStart: '',
    listOrder: {},
  };
  //按钮控制
  private btnConfig = {
    report: false, //上报
    text: false, //生成文本
    unread: false, //查看未读
    read: false, //标为已读
    search: false, //搜索
    accurateSearch: false, //精准搜索
  };
  // 当前角色级别
  private roleLevel: boolean;
  // 当前角色信息
  private role: object;
  // 当前角色是上级还是下级
  private roleStatus: boolean;
  // 按钮功能数组
  private btnGroup: object = {
    // preview: {
    //   name: '预览',
    //   emit: 'preview',
    //   el: 'preview',
    //   type: 'primary',
    //   expression: false,
    // },
    handle: { name: '办理', emit: 'handle', type: 'primary', expression: true },
    // sticky: { name: '置顶', emit: 'sticky', type: 'success', expression: true },
    // cancelSticky: {
    //   name: '取消置顶',
    //   emit: 'cancelSticky',
    //   type: 'success',
    //   expression: true,
    // },
    // continueReport: {
    //   name: '续报',
    //   emit: 'continueReport',
    //   el: 'continue-report',
    //   type: 'primary',
    //   expression: true,
    // },
    // returnReport:{ name: '退回', emit: 'continueReport', el: 'return-report', type: 'danger',expression:true  },
    // infoRepeat: {
    //   name: '重报',
    //   emit: 'infoRepeat',
    //   type: 'primary',
    //   expression: true,
    // },
    draftEdit: {
      name: '编辑草稿',
      emit: 'draftEdit',
      type: 'primary',
      expression: true,
    },
    draftDelect: {
      name: '删除',
      emit: 'draftDelect',
      type: 'warning',
      expression: true,
    },
    shareTo: { 
      name: '共享至...',
      emit: 'shareTo',
      type: 'primary',
      expression: true,
    },
  };
  // 续保事件列表
  private options: []
  private currentTypePage = 1
  private currentTimePage = 1
  private reportTypeList = []
  // 事件类型列表
  typeList: Array<any> = [];

  @Inject('http') http: any;
  @Inject('store') store:any
  created() {
    console.log(this.$route.query)
    this.role = JSON.parse(sessionStorage.getItem('role'));
    this.roleLevel = this.role['isYjb'];
    this.dayType = this.$route.query.type || '1';
    this.store.dispatch('infomanage/setInfomanage',this.searchData);
    this.changeDayType(this.dayType);
    this.getEventList();
    this.btnManagement();
  }

  activated() {}
  changePage(type) {
    if (type === 1) {
      if (this.currentTimePage > 1) {
        this.currentTimePage--
        this.timeLeft += 21.85;
      }
    } else {
      if (this.currentTimePage <= this.reportLength - 6) {
        this.currentTimePage++
        this.timeLeft -= 21.85;
      }
    }
  }
  changeTypePage(type) {
    if (type === 1) {
      if (this.currentTypePage > 1) {
        this.currentTypePage--
        this.typeLeft += 50;
      }
    } else {
      if(this.currentTypePage < this.reportTypeList[0].length-1) {
        this.currentTypePage++
        this.typeLeft -= 50;
      }
    }
  }
  changeDataType(type) {
    this.dataType = type;
    this.timeLeft = 0;
    this.typeLeft = 0;
  }
  // 打开地图弹框
  showMap(item) {
    this.$set(this.mapInfo, 'data', { location: { x: item.longitude, y: item.latitude } });
    this.viewMapDialog = true;

  }
  /**
   * 
   *  author by xinglu 获取当前菜单的按钮权限
   *  @param{
   *    menuId: "",  //菜单id
   *    userId: "", //当前登录用户的id
   *  }
   */
  btnManagement() {
    var userInfo = searchSession.getter({ name: 'role' });
    let params = {
      menuId: "2c9287db6e7e3851016e812f71600004",
      userId: userInfo['userId'],
    };
    this.http.PowerNodeRequest.btnPowerManagement(params).then((res) => {
      if (res.status == 200) {
        res.data.forEach((data) => {
          switch (data.privName) {
            case '添加上报':
              this.btnConfig.report = true;
              break;
            case '生成文本':
              this.btnConfig.text = true;
              break;
            case '查看未读':
              this.btnConfig.unread = true;
              break;
            case '标为已读':
              this.btnConfig.read = true;
              break;
            case '搜索':
              this.btnConfig.search = true;
              break;
            case '精准搜索':
              this.btnConfig.accurateSearch = true;
              break;
          }
        });
      }
    });
  }
  private propData = {
    isCheck: true,
    pageSize: 0,
    total: 0,
    emptyText: '加载中',
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
        label: '事件ID',
        width: '/',
        prop: 'infoNumber',
      },
      {
        type: 'link',
        label: '标题',
        basehref: '/information/detailsManage',
        passProp: 'infoId',
        prop: 'infoTitle',
        badge: true,
        styles: {
          width: '100%',
        },
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
      },
      {
        type: 'string',
        label: '接报时间',
        width: '/',
        prop: 'reportDate',
      },
      {
        type: 'string',
        label: '报送单位',
        width: '/',
        prop: 'orgName',
      },
      {
        type: 'button',
        label: '操作',
        width: window.screen.width <= 1400 ? '280' : '370',
        prop: 'operate',
      },
    ],
    // tag展示列表 type 属性是tag 才加tagArray属性
    // tagArray: { '0': { name: '待签', type: 'danger' }, '1': { name: '待办', type: 'primary' }, '9': { name: '退回', type: 'info' } },
    data: [],
  };

  constructor() {
    super();
  }

  private temp = {
    style: require('../../style/infoManage/infoManageList.less'),
  };
  // 切换时间类别
  changeDayType(item) {
    this.showSearch = false;
    this.dayType = item;
    this.deleteSearch()
    switch (this.dayType) {
      case '1':
        this.searchData.pageSize = 1
        this.store.dispatch("infomanage/setInfomanage", this.searchData)
        break;
      case '2':
        this.searchData.pageSize = 100
        this.store.dispatch("infomanage/setInfomanage", this.searchData)
        const curTime3 = new Date().getTime();
        var startTime = curTime3 - (3 * 3600 * 24 * 1000)
        this.search_time = [new Date(startTime), new Date()]
        break;
      case '3':
        this.searchData.pageSize = 100
        this.store.dispatch("infomanage/setInfomanage", this.searchData)
        const curTime7 = new Date().getTime();
        var startTime = curTime7 - (7 * 3600 * 24 * 1000)
        this.search_time = [new Date(startTime), new Date()]
        break;
      case '4':
        this.searchData.pageSize = 8
        this.store.dispatch("infomanage/setInfomanage", this.searchData)
        break;
    }
    this.getListData()
  }
  // 点击信息录入
  enteringMsg() {
    this.viewDialog = true;
  }
  closePop() {
    this.viewDialog = false;
  }
  submit() {
    if(this.addType === '1') {
      this.$router.push({
        path: '/information/detailsEdit',
        query: { type: this.dayType },
      });
    }else{
      if(!this.eventId) {
        this.$message.warning('请选择续报事件！');
        return false
      }
      this.handle(this.eventId)
    }
  }
  // 查看详情
  showDetails(item,index) {
    this.dataType = 1;
    item.isActive = !item.isActive;
    if (item.isActive) {
      this.propData.data.forEach(ele=>{
        if (!ele.isDetails && ele.infoId !== item.infoId) {
          ele.isActive = false
        }
        if (ele.isDetails && ele.infoId !== item.infoId) {
          ele.isShow = false
        }
      })
      const arr = this.propData.data.slice(index, this.propData.data.length);
      let obj = arr.find(item => { return item.isDetails });
      if (obj){
        this.getReportListByTime(item.infoId, obj)
        this.getReportListByType(item.infoId, obj)
      }
    }else{
      this.propData.data.forEach(ele => {
        if (ele.isDetails) {
          ele.isShow = false
        }
      })
    }
  }
  // 重绘地图尺寸
  private updateMapSize() {
    this.$refs.detailMap['updateMapSize']()
  }
  mapRenderFinish() {
    window.onresize = () => {
      if (this.updateMapSize) {
        setTimeout(this.updateMapSize, 2000)
      }
    }
    this.$refs.detailMap['setMapDiot'](this.mapInfo) 
  }
  getOrg(val) {
    this.$set(this.searchData, 'orgCode', val);
  }

  changeEvent(val) {
    this.$set(this.searchData, 'eventType', val);
  }

  // 查看未读  查看全部
  searchUnread() {
    if (!this.searchData['isReadCode']) {
      this.searchData['isReadCode'] = '1';
      this.readSign = '查看全部';
    } else {
      this.searchData['isReadCode'] = '';
      this.readSign = '查看未读';
    }
    this.store.dispatch("infomanage/setInfomanage",this.searchData)
    this.getListData(1);
  }

  //  获取最新的五条事件
  getEventList () {
    const searchData = {
      nowPage: 1,
      pageSize:5
    }
    this.http.GempInfoBaseRequest.getAll(searchData).then(res=>{
      if(res.status === 200) {
        this.eventOptions =  res.data.list;
      }
    })
  }
  // 获取列表数据
  /**
   * Modify by chenzheyu 去除退回按钮判断
   */
  async getListData(nowPage?) {
    let token = JSON.parse(sessionStorage.getItem('token'));
    let params = {
      token: token,
    };
    // 判断用户是否是上下级
    await this.http.GempInfoBaseRequest.getUserLevel(params).then((res) => {
      if (res.status == 200) {
        this.roleStatus = res.data;
      }
    });
    if (this.search_time) {
      let arr = [];
      this.search_time.forEach((item) => {
        arr.push(item);
      });
      this.searchData['reportDateStrStart'] = arr[0];
      this.searchData['reportDateStrEnd'] = arr[1];
    } else {
      this.searchData['reportDateStrStart'] = '';
      this.searchData['reportDateStrEnd'] = '';
    }
    this.store.dispatch('infomanage/setInfomanage',{reportDateStrStart:this.searchData['reportDateStrStart'],reportDateStrEnd:this.searchData['reportDateStrEnd']})
    // 去除空格
    const searchData = JSON.parse(JSON.stringify(this.store.getters["infomanage/getInfomanage"]))
    await this.http.GempInfoBaseRequest.getAll({ ...searchData, orgCode: searchData.orgCode.length > 0 ? [searchData.orgCode] : [] }).then(item => {
      let data = {
        total: 0,
        pageSize: 8,
        data: [],
        nowPage: 0
      };
      if (item.status !== 200) {
        let dataObj = Object.assign({}, this.propData, data);
        this.$set(this, 'propData', dataObj);
        this.propData.emptyText = '暂无数据';
        return;
      }
      if (item.data.list.length == 0) {
        this.propData.emptyText = '暂无数据';
      }
      data.total = item.data.total;
      data.pageSize = item.data.pageSize;
      data.nowPage = item.data.nowPage
      data.data = item.data.list.map((item, index) => {
        let obj = JSON.parse(JSON.stringify(this.btnGroup));
        // 当前角色为上级,并且数据有呈报才显示预览按钮
        // obj['preview'].expression = item.reviewFlag == true ? true : false;
        //当返回的infoStatus字段的值为0时，草稿按钮显示
        obj['draftEdit'].expression = item.infoStatus == '0' ? true : false;
        obj['draftDelect'].expression = item.infoStatus == '0' ? true : false
        //   ? true
        //   : false;
        // 高新区按钮不显示办理,注释为原代码
        // obj['handle'].expression =
        //   (this.roleLevel && !obj['draftEdit'].expression) ||
        //   (item.handleFlag && !this.roleLevel);
        //   console.log(obj['handle'].expression)
          // obj['handle'].expression =
          // (!obj['draftEdit'].expression) ||
          // (item.handleFlag && !this.roleLevel);
        // obj['sticky'].expression =
        //   item.isTop == 0 && !obj['draftEdit'].expression ? true : false;
        // obj['cancelSticky'].expression =
        //   !obj['sticky'].expression && !obj['draftEdit'].expression;
        //当填报单位与角色不一致并且后台返回数据上报状态不为退报时,屏蔽重报按钮
        // obj['infoRepeat'].expression =
        //   item.orgCode == this.role['orgCode'] &&
        //   item.infoReportStatus == '2' &&
        //   !obj['draftEdit'].expression
        //     ? true
        //     : false;
        //当填报单位与角色不一致,屏蔽续报按钮
        // obj['continueReport'].expression =
        //   !obj['infoRepeat'].expression &&
        //   item.orgCode == this.role['orgCode'] &&
        //   !obj['draftEdit'].expression
        //     ? true
        //     : false;
        // obj['continueReport'].expression = false;
        // 共享至
        obj['shareTo'].expression = this.role['shareStatus'] && item.pushStatus !== '1';
        // obj['shareTo'].expression = false;

        item.operate = obj;
        return item;
      });
      data = Object.assign({}, this.propData, data);
      this.tabUnread({
        name: '信息处理',
        unreadCount: item.data['unReadTotalCount'],
      });
      //未选择事件等级时，判断
      const keys = ['deathNum', 'seriousInjureNum', 'minorInjureNum', 'woundNum', 'lossNum','trappedNum']
      data.data.map((it) => {
        if (it.eventLevelName == '未知') {
          it['eventLevelCode'] = '6';
        }
        let allNum = []
        keys.forEach(item => {
          allNum.push(it[item])
        })
        if (allNum.every(item => { return item === null })) {
          it.casualty = 0

        } else if (allNum.every(item => { return item === 0 })) {
          it.casualty = 1

        } else {
          it.casualty = 2
        }
      });
      if (this.dayType !== '4') {
        let arr = [];
        for (let i = 0; i <= data.data.length; i++) {
          if ((i + 1) % 2 === 0) {
            if (data.data[i]) {
              arr.push(data.data[i]);
            }
            arr.push({ isShow: false, isDetails: true })
          } else {
            if (data.data[i]) {
              data.data[i].isActive = false;
              arr.push(data.data[i])
            }
            
          }
        }
        data.data = arr;
      }
      this.$set(this, 'propData', data);
    });
  }

  async getReportListByTime(infoId,obj) {
    const res = await this.http.GempInfoBaseRequest.reportListByTime(infoId)
    if(res.status === 200) {
      obj.isShow = true
      res.data = res.data || []
      this.reportLength = res.data.length
      if(res.data.length) {
        this.lastId = res.data[res.data.length -1].id
      }
      obj.reportUpList = []
      obj.reportDownList = []
      res.data.forEach((item,index) => {
        if((index % 2) === 0) {
          obj.reportUpList.push(item)
        }else{
          obj.reportDownList.push(item)
        }
      });
    }
  }
  async getReportListByType(infoId, obj) {
    const res = await this.http.GempInfoBaseRequest.reportListByType(infoId)
    if (res.status === 200) {
      obj.reportTypeList = Object.values(res.data) || []
      this.reportTypeList = obj.reportTypeList
    }
  }
  // 列表按钮点击响应
  tablecallback(data) {
    this[data.type](data);
  }

  // 翻页功能
  handlePageChange(data) {
    this.searchData['nowPage'] = data.rowVal;
    this.store.dispatch('infomanage/setInfomanage',{nowPage:data.rowVal})
    this.getListData();
  }
  //草稿删除
  draftDelect(data) {
    this.$confirm('是否确认删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'confirmButtonClass',
      cancelButtonClass: 'confirmButtonClass',
    })
      .then(() => {
        let infoParams = { infoId: typeof data === 'string' ? data : data.rowVal.infoId };
        this.http.DetailOperationsRequest.delect(infoParams).then((res) => {
          if (res.status == 200) {
            this.$message.success('操作成功！')
            this.getListData(1);
          } else {
            this.$message({
              message: '删除失败',
              type: 'error',
            });
          }
        });
      })
      .catch(() => {
        this.$message({
          message: '已取消操作',
        });
      });
  }
  // 置顶功能
  sticky(data) {
    let infoParams = { infoId: data.rowVal.infoId };
    this.http.DetailOperationsRequest.top(infoParams).then((res) => {
      if (res.status == 200) {
        this.getListData(1);
      } else {
        this.$message({
          message: '置顶请求失败',
          type: 'error',
        });
      }
    });
  }

  // 取消置顶功能
  cancelSticky(data) {
    let infoParams = { infoId: data.rowVal.infoId };
    this.http.DetailOperationsRequest.topCancel(infoParams).then((res) => {
      if (res.status == 200) {
        this.getListData(1);
      } else {
        this.$message({
          message: '取消置顶请求失败',
          type: 'error',
        });
      }
    });
  }

  // 预览功能
  preview(data) {
    this.viewDialogPreview = true;
    this.templateName = data.buttonItem.el;
    // this.tilteName = data.buttonItem.name;
    this.propsData = {
      infoId: data.rowVal.infoId,
    };
  }

  // 办理功能
  handle(data) {
    if(typeof data !== 'string') {
      data = data.rowVal.infoId
    }
    this.$router.push({
      path: '/information/detailsManage',
      query: { id: data, type: this.dayType},
    });
  }

  //续报或退回
  continueReport(data) {
    this.viewDialog = true;
    this.templateName = data.buttonItem.el;
    this.tilteName = data.buttonItem.name;
    this.propsData = {
      infoId: data.rowVal.infoId,
    };
  }

  // /**
  //  *
  //  * 点击跳转页面
  //  * @param {*} data
  //  * @memberof InfoManageListController
  //  */
  // link(data) {
  //   let infoId = '';
  //   if (data.rowVal.infoId) {
  //     infoId = data.rowVal.infoId;
  //   }
  //   window.open(
  //     `${jumpLink}?token=${sessionStorage.getItem(
  //       'token'
  //     )}&infoId="${infoId}"&stype="1"`
  //   );
  // }

  /*
   * Author by lihuihui  点击草稿按钮跳转路由
   */
  draftEdit(data) {
    this.$router.push({
      path: '/information/detailsEdit',
      query: { id: data.rowVal.infoId ,type:this.dayType},
    });
  }

  /**
   * 报送理政中心
   * @param data 
   */
  shareTo(data) {
    this.$confirm('是否确认共享此信息?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'confirmButtonClass',
      cancelButtonClass: 'confirmButtonClass',
    }).then(() => {
      let params = { id: typeof data === 'string' ? data:data.rowVal.infoId, pushStatus: '1' };
      this.http.DetailOperationsRequest.pushStatus(params).then((res) => {
        if (res.status == 200) {
          this.getListData(1);
        } else {
          this.$message({
            message: '共享信息失败',
            type: 'error',
          });
        }
      });
    });
  }

  //关闭信息拟办、信息审核、领导批示等弹框的回调函数
  closeDialogCall(callInfo) {
    //关闭弹框
    this.viewDialog = false;
    //关闭弹框
    this.viewDialogPreview = false;
    //重新刷新当前页面数据
    this.getListData();
  }

  // 排序功能
  sort(data) {
    this.$set(this.searchData, 'listOrder', data.rowVal);
    this.store.dispatch("infomanage/setInfomanage",this.searchData)
    this.getListData();
  }

  // tab组件展示未读数功能
  tabUnread(obj: object) {
    this.emit('unread', obj);
  }

  // 标为已读
  signReaded() {
    this.$confirm('此操作将把所有未读消息一键标为已读，是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'confirmButtonClass',
      cancelButtonClass: 'confirmButtonClass',
    })
      .then(() => {
        this.http.GempInfoBaseRequest.baseInfoClean().then((res) => {
          if (res.status == 200) {
            this.getListData();
            this.updateMessageRemindData();
            this.$message({
              type: 'success',
              message: res.msg,
            });
          }
        });
      })
      .catch(() => {
        this.$message({
          message: '已取消操作',
        });
      });
  }

  // 更新消息提醒的滚动条，弹框，铃铛
  updateMessageRemindData() {
    let data = {
      type: 'updateMessageRemind',
    };
    setTimeout(() => {
      parent.postMessage(data, '*');
    }, 2000);
  }

  //重报
  infoRepeat(data) {
    this.$router.push({
      path: '/information/repeat',
      query: { id: data.rowVal.infoId },
    });
  }

  /*
   * Author by chengyun 获取选中列表
   * Modify by chengyun
   */
  handleselection(data) {
    this.handleSelectList = [];
    this.handleSelectSketch = [];
    data.type.forEach((el) => {
      if (el.infoStatus == 1) {
        this.handleSelectList.push(el.infoId);
      } else {
        this.handleSelectSketch.push(el.infoId);
      }
    });
  }

  /*
   * Author by chengyun 生成文本
   * Modify by chengyun
   * Modify by chenzheyu  向父级页面传递跳转参数
   */
  reportAdd() {
    if (this.handleSelectSketch && this.handleSelectSketch.length > 0) {
      return this.$message({
        type: 'warning',
        message: '草稿不能生成文本,请重新选择!',
      });
    }
    if (this.handleSelectList && this.handleSelectList.length > 0) {
      let data = { type: 'menu', value: 'briefReport/specialReport' };
      parent.postMessage(JSON.stringify(data), '*');
      let paramsSelect = JSON.stringify(this.handleSelectList);
      // this.linkTo();
      this.$router.push({
        name: 'textFileAdd',
        params: { handle: 'textAdd', select: paramsSelect },
      });
    } else {
      this.$message({ type: 'warning', message: '请选择信息!' });
    }
  }


  /**
   * 生成简报
   */
  async reportAdd2() {
    const data = this.propData.data.find(item => { return item.isActive });
    let handleSelectSketch = [];
    let handleSelectList = []
    if(this.dayType === '4') {
      handleSelectSketch = this.handleSelectSketch;
      handleSelectList = this.handleSelectList;
    }else{
      if (data) {
        if(data.infoStatus == 0) {
          handleSelectSketch.push(data.infoId)
        }else{
          handleSelectList.push(data.infoId)
        }
      }
    }
    if (handleSelectSketch && handleSelectSketch.length > 0) {
      return this.$message({
        type: 'warning',
        message: '草稿不能生成简报,请重新选择!',
      });
    }
    if (handleSelectList && handleSelectList.length > 0) {
      let data = { type: 'menu', value: 'briefReport/specialReport' };
      parent.postMessage(JSON.stringify(data), '*');
      let paramsSelect = JSON.stringify(handleSelectList);
      this.$router.push({
        name: 'textFileAdd',
        params: { handle: 'textAdd', select: paramsSelect },
      });
      const listParams = await this.getText(paramsSelect);
      const infoId = await this.addText(listParams);
      this.changeType(infoId, 'specialReportAdd')

    } else {
      this.$message({ type: 'warning', message: '请选择信息!' });
    }
  }

  // 查询文本信息
  getText(selectIds) {
    const ids = JSON.parse(selectIds)
    return this.http.briefReportRequest.documentByInfoId({ ids }).then((res) => {
      const listParams = {
        id: '', //简报Id
        infoId: '', //事件id
        reportContent: '', //简报内容
        reportTitle: '' //简报标题
      };

      if (res.status == 200) {
        listParams.reportTitle = res.data[0].reportTitle
        listParams.infoId = res.data[0].infoId
        let html = ''
        res.data.forEach((val) => {
          html += val.reportTitle + '\n'
          html += '  ' + val.reportContent + '\n'
          if (val.gempBriefInstructDTOs && val.gempBriefInstructDTOs.length > 0) {
            val.gempBriefInstructDTOs.forEach((element) => {
              html += element.instructTitle + '\n'
              html += '  ' + element.instructContent + '\n'
            })
          }
        })
        listParams.reportContent = html
      }

      return listParams;
    })
  }

  // 新增保存文本文件
  addText(listParams) {
    return this.http.briefReportRequest.documentAdd(listParams).then((res) => {
      if (res.status == 200) {
        return res.data
      }
    })
  }

  // 更改类型（生成简报）
  changeType(briefId, urlJump) {
    let transferFunc:Function
    transferFunc = this.store.state.SYSTEMOFFICE === 'ONLYOFFICE'? this.http.briefReportRequest.transferOffice:this.http.briefReportRequest.transferType
    transferFunc({ briefId, reportType: 'SPECIAL' }).then(res => {
      if (res.status != 200) {
        this.$message.error('生成简报失败！')
        return false
      }

      setTimeout(() => {
        this.$router.push({ name: urlJump, params: { inparameter: res.data, infoId: res.data.infoId} })
      }, 200)
    })
  }
  /**
   *Author by chengyun 点击跳转到应急预案页面
   */
  linkTo() {
    let data = {
      type: 'linkTo',
      infotype: 4,
    };
    parent.postMessage(data, '*');
  }
  /**
   * 重置清空按钮
   */
  deleteSearch() {
    this.search_time = [];
    this.searchData.eventType = [];
    this.searchData.orgCode = [];
    this.searchData.pageSize = 8;
    if (this.$refs.eventType) {
      this.$refs.eventType['slideValue'] = '';
      this.$refs.eventType['$refs'].tree.setCheckedKeys([]);
      this.$refs.eventType['commonSelectIndex'] = -1;
    }
    if (this.$refs.orgCode) {
      this.$refs.orgCode['slideValue'] = '';
      this.$refs.orgCode['$refs'].tree.setCheckedKeys([]);
      this.$refs.orgCode['commonSelectIndex'] = -1;
    }
    this.quikSearch()
  }

  /**
   * 快速检索
   */
  quikSearch() {
    this.searchData.nowPage = 1
    this.store.dispatch("infomanage/setInfomanage",this.searchData)
    this.getListData()
  }
}
