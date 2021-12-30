import { ControllerBase, Inject, Watch, Prop } from 'prism-web'
import { DocumentProcessController } from '@/dutyManagement/controller/documentProcessController';
// import { getRequestUrl } from '../../../assets/libs/commonUtils'


export class specialCampaignListController extends ControllerBase {
  private temp = {
    style: require('../style/specialCampaignList.less')
  }
  private value1 = ''
  private value2 = ''
  private pickerOptions = {
    disabledDate:(time)=>{
        return time.getTime() < new Date(new Date().setHours(0, 0, 0, 0)).getTime()
    }
  };
  private content: string = ''; // 关键字
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
  @Prop() navselectcode: string
  @Watch('navselectcode')
  navselectcodeChange(val) {
    
  }
  private btnGroup: object = {
    modify: { name: '修改', type: 'success', emit: 'modify', expression: true },
    viewpreview: { name: '查看报告', type: 'success', el: 'viewpreview',emit: 'viewpreview', expression: true }
  }
  private viewDialogPreview: boolean = false; // 预览页面标志
  private templateName: string = '';
  private propsData1: Object = {};
  private propData = {
    isCheck: false,
    pageSize: 8,
    emptyText: "加载中",
    total: 0,
    config: [
      {
        type: 'string',
        label: '序号',
        width: '/',
        prop: 'orderNum',
        // emit: 'reportDetail'
      },
      {
        type: 'string',
        label: '专项活动',
        prop: 'activityName'
      },
      {
        type: 'string',
        label: '活动说明',
        prop: 'acitivityContent'
      },
      {
        type: 'string',
        label: '开始时间',
        prop: 'startTime',
        width:'/'
      },
      {
        type: 'string',
        label: '结束时间',
        prop: 'endTime'
      },
      {
        type: 'string',
        label: '创建人',
        prop: 'creator',
        width:'120'
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
  // 列表查询参数
  private searchData = {
    acitivityContent: "",
    activityName: "",
    endTime: "",
    nowPage: 1,
    pageSize: 10,
    startTime: "",
    // orgCode: "cc41e4965f8c43518ecc731c697dabc2",
  };

  created(){
    this.searchData.startTime =  this.value1
    this.searchData.endTime =  this.value2
    // if (window.sessionStorage.getItem("role")) {
    //   let role = JSON.parse(window.sessionStorage.getItem("role"))
    //   this.searchData.orgCode = role.orgCode
    // }
    // this.searchData.orgCode = JSON.parse(window.sessionStorage.getItem('role')).orgCode
    this.getListData()
  }

  async getListData() {
    // 去除空格
    const searchData = JSON.parse(JSON.stringify(this.searchData))

    await this.http.SpecialCampaignRequest.getSpecialCampaignList({ ...searchData }).then(item => {
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
        // obj['modify'].expression =true 
        item.operate = obj;
        item.orderNum = index + 1;
        return item;
      });
      // this.propData.data = item.data.list.map((jtem, index) => {
      //   let obj =  JSON.parse(JSON.stringify(this.btnGroup));
      //       obj['modify'].expression = true
      //     jtem.isoperate = obj
      //   return jtem
      // })
      data = Object.assign({}, this.propData, data);
      // //未选择事件等级时，判断
      // data.data.map(it=>{
      //   if(it.eventLevelName == '未知') {
      //      it['eventLevelCode'] = '6'
      //   }
      // })
      this.$set(this, 'propData', data);
    });
  }
  // 点击查询
  inquire() {
    this.searchData.activityName =  this.content
    this.getListData()
  }
  // 新增专项活动
  addCampaign() {
      this.$router.push({
        path: '/specialCampaign/addSpecialCampaign',
      });
  }

  // 列表按钮点击响应
  tablecallback(data) {
    this[data.type](data);
    // console.log(data.type, 888)
  }


  // 点击修改
  modify(data){
    // console.log(data)
    this.$router.push({ path: '/specialCampaign/addSpecialCampaign', query: { id: data.rowVal.majorActivityId, endTime: data.rowVal.endTime, startTime: data.rowVal.startTime, activityName: data.rowVal.activityName, acitivityContent: data.rowVal.acitivityContent  } })
  }
  // 查看报告
  viewpreview(data) {
    console.log(data)
    this.viewDialogPreview = true;
    this.templateName = data.buttonItem.el;
    // this.tilteName = data.buttonItem.name;
    this.propsData1 = {
      majorActivityId: data.rowVal.majorActivityId,
      dailyActivityId:　'',
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