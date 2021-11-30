var axios = require("axios");

/* 调取其他接口数据 */
module.exports = function axiosFetch(params = {}) {
    return new Promise((resolve => {
        const updateTime = Date.now() // 更新
        const { secid = '0.002594', updateTime: _ = updateTime } = params;
        const service = 'http://55.push2his.eastmoney.com/api/qt/stock/kline/get'
        const urlParams = `secid=${secid}&ut=fa5fd1943c7b386f172d6893dbfba10b&fields1=f1%2Cf2%2Cf3%2Cf4%2Cf5%2Cf6&fields2=f51%2Cf52%2Cf53%2Cf54%2Cf55%2Cf56%2Cf57%2Cf58%2Cf59%2Cf60%2Cf61&klt=101&fqt=0&end=20500101&lmt=120&_=${_}`
        const url = `${service}?${urlParams}`
        console.log(url, '<==url')
        axios.get(url)
            .then(res => {
                // // const jsonD = res.data.split('(')[1].split(')')[0]
                // const data = JSON.parse(res.data)
                resolve(res)
            })
            .catch(err => {
                console.error(err)
            })
    }))
}