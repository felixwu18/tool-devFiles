// import { ControllerBase, Inject, Watch } from 'prism-web';
// import { downloadFuncs } from '../../../../assets/libs/commonUtils';
// import searchSession from '../../../../assets/libs/searchData';

// /**
//  * create by huihui 引入gv組建
//  */
// import * as gv from 'gv';
// gv.config.ChartTemplate.load();
// export class DutyStatisticsController extends ControllerBase {
//   private temp = {
//     style: require('../../style/dutyStatistics/dutyStatisticsList.less'),
//   };
//   // 列表时间查询参数
//   // private search_time: Array<any> = [];
//   private valuetime = [];
//   constructor() {
//     super();
//   }
//   private defaultchecked = '';
//   private flag = false;
//   @Inject('http') http: any;
//   //按钮控制
//   private btnConfig = {
//     time: false, //时间
//     export: false, //导出
//   };
//   // 当前角色级别
//   private roleLevel: boolean;
//   // 当前角色信息
//   private role: object;
//   // 按钮组
//   private btnArray: object = {
//     all: {
//       name: '删除',
//       emit: 'delTransfer',
//       type: 'danger',
//       viewDialog: {
//         title: '删除转办督办',
//         compName: 'transfer-delete',
//         height: '170px',
//         width: '500px',
//       },
//       expression: true,
//     },
//     delete: {
//       name: '已删除',
//       emit: '',
//       className: 'delete',
//       disabled: true,
//       expression: true,
//     },
//   };

//   //查看所有传参(传空) 查看未删传参(传0)
//   private searchData: Object = {
//     deleteFlag: null,
//     startTime: '',
//     endTime: '',
//     keyWord: '',
//     listOrder: {
//       prop: '',
//       sort: '',
//     },
//     nowPage: 1,
//     pageSize: 10,
//   };

//   //列表参数
//   private propData = {
//     isCheck: false,

//     config: [
//       {
//         type: 'string',
//         label: '姓名',
//         width: '/',
//         prop: 'dutyPeopleName',
//       },
//       {
//         type: 'string',
//         label: '白班(小时)',
//         width: '/',
//         prop: 'dayShiftSum',
//       },
//       {
//         type: 'string',
//         label: '晚班(小时)',
//         width: '/',
//         prop: 'eveningShiftSum',
//       },
//       {
//         type: 'string',
//         label: '合计(小时)',
//         width: '/',
//         prop: 'dutyTimeSum',
//       },
//     ],
//     // tagArray:{'0':{name:'待签',type:'danger'},'1':{name:'已签',type:'success'},'2':{name:'迟签',type:'warning'}},
//     data: [],
//   };
//   // 时间范围选择按钮
//   private selectBtn: string = '本月';
//   // 时间范围
//   private startTime: string = '';
//   private endTime: string = '';
//   private exportData = {
//     endDutyTime: '',
//     orgCode: '',
//     queryType: '',
//     startDutyTime: '',
//   };
//   created() {
//     this.settingOrgCode();
//     this.getListData();
//     this.btnManagement();
//   }
//   activated() {}
//   /**
//    *  author by xinglu 获取当前菜单的按钮权限
//    *  @param{
//    *    menuId: "",  //菜单id
//    *    userId: "", //当前登录用户的id
//    *  }
//    */
//   btnManagement() {
//     var userInfo = searchSession.getter({ name: 'role' });
//     let params = {
//       menuId: '2c9287db6e7e3851016e8328bd3e044d',
//       userId: userInfo['userId'],
//     };
//     this.http.PowerNodeRequest.btnPowerManagement(params).then(res => {
//       if (res.status == 200) {
//         // console.log(res);
//         res.data.forEach(data => {
//           switch (data.privName) {
//             case '时间':
//               this.btnConfig.time = true;
//               break;
//             case '导出':
//               this.btnConfig.export = true;
//               break;
//           }
//         });
//       }
//     });
//   }
//   echarts(data) {
//     let staticData = [];
//     let obj = null;
//     let total = 0;
//     for (let i = 0; i < data.length; i++) {
//       obj = {
//         name: data[i].dutyPeopleName + ' ' + data[i].dutyTimeSum + '小时',
//         value: data[i].dutyTimeSum,
//       };
//       total += data[i].dutyTimeSum;
//       staticData.push(obj);
//     }
//     staticData = this.formatGvData(gv, staticData, null);
//     //假设静态数据源已构建完毕
//     let chartSource = new gv.source['SimpleSource'](staticData);
//     const barChart = new gv.chart['BasicPieChart'](
//       chartSource,
//       document.getElementById('basicPieChart'),
//     );
//     barChart.config('legend.x', 'left');
//     barChart.config('legend.orient', 'vertical');
//     barChart.config('legend.formatter', '{name}');
//     barChart.config('legend.data', '[]');
//     barChart.config('series[0].radius', '60%');
//     barChart.config('series[0].center', ['50%', '52%']);
//     barChart.config('title.text', `总计:${total}小时`);
//     barChart.config('title.x', 'center');
//     //渲染
//     barChart.render();
//   }

