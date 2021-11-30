/* 上升三三法 */
module.exports = function sssfSelect(data) {
    if(typeof data !== 'object') { return }
    const latest3DaysP = data.slice(0, 4) // 时间降序
    const maxArr = latest3DaysP.map(item => item.split(',')[3])
    const minArr = latest3DaysP.map(item => item.split(',')[4])
    const condition1 = latest3DaysP[3].split(',').reverse()[2] > 5 // 开盘价 反序 index 1
    const condition2 = maxArr[3] > maxArr[2] && maxArr[3] > maxArr[1] && maxArr[3] > maxArr[0]
    const condition3 = minArr[3] < minArr[2] && minArr[3] < minArr[1] && minArr[3] < minArr[0]
    return condition1&&condition2&&condition3
}

// module.exports = function sssfSelect(data) {
//     if(typeof data !== 'object') { return }
//     const latest3DaysP = data.slice(0, 4) // 时间降序
//     const maxArr = latest3DaysP.map(item => item.split(',')[3])
//     const minArr = latest3DaysP.map(item => item.split(',')[4])
//     const startPArr = latest3DaysP.map(item => item.split(',')[1]) // 开盘价数组
//     const condition1 = latest3DaysP[3].split(',').reverse()[2] > 5 // 大阳线涨幅 反序 index 2
//     const condition2 = maxArr[3] > maxArr[2] && maxArr[3] > maxArr[1] && maxArr[3] > maxArr[0]
//     const condition3 = startPArr[3] < minArr[2] && startPArr[3] < minArr[1] && startPArr[3] < minArr[0]
//     return condition1&&condition2&&condition3
// }
// module.exports = function sssfSelect(data) {
//     if(typeof data !== 'object') { return }
//     const latest4DaysP = data.slice(0, 4) // 时间降序 截取最近四天数据
//     const maxArr = latest4DaysP.map(item => item.split(',')[3])
//     const minArr = latest4DaysP.map(item => item.split(',')[4])
//     const dyStartP = latest4DaysP[3].split(',')[1] // 开盘价 index 1
//     const condition1 = latest4DaysP[3].split(',')[1] > 5 // 涨幅 index 9
//     const condition2 = maxArr[3] > maxArr[2] && maxArr[3] > maxArr[1] && maxArr[3] > maxArr[0]
//     const condition3 = dyStartP < minArr[2] && dyStartP < minArr[1] && dyStartP < minArr[0]
//     return condition1&&condition2&&condition3
// }