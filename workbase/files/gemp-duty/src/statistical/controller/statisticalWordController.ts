import { ControllerBase, Inject, Prop, Watch } from 'prism-web';
import { NONAME } from 'dns';

const echarts = require('echarts')
const jiangxi = require('echarts/map/json/province/jiangxi.json')


export class statisticalWordController extends ControllerBase {

  constructor() {
    super();
  }

  @Inject('http') http: any
  @Inject('echarts') echarts: any;
  @Inject('jiangxi') jiangxi: any;

  @Prop({
    default: () => {
      return {}
    }
  }) wordData: any;

  

  private temp = {
    style: require('../style/statisticalWord.less'),
  };
  private lists: any = {};
  private disasterList = [
    {
      title: '事故灾难',
      childrenTitle: '矿山',
      grandsonTitle: '煤矿',
      total: {
        start: 10,
        personal: 20
      },
      proportion: {
        start: 10,
        personal: 20,
        growthRate: '5%'
      },
      linkRatio: {
        start: 10,
        personal: 20,
        growthRate: '5%'
      }
    }, {
      title: '事故灾难',
      childrenTitle: '危险物品',
      grandsonTitle: '烟花爆竹',
      total: {
        start: 10,
        personal: 20
      },
      proportion: {
        start: 10,
        personal: 20,
        growthRate: '5%'
      },
      linkRatio: {
        start: 10,
        personal: 20,
        growthRate: '5%'
      }
    }, {
      title: '事故灾难',
      childrenTitle: '危险物品',
      grandsonTitle: '化工',
      total: {
        start: 10,
        personal: 20
      },
      proportion: {
        start: 10,
        personal: 20,
        growthRate: '5%'
      },
      linkRatio: {
        start: 10,
        personal: 20,
        growthRate: '5%'
      }
    }, {
      title: '事故灾难',
      childrenTitle: '工业制造',
      grandsonTitle: '冶金',
      total: {
        start: 10,
        personal: 20
      },
      proportion: {
        start: 10,
        personal: 20,
        growthRate: '5%'
      },
      linkRatio: {
        start: 10,
        personal: 20,
        growthRate: '5%'
      }
    }, {
      title: '事故灾难',
      childrenTitle: '工业制造',
      grandsonTitle: '有色',
      total: {
        start: 10,
        personal: 20
      },
      proportion: {
        start: 10,
        personal: 20,
        growthRate: '5%'
      },
      linkRatio: {
        start: 10,
        personal: 20,
        growthRate: '5%'
      }
    }, {
      title: '事故灾难',
      childrenTitle: '工业制造',
      grandsonTitle: '机械',
      total: {
        start: 10,
        personal: 20
      },
      proportion: {
        start: 10,
        personal: 20,
        growthRate: '5%'
      },
      linkRatio: {
        start: 10,
        personal: 20,
        growthRate: '5%'
      }
    }, {
      title: '事故灾难',
      childrenTitle: '工业制造',
      grandsonTitle: '轻工',
      total: {
        start: 10,
        personal: 20
      },
      proportion: {
        start: 10,
        personal: 20,
        growthRate: '5%'
      },
      linkRatio: {
        start: 10,
        personal: 20,
        growthRate: '5%'
      }
    }, {
      title: '事故灾难',
      childrenTitle: '矿山',
      grandsonTitle: '煤矿',
      total: {
        start: 10,
        personal: 20
      },
      proportion: {
        start: 10,
        personal: 20,
        growthRate: '5%'
      },
      linkRatio: {
        start: 10,
        personal: 20,
        growthRate: '5%'
      }
    }, {
      title: '自然灾害',
      childrenTitle: '矿山',
      grandsonTitle: '洪水',
      total: {
        start: 10,
        personal: 20
      },
      proportion: {
        start: 10,
        personal: 20,
        growthRate: '5%'
      },
      linkRatio: {
        start: 10,
        personal: 20,
        growthRate: '5%'
      }
    }, {
      title: '自然灾害',
      childrenTitle: '矿山',
      grandsonTitle: '山崩',
      total: {
        start: 10,
        personal: 20
      },
      proportion: {
        start: 10,
        personal: 20,
        growthRate: '5%'
      },
      linkRatio: {
        start: 10,
        personal: 20,
        growthRate: '5%'
      }
    }, {
      title: '其它灾害',
      childrenTitle: '矿山',
      grandsonTitle: '暴雨',
      total: {
        start: 10,
        personal: 20
      },
      proportion: {
        start: 10,
        personal: 20,
        growthRate: '5%'
      },
      linkRatio: {
        start: 10,
        personal: 20,
        growthRate: '5%'
      }
    },

  ]


