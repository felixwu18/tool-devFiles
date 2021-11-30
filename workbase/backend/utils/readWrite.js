
// var createDir = require("./utils/createDir")
var fs = require("fs"); //文件模块
/* 创建文件夹, 传入文件夹路径 */
// createDir('./upload')
//通过foreach方法将文件数组中的所有文件全部读出并保存
// req.files.forEach(function (ele, i, arr) {
// const file = path.join(__dirname, 'data/20201206HSA.json');
module.exports = function writeD() {
    const file = './data/20201206HSA.json';
    // let writePath = __dirname + "/data/" + 'HSAFormat.json'; //生成目录
    let writePath = 'F:\\stock\\backend\\paData\\data\\HSAFormat.json'; //生成目录
    // 'F:\stock\backend\paData\data\HSAFormat.json
    //从内存中读取文件
    fs.readFile(file, 'utf-8', (err, data) => {
        if (err) {
            res.send('文件读取失败');
            console.log(err)
        } else {
            console.log(data)
            const originD = JSON.parse(data).diff
            // console.log(originD.diff)
            const formatD = originD.map(item => {
                return {
                    key: `${item.f12[0] === '6' ? 1 : 0}.${item.f12}`, // '0.000636' '1.603989'
                    value: item.f14,
                    marketT: `${item.f12[0] === '6' ? 'sh' : 'sz'}`
                }
            })
            console.log(formatD, '<==写入数据成功')
            fs.writeFile(writePath, JSON.stringify(formatD), function (err, m) {
               console.log(err, m)
            }); //将文件写入磁盘
        }
    });
    // });

}

