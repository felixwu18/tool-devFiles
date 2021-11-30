/* 三阳上轨 必须要20天的数据*/
const accumulator = require("../accumulator")
const to20Average = require("../to20Average")

module.exports = function sysgSelect(data) {
    if(typeof data !== 'object') { return }
    const latest3DaysP = data.slice(0, 3) // 时间降序
    const spjArr = latest3DaysP.map(item => item.split(',')[2]) // 收盘价
    const day3zfArr = latest3DaysP.map(item => item.split(',')[8]) // 3天涨跌幅
    const d3lj = accumulator(day3zfArr) // 3天涨幅累计
    const upper = to20Average(data).upper

    const condition1 = d3lj > 13 // 3天累计13点以上
    const condition2 = day3zfArr[0] > 0 && day3zfArr[1] > 0 && day3zfArr[2] > 0 // 三天阳线
    const condition3 = spjArr[0] > upper // 突破boll上轨

    return condition1&&condition2&&condition3
}