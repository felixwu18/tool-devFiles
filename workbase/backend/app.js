// ----------------   引用模块   -----------------//
var express = require('express');
var app = express();

// 中间件
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '25mb'})); // 将中间件注入express, post 接受参数必须加入
// app.use(express.urlencoded({limit: '25mb'}));

//设置跨域访问（设置在所有的请求前面即可）
app.all("*", function (req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers", "content-type");
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  if (req.method == 'OPTIONS')
  res.send(200); //让options尝试请求快速结束
  else
  next();
});


// var writeD = require("./utils/readWrite"); // 读写
// writeD()

//  require路由
// var setCacheFSPRoute = require("./routes/setCacheFSP"); // 写入缓存分时回调
var getCacheFSPRoute = require("./routes/getCacheFSP"); // 读取缓存分时回调

// ------------------ 接口  ----------------------//

// app.post('/setCacheFSP', getCacheFSPRoute) // 测试post
app.get('/getCacheFSP', getCacheFSPRoute) // 获取数据
app.post('/getCacheFSP', getCacheFSPRoute) // 获取数据



// ----------------   监听端口   ------------------//
//监听
var server = app.listen(4000, function () {
  var port = server.address().port
  console.log(`引用实例,访问地址为 http://127.0.0.1:${port}`);
});

