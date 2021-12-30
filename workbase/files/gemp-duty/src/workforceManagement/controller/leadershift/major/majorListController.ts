import { ControllerBase, Inject, Prop, Emit } from 'prism-web';
export class majorListController extends ControllerBase {
	constructor() {
		super();
	}

  @Inject('http') http: any;
  private searchData = {
    abscriptYear: new Date().getFullYear().toString(),
    leaderScheduleType: '1',
    nowPage: 1,
    pageSize: 8
  };

  private propData = {
    isCheck: false,
    pageSize: 8,
    total: 0,
    config: [
      {
        type: 'string',
        label: '节假日名称',
        prop: 'name'
      },
      {
        type: 'string',
        label: '开始时间',
        prop: 'startTime'
      },
      {
        type: 'string',
        label: '结束时间',
        prop: 'endTime'
      },
      {
        type: 'button',
        label: '带班值班表',
        prop: 'operate'
      }
    ],
    data: []
  };

  created() {
    this.getListData();
  }
    // 列表的按钮点击事件
  tablecallback(data) {
    this[data.type](data);
  }

	/**
	 * author by 刘文磊列表详情按钮
	 */

  details(data) {
    this.$router.push({
      path: "/workforceManagement/major",
      query: {
        id: data.rowVal.holidayImportantId,
        start: data.rowVal.startTime,
        end: data.rowVal.endTime
      }
    });
  }



	/**
	 * 获取节假日带班列表数据
	 */
  getListData() {
    this.http.SetondutyRequest.holidayList(this.searchData).then(res => {
      if (res.status === 200) {
        res.data.list.map(it => (it['operate'] = { details: { name: '详情', type: 'primary', emit: 'details', expression: true } }));

        this.$set(this.propData, 'data', res.data.list);
        this.propData.total = res.data.total;
      }
    });
  }

  // 列表翻页
  handlePageChange(data) {
    this.searchData['nowPage'] = data.rowVal;
    this.getListData();
  }
}
