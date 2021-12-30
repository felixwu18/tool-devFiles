import { ControllerBase, Inject } from "prism-web";
import searchSession from "../../../../assets/libs/searchData";

export class TextFileListController extends ControllerBase {
  constructor() {
    super();
  }

  private temp = {
    style: require("../../style/textFile/textFileList.less"),
  };

  @Inject("http") http: any;
  @Inject("store") store: any;
  private showSearch: Boolean = false; //展示高级搜索
  private viewDialog: boolean = false;
  private templateName: string = "";
  private tilteName: string = "";
  private propsData: Object = {};
  private flag: boolean = false; //弹框显示参数
  private messageDom: any = null; //message实体
  //按钮控制
  private btnConfig = {
    add: false, //新增
    all: false, //查看未读
    read: false, //标为已读
    search: false, //搜索
    accurateSearch: false, //精准搜索
  };
  // 默认显示查看全部
  private readSign: string = "查看全部";
  // 列表时间查询参数
  private search_time: Array<any> = [];
  // 列表查询参数
  private searchData: object = {
    deleteFlag: "0", //查看删除/所有
    endTime: "", //结束时间
    keyWord: "", //查询关键字,默认查询标题
    listOrder: {}, //排序参数
    nowPage: 1, //当前页数
    pageSize: 10, //每页条数
    reportType: [
      "TEXT", //简报类型
    ],
    startTime: "", //开始时间
    unreadStatus: "", //是否未读
  };
  //列表已读请求参数
  private alreadyRead: string = "TEXT";
  // 当前角色级别
  private roleLevel: boolean;
  // 当前角色信息
  private role: object;
  // 按钮功能数组
  private btnGroup: object = {
    edit: { name: "编辑", emit: "edit", type: "primary", expression: true },
    delete: {
      name: "删除",
      emit: "delete",
      el: "return-report",
      type: "danger",
      expression: true,
    },
    createBrief: {
      name: "生成简报",
      emit: "createBrief",
      type: "primary",
      expression: true,
    },
  };
  // 事件类型列表
  typeList: Array<any> = [];
  //删除弹框
  private dialogOption = {
    flag: false,
    titleName: "删除原因",
    componentName: "",
    propsData: {},
  };
  created() {
    this.store.dispatch("brief/setTextfile", this.searchData);
    this.refresh();
    this.getListData();
    this.btnManagement();
  }
  activated() {}

  /**
   * author by huihui生成简报按钮
   */
  //弹出框参数
  private click(el: string, name: string) {
    this.flag = true;
    this.templateName = el;
    this.tilteName = name;
    this.propsData;
  }
  closeDialogCallTwo() {
    //关闭保存弹框
    this.flag = false
}
  createBrief(res) {
    this.$set(this.propsData, "data", res.rowVal);
    // if (this.propsData.reportTitle.trim() == '' || this.propsData.reportContent.trim() == '') {
    //   this.$message.warning('标题与内容不能为空！')
    //   return
    // }
    this.click("text-preservation", "生成简报");
  }
  /**
   *  author by xinglu 获取当前菜单的按钮权限
   *  @param{
   *    menuId: "",  //菜单id
   *    userId: "", //当前登录用户的id
   *  }
   */
  btnManagement() {
    var userInfo = searchSession.getter({ name: "role" });
    let params = {
      menuId: "2c9287db6e7e3851016e8295821d03ad",
      userId: userInfo["userId"],
    };
    this.http.PowerNodeRequest.btnPowerManagement(params).then((res) => {
      if (res.status == 200) {
        // console.log(res);
        res.data.forEach((data) => {
          switch (data.privName) {
            case "新增":
              this.btnConfig.add = true;
              break;
            case "查看全部":
              this.btnConfig.all = true;
              break;
            case "标为已读":
              this.btnConfig.read = true;
              break;
            case "搜索":
              this.btnConfig.search = true;
              break;
            case "精准搜索":
              this.btnConfig.accurateSearch = true;
              break;
          }
        });
      }
    });
  }
  private propData = {
    isCheck: false,
    pageSize: 10,
    total: 0,
    config: [
      {
        type: "link",
        label: "公文标题",
        basehref: "/briefReport/textFileDetail",
        passProp: "id",
        width: "/",
        prop: "reportTitle",
        badge: true,
        emit: "showDelTip",
      },
      {
        type: "string",
        label: "创建人",
        width: "/",
        prop: "creatorName",
      },
      {
        type: "string",
        label: "更新时间",
        width: "/",
        prop: "updateTime",
      },
      {
        type: "button",
        label: "操作",
        width: "240",
        prop: "operate",
      },
    ],

    data: [],
  };

  // getOrg(val) {
  //   this.$set(this.searchData, 'orgCode', val)
  // }

