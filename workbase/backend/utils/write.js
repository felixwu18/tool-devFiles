
const configsP = require('../data/bankuaiParts/粮酒行业')
var fs = require("fs"); //文件模块
(function writeD() {
    let writePath = 'F:\\stock\\backend\\paData\\data\\bankuaiParts\\粮酒行业.js'; //生成目录
    const formatD = configsP.map(item => {
        return {
            key: `${item.key[0] === '6' ? 1 : 0}.${item.key}`, // '0.000636' '1.603989'
            value: item.value,
            marketT: `${item.key[0] === '6' ? 'sh' : 'sz'}`
        }
    })
    console.log(formatD)
    fs.writeFile(writePath, JSON.stringify(formatD), function (err, m) {
        console.log(err, m)
    }); //将文件写入磁盘
})()

