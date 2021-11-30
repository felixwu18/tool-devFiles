/* 九阳洼地 */
module.exports = function sssfSelect(data) {
    if(typeof data !== 'object') { return }
    const latest9DaysP = data.slice(0, 9) // 时间降序
    for(let i = 0; i < latest9DaysP.length; i++) {
        const currentZF = latest9DaysP[i].split(',')[8] //涨幅 index 8
        if(currentZF > 3 || currentZF < -3) { // 确保小阴小阳
            return false
        }
    }
    const spjArr = latest9DaysP.map(item => item.split(',')[2]) // 收盘盘价
    const kpjArr = latest9DaysP.map(item => item.split(',')[1]) // 开盘价
    const xyxArr = latest9DaysP.filter(item => (item.split(',')[2] - item.split(',')[1]) < 0) // 阴线 收盘 - 开盘
    const condition1 = xyxArr.length < 3 // 最多两个阴线
    const condition2 = ((spjArr[0] - kpjArr[8]).toFixed(2) / kpjArr[8] * 100).toFixed(2) < 2 // 最新收盘价- 最开始的开盘价
    return condition1&&condition2
}