//   //数据导出
//   dutyDownload() {
//     this.http.DutyStatisticsRequest.dutyStatisticExport(this.exportData).then(
//       res => {
//         console.log(res);
//         if (res.url) {
//           downloadFuncs(res);
//         } else {
//           this.$message.error('下载失败');
//         }
//       },
//     );
//   }

//   /* author by weiqiming 数据列表
//    *  Modify by
//    */
//   getListData() {
//     this.http.DutyStatisticsRequest.dutyStatisticList(this.exportData).then(
//       res => {
//         this.propData.data = res.data;
//         if (res.data.length == 0) {
//           this.flag = true;
//         } else {
//           this.flag = false;
//           this.echarts(res.data);
//         }
//       },
//     );
//   }
//   getTranferList() {
//     if (this.valuetime.length > 0) {
//       this.exportData.queryType = '';
//       (this.exportData.endDutyTime = this.valuetime[1]),
//         (this.exportData.startDutyTime = this.valuetime[0]);
//     }
//     this.getListData();
//     // console.log('时间',this.valuetime)
//     // this.propData.total = this.propData.data.length + 1;
//   }
//   tableRowClassName() {}
//   //触发按钮的事件
//   tablecallback(data) {
//     this[data.type](data);
//   }
//   // 点击组织机构 by weiqiming
//   getOrg(val) {
//     if (val.prop.id) {
//       this.$set(this.exportData, 'orgCode', val.prop.id);
//       this.getListData();
//     } else {
//       this.$message({ type: 'warning', message: '当前机构不存在!' });
//     }
//   }
//   // echarts 数据处理 by weiqiming
//   formatGvData(gv, arr, alias) {
//     let chartData = new gv.data.ChartData();
//     for (let i = 0; i < arr.length; i++) {
//       const chartItem = new gv.data.ChartItem();
//       const temp = arr[i];
//       const keys = Object.keys(arr[i]);
//       for (let j = 0; j < keys.length; j++) {
//         const dataEntry = new gv.data.ChartEntry();
//         dataEntry.name = keys[j];
//         dataEntry.value = temp[keys[j]];
//         if (alias) {
//           dataEntry.alias = alias[j];
//         }
//         chartItem.addEntry(dataEntry);
//       }
//       chartData.addItem(chartItem);
//     }
//     return chartData;
//   }
//   // // 获得本月，本季度，本年起止时间
//   formatSelectDate(data) {
//     // console.log('data',data);
//     this.valuetime = [];
//     this.exportData.endDutyTime = '';
//     this.exportData.startDutyTime = '';
//     if (data == '1') {
//       this.exportData.queryType = data;
//     } else if (data == '2') {
//       this.exportData.queryType = data;
//     } else if (data == '3') {
//       this.exportData.queryType = data;
//     } else {
//       this.exportData.queryType = '';
//     }
//     this.getListData();
//   }

//   /**  author by chengyun 新增通讯录设置当前用户机构的id
//    *   Modify by
//    */
//   settingOrgCode() {
//     this.role = JSON.parse(sessionStorage.getItem('role'));
//     if (this.role) {
//       this.exportData.orgCode = this.role['orgCode'];
//     }
//   }
//   // formatSelectDate(time) {
//   //   this.selectBtn = time;
//   //   var now = new Date(); //当前日期
//   //   var nowDayOfWeek = now.getDay(); //今天本周的第几天
//   //   var nowDay = now.getDate(); //当前日
//   //   var nowMonth = now.getMonth(); //当前月
//   //   var nowYear = now.getFullYear(); //当前年
//   //   nowYear += nowYear < 2000 ? 1900 : 0;
//   //   switch (time) {
//   //     case '本月':
//   //       this.startTime = getMonthStartDate();
//   //       this.endTime = getMonthEndDate();
//   //       // this.exportData['queryType'] = '1';
//   //       // console.log('this.startTime',this.startTime);
//   //       break;
//   //     case '本季':
//   //       this.startTime = getQuarterStartDate();
//   //       this.endTime = getQuarterEndDate();
//   //       break;
//   //     case '本年':
//   //       this.startTime = getYearStartDate();
//   //       this.endTime = getYearEndDate();
//   //       break;
//   //   }

