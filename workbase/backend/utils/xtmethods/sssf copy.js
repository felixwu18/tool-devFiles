/* 上升三三法 */
module.exports = function sssfSelect(data) {
    if(typeof data !== 'object') { return }
    const latest3DaysP = data.slice(0, 4) // 时间降序
    const maxArr = latest3DaysP.map(item => item.split(',')[3])
    const minArr = latest3DaysP.map(item => item.split(',')[4])
    const dyArr = latest3DaysP[3].split(',') // 大阳线数据
    const dyStartP = dyArr[1] // 开盘价 index 1
    const condition1 = dyArr[9] > 5 // 涨幅 index 9
    const condition2 = maxArr[3] > maxArr[2] && maxArr[3] > maxArr[1] && maxArr[3] > maxArr[0]
    const condition3 = dyStartP < minArr[2] && dyStartP < minArr[1] && dyStartP < minArr[0]
    return condition1&&condition2&&condition3
}