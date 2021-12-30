# iams-web

前端系统



## 项目如何同步产品的最新代码

```shell
# 检出fork的项目代码
# git clone http://xxx.git

# 添加产品仓库remote product
cd gemp-duty
git remote add product http://devops.wh.gsafety.com/git/gemp/gemp-web/gemp-duty.git

# 查看远程仓库状态，此时本地会有2个远端分支origin(项目), product(产品)
git remote -v

# 同步产品master分支代码（稳定）
git pull product master

# 同步代码develop分支代码（最新），可选，必须和master一致
git pull product develop

# 检查确认后，将最新代码推送项目分支
# git push origin master

```