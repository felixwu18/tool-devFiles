import { ControllerBase, Inject, Watch, Prop } from 'prism-web'


export class CurrentSpecialDataController extends ControllerBase {

  constructor() {
    super()
  }
  @Inject('http') http:any
  @Watch('value1')
  timeValue1(val) {
      if(val) {
          this.searchData.startTime =  new Date(val).toJSON()
          this.pickerOptions['disabledDate'] = (time) => {
                  return time.getTime() < val.getTime()
          }
      }
  }
  @Watch('value2')
  timeValue2(val) {
      if(val) {
          this.searchData.endTime =  new Date(val.setHours(23, 59, 59, 0)).toJSON()
      }
  }
  private content: string = ''; // 关键字
  private value1 = new Date(new Date().setHours(0, 0, 0, 0)).toJSON()
  private value2 = new Date(new Date().setHours(23, 59, 59, 0)).toJSON()
  private pickerOptions = {
    disabledDate:(time)=>{
        return time.getTime() < new Date(new Date().setHours(0, 0, 0, 0)).getTime()
    }
  };

  private btnGroup: object = {
    viewpreview: { name: '查看报告', type: 'success', el: 'viewpreview',emit: 'viewpreview', expression: true },
    modify: { name: '修改', type: 'success', emit: 'modify', expression: true },
  }
  // 列表查询参数
  private searchData = {
    dailyAcitivity: "",
    dailyActivityId: "",
    endTime: "",
    keyWord: "",
    // majorActivityId: "",
    nowPage: 1,
    pageSize: 10,
    startTime: ""
  };
  private viewDialogPreview: boolean = false; // 预览页面标志
  private templateName: string = '';
  private propsData1: Object = {};
  private propData = {
    isCheck: false,
    pageSize: 8,
    total: 0,
    emptyText: "加载中",
    config: [
      {
        type: 'string',
        label: '序号',
        width: '100',
        prop: 'orderNum',
        // emit: 'reportDetail'
      },
      {
        type: 'string',
        label: '专项活动',
        width:'/',
        prop: 'activityName'
      },
      {
        type: 'string',
        label: '日期',
        width:'200',
        prop: 'dailyAcitivity'
      },
      {
        type: 'string',
        label: '创建人',
        prop: 'creatorName',
        width:'200'
      },
      {
        type: 'string',
        label: '最后编辑时间',
        prop: 'updateTime',
        width:'200'
      },
      // 先暂时隐藏这一列
      {
        type: 'button',
        label: '操作',
        width: '200',
        prop: 'operate'
      }
    ],
    // tag展示列表
    // tagArray: { '0': { name: '待签', type: 'danger' }, '1': { name: '待办', type: 'primary' }, '9': { name: '退回', type: 'info' } },
    data: []
  }

  created(){
    this.searchData.startTime =  this.value1
    this.searchData.endTime =  this.value2
    this.getListData()
  }
  async getListData() {
    // 去除空格
    const searchData = JSON.parse(JSON.stringify(this.searchData))

    await this.http.SpecialCampaignRequest.getCampaignList({ ...searchData }).then(item => {
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
        // obj['preview'].expression =true 
        item.orderNum = index + 1;
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
  // 查询
  inquire() {
    this.searchData.keyWord =  this.content
    this.getListData()
  }
  // 列表按钮点击响应
  tablecallback(data) {
    this[data.type](data);
    // console.log(data.type, 888)
  }
  modify(data){
    console.log(data)
    this.$router.push({ path: '/currentSpecial/currentSpecialList', query: {cname:data.rowVal.activityName, dailyAcitivity: data.rowVal.dailyAcitivity,majorActivityId: data.rowVal.majorActivityId, workGroupListDTOs: data.rowVal.workGroupListDTOs} })
  }
  // 查看报告
  viewpreview(data) {
    console.log(data)
    this.viewDialogPreview = true;
    this.templateName = data.buttonItem.el;
    // this.tilteName = data.buttonItem.name;
    this.propsData1 = {
      majorActivityId: data.rowVal.majorActivityId,
      dailyActivityId:　data.rowVal.dailyActivityId,
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
}