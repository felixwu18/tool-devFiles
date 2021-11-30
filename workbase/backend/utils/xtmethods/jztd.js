/* 金针探底 */
const accumulator = require("../accumulator")
module.exports = function jztdSelect(data) {
    if(typeof data !== 'object') { return }
    const latest9DaysP = data.slice(0, 9) // 时间降序
    // for(let i = 0; i < latest9DaysP.length; i++) {
    //     const currentZF = latest9DaysP[i].split(',')[8] //涨幅 index 8
    //     if(currentZF > 3 || currentZF < -3) { // 确保小阴小阳
    //         return false
    //     }
    // }
    // latest9DaysP -- '2020-12-11, 103.43, 100.00, 103.74, 100.00, 146269, 1482557808.00, 3.65, -2.52, -2.59, 1.40'
    // index 开盘价 1 收盘价 2 最高价 3 最低价 4 成交量 5 成交额 6 振幅 7 涨跌幅 8 成交额 9 换手率 10
    const spjArr = latest9DaysP.map(item => item.split(',')[2]) // 收盘价
    const kpjArr = latest9DaysP.map(item => item.split(',')[1]) // 开盘价
    const lowestArr = latest9DaysP.map(item => item.split(',')[4]) // 最低价
    const topArr = latest9DaysP.map(item => item.split(',')[3]) // 最高价
    const zfArr = latest9DaysP.map(item => item.split(',')[8]) // 涨跌幅

    // const xyxArr = latest9DaysP.filter(item => (item.split(',')[2] - item.split(',')[1]) < 0) // 阴线 收盘 - 开盘
    /* 金针 */
    const dfyx = (kpjArr[0] - lowestArr[0]).toFixed(2)
    const kfyx = (topArr[0] - spjArr[0]).toFixed(2)
    const skzd = ((spjArr[0] - kpjArr[0]) / kpjArr[0]).toFixed(2) // 收盘价 - 开盘价 收开涨跌
    const condition1 = skzd < 1 && skzd > 0 // 实体点数 1点以内
    const condition2 = (dfyx / kfyx).toFixed(2) > 2.5 // 上下影线多空占比
    const condition3 = zfArr.slice(1, 4).find(zdf => zdf > 0) === undefined // 连跌3天
    const d3lj = accumulator(zfArr.slice(1, 4)) // 3天跌幅累计, 或者四天跌幅
    const condition4 = (d3lj < -5) && (d3lj > -7.5) // 累计跌幅6到7个点
    // console.log('latest9DaysP', latest9DaysP)
    // console.log('dfyx', dfyx)
    // console.log('kfyx', kfyx)
    // console.log('skzd', skzd)
    // console.log('condition1', condition1)
    // console.log('condition2', condition2)
    // console.log('condition3', condition3)
    // console.log('d3lj', d3lj)
    // console.log('condition4', condition4)
    return condition1&&condition2&&condition3&&condition4
}
