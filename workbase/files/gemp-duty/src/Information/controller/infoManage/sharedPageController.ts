import { ControllerBase, Inject } from 'prism-web';
import { jumpLink } from '../../../../service/config/base';
import searchSession from '../../../../assets/libs/searchData';
export class InfoManageListController extends ControllerBase {
  private dialogNTKO: Boolean = true;
  private showSearch: Boolean = false;
  private templateName: string = '';
  private tilteName: string = '';
  private propsData: Object = {};
  private handleSelectList = []; //选中列表参数 程云
  private handleSelectSketch = []; //选中草稿列表参数 程云
  private windowWidth = '370';

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
    pageSize: 8,
    reportDateStrEnd: '',
    reportDateStrStart: '',
    listOrder: {},
    pushStatus: '1',
  };
  // 事件类型列表
  typeList: Array<any> = [];

  @Inject('http') http: any;
  @Inject('store') store:any
  created() {
    this.store.dispatch('infomanage/setSharePageParams',this.searchData);
    this.getListData();
  }

  activated() {}
  
  private propData = {
    isCheck: false,
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
        width: '270',
        prop: 'infoTitle',
        badge: true,
        styles: {
          width: '100%',
        },
      },
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
    ],
    data: [],
  };

  constructor() {
    super();
  }

  private temp = {
    style: require('../../style/infoManage/infoManageList.less'),
  };

  getOrg(val) {
    this.$set(this.searchData, 'orgCode', val);
  }

  changeEvent(val) {
    console.log(val);
    this.$set(this.searchData, 'eventType', val);
  }

  // 获取列表数据
  async getListData(nowPage?) {
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
    this.store.dispatch('infomanage/setSharePageParams',{reportDateStrStart:this.searchData['reportDateStrStart'],reportDateStrEnd:this.searchData['reportDateStrEnd']})
    // 去除空格
    const searchData = JSON.parse(JSON.stringify(this.store.getters["infomanage/getSharePageParams"]));
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
      data.nowPage = item.data.nowPage;
      data.data = item.data.list;
      data = Object.assign({}, this.propData, data);
      
      //未选择事件等级时，判断
      data.data.map((it) => {
        if (it.eventLevelName == '未知') {
          it['eventLevelCode'] = '6';
        }
      });
      this.$set(this, 'propData', data);
    });
  }

  handleselection(data) {}

  // 列表按钮点击响应
  tablecallback(data) {
    this[data.type](data);
  }

  // 翻页功能
  handlePageChange(data) {
    this.searchData['nowPage'] = data.rowVal;
    this.store.dispatch('infomanage/setSharePageParams',{nowPage:data.rowVal})
    this.getListData();
  }

  // 排序功能
  sort(data) {
    this.$set(this.searchData, 'listOrder', data.rowVal);
    this.store.dispatch("infomanage/setSharePageParams",this.searchData)
    this.getListData();
  }

  /**
   * 重置清空按钮
   */
  deleteSearch() {
    this.search_time = [];
    this.searchData.eventType = [];
    this.searchData.orgCode = [];
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
    this.getListData();
    this.quikSearch()
  }

  /**
   * 快速检索
   */
  quikSearch() {
    this.searchData.nowPage = 1
    this.store.dispatch("infomanage/setSharePageParams",this.searchData)
    this.getListData()
  }
}
