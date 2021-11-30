// var fs = require("fs"); //文件模块

module.exports = function (req, res) {
    const { secid } = req.query
    const currentItem = true
    const err = false
    const data = '测试通过！'
    if (currentItem) {
        //从内存中读取文件
        if (err) {
            res.send(`文件读取失败`);
            // console.log(err)
            console.log(`读取失败`)
        } else {
            res.send(data)
            console.log(`读取成功`)
        }
    }
  }