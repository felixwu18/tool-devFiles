import { ControllerBase, Inject, Prop, Watch } from 'prism-web'
import { timeFormat, downloadFuncs } from '../../../assets/libs/commonUtils'
import { type } from 'os'
import searchSession from '../../../assets/libs/searchData'

export class StatisticalReportControler extends ControllerBase {
  constructor() {
    super()
  }
  private temp = {
    style: require('../style/statisticalReport.less')
  }
  private mounthtype: string = '3' //判断周年月报表
  @Inject('http') http: any
  @Inject('downloadFunc') downloadFunc: any

  // @Prop() mounthcode: string
  // @Watch('mounthcode')
  // navselectcodeChange() {
  //   this.mounthtype = this.mounthcode
  //   if (this.mounthtype == '2') {
  //     // 如果是月报表月份传空
  //     this.searchlist.month = ''
  //   } else {
  //     this.getToday()
  //   }
  //   this.getDate()
  // }

  private searchlist = {
    day: [],
    date: '',
    year: '',
    month: '',
    tenantId: ''
  }
  private defaultchecked = ''
  private selectDocument = '0'
  private dataList = [
    // {
    //     disasterGreatJoint: "事故灾难（4起，死亡4人、受伤0人，其中较大事故0起，死亡0人）",
    //     secondGradeDTOs: [
    //         {
    //             disasterGreatJoint: "1.金属非金属矿山事故（2起，死亡2人、受伤0人，其中较大事故0起，死亡0人）"
    //         },
    //         {
    //             disasterGreatJoint: "2.建筑施工事故（2起，死亡2人、受伤0人，其中较大事故0起，死亡0人）"
    //         },
    //         {
    //             disasterGreatJoint: "3.烟花爆竹和民用爆炸物事故（0起，死亡0人、受伤0人，其中较大事故0起，死亡0人）"
    //         }
    //     ]
    // },
    // {
    //     disasterGreatJoint: "其他突发事件（2起，死亡0人、受伤0人，其中较大事故0起，死亡0人）",
    //     secondGradeDTOs: [
    //         {
    //             disasterGreatJoint: "1.金属非金属矿山事故（2起，死亡2人、受伤0人，其中较大事故0起，死亡0人）"
    //         },
    //         {
    //             disasterGreatJoint: "2.建筑施工事故（2起，死亡2人、受伤0人，其中较大事故0起，死亡0人）"
    //         },
    //     ]
    // },
    // {
    //     disasterGreatJoint: "自然灾害（1起，死亡0人、受伤0人，其中较大事故0起，死亡0人）",
    //     secondGradeDTOs: null
    // }
  ]
  private indexList: any = [
    {
      i: '(一)、'
    },
    {
      i: '(二)、'
    },
    {
      i: '(三)、'
    },
    {
      i: '(四)、'
    },
    {
      i: '(五)、'
    },
    {
      i: '(六)、'
    },
    {
      i: '(七)、'
    }
  ]
  private value1 = []
  // 开始时间小于结束时间
  private startPicker = {
    disabledDate: (time) => {
      if (this.searchlist.day[1]) {
        return time.getTime() > new Date(this.searchlist.day[1]).getTime()
      } else {
        return time.getTime() > Date.now()
      }
    }
  }
  private endPicker = {
    disabledDate: (time) => {
      if (this.searchlist.day[0]) {
        return time.getTime() < new Date(this.searchlist.day[0]).getTime()
      } else {
        return time.getTime() > Date.now()
      }
    }
  }
  getToday() {
    let now = new Date()
    let Y = now.getFullYear()
    let M = now.getMonth() + 1
    let D = now.getDate()
    let Mdate = now.getMonth() >= 10 ? Number(now.getMonth()) + 1 : '0' + Number(now.getMonth() + 1)
    // let firstday = Y + '-' + Mdate + '-01'
    // this.searchlist.year = Y + '';
    this.searchlist.month = Y + '-' + M
    this.searchlist.date = Y + '-' + Mdate
    // this.searchlist.day[0] = firstday
    // this.searchlist.day[0] =  Y + '-' + M + '-' + D;
    // this.searchlist.day[1] =  Y + '-' + M + '-' + D
    // console.log(this.searchlist.day, M)
  }

