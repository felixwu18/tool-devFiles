import { ControllerBase, Inject, Prop } from 'prism-web';

export class LowerHairInstructionsIssueController extends ControllerBase {
  private temp = {
    style: require('../../style/documentHandle/lowerHairInstructionsIssue.less')
  };
  constructor() {
    super();
  }

  @Inject('http') http: any;
  //判断是否有数据
  private editId: String;
  //处理过程参数
  private handlelist = [];
  //tab信息
  private tab: string;
  // message实体
  private messageDom: any = null;
  //向弹出框传递参数
  private propsData: Object = {};
  private checkPage: string = '1';
  private titleData = '批示公文';
  private activeNamex = 'first'; //tab栏选中

  private processid = '';

  //向弹出框配置参数
  private dialogConfig: Object = {
    viewDialog: false, //弹框是否显示
    templateName: '', //弹框组件名
    tilteName: '',//标题头
    propsData: {}//内容
  };

  private instructionEvents = [] // 批示事件列表
  private formdata = {
    content: '', //批示内容
    documentProgressStatus: '', //公文状态 未处理-1|已接收-2|已退回-3|草稿-4
    documentTitle: '', //公文标题
    receiveName: '', //接收人名称
    receiveUnitCode: '', //接受发送单位code
    receiveUnitName: '', //公文接收单位名称
    recevierId: '', //接收人id
    remarks: '', //备注
    reviewDate: '', //批示日期
    reviewEvent: '', //批示事件
    reviewLeaderId: '', //批示领导Id
    reviewLeaderName: '', //批示领导名称
    upDowmType: '2', //公文操作状态 公文操作类型 公文上报-1|公文下发-2
    attachmentList: [] //附件
  }

  private rules = {
    receiveName: [
      { required: true, message: '该字段为必填字段', trigger: "blur" }
    ],
    reviewDate: [
      { required: true, message: '该字段为必填字段', trigger: "blur" }
    ],
    documentTitle: [
      { required: true, message: '该字段为必填字段', trigger: "blur" }
    ],
    reviewEvent: [
      { required: true, message: '该字段为必填字段', trigger: "blur" }
    ],
    content: [
      { required: true, message: '该字段为必填字段', trigger: "blur" }
    ]
  }

  created() {
    if (this.$route.query.id) {
      this.editId = this.$route.query.id.toString();
      this.getListData();
    }
    this.getSelectNodes()
  }

  /* author by xinglu 获取列表数据
  *  Modify by 
  */
  getListData() {
    if (this.editId) {
      let publi = { publicId: this.$route.query.id, data: "" }
      this.http.DocumentHandleRequest.getdutyInformationDetail(publi).then(
        res => {
          if (res.status == 200) {
            res.data.reviewDate = res.data.reviewDate.replace(/\-/g, '/')
            this.formdata = res.data;

          }
        }
      );
    }
  }

  /**
   * author by xinglu 获取下拉批示事件列表
   */
  getSelectNodes() {
    this.http.SelectNode.getUptypeList().then(res => {
      if (res.status == 200) {
        this.instructionEvents = res.data
      }
    })
  }

  /* author by chengyun 关闭弹框
   *  Modify by
   */
  closeDialogCall() {
    //关闭弹框
    this.dialogConfig['viewDialog'] = false;
  }
  /* author by chengyun tab栏选中
   *  Modify by chenzheyu
   */
  handleClick(val) { }
  /* author by chengyun 保存草稿
   *  Modify by chenzheyu
   */
  addReportInfo() {
    this.formdata.documentProgressStatus = '4';
    let newData = this.formdata;
    this.$refs.simpleTable['validate'](valid => {
      if (!valid) {
        if (this.messageDom) {
          this.messageDom.close();
        }
        this.messageDom = this.$message({
          type: 'warning',
          message: '您还有未填字段'
        });
        return false;
      } else {
        this.http.DocumentHandleRequest.receipInstructsIssueAdd(newData).then(
          res => {
            if (res.status == 200) {
              this.$message({
                type: "success",
                message: "保存草稿成功"
              })
              this.goback();
            }
          }
        );
      }
    });
  }
  /* author by xinglu 返回按钮
  *  Modify by 
  */
  goback() {
    if (this.$route.query.tab) {
      this.tab = this.$route.query.tab.toString();
      this.$router.push(`/dutyManagement/documentHandle?tab=${this.tab}`);
    } else {
      this.$router.go(-1);
    }
  }
  /* author by  上报按钮
  *  Modify by 
  */
  private addReport(el: string, name: string) {
    this.dialogConfig['viewDialog'] = true;
    let data = {
      viewDialog: true,
      templateName: el,
      tilteName: name
    };
    this.$set(this, 'dialogConfig', data);
  }
  /* author by  下发按钮
  *  Modify by 
  */
  private addLower() {
    this.$refs.simpleTable['validate'](valid => {
      if (!valid) {
        if (this.messageDom) {
          this.messageDom.close();
        }
        this.messageDom = this.$message({
          type: 'warning',
          message: '您还有未填字段'
        });
        return false;
      } else {
        this.dialogConfig['viewDialog'] = true;
        this.dialogConfig['propsData'] = this.formdata;
        this.dialogConfig['tilteName'] = '下发';
        this.dialogConfig['templateName'] = 'lower-haire-report';
        // console.log(this.listparams);
      }
    });
  }
  /* author by  分享按钮
  *  Modify by 
  */
  private shareInformatiom(el: string, name: string) {
    this.dialogConfig['viewDialog'] = true;
    let data = {
      viewDialog: true,
      templateName: el,
      tilteName: name
    };
    this.$set(this, 'dialogConfig', data);
  }

  /**
   * Author by chenzheyu
   * 切换批示事件关联批示领导
   * @param val 
   */
  changeLeader(val) {
    let currentVal = this.instructionEvents.filter(item => {
      return item.publicId == val
    })[0]
    console.log(currentVal)
    this.$set(this.formdata, 'reviewLeaderName', currentVal['receiveName'])
    this.$set(this.formdata, 'reviewLeaderId', currentVal['recevierId'])
  }

}
