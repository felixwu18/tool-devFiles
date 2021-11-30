
var fs = require("fs");
// 定义创建上传文件夹的方法
module.exports = function(folder){
    try{
        fs.accessSync(folder); 
    }catch(e){
        fs.mkdirSync(folder);
    }
};

// var uploadFolder = './file_upload/'; // 指定文件夹路径（）

// createFolder(uploadFolder);