  private lists = [] // table表格数据
  private event = {}
  private eventOrgName = ''
  private spanArr = []
  private contentSpanArr = []
  private pos = 0
  private position = 0
  //左侧机构树按钮参数
  private configtree = {
    setParameters: {
      tenantId: ''
    }
  }

  private idx = this.lists.length - 1
  created() {
    // this.searchlist.tenantId = JSON.parse(window.sessionStorage.getItem('role')).tenantId;
    //  console.log()
    // this.value1[0] = new Date(new Date().setHours(0, 0, 0, 0)).toJSON()
    // this.value1[1] = new Date(new Date().setHours(23, 59, 59, 0)).toJSON()
    this.configtree.setParameters.tenantId = JSON.parse(JSON.stringify(searchSession.getter({ name: 'role' }))).tenantId

    // this.eventOrgName = JSON.parse(JSON.stringify(searchSession.getter({ name: 'role' }))).districtName
    this.getToday()
    // this.getDate()
  }

  treecallback(data) {
    this[data.type](data)
  }
  mounted() {
    setTimeout(() => {
      this.$nextTick(() => {
        this.getuserGroupOrg()
      })
    }, 1000)
  }
  getuserGroupOrg() {
    this.http.TreeNode.getStatementTree(this.configtree.setParameters).then((res) => {
      if (res.status == 200) {
        this.defaultchecked = res.data[0].id
        this.searchlist.tenantId = res.data[0].id
        this.eventOrgName = res.data[0].label
        this.getDate()
        this.$refs.searchtree['handleTree']('setCurrentKey', res.data[0].id)
      }
    })
  }

  completetree(data) {
    let val = this.$refs.searchtree['getCurrentNodes']()
  }

  /**
   * author by huihui 选择机构
   */
  getOrg(val) {
    console.log(val)
    this.eventOrgName = val.prop.label
    this.searchlist.tenantId = val.prop.id
    this.getDate()
  }

  // 下载表格
  exportAll() {
    let prarm = {
      // distCode: '340000',
      distCode: '',
      endTime: '',
      monthTime: '',
      // monthTime: '2020-8',
      startTime: '',
      yearTime: ''
    }
    prarm.distCode = this.searchlist.tenantId
    // prarm.distCode = '340000'
    prarm.endTime = this.searchlist.day[1]
    prarm.monthTime = this.searchlist.month
    prarm.startTime = this.searchlist.day[0]
    prarm.yearTime = this.searchlist.year
    this.http.StatisticalReportRequest.statisticExportReport(prarm).then((res) => {
      if (res.url) {
        downloadFuncs(res)
      } else {
        this.$message.error('下载失败')
      }
    })
  }
  // 打印PDF
  exportPDF() {
    // 可能由于框架问题直接打印body会只打印一页
    var jubuData = document.getElementById('print').innerHTML
    //把获取的 局部div内容赋给body标签, 相当于重置了 body里的内容 （这里会导致ecahrts打印不出来）
    window.document.body.innerHTML = jubuData
    // this.getEcharts()
    window.print()
    location.reload()
    // 获取到打印的内容
    // const jubuData = document.getElementById("print").innerHTML;
    // const containerBox = document.createElement('div');
    // const container = document.createElement('div');
    // containerBox.appendChild(container)
    // container.innerHTML = jubuData
    // document.body.appendChild(containerBox)
    // this.sheetToSelf(container)
    // const iframe = document.getElementById('printf') as any;
    // const doc = document.all ? iframe.contentWindow.document : iframe.contentDocument;
    // doc.open();
    // doc.write(container.innerHTML);
    // doc.close();
    // document.body.removeChild(containerBox)
    // iframe.contentWindow.focus();
    // // iframe加载完成后再执行打印
    // iframe.contentWindow.onload = function () {
    //   iframe.contentWindow.print()
    // }
  }

  // public sheetToSelf(dom) {
  //   const sheets = document.styleSheets;
  //   const sheetsArry = Array.from(sheets);
  //   const $dom = dom.parentNode

  //   function cssTextToJSON(cssText) {
  //     const arr = cssText.split(';')
  //     arr.splice(arr.length - 1, 1)
  //     const obj = {}
  //     arr.forEach(function (item) {
  //       const attrName = item.split(':')[0]
  //       obj[attrName.replace(/ /g, '')] = item.split(':').map(function (i, index) {
  //         return index ? i : ''
  //       }).join('')
  //     })
  //     return obj
  //   }

