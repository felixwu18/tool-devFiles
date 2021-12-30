import { ControllerBase, Inject, Prop, Emit } from 'prism-web';
import { downloadFuncs } from './../../../../../assets/libs/commonUtils'
export class MajorController extends ControllerBase {
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
    dutyCategory: "1",
    orgCode: "",
    nowPage: 1,
    orgName:"",
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


  created() {
    this.searchlist.orgCode =this.getRoute().orgcode ?  this.getRoute().orgcode.toString() : JSON.parse(window.sessionStorage.getItem('role')).orgCode
    this.searchlist.holidayImportantId = this.getRoute().id.toString();
    this.searchlist.orgName = this.getRoute().orgName ? this.getRoute().orgName.toString() : JSON.parse(window.sessionStorage.getItem('role')).orgName
    this.defaultchecked = this.getRoute().orgcode ? this.getRoute().orgcode.toString() : ""
    this.getListData();

  }
  /**
* author by 刘文磊选择机构
*/
  getOrg(data) {
    this.searchlist.orgCode = data.prop.id
    this.searchlist.orgName = data.prop.label
    this.getListData()
  }

   // 列表的按钮点击事件
  tablecallback(data) {
    this[data.type](data);
  }

  // 翻页功能
  handlePageChange(data) {
    this.searchlist['nowPage'] = data.rowVal
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
	 * 前往
	 */
  goRoute(type: string) {
    switch (type) {
      case 'edit':
        this.$router.push({
          path: "/workforceManagement/majorEdit", query: {
            id: this.getRoute().id,
            orgcode: this.searchlist.orgCode,
            start: this.getRoute().start,
            end: this.getRoute().end,
            orgName:this.searchlist.orgName
          }
        })
        break;

      default:
        this.$router.push({ path: `/workforceManagement/majorList` });
        break;
    }
  }

  /**
   * author by 刘文磊 导出
   */ 
  exporttable() {
    this.http.LeaderShiftRequest.holidayExport(this.searchlist).then((res) => {
      if (res.url) {
        downloadFuncs(res)
      }
    })
  }
}
