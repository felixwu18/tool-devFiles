import {ControllerBase, Inject, Watch, Prop} from 'prism-web'
import {timeFormat} from '../../../assets/libs/commonUtils'

const echarts = require('echarts')

export class WeekplanListControll extends ControllerBase {
    private temp = {
        style: require('../style/InformationStatisticList.less')
    }

    constructor() {
        super()
    }

    @Inject("http") http: any
    @Inject('echarts') echarts: any;


    private oldChooseData = [];
    private selectArea = '';

    private tabTime = "0";
    private selectEvenLevel = '';
    private search_time = [new Date(this.getYearStartDate() + " 00:00:00"), new Date(this.getYearEndDate() + " 23:59:59")];
    // data: ['芝罘区', '福山区', '牟平区', '莱山区', '龙口市', '莱阳区', '莱州市', '蓬莱市', '招远市', '栖霞市', '海阳市', '长岛县'],
    private areaData = [];
    private evenLevelData = [];

    private totalNum1 = 0;
    private totalNum2 = 0;
    private totalNum3 = 0;
    private totalNum4 = 0;

    // public selectAll(val) {
    //     console.log(val);
    //     const allValues = this.areaData.map(item => {
    //         return item.value;
    //     });
    //     // 用来储存上一次选择的值，可进行对比
    //     const oldVal = this.oldChooseData.length > 0 ? this.oldChooseData : [];
    //
    //     // 若选择全部
    //     if (val.includes('ALL_SELECT')) {
    //         this.selectArea = allValues;
    //     }
    //
    //     // 取消全部选中， 上次有， 当前没有， 表示取消全选
    //     if (oldVal.includes('ALL_SELECT') && !val.includes('ALL_SELECT')) {
    //         this.selectArea = [];
    //     }
    //
    //     // 点击非全部选中，需要排除全部选中 以及 当前点击的选项
    //     // 新老数据都有全部选中
    //     if (oldVal.includes('ALL_SELECT') && val.includes('ALL_SELECT')) {
    //         const index = val.indexOf('ALL_SELECT');
    //         val.splice(index, 1); // 排除全选选项
    //         this.selectArea = val;
    //     }
    //
    //     // 全选未选，但是其他选项都全部选上了，则全选选上
    //     if (!oldVal.includes('ALL_SELECT') && !val.includes('ALL_SELECT')) {
    //         if (val.length === allValues.length - 1) {
    //             this.selectArea = ['ALL_SELECT'].concat(val);
    //         }
    //     }
    //
    //     // 储存当前选择的最后结果 作为下次的老数据
    //     this.oldChooseData = this.selectArea;
    // }
    //
    // public removeTag(val) {
    //     if (val === '全部') {
    //         this.selectArea = []
    //     }
    // }

    private tableData = [{date: '自然灾害',
    }, {
        date: '事故灾难',
    } /*{
        date: '公共卫生',
    }, {
        date: '事故安全',
    }*/]

    @Watch('search_time')
    watchTime(val) {
        this.searchData['startTime'] = val[0];
        this.searchData['endTime'] = val[1]
    }

//  条件搜索图表
    public searchData = {
        distCode: "",
        eventLevelCode: "",
        eventTypeCode: "",
        startTime: this.getYearStartDate() + " 00:00:00",
        endTime: this.getYearEndDate() + " 23:59:59"
    };

    private echartData = {
        xAxis: [],
        naturalNum: [],
        accidentNum: [],
        healthNum: [],
        securityNum: [],
        totalNum: []
    }

    public toggleTab(e) {
        switch (e) {
            case "0":
                this.search_time = [new Date(this.getYearStartDate() + " 00:00:00"), new Date(this.getYearEndDate() + " 23:59:59")];
                break;
            case "1":
                this.search_time = [new Date(this.getQuarterStartDate() + " 00:00:00"), new Date(this.getQuarterEndDate() + " 23:59:59")];
                break
            case "2":
                this.search_time = [new Date(this.getMonthStartDate() + " 00:00:00"), new Date(this.getMonthEndDate() + " 23:59:59")];
                break
            case "3":
                this.search_time = [new Date(this.getWeekStartDate() + " 00:00:00"), new Date(this.getWeekEndDate() + " 23:59:59")];
                break
        }
    }

    public formatSelectDate(time) {
        var now = new Date(); //当前日期
        var nowDayOfWeek = now.getDay(); //今天本周的第几天
        var nowDay = now.getDate(); //当前日
        var nowMonth = now.getMonth(); //当前月
        var nowYear = now.getFullYear(); //当前年
        nowYear += nowYear < 2000 ? 1900 : 0;

    }