  //   sheetsArry.forEach(function (sheetContent) {
  //     const { rules, cssRules } = sheetContent as any;
  //     //cssRules兼容火狐
  //     const rulesArry = Array.from(rules || cssRules || []);
  //     rulesArry.forEach(rule => {
  //       const { selectorText, style } = rule as any;
  //       //全局样式不处理
  //       if (selectorText !== '*') {
  //         //兼容某些样式在转换的时候会报错
  //         try {
  //           const select = $dom.querySelectorAll(selectorText);
  //           select.forEach(dom => {
  //             if (dom.style.cssText) {
  //               const oldCssText = cssTextToJSON(dom.style.cssText);
  //               const newCssText = cssTextToJSON(style.cssText);
  //               for (let i in newCssText) {
  //                 oldCssText[i] = newCssText[i]
  //               }
  //               for (let i in oldCssText) {
  //                 dom.style[i] = oldCssText[i]
  //               }
  //             } else {
  //               dom.style.cssText = style.cssText
  //             }
  //           })
  //         } catch (e) {
  //           console.log('转换成行内样式失败', e);
  //         }
  //       }
  //     })
  //   })
  // }
  // 刷新
  // toRenovate() {
  //   //  console.log(this.searchlist.year + '-' + this.searchlist.month)
  //   if (this.searchlist.month != '') {
  //     var params = {
  //       time: this.searchlist.year + '-' + this.searchlist.month
  //     };
  //   } else {
  //     var params = {
  //       time: this.searchlist.year
  //     };
  //   }
  //   // let param = JSON.parse(params)
  //   this.http.StatisticalReportRequest.getRenovate(params).then(res => {
  //     // console.log(11)
  //     if (res.status == 200) {
  //       // console.log(111)
  //       this.$message({
  //         type: 'success',
  //         message: '刷新成功',
  //         duration: 1000
  //       })
  //       this.getDate();
  //     } else {
  //       this.$message({
  //         type: 'warning',
  //         message: '刷新失败',
  //         duration: 1000
  //       })
  //     }
  //   },
  //   );
  // }
  /**
   * author by huihui 切换时间
   */
  updatetable() {
    let arr = this.searchlist.month.split('-')
    // this.searchlist.year = arr[0];
    let str = arr[1].substring(0, 1)
    if (str == '0') {
      this.searchlist.month = arr[0] + '-' + arr[1].substring(1)
    } else {
      this.searchlist.month = arr[0] + '-' + arr[1]
    }
    // console.log(this.searchlist)
    console.log(this.searchlist.month, 888)
    this.getDate()
  }

