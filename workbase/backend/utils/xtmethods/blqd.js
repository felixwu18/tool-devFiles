/* 倍量启动 条件苛刻，但有符合的一般有行情 */
module.exports = function blqdSelect(data) {
    if(typeof data !== 'object') { return }
    const latest5DaysP = data.slice(0, 5) // 时间降序 取五天参考
    const latest19DaysP = data.slice(1) // 时间降序 取前19天参考
    const spjArr = latest5DaysP.map(item => item.split(',')[2]) // 收盘价
    const kpjArr = latest5DaysP.map(item => item.split(',')[1]) // 开盘价
    const zdfArr = latest5DaysP.map(item => item.split(',')[8]) // 涨跌幅 5天
    const zdf19Arr = latest19DaysP.map(item => item.split(',')[8]) // 涨跌幅 19天
    const maxdfArr = zdf19Arr.filter(adf => adf < -3) // 前19天最大跌幅要求
    const volumeArr = latest5DaysP.map(item => item.split(',')[5]) // 成交量
    const condition1 = maxdfArr.length < 2 // 最大允许跌幅数量不能超1
    const condition2 = zdf19Arr.findIndex(adf => adf > 5 || adf < -4) === -1 // 前19天最大涨幅，最大跌幅限制
    const condition3 = (volumeArr[0] / volumeArr[1]).toFixed(2) > 2.8 // 量柱倍量
    const condition4 = ((spjArr[0] - kpjArr[4]) / kpjArr[4] * 100).toFixed(2) < 20 // 五天累计涨幅18点内
    const condition5 = zdfArr[0] > 5 // 放量当天涨幅要求
    console.log(latest5DaysP, '=====>latest5DaysP')
    console.log(volumeArr, '=====>volumeArr')
    console.log((volumeArr[0] / volumeArr[1]).toFixed(2), '=====>(volumeArr[0] / volumeArr[1]).toFixed(2)')
    console.log(((spjArr[0] - kpjArr[4]) / kpjArr[4] * 100).toFixed(2), '=====>((spjArr[0] - kpjArr[4]) / kpjArr[4] * 100).toFixed(2)')
    console.log(zdfArr[0], '=====>zdfArr[0]')

    console.log(maxdfArr, '=====>maxdfArr')
    console.log(condition1, '=====>condition1')
    console.log(condition2, '=====>condition2')
    console.log(condition3, '=====>condition3')
    console.log(condition4, '=====>condition4')
    console.log(condition5, '=====>condition5')
    return condition1&&condition2&&condition3&&condition4&&condition5
}
