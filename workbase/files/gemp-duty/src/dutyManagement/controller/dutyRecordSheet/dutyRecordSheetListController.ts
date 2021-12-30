import { ControllerBase, Inject, Filter, Watch } from 'prism-web';
import { timeFormat } from '../../../../assets/libs/commonUtils';
import searchSession from '../../../../assets/libs/searchData';
//值班记录单列表部分
export class DutyRecordSheetListController extends ControllerBase {
  private temp = {
    style: require('../../style/dutyRecordSheet/dutyRecordSheetList.less')
  };
  constructor() {
    super();
  }
  private nowOrgcode = ""

  private defaultchecked = ''; //机构树默认选中
  private checkList = []; //选中数组
  private workStatus = false; //我的工作的状态
  private loadrName = [];
  private dutyName = [];
  private orgCode = JSON.parse(sessionStorage.getItem('role')).orgCode; // 默认选中组织数的id
  private handlingPeople = ''; // 默认经办人
  private list = []; //值班记录单列表
  private leaderHead = []
  private leaderBody = []
  private dutyMan = [
    {
      //值班记录单列表
      dutyPeopleName: ''
    },
    {
      dutyPeopleName: ''
    }
  ];
  //按钮控制
  private btnConfig = {
    mywork: false, //我的工作
    add: false,//添加事项
    search: false,//搜索
  }
  private dutyDatas: Object = {
    nowPage: 0,
    pageSize: 12,
    pages: 158,
    total: 1259,
    unReadTotalCount: 0
  };

  /* author by huihui  根据不同的状态，添加不同的背景图
   *  Modify by
   */
  addclass(i) {
    switch (i) {
      case 0:
        return 'book_green';
      case 1:
        return 'book_red';
      case 2:
        return 'book_blue';
    }
  }

  //查看所有传参(传空) 查看未删传参(传0)
  private searchData: Object = {
    deleteFlag: null,
    startTime: '',
    endTime: '',
    keyWord: '',
    listOrder: {
      prop: '',
      sort: ''
    },
    nowPage: 1,
    pageSize: 10
  };

  private recoredType = ''; //值班记录事项类型
  //查看所有传参(传空)  值班记录单列表参数
  private listData = {
    dutyDate: '', //值班日期
    dutyPeopleId: '', //值班人员
    handlingPeople: '', //经办人
    nowPage: 1, //当前页数
    orgCode: this.orgCode, //组织id
    pageSize: 12, //每页条数
    recoredType: '', //值班记录事项类型
    workContent: '' //工作内容
  };
  private peopleOrgCode = ""
  private dutyData: Object = {
    orgCode: this.orgCode, //组织id
    dddd: ''
  };
  @Filter()
  // 时间过滤
  formatDate(time) {
    return time.replace(/\-/g, '/');
  }

  created() {
    this.getDuty();
    if (this.$route.query.orgCode) {
      this.orgCode = this.$route.query.orgCode + '';
      this.$set(this.listData, 'orgCode', this.orgCode);
      this.getListData();
    } else {
      this.getLoginName();
    }
    this.btnManagement()
  }
  activated() {
  }
  /**
  *  author by xinglu 获取当前菜单的按钮权限
  *  @param{
  *    menuId: "",  //菜单id
  *    userId: "", //当前登录用户的id
  *  }
  */
  btnManagement() {
    var userInfo = searchSession.getter({ name: 'role' })
    let params = {
      menuId: '2c9287db6e7e3851016e83284f46044b',
      userId: userInfo['userId']
    }
    this.http.PowerNodeRequest.btnPowerManagement(params).then((res) => {
      if (res.status == 200) {
        // console.log(res);
        res.data.forEach((data) => {
          switch (data.privName) {
            case '工作':
              this.btnConfig.mywork = true
              break
            case '添加':
              this.btnConfig.add = true
              break
            case '搜索':
              this.btnConfig.search = true
              break
          }
        })
      }
    })
  }
  getOrg(val) {
    // this.$set(this.searchData, 'orgCode', val);
    this.dutyData['orgCode'] = this.orgCode
    this.nowOrgcode = val['prop'].id
    this.leaderBody = []
    this.leaderHead = []
    this.orgCode = val['prop'].id;
    this.$set(this.dutyData, 'orgCode', val['prop'].id);

    this.getDuty()
    if (this.workStatus) return
    this.$set(this.searchData, 'keyWord', '');
    this.$set(this.listData, 'orgCode', val['prop'].id);

    this.getListData();
  }
  /* author by huihui  //分页
   *  Modify by
   */

  handleCurrentChange(val) {
    //分割数组
    // var num = val - 1;
    // console.log(val);
    // var data = this.list.slice(num * 12, val * 12);
    // this.$set(this.dutyDatas, 'list', data);
    this.listData['nowPage'] = val;
    this.getListData();
  }

  loadrList() {
    this.$message('领导');
  }

  dutyList() {
    this.$message('值班');
  }

