/* 计算20均线 */
module.exports = function today20Average(data, days = 20) {
    // for (let i = 0; i < days; i++) {
        const every = data.slice(0, 20); // 动态获取每天前20天收盘价
        const average = to20Average(every) // 计算出每天的布林通道上轨(包括其他指标)
    //     averages.push(average)
    // }
    return average
};

function to20Average(data) {
    // "2020-12-10, 168.00, 169.52, 171.66, 166.02, 370436, 6243808768.00, 3.26, -2.15, -3.72, 3.23"
    // index 开盘价 1 收盘价 2 最高价 3 最低价 4 成交量 5 成交额 6 振幅(当天最高最低差额/前一天收盘价) 7 涨跌幅 8 涨跌额 9 换手率 10
    let sum20 = null;
    let average20 = null
    const price20 = []
    let std = null
    data.forEach((str, index) => { // 降序时间
        const todayPrice = str.split(',')[2] // 取收盘价
        sum20 += todayPrice * 1
        price20.push(todayPrice)
    })
    /* 计算出当天最高百分点 */
    // const todayTopP = data[0].split(',')[3] // 当天最高价
    // const todayLowP = data[0].split(',')[4] // 当天最低价
    // const yesterdaySPJ = data[1].split(',')[2] // 昨天收盘价
    // const topDot = ((todayTopP - yesterdaySPJ) / yesterdaySPJ * 100).toFixed(2) // 最高价点数
    // const lowDot = ((todayLowP - yesterdaySPJ) / yesterdaySPJ * 100).toFixed(2) // 最低价点数
    /* 每天的振幅 */
    // const todayZF = data[0].split(',')[7]

    /* 每天的涨跌幅 */
    // const todayZDF = data[0].split(',')[8]

    /* 处理当天最高价，对低价 对应的分明 格式： 14:42 => 14-42  */
    // let TopPtime = '-', LowPtime = '-'
    // if (data[0].split(',')[11]) {
    //     TopPtime = data[0].split(',')[11].replace(/:/, '.')
    //     LowPtime = data[0].split(',')[12].replace(/:/, '.')
    // }

    average20 = (sum20 / 20).toFixed(2) * 1 // 当天20均
    std = getStd(price20) * 1 // 计算标准差

    /* 距20均偏移率 */
    // const toAverage20Ratio = ((data[0].split(',')[2] - average20) / average20 * 100).toFixed(2)

    /* 组装数据 */
    // const todayInfos = data[0].split(',')
    return {
        // date: todayInfos[0],
        upper: (average20 * 1 + 2 * std * 1).toFixed(2),  // 布林通道上轨
        // lower: (average20 * 1 - 2 * std * 1).toFixed(2),  // 布林通道下轨
        // currentP: todayInfos[2],
        average20, // 当天20均价格(MD)
        // topDot, // 最高点数
        // lowDot, // 最低点数
        // todayZF, // 当天的振幅
        // todayZDF, // 当天的涨跌幅
        // TopPtime, // 当天最高价对应的分时
        // LowPtime, // 当天最低价对应的分时
        // toAverage20Ratio, // 当天价到20均的偏移量
    }
}


/* 标准差 */
function getStd(arr) {
    var sum = function (x, y) { return x * 1 + y * 1; };　　//求和函数
    var square = function (x) { return x * x; };　　//数组中每个元素求它的平方
    // var arr = [1,1,3,5,5];　　//
    var mean = arr.reduce(sum) / arr.length;
    var deviations = arr.map(function (x) { return x - mean; });
    var stddev = Math.sqrt(deviations.map(square).reduce(sum) / (arr.length - 1));
    return stddev.toFixed(2)
}