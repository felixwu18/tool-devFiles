import { ControllerBase, Inject, Prop } from "prism-web";

export class TextFileEditController extends ControllerBase {
  constructor() {
    super();
  }
  private temp = {
    style: require("../../style/textFile/textFileEdit.less"),
  };
  @Inject("http") http: any;
  private activeNamex = "first";
  private editId: string = ""; //文章id
  private flag: boolean = false; //弹框显示参数
  private dialogVisible: boolean = false; //控制处理过程弹出框
  private dialogContent = false;
  private templateName: string = "";
  private tilteName: string = "";
  private propsData: Object = {};

  private typereport = {
    reportType: "",
  };

  //请求参数 xinglu
  private listParams = {
    id: "", //简报Id
    infoId: "", //事件Id
    reportContent: "", //简报内容
    reportTitle: "", //简报标题
  };

  private handlelist = []; //处理过程参数 程云

  created() {
    this.editId = this.$route.query.id as string;
    this.getText(this.editId);
    this.briefProcess(this.editId);
  }
  //弹出框参数
  private click(el: string, name: string) {
    this.flag = true;
    this.templateName = el;
    this.tilteName = name;
    this.propsData;
  }
  closeDialogCall() {
    //关闭保存弹框
    this.flag = false;
    //关闭处理过程弹窗
    this.briefProcess(this.editId);
  }
  //获取文本信息
  getText(id) {
    let briefDetail = { briefId: id };
    this.http.briefReportRequest.documentById(briefDetail).then((res) => {
      if (res.status == 200) {
        this.listParams.reportTitle = res.data.reportTitle;
        this.listParams.reportContent = res.data.reportContent;
        this.$set(this.propsData, "data", res.data);
      }
    });
  }
  //处理过程tab栏处理
  private handleClick(val) {}
  /**
   * author by xinglu 保存按钮
   */
  addReportInfo() {
    if (
      this.listParams.reportTitle.trim() == "" ||
      this.listParams.reportContent.trim() == ""
    ) {
      this.$message({
        message: "你还有信息未填写完毕！",
        type: "error",
      });
    } else {
          this.saveTextFile().then((res) => {
            if (res.status == 200) {
              this.$message({ type: "success", message: "保存成功" });
              this.$router.push({
                path: "/briefReport/textFile",
              });
            }else{
                this.$message({ type: "error", message: "保存失败" });
            }
          });
      // this.saveTextFile().then(res => {
      //     if (res.status == 200) {
      //         this.$confirm('文本编辑成功，是否生成简报？','提示').then((_) => {
      //             setTimeout(() => {
      //                 this.click('text-preservation', '生成简报')
      //             }, 500)
      //         }).catch(() => {
      //             this.briefProcess(res.data);
      //         })
      //     }
      // })
    }
  }
  /**
   * author by xinglu 生成简报按钮
   */
  createBrief() {
    if (
      this.listParams.reportTitle.trim() == "" ||
      this.listParams.reportContent.trim() == ""
    ) {
      this.$message.warning("标题与内容不能为空！");
      return;
    }
    this.click("text-preservation", "生成简报");
    // this.saveTextFile()
    //     .then(res => {
    //         if (res.status == 200) {
    //             this.click('text-preservation', '生成简报')
    //         }
    //     })
  }
  /**
   * author by xinglu 保存发送请求
   */
  saveTextFile() {
    this.listParams.id = this.editId;
    return this.http.briefReportRequest
      .documentModify(this.listParams)
      .then((res) => {
        if (res.status == 200) {
          return res;
        }
      });
  }
  /*
   * Author by chengyun 获取处理过程
   * Modify by chengyun
   */
  briefProcess(id) {
    let briefProcessDetail = { briefId: id };
    this.http.briefReportRequest
      .briefProcess(briefProcessDetail)
      .then((res) => {
        if (res.status == 200) {
          this.handlelist = res.data;
        }
      });
  }
  /*
   * Author by chengyun 处理过程弹框事件
   * Modify by chengyun
   */
  textDialog(data) {
    this.dialogVisible = true;
    this.dialogContent = data;
  }
}