  // changeEvent(val) {
  //   this.$set(this.searchData, 'eventType', val)
  // }
  /**
   * author by xinglu 实时刷新
   */
  refresh() {
    this.on("reportAddId", (data) => {});
  }
  /**
   * 查看未删  查看全部 author by xinglu
   */
  searchUnread() {
    if (this.readSign == "查看全部") {
      this.searchData["deleteFlag"] = "";
      this.readSign = "查看未删";
    } else {
      this.searchData["deleteFlag"] = "0";
      this.readSign = "查看全部";
    }
    this.store.dispatch("brief/setTextfile", this.searchData);
    this.getListData();
  }
  /**
   * 获取列表数据
   * author by xinglu
   */
  getListData() {
    this.http.briefReportRequest
      .briefList(this.store.getters["brief/getTextfile"])
      .then((res) => {
        // console.log(res);
        if ((res.status = 200)) {
          this.propData.total = res.data.total;
          this.propData.pageSize = res.data.pageSize;
          this.propData.data = res.data.list.map((item, index) => {
            item.deleteFlag = Number(item.deleteFlag);
            item.operate = this.btnGroup;
            if (item.deleteFlag == 0) {
              item.operate = JSON.parse(JSON.stringify(this.btnGroup));
            } else {
              item.operate = {};
            }
            return item;
          });
        }
        this.tabUnread({
          unReadTotalCount: res.data.unReadTotalCount,
          type: "文本文件",
        });
      });
  }
  /**
   * 列表按钮点击响应
   * author by xinglu
   */
  tablecallback(data) {
    this[data.type](data);
  }
  /**
   * 列表按钮点击响应
   * author by xinglu
   */
  // 翻页功能 author by xinglu
  handlePageChange(data) {
    this.searchData["nowPage"] = data.rowVal;
    this.store.dispatch("brief/setTextfile", { nowPage: data.rowVal });
    this.getListData();
  }
  /**
   * 列表按钮点击响应
   * author by xinglu
   */
  // 编辑功能 author by xinglu
  edit(data) {
    this.$router.push({
      path: "/briefReport/textFileEdit",
      query: { id: data.rowVal.id },
    });
  }
  /**
   * 列表按钮点击响应
   * author by xinglu
   */
  //删除 author by xinglu
  delete(data) {
    setTimeout(() => {
      this.dialogOption.flag = true;
      this.dialogOption.titleName = "删除原因";
      this.dialogOption.componentName = "deleteBrief-brief";
      this.dialogOption.propsData = data.rowVal;
    }, 350);
  }

  /**
   * 关闭弹框
   * author by xinglu
   */
  closeDialogCall(callInfo) {
    //关闭弹框
    this.dialogOption.flag = false;
    //重新刷新当前页面数据
    this.getListData();
  }
  /**
   * 排序功能
   * author by xinglu
   */
  sort(data) {
    this.$set(this.searchData, "listOrder", data.rowVal);
    this.store.dispatch("brief/setTextfile", { listOrder: data.rowVal });
    this.getListData();
  }
  /**
   * 已删除数据类名更改
   * author by xinglu
   */
  tableRowClassName({ row, rowIndex }) {
    if (row.deleteFlag == 1) {
      return "delete_data";
    }
  }
  /**
   * 已删除信息提示
   * author by xinglu
   */
  showDelTip() {
    if (this.messageDom) {
      this.messageDom.close();
    }
    this.messageDom = this.$message("该信息已被删除!");
  }
  /**
   * tab组件展示未读数功能
   * author by xinglu
   */
  tabUnread(obj: object) {
    this.emit("briefunread", obj);
  }
  /**
   * 标为已读
   * author by xinglu
   */
  signReaded() {
    this.$confirm("此操作将把所有未读消息一键标为已读，是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      confirmButtonClass: "confirmButtonClass",
      cancelButtonClass: "confirmButtonClass",
    })
      .then(() => {
        let reportParams = { reportType: this.alreadyRead };
        this.http.briefReportRequest.clean(reportParams).then((res) => {
          if (res.status == 200) {
            this.emit("read", true);
            this.getListData();
            this.$message({
              type: "success",
              message: "操作成功",
            });
          }
        });
      })
      .catch(() => {
        this.$message({
          message: "已取消操作",
        });
      });
  }
  /**
   * 精准搜索功能
   * author by xinglu
   */
  getListDataByExact() {
    if (this.search_time) {
      this.searchData["startTime"] = this.search_time[0];
      this.searchData["endTime"] = this.search_time[1];
    } else {
      this.searchData["startTime"] = "";
      this.searchData["endTime"] = "";
    }
    this.store.dispatch("brief/setTextfile", this.searchData);
    this.getListData();
  }

  // 快速检索
  quickSearch() {
    this.searchData["nowPage"] = 1;
    this.store.dispatch("brief/setTextfile", this.searchData);
    this.getListData();
  }
}
