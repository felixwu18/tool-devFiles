import { ControllerBase, Inject, Prop, Watch } from 'prism-web';
import searchSession from '../../../assets/libs/searchData'

const echarts = require('echarts')
const jiangxi = require('echarts/map/json/province/jiangxi.json')
export class statisticalSummaryListControler extends ControllerBase {

  constructor() {
    super();
  }

  @Inject('http') http: any
  private temp = {
    style: require('../style/statisticalSummaryList.less'),
  };
  private searchlist = {
    "yearTime": "",
    // "monthTime": '2020-08',
    "monthTime": new Date().toJSON().split('-').slice(0, 2).join('-'),
    "distCode": "",
    "label": "",
    "startTime": "",
    "endTime": ""
  }

  private defaultchecked = ""

  // 文档数据
  private wordData: Object = {}
  private showWord = false
  private selectDocument = '0'
  private eventOrgName = ''
  //左侧机构树按钮参数
  private configtree = {
    setParameters: {
      tenantId: ''
    }
  }
  // 开始时间小于结束时间
  private startPicker = {
    disabledDate: time => {
      if (this.searchlist.startTime) {
        return (
          time.getTime() > new Date(this.searchlist.startTime).getTime()
        );
      } else {
        return time.getTime() > Date.now();
      }
    }
  }
  private endPicker = {
    disabledDate: time => {
      if (this.searchlist.endTime) {
        return (
          time.getTime() < new Date(this.searchlist.endTime).getTime()
        );
      } else {
        return time.getTime() > Date.now();
      }
    }
  }
  // 列表按钮点击响应
  tablecallback(data) {
    this[data.type](data);
  }
  created() {
    this.configtree.setParameters.tenantId = JSON.parse(JSON.stringify(searchSession.getter({ name: 'role' }))).tenantId
    this.eventOrgName = JSON.parse(JSON.stringify(searchSession.getter({ name: 'role' }))).districtName
    this.getTree()
  }

  // 切换报表
  changeReport(val) {
    if (+val === 1) {
      this.searchlist.monthTime = ''
      this.searchlist.startTime = ''
      this.searchlist.endTime = ''
      this.searchlist.yearTime = new Date().getFullYear().toString()
    } else if (+val === 2) {
      this.searchlist.monthTime = ''
      this.searchlist.yearTime = ''
      this.searchlist.startTime = new Date().toJSON().split('-').slice(0, 2).concat('01').join('-')
      this.searchlist.endTime = new Date().toJSON().split('-').slice(0, 2).join('-') + '-' + new Date().getDate()
    } else {
      this.searchlist.monthTime = new Date().toJSON().split('-').slice(0, 2).join('-')
      this.searchlist.startTime = ''
      this.searchlist.endTime = ''
      this.searchlist.yearTime = ''
    }
    this.getData()
  }

  treecallback(data) {
    this[data.type](data);
  }

  getOrg(val) {
    this.searchlist.distCode = val.prop.id
    this.searchlist.label = val.prop.label
    this.showWord = false
    this.getData()
  }



  private getTree() {
    this.http.TreeNode.getStatisticalDistrictTree(this.configtree.setParameters).then(res => {
      if (res.status == 200) {
        this.defaultchecked = res.data[0].id;
        this.searchlist.distCode = res.data[0].id;
        this.searchlist.label = res.data[0].label;
        // this.$refs.searchtree['handleTree']("setCurrentKey", res.data[0].id)
        this.getData()
      }
    })
  }

  private getData() {
    // this.searchlist.distCode = '340000'
    // this.searchlist.label = '安徽省'
    this.http.StatisticalReportRequest.getStatisticaReviewInfo(this.searchlist).then(res => {
      if (res.status === 200) {
        this.wordData = res.data
        this.initChart()
      }
    })
  }
  private indexList = [
    '(一)、', '(二)、', '(三)、', '(四)、', '(五)、', '(六)、', '(七)、', '(八)、', '(九)、'
  ]

