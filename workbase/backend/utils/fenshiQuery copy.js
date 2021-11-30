/* 查询单个股分时价接口*/
var axios = require("axios");
// var download = require("../utils/http");

module.exports = function fenshiQuery(params) {
    return new Promise((resolve => {
        /*secid id   _ 更新最新数据*/
        const updateTime = Date.now() // 更新
        const { secid = '0.002594', ndays, updateTime: _ = updateTime } = params;
        const service = 'http://push2.eastmoney.com/api/qt/stock/trends2/get'
        // const service = 'http://push2his.eastmoney.com/api/qt/stock/trends2/get'
        const urlParams = `fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13&fields2=f51,f52,f53,f54,f55,f56,f57,f58&ut=fa5fd1943c7b386f172d6893dbfba10b&ndays=${ndays}&iscr=0&secid=${secid}&_=${_}`
        // http://push2.eastmoney.com/api/qt/stock/trends2/get?fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13
        // &fields2=f51,f52,f53,f54,f55,f56,f57,f58&ut=fa5fd1943c7b386f172d6893dbfba10b
        // &ndays=1&iscr=0&secid=0.002594&cb=jQuery112406570221374152183_1611151323925
        // &_=1611151323935
        // http://push2.eastmoney.com/api/qt/stock/trends2/get?fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13&fields2=f51,f52,f53,f54,f55,f56,f57,f58&ut=fa5fd1943c7b386f172d6893dbfba10b&ndays=1&iscr=0&secid=0.002594&cb=jQuery1124042171165613532424_1611152298670&_=1611152298682
        const url = `${service}?${urlParams}`
        
        axios.get(url)
            .then(res => {
                // console.log(res.data.data, '===>res.data.data')
                resolve(res.data.data);
                // setTimeout(() => {
                //     console.log(res.data, 'res.data<=======')
                // }, 300)
            })
            .catch(err => {
                console.error('error', err)
            })
        // download(url, res => {
        //     console.log(url, 'url')
        //     console.log(res, 'url')
        //     resolve(res);
        // })
    }))
}