//   //   //格式化日期：yyyy-MM-dd
//   //   function formatDate(date) {
//   //     var myyear = date.getFullYear();
//   //     var mymonth = date.getMonth() + 1;
//   //     var myweekday = date.getDate();
//   //     if (mymonth < 10) {
//   //       mymonth = '0' + mymonth;
//   //     }
//   //     if (myweekday < 10) {
//   //       myweekday = '0' + myweekday;
//   //     }
//   //     return myyear + '-' + mymonth + '-' + myweekday;
//   //   }
//   //   //获得某月的天数
//   //   function getMonthDays(myMonth) {
//   //     var monthStartDate = new Date(nowYear, myMonth, 1);
//   //     var monthEndDate = new Date(nowYear, myMonth + 1, 1);
//   //     var days =
//   //       (Number(monthEndDate) - Number(monthStartDate)) / (1000 * 60 * 60 * 24);
//   //     return days;
//   //   }
//   //   //获得本季度的开始月份
//   //   function getQuarterStartMonth() {
//   //     var quarterStartMonth = 0;
//   //     if (nowMonth < 3) {
//   //       quarterStartMonth = 0;
//   //     }
//   //     if (2 < nowMonth && nowMonth < 6) {
//   //       quarterStartMonth = 3;
//   //     }
//   //     if (5 < nowMonth && nowMonth < 9) {
//   //       quarterStartMonth = 6;
//   //     }
//   //     if (nowMonth > 8) {
//   //       quarterStartMonth = 9;
//   //     }
//   //     return quarterStartMonth;
//   //   }
//   //   //获得本月的开始日期
//   //   function getMonthStartDate() {
//   //     var monthStartDate = new Date(nowYear, nowMonth, 1);
//   //     return formatDate(monthStartDate);
//   //   }
//   //   //获得本月的结束日期
//   //   function getMonthEndDate() {
//   //     var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
//   //     return formatDate(monthEndDate);
//   //   }
//   //   //获得本季度的开始日期
//   //   function getQuarterStartDate() {
//   //     var quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1);
//   //     return formatDate(quarterStartDate);
//   //   }
//   //   //获的本季度的结束日期
//   //   function getQuarterEndDate() {
//   //     var quarterEndMonth = getQuarterStartMonth() + 2;
//   //     var quarterStartDate = new Date(
//   //       nowYear,
//   //       quarterEndMonth,
//   //       getMonthDays(quarterEndMonth)
//   //     );
//   //     return formatDate(quarterStartDate);
//   //   }
//   //   //获得本年的开始日期
//   //   function getYearStartDate() {
//   //     //获得当前年份4位年
//   //     var currentYear = now.getFullYear();
//   //     //本年第一天
//   //     var currentYearFirstDate = new Date(currentYear, 0, 1);
//   //     return formatDate(currentYearFirstDate);
//   //   }
//   //   //获得本年的结束日期
//   //   function getYearEndDate() {
//   //     //获得当前年份4位年
//   //     var currentYear = now.getFullYear();
//   //     //本年最后
//   //     var currentYearLastDate = new Date(currentYear, 11, 31);
//   //     return formatDate(currentYearLastDate);
//   //   }
//   //   // alert(getQuarterEndDate());
//   // }

//   // //格式化日期：yyyy-MM-dd
//   // formatDate(date) {
//   //   var myyear = date.getFullYear();
//   //   var mymonth = date.getMonth() + 1;
//   //   var myweekday = date.getDate();
//   //   if (mymonth < 10) {
//   //     mymonth = '0' + mymonth;
//   //   }
//   //   if (myweekday < 10) {
//   //     myweekday = '0' + myweekday;
//   //   }
//   //   return myyear + '-' + mymonth + '-' + myweekday;
//   // }
//   // // 监听时间选择器时间变化
//   // @Watch('search_time')
//   // seachTime(val) {
//   //   console.log('时间',val)
//   //   // this.startTime = this.formatDate(val[0]);
//   //   // this.endTime = this.formatDate(val[1]);
//   //   // console.log('开始时间',this.startTime)
//   //   // console.log('结束时间',this.endTime)
//   // }
// }
