import { ControllerBase, Inject, Prop, Emit } from 'prism-web';
import { downloadFuncs } from './../../../../../assets/libs/commonUtils'
export class FestivalController extends ControllerBase {
  constructor() {
    super();
  }
  private temp = {
    style: require('../../../style/leadershift/festival.less')
  };

  @Inject('http') http: any;

  private defaultchecked = '';
  private searchlist = {
    holidayImportantId: "",
    dutyCategory: "0",
    orgCode: "",
    nowPage: 1,
    pageSize:8
  }
  private propData = {
    isCheck: false,
    pageSize: 8,
    total: 0,
    config: [
      {
        type: 'string',
        label: '日期',
        prop: 'dutyDate'
      },
      {
        type: 'string',
        label: '姓名',
        prop: 'dutyPeopleName'
      },
      {
        type: 'string',
        label: '职务',
        prop: 'dutyPeoplePosition'
      },
      {
        type: 'string',
        label: '电话',
        prop: 'dutyPeoplePhone'
      }
    ],
    data: []
  };

  //author by huihui导出参数
  private exportFile = {
    dutyCategory: "0",
    holidayImportantId: "",
    nowPage: 1,
    orgCode: "",
    orgName: "",
  }

  created() {
    this.searchlist.orgCode = this.getRoute().orgcode ? this.getRoute().orgcode.toString() : JSON.parse(window.sessionStorage.getItem('role')).orgCode;
    this.searchlist.holidayImportantId = this.getRoute().id.toString();
    this.exportFile.orgCode = this.getRoute().orgcode ? this.getRoute().orgcode.toString() : JSON.parse(window.sessionStorage.getItem('role')).orgCode;
    this.exportFile.orgName = this.getRoute().orgName ? this.getRoute().orgName.toString() : JSON.parse(window.sessionStorage.getItem('role')).orgName;
    this.getListData();
    this.defaultchecked = this.getRoute().orgcode ? this.getRoute().orgcode.toString() :""

  }
  /**
* author by 刘文磊选择机构
*/
  getOrg(data) {
    this.searchlist.orgCode = data.prop.id
    this.exportFile.orgCode = data.prop.id
    this.exportFile.orgName = data.prop.label
    this.getListData()
  }

   // 列表的按钮点击事件
  tablecallback(data) {
    this[data.type](data);
  }

  // 翻页功能
  handlePageChange(data) {
    this.searchlist['nowPage'] = data.rowVal;
    this.exportFile['nowPage'] = data.rowVal
    this.getListData()
  }


	/**
	 * 获取节假日具体值班情况列表数据
	 */
  public getListData() {
    this.http.LeaderShiftRequest.holidayList(this.searchlist).then(res => {
      if (res.status == 200) {
        this.propData.data = res.data.list;
        this.propData.total = res.data.total;
      }
    });
  }

	/**
	 * 路由跳转
	 */
  goRoute(type: string) {
    switch (type) {
      case 'edit':
        this.$router.push({
          path: "/workforceManagement/festivalEdit", query: {
            id: this.getRoute().id,
            orgcode: this.searchlist.orgCode,
            start: this.getRoute().start,
            end: this.getRoute().end,
            orgName: this.exportFile.orgName
          }
        })
        break;

      default:
        this.$router.push({ path: `/workforceManagement/festivalList` });
        break;
    }
  }


  // author by huihui导出
  exporttable() {
    this.exportFile.holidayImportantId = this.getRoute().id.toString();
    this.http.LeaderShiftRequest.holidayExport(this.exportFile).then((res) => {
      if (res.url) {
        downloadFuncs(res)
      }
    })
  }
}
