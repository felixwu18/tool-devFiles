/* 倍量启动 条件苛刻，但有符合的一般有行情 */
const to20Average = require("../to20Average")

module.exports = function blp20aSelect(data) {
    if(typeof data !== 'object') { return }
    const zdfArr = data.map(item => item.split(',')[8]) // 涨跌幅
    const volumeArr = data.map(item => item.split(',')[5]) // 成交量
    const spjArr = data.map(item => item.split(',')[2]) // 收盘价
    const average20 = to20Average(data).average20

    const condition1 = (volumeArr[0] / volumeArr[1]).toFixed(2) > 1.8 // 量柱倍量
    const condition2 = zdfArr[0] > 4 // 放量当天涨幅要求
    const condition3 = spjArr[0] > average20 // 突破20均

    // console.log(volumeArr, '=====>volumeArr')
    // console.log(zdfArr, '=====>zdfArr')
    // console.log(average20, '=====>average20')
    // console.log((volumeArr[0] / volumeArr[1]).toFixed(2), '=====>(volumeArr[0] / volumeArr[1]).toFixed(2)')
    // console.log(condition1, '=====>condition1')
    // console.log(condition2, '=====>condition2')
    // console.log(condition3, '=====>condition3')
    return condition1&&condition2&&condition3
}
