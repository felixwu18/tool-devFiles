/* 阴阳互换 大阴战法 大跌第二天收盘选股 */
const accumulator = require("../accumulator")
const getMaxNum = require("../getMaxNum")

module.exports = function yyhhSelect(data) {
    if(typeof data !== 'object') { return }
    const latest25DaysP = data.slice(0, 25) // 时间降序
    const zdfArr = latest25DaysP.map(item => item.split(',')[8]) // 涨跌幅
    const zfArr = latest25DaysP.map(item => item.split(',')[7]) // 振幅
    const topArr = latest25DaysP.map(item => item.split(',')[3]) // 最高价
    const lowArr = latest25DaysP.map(item => item.split(',')[4]) // 最低价
    const earliestLowP = lowArr.slice(-1)[0] // 最早时间的最低价
    const d25ljzdf = accumulator(zdfArr) // 前25天涨幅累计
    // const d25ljzf = ((getMaxNum(topArr) - earliestLowP) / earliestLowP * 100).toFixed(2) // 前25天振幅

    const condition1 = zdfArr[1] < -5 && zdfArr[1] > -10 // 大阴线
    // const condition2 = zdfArr[0] > 0 && zdfArr[0] < 3 // 大跌第二天小阳线企稳
    const condition3 = d25ljzdf > 30 // 前25累计涨幅要求  35
    // const condition4 = d25ljzf > 80 // 前25累计振幅要求

    // console.log(latest25DaysP, '=====>latest25DaysP')
    // console.log(zdfArr, '=====>zdfArr')
    // console.log(zfArr, '=====>zfArr')
    // console.log(topArr, '=====>topArr')
    // console.log(d25ljzdf, '=====>d25ljzdf')
    // console.log(earliestLowP, '=====>earliestLowP')
    // // console.log(d25ljzf, '=====>d25ljzf')
    // console.log(condition1, '=====>condition1')
    // // console.log(condition2, '=====>condition2')
    // console.log(condition3, '=====>condition3')
    // console.log(condition4, '=====>condition4')
    // return condition1&&condition2&&condition3
    return condition1&&condition3
}
