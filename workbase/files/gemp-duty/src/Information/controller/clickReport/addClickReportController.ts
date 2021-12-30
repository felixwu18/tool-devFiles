import { ControllerBase, Inject } from 'prism-web';
import { downloadFuncs , timeFormat} from '../../../../assets/libs/commonUtils'

export class AddClickReportController extends ControllerBase {

    constructor() {
        super();
    }

    @Inject('http') http: any;
    private temp = {
        style: require('../../style/clickReport/oneClickReport.less'),
    };
    private pickerOptions = {
        disabledDate: (time) => {
            // return time.getTime() < Date.now() - 60 * 60 * 24 * 1000;
            return time.getTime() > Date.now();
        },
    };
    private reportParams = {
        quickTitle: "",//事件标题 
        quickTime:timeFormat(new Date()),//上报日期
        quickContent: "",//内容
        attachmentList: []//信息附件
    }
    // 重报参数
  //   private reReportParams = {
  //     quickId: this.$route.query.id || '',
  //     quickTitle: "",//事件标题 
  //     quickTime:timeFormat(new Date()),//上报日期
  //     quickContent: "",//内容
  //     attachmentList: []//信息附件
  // }
    private messageDom: any = null // message实体
    private msgData: any = {
        limit:'office'
      }
    private rules = {
        quickTitle: [
            { required: true, message: "请输入事件标题", trigger: "blur" }
        ],
        quickTime: [
            { required: false, message: "请输入上报日期", trigger: "blur" }
        ],
        quickContent: [
            { required: false, message: "请输入内容", trigger: "blur" }
        ],
        // attachmentList: [
        //     { required: true, message: "请输入事件标题", trigger: "blur" }
        // ],
    }
    created() {
      // console.log(this.$route.query.id, 9999)
      // 重报进入
      if (this.$route.query.id) {
        this.getDedailsData()
      }
    }
    /**
     * 一键上报
     */
    addReport() { 
        // this.reportParams.quickTime =  new Date(this.reportParams.quickTime).toUTCString()
        if (this.reportParams['quickContent'].length > 500) {
            if (this.messageDom) {
              this.messageDom.close();
            }
            this.messageDom = this.$message({
              type: 'warning',
              message: '内容最大长度为500',
            });
            return false;
        }
        if (!this.reportParams['quickTitle']) {
            if (this.messageDom) {
              this.messageDom.close();
            }
            this.messageDom = this.$message({
              type: 'warning',
              message: '请填写标题',
            });
            return false;
          }else {
            if (this.reportParams['quickTitle'].length > 50) {
              if (this.messageDom) {
                this.messageDom.close();
              }
              this.messageDom = this.$message({
                type: 'warning',
                message: '标题最大长度为50',
              });
              return false;
            } else {
            this.$refs.reportform["validate"]((valid) => {
                if (valid) {
                    if (this.$route.query.id) {
                      let reReportParams = {
                        quickId: this.$route.query.id || "",
                        quickTitle: this.reportParams.quickTitle ,//事件标题 
                        quickTime:this.reportParams.quickTime,//上报日期
                        quickContent: this.reportParams.quickContent,//内容
                        attachmentList: this.reportParams.attachmentList//信息附件
                      }
                      this.http.ClickReportRequest.addReport(reReportParams).then(res=>{
                        if(res.status == 200) {
                            this.$message.success("重报成功")
                            this.$router.push({path:"/information/oneclickReport"})
                        }
                      })
                    } else {
                      this.http.ClickReportRequest.addQuickQuick(this.reportParams).then(res=>{
                        if(res.status == 200) {
                            this.$message.success("保存成功")
                            this.$router.push({path:"/information/oneclickReport"})
                        }
                      })
                    }
                }
            })
            }
          }
    }
    /**
     * 下载模板
     */
    downloadFiles(e) {
        e.preventDefault()
        this.http.ClickReportRequest.quickExport().then((res) => {
            if (res.url) {
                downloadFuncs(res)
            }
        })
    }
    /**
     * 获取详情数据
     */
    async getDedailsData() {
      let params = {
          quickId: this.$route.query.id || ''
        }
      await this.http.ClickReportRequest.oneQuickOver(params).then(res=>{
          if(res.status == 200) {
              if(res.data){
                  if(!res.data.attachmentList){
                      res.data.attachmentList = []
                  }
                  this.$set(this,'reportParams',res.data)
              }
          }
      })
    }
}