  // 选择类型
  selectType(type) {
    switch (type) {
      case 'done':
        // this.$message('已办事项');
        // let doneList = this.list.filter(item => item.recoredType === 0);
        // this.$set(this.dutyDatas, 'list', doneList);
        this.$set(this.listData, 'recoredType', 0);
        break;

      case 'todo':
        // this.$message('待办事项');
        // let todoList = this.list.filter(item => item.recoredType === 1);
        // this.$set(this.dutyDatas, 'list', todoList);
        this.$set(this.listData, 'recoredType', 1);
        break;

      case 'subscribe':
        // this.$message('关注事项');
        // let subsList = this.list.filter(item => item.recoredType === 2);
        // this.$set(this.dutyDatas, 'list', subsList);
        this.$set(this.listData, 'recoredType', 2);
        break;

      default:
        this.$set(this.listData, 'recoredType', '');
        // var data = this.list;
        // this.$set(this.dutyDatas, 'list', data);
        break;
    }
    this.getListData();
  }

  @Inject('http') http: any;
  getLoginName() {
    //获取登录人的信息
    if (window.sessionStorage.getItem('role')) {
      let role = JSON.parse(window.sessionStorage.getItem('role'));
      // this.listData['handlingPeople'] = role.orgName;
      // this.$set(this.listData, 'handlingPeople', role.orgName);
      this.handlingPeople = role.userName;
      this.$set(this.listData, 'orgCode', role.orgCode);
      this.orgCode = role.orgCode;
      this.getListData();
    }
  }
  // 获取数据列表
  getListData() {
    this.http.DutyRecordSheet.dutySituationList(this.listData).then(res => {
      if (res.status == 200) {
        this.list = res.data.list;
        var num = res.data.total;
        this.$set(this.dutyDatas, 'total', num);
        this.$set(this.dutyDatas, 'list', this.list);
      }
    });
  }

  // 获取今日值班信息
  getDuty() {
    this.http.DutyRecordSheet.dutySituationDutyman(this.dutyData).then(res => {
      if (res.status == 200) {
        this.dutyMan = res.data.forEach(item => {
          if (item.leaderFlag == "1") {
            this.leaderHead.push(item)
          } else if (item.leaderFlag == "0") {
            this.leaderBody.push(item)


          }
        })
      }
    });
  }

  // 删除记录单
  delectSheet(item) {
    let id = item.dutyRecordId;
    let data = {
      id: id
    };
    this.$confirm('请确认是否要删除此条信息!','提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
      .then(() => {
        this.http.DutyRecordSheet.dutySituationDelect(data).then(res => {
          if (res.status === 200) {
            this.$message({ message: res.data, type: 'success' });
            this.getListData();
          } else {
            this.$message({ message: '删除失败!', type: 'error' });
          }
        });
      })
      .catch(() => {
        this.$message({
          message: '已取消操作',
          type: 'success'
        });
      });
  }

  // 经办人 内容查询
  @Watch('searchData.keyWord')
  searchSession(val) {
    if (this.workStatus) {
      this.$set(this.listData, 'handlingPeople', sessionStorage.getItem('role'))['userName'];
      // 选中我的工作
      this.getLoginName();
      if (val) {
        //search框有值
        this.$set(this.listData, 'workContent', val);
        this.getListData();
      } else {
        //search框无值
        this.$set(this.listData, 'workContent', '');
        this.getListData();
      }
    } else {
      //我的工作未选中
      this.$set(this.listData, 'handlingPeople', '');
      if (val) {
        this.$set(this.listData, 'workContent', val);
        this.getListData();
      } else {
        this.$set(this.listData, 'workContent', '');
        this.getListData();
      }
    }
  }
  // 监听我的工作按钮点击
  @Watch('workStatus')
  changeNowOrgName(val) {
    if (val) {
      this.$set(this.listData, 'nowPage', 1);
      this.$set(this.listData, 'handlingPeople', JSON.parse(sessionStorage.getItem('role')).userName);
      this.getLoginName();
    } else {
      this.$set(this.listData, 'nowPage', 1);
      this.$set(this.listData, 'handlingPeople', '');
      this.handlingPeople = '';
      this.listData.orgCode = this.nowOrgcode ? this.nowOrgcode : JSON.parse(sessionStorage.getItem('role')).orgCode
      this.getListData();
    }
  }

  // 根据值班人员查询列表
  searchDutySheet(data) {
    if (this.workStatus) return
    this.listData.handlingPeople = data.dutyPeopleName
    this.listData.orgCode = this.nowOrgcode ? this.nowOrgcode : JSON.parse(sessionStorage.getItem('role')).orgCode
    this.$set(this.listData, 'nowPage', 1);
    this.getListData()
  }
  //跳转至详情页面
  getDetailById(data) {
    // console.log(data);
    let dutyRecordId = data.dutyRecordId
    this.$router.push({ path: '/dutyManagement/dutyRecordSheetDetail', query: { dutyRecordId: dutyRecordId } })
  }
}