  private indexList = [
    '(一)、', '(二)、', '(三)、', '(四)、', '(五)、', '(六)、', '(七)、', '(八)、', '(九)、'
  ]

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

  objectSpanMethod({ row, column, rowIndex, columnIndex }) {

    let key = ''
    switch (columnIndex) {
      case 0:
        key = 'title'
        break;
      case 1:
        key = 'grandsonTitle'
        break;
    }

    if (key) {
      let rowspan = 1;
      let colspan = 0;
      const data = this.disasterList
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

  goback() {
    this.$router.go(-1)
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

  public initChart() {
    const Chart = echarts.init(
      this.$refs.zhuzhuangtu as HTMLCanvasElement
    );
    const option = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: ['报送事件'],
        left: 'right',
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
          data: ['南昌', '九江', '上饶', '抚州', '宜春', '吉安', '赣州', '景德镇', '萍乡', '新余', '鹰潭'],
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
      series: [
        {
          name: '报送事件',
          type: 'bar',
          barWidth: '60%',
          data: [20, 19, 18, 16, 15, 14, 12, 10, 8, 6, 4]
        }
      ]
    };
    Chart.setOption(option, true);
    const Chart2 = echarts.init(
      this.$refs.bingtu as HTMLCanvasElement
    );
    const option2 = {
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c}'
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
          radius: [0, 110],
          center: ['50%', '50%'],
          roseType: 'radius',
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: true
            }
          },
          data: [
            { value: 10, name: '事故灾难' },
            { value: 6, name: '自然灾害' },
            { value: 5, name: '其它' }
          ]
        }
      ]
    };
    Chart2.setOption(option2, true);
    const Chart3 = echarts.init(
      this.$refs.zhuzhuangtu2 as HTMLCanvasElement
    );
    const option3 = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: ['报送事件'],
        left: 'right',
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
          data: ['南昌', '九江', '上饶', '抚州', '宜春', '吉安', '赣州', '景德镇', '萍乡', '新余', '鹰潭'],
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
      series: [
        {
          name: '报送事件',
          type: 'bar',
          barWidth: '60%',
          data: [20, 19, 18, 16, 15, 14, 12, 10, 8, 6, 4]
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
        }
      },
      legend: {
        data: ['自然灾害', '事故', '其它'],
        left: 'right',
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
          data: ['南昌', '九江', '上饶', '抚州', '宜春', '吉安', '赣州', '景德镇', '萍乡', '新余', '鹰潭'],
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
      color: ['#DFE6F3', '#5A81CB', '#3398DB'],
      series: [{
        name: '事故',
        type: 'bar',
        stack: 'all',
        barWidth: 12,
        data: [120, 132, 101, 134, 90, 230, 210, 132, 101, 234, 290]
      }, {
        name: '自然灾害',
        type: 'bar',
        stack: 'all',
        data: [220, 182, 191, 234, 290, 330, 310, 230, 210, 134, 90]
      }, {
        name: '其它',
        type: 'bar',
        stack: 'all',
        data: [220, 182, 191, 234, 290, 330, 310, 230, 210, 134, 90]
      }
      ]
    };
    Chart4.setOption(option4, true);

    echarts.registerMap('jiangxi', jiangxi)
    const mapChart = echarts.init(
      this.$refs.mapChart as HTMLCanvasElement
    );
    const option5 = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}<br/>{c} (p / km2)'
      },
      visualMap: {
        min: 800,
        max: 50000,
        text: ['High', 'Low'],
        realtime: false,
        calculable: true,
        inRange: {
          color: ['lightskyblue', 'yellow', 'orangered']
        }
      },
      series: [
        {
          name: '江西省',
          type: 'map',
          map: 'jiangxi',
          mapType: 'jiangxi', // 自定义扩展图表类型
          label: {
            show: true
          },
          data: (this.wordData.mapInfoList || []).map(item => {
            return {
              name: item.distName,
              value: item.deathNum
            }
          }),
        }
      ]
    };
    debugger
    mapChart.setOption(option5, true);
  }
  mounted() {
    // this.getData();
    // console.log(this.$route.query.year, 111)
    // this.paramYear = this.$route.query.year + '年' + this.$route.query.month + '月'
    this.getData();

  }
  
  public getData() {
    this.initChart()

  }
}