import { ControllerBase, Inject, Prop } from 'prism-web';

export class ReceipIssueController extends ControllerBase {
  private temp = {
    style: require('../../style/documentHandle/lowerHairIssue.less')
  };
  constructor() {
    super();
  }

  @Inject('http') http: any;
  // message实体
  private messageDom: any = null;
  //tab信息
  private tab: string;
  //判断是否有数据
  private editId: String;
  //向弹出框传递参数
  private propsData: Object = {};
  private checkPage: string = '1';
  private titleData = '下发公文';
  //处理过程参数
  private handlelist = [];
  private activeNamex = 'first'; //tab栏选中

  // 联系人下拉数据
  private concatPersonList = []
  private processid = '';
  //向弹出框配置参数
  private dialogConfig: Object = {
    viewDialog: false, //弹框是否显示
    templateName: '', //弹框组件名
    tilteName: '' ,//标题头
    propsData:{}//内容
  };

  // 验证规则
  private rules = {
    documentTitle:[
      {required:true,message:'该字段为必填字段',trigger:"blur"}
    ],
    contactPeopleName:[
      {trigger:"blur"}
    ],
    contactPhone:[
      {trigger:"blur"}
    ],
    content:[
      {required:true,message:'该字段为必填字段',trigger:"blur"}
    ]
 }

  private formdata = {
      attachmentList: [], //附件列表
      contactPeopleName: '', //联系人
      contactPhone: '', //联系电话
      content: '', //内容
      documentProgressStatus: '4', //公文状态 未处理-1|已接收-2|已退回-3|草稿-4
      documentTitle: '', //公文标题
      downSendingId: '', //主键
      receiveName: '', //接收人名称
      receiveUnitCode: '', //接受发送单位code
      receiveUnitName: '', //公文接收单位名称
      recevierId: '', //接收人id
      remarks: '', //备注
      upDowmType: '2' //公文操作状态 公文操作类型 公文上报-1|公文下发-2
  };
  created() {
    if (this.$route.query.id) {
      this.editId = this.$route.query.id.toString();
      this.getListData();
    }

    this.getConcatPerson()
  }

  // 获取列表数据
  getListData() {
    if (this.editId) {
      let publi = {publicId:this.$route.query.id}
      this.http.DocumentHandleRequest.getdutyInformationDetail(publi).then(
        res => {
          if (res.status == 200) {
            this.$set(this,'formdata',res.data)
          }
        }
      );
    }
  }

  /* author by chengyun 关闭弹框
   *  Modify by
   */
  closeDialogCall() {
    //关闭弹框
    this.dialogConfig['viewDialog'] = false;
  }

  handleClick(val) {}
  /* author by chengyun 保存草稿
   *  Modify by
   */
  addReportInfo() {
    this.formdata.documentProgressStatus = '4';
    let newData = this.formdata
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
        this.http.DocumentHandleRequest.receipIssueEdit(newData).then(res => {
          if (res.status == 200) {
            this.$message({
              type:"success",
              message:"编辑下发公文草稿成功"
            })
            this.goback();
          }else{
            this.$message({
              type:"success",
              message: res.msg
            })
          }
        });
      }
    });
  }
  // 返回按钮 by xinglu
  goback() {
    if (this.$route.query.tab) {
      this.tab = this.$route.query.tab.toString();
      this.$router.push(`/dutyManagement/documentHandle?tab=${this.tab}`);
    } else {
      this.$router.go(-1);
    }
  }

  private addReport(el: string, name: string) {
    this.dialogConfig['viewDialog'] = true;
    let data = {
      viewDialog: true,
      templateName: el,
      tilteName: name
    };
    this.$set(this, 'dialogConfig', data);
  }

  private addLower(el: string, name: string) {
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
  //分享
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
   * 获取联系人列表
   */
  getConcatPerson(){
    this.http.SelectNode.getOrgPersion().then(res => {
      this.$set(this,"concatPersonList",res.data)
    })
  }

  /**
   * Author by chenzheyu
   * 切换联系人关联联系电话
   * @param val 
   */
  changePhone(val) {
    let currentPerson = this.concatPersonList.filter(item => {
      return item.personName == val
    })[0]
    this.$set(this.formdata,'contactPhone',currentPerson['dutyNumber'])
  }
}