  // 切换年份
  upyeartable() {
    //  console.log(this.searchlist.date, 777)
    this.searchlist.month = ''
    this.searchlist.day = []
    // this.searchlist.year = this.searchlist.date;
    this.getDate()
  }
  // 切换日
  updaytable() {
    this.searchlist.month = ''
    this.searchlist.year = ''
    // let d = new Date(this.searchlist.day[0])
    // let t = new Date(this.searchlist.day[1])
    // if ((d.getMonth() + 1) < 10) {
    //     if (d.getDate() < 10) {
    //         this.searchlist.day[0] = d.getFullYear() + '-' + '0' + (d.getMonth() + 1) + '-0' + d.getDate();
    //     } else {
    //         this.searchlist.day[0] = d.getFullYear() + '-' + '0' + (d.getMonth() + 1) + '-' + d.getDate();
    //     }
    // } else {
    //     if (d.getDate() < 10) {
    //         this.searchlist.day[0] = d.getFullYear() + '-' + (d.getMonth() + 1) + '-0' + d.getDate();
    //     } else {
    //         this.searchlist.day[0] = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    //     }
    // }
    // if ((t.getMonth() + 1) < 10) {
    //     if (d.getDate() < 10) {
    //         this.searchlist.day[1] = t.getFullYear() + '-0' + (t.getMonth() + 1) + '-0' + t.getDate();
    //     } else {
    //         this.searchlist.day[1] = t.getFullYear() + '-0' + (t.getMonth() + 1) + '-' + t.getDate();
    //     }
    // } else {
    //     if (d.getDate() < 10) {
    //         this.searchlist.day[1] = t.getFullYear() + '-' + (t.getMonth() + 1) + '-0' + t.getDate();
    //     } else {
    //         this.searchlist.day[1] = t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate();
    //     }
    // }
    this.searchlist.day = [timeFormat(this.searchlist.day[0]).substr(0, 10), timeFormat(this.searchlist.day[1]).substr(0, 10)]
    console.log(this.searchlist.day)
    this.getDate()
  }
  /**
   * author by huihui 获取统计数据
   */
  getDate() {
    let prarm = {
      distCode: '',
      endTime: '',
      monthTime: '',
      // monthTime: '2020-8',
      startTime: '',
      yearTime: ''
    }
    prarm.distCode = this.searchlist.tenantId
    // prarm.distCode = '340000'
    prarm.endTime = this.searchlist.day[1]
    prarm.monthTime = this.searchlist.month
    prarm.startTime = this.searchlist.day[0]
    prarm.yearTime = this.searchlist.year
    this.http.StatisticalReportRequest.getStatic(prarm).then((res) => {
      if (res.status == 200) {
        // console.log(res)
        this.$set(this, 'event', res.data)
        this.$set(this, 'dataList', res.data.gempMonthInfoReportInfoFirstGradeDTOs)
        this.$set(this, 'lists', res.data.statementInfoDTOs)
        this.getSpanArr(res.data.statementInfoDTOs)
        this.getContentSpanArr(res.data.statementInfoDTOs)
      }
    })
  }
  // 判断合并行
  getSpanArr(data) {
    this.spanArr = []
    // this.contentSpanArr = [];
    for (var i = 0; i < data.length; i++) {
      if (i === 0) {
        this.spanArr.push(1)
        this.pos = 0
      } else {
        // 判断当前元素与上一个元素是否相同
        if (data[i].secondaryClassificationName === data[i - 1].secondaryClassificationName) {
          this.spanArr[this.pos] += 1
          this.spanArr.push(0)
        } else {
          this.spanArr.push(1)
          this.pos = i
        }
      }
    }
  }
  getContentSpanArr(data) {
    this.contentSpanArr = []
    // this.contentSpanArr = [];
    for (var i = 0; i < data.length; i++) {
      if (i === 0) {
        this.contentSpanArr.push(1)
        this.position = 0
      } else {
        // 判断当前元素与上一个元素是否相同
        if (data[i].primaryClassificationName === data[i - 1].primaryClassificationName) {
          this.contentSpanArr[this.position] += 1
          this.contentSpanArr.push(0)
        } else {
          this.contentSpanArr.push(1)
          this.position = i
        }
      }
    }
  }
  // 表格合并
  objectSpanMethod({ row, column, rowIndex, columnIndex }) {
    if (columnIndex === 1) {
      const _row = this.contentSpanArr[rowIndex]
      const _col = _row > 0 ? 1 : 0
      return {
        rowspan: _row,
        colspan: _col
      }
    }
    if (columnIndex === 2) {
      const _row = this.spanArr[rowIndex]
      const _col = _row > 0 ? 1 : 0
      return {
        rowspan: _row,
        colspan: _col
      }
    }
  }
  // 切换报表
  changeReport(val) {
    // console.log(val, 888)
    if (val == '1') {
      this.mounthtype = '1'
      this.searchlist.month = ''
      this.searchlist.year = ''
      let now = new Date()
      let Y = now.getFullYear()
      let Mdate = now.getMonth() >= 10 ? Number(now.getMonth()) + 1 : '0' + Number(now.getMonth() + 1)
      let firstday = Y + '-' + Mdate + '-01'
      let M = now.getMonth() + 1
      let D = now.getDate()
      this.searchlist.day[0] = firstday
      this.searchlist.day[1] = Y + '-' + Mdate + '-' + D
      // this.getToday()
      this.getDate()
    } else if (val == '2') {
      this.mounthtype = '2'
      this.searchlist.month = ''
      this.searchlist.day[0] = ''
      this.searchlist.day[1] = ''
      let now = new Date()
      let Y = now.getFullYear()
      this.searchlist.year = Y + ''
      this.getDate()
    } else if (val == '0') {
      this.mounthtype = '3'
      this.searchlist.year = ''
      this.searchlist.day[0] = ''
      this.searchlist.day[1] = ''
      let now = new Date()
      let M = now.getMonth() + 1
      let Y = now.getFullYear()
      this.searchlist.month = Y + '-' + M
      this.getDate()
    }
  }
}