    //获得本周的开端日期
    public getWeekStartDate() {
        var weekStartDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - new Date().getDay() + 1);
        console.log(new Date().getDate() - new Date().getDay());
        console.log(weekStartDate);
        return this.formatDate(weekStartDate);
    }

    //获得本周的停止日期
    public getWeekEndDate() {
        var weekEndDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + (7 - new Date().getDay()));
        return this.formatDate(weekEndDate);
    }


    //获得本年的开始日期
    public getYearStartDate() {
        //获得当前年份4位年
        var currentYear = new Date().getFullYear();
        //本年第一天
        var currentYearFirstDate = new Date(currentYear, 0, 1);
        return this.formatDate(currentYearFirstDate);
    }

    //获得本年的结束日期
    public getYearEndDate() {
        //获得当前年份4位年
        var currentYear = new Date().getFullYear();
        //本年最后
        var currentYearLastDate = new Date(currentYear, 11, 31);
        return this.formatDate(currentYearLastDate);
    }

    //获得本季度的开始日期
    public getQuarterStartDate() {
        var quarterStartDate = new Date(new Date().getFullYear(), this.getQuarterStartMonth(), 1);
        return this.formatDate(quarterStartDate);
    }

    //获的本季度的结束日期
    public getQuarterEndDate() {
        var quarterEndMonth = this.getQuarterStartMonth() + 2;
        var quarterStartDate = new Date(
            new Date().getFullYear(),
            quarterEndMonth,
            this.getMonthDays(quarterEndMonth)
        );
        return this.formatDate(quarterStartDate);
    }

    //获得本季度的开始月份
    public getQuarterStartMonth() {
        var quarterStartMonth = 0;
        if (new Date().getMonth() < 3) {
            quarterStartMonth = 0;
        }
        if (2 < new Date().getMonth() && new Date().getMonth() < 6) {
            quarterStartMonth = 3;
        }
        if (5 < new Date().getMonth() && new Date().getMonth() < 9) {
            quarterStartMonth = 6;
        }
        if (new Date().getMonth() > 8) {
            quarterStartMonth = 9;
        }
        return quarterStartMonth;
    }

    //获得某月的天数
    public getMonthDays(myMonth) {
        var monthStartDate = new Date(new Date().getFullYear(), myMonth, 1);
        var monthEndDate = new Date(new Date().getFullYear(), myMonth + 1, 1);
        var days =
            (Number(monthEndDate) - Number(monthStartDate)) / (1000 * 60 * 60 * 24);
        return days;
    }

    //获得本月的开始日期
    public getMonthStartDate() {
        var monthStartDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        return this.formatDate(monthStartDate);
    }

    //获得本月的结束日期
    public getMonthEndDate() {
        var monthEndDate = new Date(new Date().getFullYear(), new Date().getMonth(), this.getMonthDays(new Date().getMonth()));
        return this.formatDate(monthEndDate);
    }


    public formatDate(date) {
        var myyear = date.getFullYear();
        var mymonth = date.getMonth() + 1;
        var myweekday = date.getDate();
        if (mymonth < 10) {
            mymonth = '0' + mymonth;
        }
        if (myweekday < 10) {
            myweekday = '0' + myweekday;
        }
        return myyear + '-' + mymonth + '-' + myweekday;
    }


    public reset() {
        this.tabTime = "0";
        this.selectArea = '';
        this.selectEvenLevel = "";
        this.search_time = [new Date(this.getYearStartDate() + " 00:00:00"), new Date(this.getYearEndDate() + " 23:59:59")];
    }

    public search() {
        console.log(this.searchData);
        this.searchData.eventLevelCode = this.selectEvenLevel
        this.searchData.distCode = this.selectArea
        this.totalNum1 = 0;
        this.totalNum2 = 0;
        this.totalNum3 = 0;
        this.totalNum4 = 0;
        this.tableData = [{
            date: '自然灾害',
        }, {
            date: '事故灾难',
        }/*, {
            date: '公共卫生',
        }, {
            date: '事故安全',
        }*/];
        if (typeof this.searchData.startTime === "object") {
            this.searchData.startTime = timeFormat(this.search_time[0])
            this.searchData.endTime = timeFormat(this.search_time[1])
        }

        this.http.ReceivingStatistic.getEchartsData(this.searchData).then(res => {
            console.log(res);
            if (res.data && Array.isArray(res.data)) {

                // 图数据
                this.echartData.xAxis = res.data.map(item => {
                    return item.distName
                });
                this.echartData.naturalNum = res.data.map(item => {
                    return item.naturalNum
                });
                this.echartData.accidentNum = res.data.map(item => {
                    return item.accidentNum
                });
                this.echartData.healthNum = res.data.map(item => {
                    return item.healthNum
                });
                this.echartData.securityNum = res.data.map(item => {
                    return item.securityNum
                });
                this.echartData.totalNum = res.data.map(item => {
                    return item.totalNum
                });

                // 表数据
                for (let i = 0; i < res.data.length; i++) {
                    this.$set(this.tableData[0], res.data[i].distName, res.data[i].naturalNum)
                }

                for (let i = 0; i < res.data.length; i++) {
                    this.$set(this.tableData[1], res.data[i].distName, res.data[i].accidentNum)
                }

                // for (let i = 0; i < res.data.length; i++) {
                //     this.$set(this.tableData[2], res.data[i].distName, res.data[i].healthNum)
                // }
                //
                // for (let i = 0; i < res.data.length; i++) {
                //     this.$set(this.tableData[3], res.data[i].distName, res.data[i].securityNum)
                // }

                for (let i in this.tableData[0]) {
                    if (i === "date" || i === "合计") {
                        continue
                    } else {
                        this.totalNum1 += Number(this.tableData[0][i])
                    }

                }
                this.tableData[0]['合计'] = this.totalNum1;

                for (let i in this.tableData[1]) {
                    if (i === "date" || i === "合计") {
                        continue
                    } else {
                        this.totalNum2 += Number(this.tableData[1][i])
                    }

                }
                this.tableData[1]['合计'] = this.totalNum2;

                // for (let i in this.tableData[2]) {
                //     if (i === "date" || i === "合计") {
                //         continue
                //     } else {
                //         this.totalNum3 += Number(this.tableData[2][i])
                //     }
                //
                // }
                // this.tableData[2]['合计'] = this.totalNum3;
                //
                // for (let i in this.tableData[3]) {
                //     if (i === "date" || i === "合计") {
                //         continue
                //     } else {
                //         this.totalNum4 += Number(this.tableData[3][i])
                //     }
                //
                // }
                // this.tableData[3]['合计'] = this.totalNum4;
                // console.log(this.tableData);
            }
            this.initMessageChart(this.echartData)
        })

    }

    public initMessageChart(echartData) {
        if (!this.$refs.messageChart) return
        const Chart = echarts.init(
            this.$refs.messageChart as HTMLCanvasElement
        );
        let rotate = 0;
        if (echartData.xAxis.length !== 1) {
            rotate = -40;
        }
        console.log(echartData.xAxis)
        const option = {
            tooltip: {
                trigger: 'axis',
                // axisPointer: {
                //     type: 'cross',
                //     crossStyle: {
                //         color: '#999'
                //     }
                // }
            },

            legend: {
                x: '300',
                y: '25',

                data: ['自然灾害', '事故灾害'/*, '公共卫生', '社会安全'*/]
            },
            xAxis: [
                {
                    type: 'category',
                    data: echartData.xAxis,
                    axisPointer: {
                        type: 'shadow'
                    },
                    axisLabel:{
                        rotate,
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '信息报送数量（件）',
                    // min: 0,
                    // max: 10,
                    minInterval: 1,
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                {
                    type: 'value',
                    name: '总和（件）',
                    minInterval: 1,
                    // min: 0,
                    // max: 50,
                    // interval: 10,

                }
            ],
            series: [
                {
                    name: '自然灾害',
                    type: 'bar',
                    data: echartData.naturalNum,
                    itemStyle: {
                        normal: {
                            color: "#19E13E",
                            barBorderRadius: 5
                        }
                    },
                    barWidth: 8
                },
                {
                    name: '事故灾害',
                    type: 'bar',
                    data: echartData.accidentNum,
                    itemStyle: {
                        normal: {
                            color: "#FB5E2F",
                            barBorderRadius: 5
                        }
                    },
                    barWidth: 8,
                },
                // {
                //     name: '公共卫生',
                //     type: 'bar',
                //     data: echartData.healthNum,
                //     itemStyle: {
                //         normal: {
                //             color: "#FFC93C",
                //             barBorderRadius: 5
                //         }
                //     },
                //     barWidth: 8,
                // },
                // {
                //     name: '社会安全',
                //     type: 'bar',
                //     data: echartData.securityNum,
                //     itemStyle: {
                //         normal: {
                //             color: "#4787FB",
                //             barBorderRadius: 5
                //         }
                //     },
                //     barWidth: 8,
                // },
                {
                    name: '总和',
                    type: 'line',
                    yAxisIndex: 1,
                    data: echartData.totalNum,
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: "#3A76F9"
                        }
                    },
                }
            ]
        };
        Chart.setOption(option, true);
    }

    created() {
        this.http.ReceivingStatistic.getArea(this.searchData).then(res => {
            if (res.data && Array.isArray(res.data)) {
                this.areaData = res.data.map(item => {
                    return {
                        label: item.distName,
                        value: item.distName,
                        id: item.distCode
                    }
                });
                console.log(this.areaData);
            } else {
                this.areaData = []
            }

            // this.areaData.unshift({value: 'ALL_SELECT', label: '全部', id: "all"})

        });
        this.http.ReceivingStatistic.getEventLevel(this.searchData).then(res => {
            if (res.data && Array.isArray(res.data)) {
                this.evenLevelData = res.data.map(item => {
                    return {
                        label: item.eventLevelName,
                        value: item.eventLevelName,
                        id: item.eventLevelCode
                    }
                });
            } else {
                this.evenLevelData = []
            }
        })


    }

    mounted() {
        console.log(this.selectEvenLevel);
        this.search()

    }
}