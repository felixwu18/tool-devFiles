/* 分时稳步上行 */
module.exports = function wbsxSelect(data, length) {
    if(typeof data !== 'object') { return }
    const latest30minsP = length ? data.slice(0, length) : data // 时间降序 一般10点钟取
    // '2020-12-11 14:49, 101.33, 101.36, 101.43, 101.30, 1011, 10248174.00, 101.562'
    // index 开盘价 1 收盘价 2 最高价 3 最低价 4 成交量 5 成交额 6 分时均线 7
    const spj30Arr = latest30minsP.map(item => item.split(',')[2]) // 时间段分分钟收盘价
    const kpj30Arr = latest30minsP.map(item => item.split(',')[1]) // 时间段分分钟开盘价
    let dfwinCount = 1 // 后1min高出前1min的次数
    for(let i = 0; i < spj30Arr.length; i++) {
        if (spj30Arr[i] - spj30Arr[i + 1] > 0) { // 后1min - 前1min
            dfwinCount++
        }
    }
    const condition1 = (dfwinCount / spj30Arr.length).toFixed(2) > 0.7 // 生出7成以上
    const condition2 = ((spj30Arr[0] - kpj30Arr[kpj30Arr.length - 1]) / kpj30Arr[kpj30Arr.length - 1]).toFixed(2) < 0.4
    console.log(spj30Arr, '=====>spj30Arr')
    console.log(kpj30Arr, '=====>kpj30Arr')
    console.log(dfwinCount, '=====>dfwinCount')
    console.log((dfwinCount / spj30Arr.length).toFixed(2), '=====>(dfwinCount / spj30Arr.length).toFixed(2)')
    console.log(condition1, '=====>condition1')
    console.log(condition2, '=====>condition2')

    return condition1&&condition2
}
