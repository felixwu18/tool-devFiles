var http = require("http");
var https = require("https");
let httpOrHttps = http // 默认http

/* 调取其他接口数据 */
module.exports = function download(url, callback, type) {
  type && (httpOrHttps = https) // type非空 一般传1则https
  httpOrHttps.get(url, function (res) {
      var data = "";
      res.on('data', function (chunk) {
        data += chunk;
      });
      res.on("end", function () {
        callback(data);
      });
    })
    .on("error", function (error) {
      callback(error);
    });
}

