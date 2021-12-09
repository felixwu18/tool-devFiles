/* 测试mysql */
const mysql = require('mysql'); // 导入mysql模块
module.exports = function (req, res) {
              const connection = mysql.createConnection({
                            host: "127.0.0.1",
                            port: "3306",
                            user: "root",
                            password: "root",
                            database: "db_test",
              });

              /* 连接数据库 */
              connection.connect(function (err) {
                            // console.log(err)
                  if (err) {
                                console.log("连接失败");
                  } else {
                                console.log("连接成功");
                  }
              }); // 启动链接 (连接提示)


              // const sql = `SELECT * FROM t_user_info`;
              const sql = `INSERT INTO t_user_info (id,name,age) VALUES(11,'Networkk',33);`;
            //   const sql = `DELETE FROM ceshi WHERE n='11';`;
              /* 向数据库查询 */
              connection.query(sql, function (err, result) {
                            console.log(result)
                            res.send(result);
              })

              /* 断开数据库连接 */
              connection.end(function (err) {
                            // console.log(err)
                            if (err) {
                                console.log("关闭连接失败");
                            } else {
                                console.log("--------------------------------------\n关闭连接成功");
                            }
              }); //操作完成后记得加上这句关闭数据库链接
}