  public initChart() {
    const Chart = echarts.init(
      this.$refs.zhuzhuangtu as HTMLCanvasElement
    );
    const option = {
      color: ['#ff8062', '#ffca11'],
      tooltip: {
        trigger: 'axis',
        extraCssText: 'width:150px;height:80px;',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: ['死亡人数', '受伤人数'],
        top: 'bottom',
        icon: 'path://M0,0L0,1L1,1L1,0Z'
      },
      grid: {
        left: '0%',
        right: '8%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          name: '机构',
          type: 'category',
          data: (this.wordData['mapInfoList'] || []).map(item => {
            return item.distName
          }),
          axisLabel: {
            color: '#666',
            margin: 12,
            rotate: -60,
            formatter: function (params) {
              if (params.length > 7 && params.length <= 10) {
                return params.slice(0, 7) + '\n' + params.slice(7);
              } else if (params.length > 10 && params.length <= 14) {
                return params.slice(0, 8) + '\n' + params.slice(8);
              } else if (params.length > 14) {
                return params.slice(0, 9) + '\n' + params.slice(9);
              } else {
                return params
              }
            }
          },
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '人数',
        }

      ],
      series: [
        {
          name: '死亡人数',
          type: 'bar',
          data: (this.wordData['mapInfoList'] || []).map(item => {
            return item.deathNum
          }),
          label: {
            show: true,
            position: ['50%', '50%'],
            color: '#000',
            fontSize: 12,
            rotate: -90,
            offset: [0, -20],
            verticalAlign: 'center'
          }
        }, {
          name: '受伤人数',
          type: 'bar',
          barGap: '-0%',
          data: (this.wordData['mapInfoList'] || []).map(item => {
            return item.injuredNum
          }),
          label: {
            show: true,
            position: ['50%', '50%'],
            color: '#000',
            fontSize: 12,
            rotate: -90,
            offset: [0, -20],
            verticalAlign: 'center'
          }
        }
      ]
    };
    Chart.setOption(option, true);
    const Chart2 = echarts.init(
      this.$refs.bingtu as HTMLCanvasElement
    );
    const option2 = {
      color: ['#4a7dff', '#90c67d', '#fdad00'],
      tooltip: {
        trigger: 'item',
        // formatter: '{b} : {c}',
        formatter(params) {
          return `${params.percent}%<br/>数量：${params.data.value}<br/>${params.data.name}`
        }
      },
      legend: {
        left: 'center',
        top: 'bottom',
        data: ['事故灾难', '自然灾害', '其它']
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: [20, 60],
          center: ['50%', '50%'],
          label: {
            normal: {
              formatter: '{d}%\n数量：{c}\n{b}',
              textStyle: {
                fontWeight: 'normal',
                fontSize: 15
              }
            }
          },
          emphasis: {
            label: {
              show: true
            }
          },
          data: [
            { value: this.wordData['infoNumLv1PieChart']['事故灾难'], name: '事故灾难' },
            { value: this.wordData['infoNumLv1PieChart']['自然灾害'], name: '自然灾害' },
            { value: this.wordData['infoNumLv1PieChart']['其他突发事件'], name: '其它' }
          ]
        }
      ]
    };
    Chart2.setOption(option2, true);
    const Chart3 = echarts.init(
      this.$refs.zhuzhuangtu2 as HTMLCanvasElement
    );
    const option3 = {
      color: ['#4a7dff'],
      tooltip: {
        trigger: 'axis',
        extraCssText: 'width:100px;height:60px;'
      },
      legend: {
        data: ['报送事件'],
        top: 'bottom',
        icon: 'path://M0,0L0,1L1,1L1,0Z'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          name: '机构',
          type: 'category',
          data: (this.wordData['infoNumHistograms'] || []).map(item => {
            return item.distName
          }),
          axisLabel: {
            color: '#666',
            margin: 12,
            rotate: -60,
            formatter: function (params) {
              if (params.length > 7 && params.length <= 10) {
                return params.slice(0, 7) + '\n' + params.slice(7);
              } else if (params.length > 10 && params.length <= 14) {
                return params.slice(0, 8) + '\n' + params.slice(8);
              } else if (params.length > 14) {
                return params.slice(0, 9) + '\n' + params.slice(9);
              } else {
                return params
              }
            }
          },
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '事件数量'
        }
      ],
      series: [
        {
          name: '报送事件',
          type: 'bar',
          label: {
            show: true,
            position: ['50%', '50%'],
            color: '#000',
            fontSize: 14,
            rotate: -90,
            offset: [0, -20],
            verticalAlign: 'center'
          },
          data: (this.wordData['infoNumHistograms'] || []).map(item => {
            return +item.infoNum
          })
        }
      ]
    };
    Chart3.setOption(option3, true);

    const Chart4 = echarts.init(
      this.$refs.zhuzhuangtu3 as HTMLCanvasElement
    );
    const option4 = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },

      },
      legend: {
        data: ['事故灾难', '自然灾害', '其他突发事件'],
        top: 'bottom',
        icon: 'path://M0,0L0,1L1,1L1,0Z'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: (() => {
            const data = this.wordData['infoNumLv1Histogram']
            const names = []
            for (let i in data) {
              names.push(i)
            }
            return names
          })(),
          axisLabel: {
            color: '#666',
            margin: 12,
            rotate: -60,
            formatter: function (params) {
              if (params.length > 7 && params.length <= 10) {
                return params.slice(0, 7) + '\n' + params.slice(7);
              } else if (params.length > 10 && params.length <= 14) {
                return params.slice(0, 8) + '\n' + params.slice(8);
              } else if (params.length > 14) {
                return params.slice(0, 9) + '\n' + params.slice(9);
              } else {
                return params
              }
            }
          },
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      color: ['#4a7dff', '#90c67d', '#fdad00'],
      series: [{
        name: '事故灾难',
        type: 'bar',
        data: (() => {
          const data = this.wordData['infoNumLv1Histogram']
          const values = []
          for (let i in data) {
            values.push(data[i]['事故灾难'])
          }
          return values
        })(),
        label: {
          show: true,
          position: ['50%', '50%'],
          color: '#000',
          fontSize: 12,
          rotate: -90,
          offset: [0, -20],
          verticalAlign: 'center'
        },
      }, {
        name: '自然灾害',
        type: 'bar',
        barGap: '0%',//柱图间距
        data: (() => {
          const data = this.wordData['infoNumLv1Histogram']
          const values = []
          for (let i in data) {
            values.push(data[i]['自然灾害'])
          }
          return values
        })(),
        label: {
          show: true,
          position: ['50%', '50%'],
          color: '#000',
          fontSize: 12,
          rotate: -90,
          offset: [0, -20],
          verticalAlign: 'center'
        },
      }, {
        name: '其他突发事件',
        type: 'bar',
        barGap: '-0%',//柱图间距
        data: (() => {
          const data = this.wordData['infoNumLv1Histogram']
          const values = []
          for (let i in data) {
            values.push(data[i]['其他突发事件'])
          }
          return values
        })(),
        label: {
          show: true,
          position: ['50%', '50%'],
          color: '#000',
          fontSize: 12,
          rotate: -90,
          offset: [0, -20],
          verticalAlign: 'center'
        },
      }
      ]
    };
    Chart4.setOption(option4, true);

    const mapName = this.searchlist.distCode
    const jxCode = 360000
    let mapSource = []

    echarts.registerMap(mapName, mapSource)
    const mapChart = echarts.init(
      this.$refs.mapChart as HTMLCanvasElement
    );
    const option5 = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}<br/>事件数量：{c}'
      },
      visualMap: {
        min: 0,
        max: +(this.wordData['infoNumHistograms'] || []).map(item => {
          return item.infoNum
        }).sort((a, b) => b - a)[0] + 1,
        text: ['高', '低'],
        realtime: false,
        left: 0,
        bottom: 0,
        itemWidth: 15,
        calculable: true,
        inRange: {
          color: ['#8ed1e9', '#bee585', '#ffbe00', '#ff5300']
        },
      },
      series: [
        {
          name: '江西省',
          type: 'map',
          map: mapName,
          // mapType: 'jiangxi', // 自定义扩展图表类型
          zoom: 1,
          label: {
            show: true,
            formatter: '{c}\n{b}'
          },
          data: (this.wordData['infoNumHistograms'] || []).map(item => {
            return {
              name: item.distName,
              value: item.infoNum
            }
          }),
        }
      ]
    };
    mapChart.setOption(option5, true);
  }
  private disasterList = []
  private getRowNum(data: Array<any>, index: number, rule: Function) {
    let res = 0
    for (let i = index; i < data.length; i++) {
      if (rule && rule(data[i])) {
        res++
      } else {
        return res
      }
    }
    return res + 1
  }

  spanMethod2({ row, column, rowIndex, columnIndex }, data, key) {
    if (key) {
      let rowspan = 1;
      let colspan = 0;
      if (!data[rowIndex - 1] || data[rowIndex][key] !== data[rowIndex - 1][key]) {
        rowspan = this.getRowNum(data, rowIndex, (item) => {
          return item[key] === data[rowIndex][key]
        })
      }

      if (rowspan === 1 && !rowIndex) {
        colspan = 1
      } else if (rowspan === 1 && data[rowIndex - 1] && data[rowIndex][key] !== data[rowIndex - 1][key]) {
        colspan = 1
      } else {
        colspan = rowspan > 1 ? 1 : 0
      }

      return {
        rowspan,
        colspan
      }
    }
  }

  objectSpanMethod(data) {
    let key = ''
    switch (data.columnIndex) {
      case 0:
        key = 'oneLevelName'
        break;
      case 1:
        key = 'eventTypeName'
        break;
    }
    return this.spanMethod2(data, this.getTableData, key)
  }

  objectSpanMethod2(data) {
    let key = ''
    switch (data.columnIndex) {
      case 1:
        key = 'primaryClassificationName'
        break;
    }
    return this.spanMethod2(data, (this.wordData['statementInfoDTOs'] || []), key)
  }

  // 打印
  derive(index) {
    // 将canvas的内容转换成图片并进行插入到dom里面去
    document.querySelectorAll('canvas').forEach(canvas => {
      const img = document.createElement('img')
      img.setAttribute('src', canvas.toDataURL("image/png"))
      img.setAttribute('class', 'canvasImage')
      const parentNode = canvas.parentNode.parentNode
      parentNode.parentNode.insertBefore(img, parentNode)
    })
    // 获取到打印的内容
    const jubuData = document.getElementById("print").innerHTML;
    // 去掉新增的图片
    document.getElementById("print").querySelectorAll('.canvasImage').forEach(item => {
      item.parentNode.removeChild(item)
    })
    const containerBox = document.createElement('div');
    const container = document.createElement('div');
    containerBox.appendChild(container)
    container.innerHTML = jubuData
    container.querySelectorAll('canvas').forEach(canvas => {
      canvas.parentNode.parentNode.parentNode.removeChild(canvas.parentNode.parentNode)
    })
    document.body.appendChild(containerBox)
    this.sheetToSelf(container)
    const iframe = document.getElementById('printf') as any;
    const doc = document.all ? iframe.contentWindow.document : iframe.contentDocument;
    doc.open();
    doc.write(container.innerHTML);
    doc.close();
    document.body.removeChild(containerBox)
    iframe.contentWindow.focus();
    // iframe加载完成后再执行打印
    iframe.contentWindow.onload = function () {
      iframe.contentWindow.print()
    }
  }
  public sheetToSelf(dom) {
    const sheets = document.styleSheets;
    const sheetsArry = Array.from(sheets);
    const $dom = dom.parentNode

    function cssTextToJSON(cssText) {
      const arr = cssText.split(';')
      arr.splice(arr.length - 1, 1)
      const obj = {}
      arr.forEach(function (item) {
        const attrName = item.split(':')[0]
        obj[attrName.replace(/ /g, '')] = item.split(':').map(function (i, index) {
          return index ? i : ''
        }).join('')
      })
      return obj
    }

    sheetsArry.forEach(function (sheetContent) {
      const { rules, cssRules } = sheetContent as any;
      //cssRules兼容火狐
      const rulesArry = Array.from(rules || cssRules || []);
      rulesArry.forEach(rule => {
        const { selectorText, style } = rule as any;
        //全局样式不处理
        if (selectorText !== '*') {
          //兼容某些样式在转换的时候会报错
          try {
            const select = $dom.querySelectorAll(selectorText);
            select.forEach(dom => {
              if (dom.style.cssText) {
                const oldCssText = cssTextToJSON(dom.style.cssText);
                const newCssText = cssTextToJSON(style.cssText);
                for (let i in newCssText) {
                  oldCssText[i] = newCssText[i]
                }
                for (let i in oldCssText) {
                  dom.style[i] = oldCssText[i]
                }
              } else {
                dom.style.cssText = style.cssText
              }
            })
          } catch (e) {
            console.log('转换成行内样式失败', e);
          }
        }
      })
    })
  }

  private tableData = [
    {
      oneLevelName: '事故灾难',
      childrensSon: ['煤矿', '非煤矿山', '烟花爆竹', '化工', '工业制造', '建筑工地', '水上运输', '航空运输', '生产经营性火灾', '城市运行', '特种设备',
        '旅行', '商贸', '校园', '农林牧渔', '建筑施工', '道路运输']
    }, {
      oneLevelName: '自然灾害',
      childrensSon: ['水旱灾害', '森林火灾', '地震灾害', '地质灾害', '其他自然灾害']
    }, {
      oneLevelName: '其它灾害',
      childrensSon: ['其他突发事件']
    }
  ]

  private get getTableData() {
    const res = (this.wordData['gempStatementReviewDayExcelDTOs'] || []).map(item => {
      return {
        ...item,
        oneLevelName: (this.tableData.find(table => {
          return table.childrensSon.indexOf(item.eventTypeName) > -1
        }) || {}).oneLevelName
      }
    })
    const arr = []
    for (let i = 0; i < res.length; i++) {
      if (res[i].isShowFlag) {
        arr.push(res[i])
      }
    }
    return arr
  }

  changeStr(str) {
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, '%', '.'];
    (arr || []).forEach(item => {
      str = str.split(item).join(`<span style="color:red">${item}</span>`)
    });
    return str
  }

}
