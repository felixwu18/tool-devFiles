import { ControllerBase, Inject, Emit, Prop, Watch } from 'prism-web';
import searchSession from '../../../../assets/libs/searchData'
import { getRequestUrl } from '../../../../assets/libs/commonUtils'
const { nationList } = require('../../../../assets/libs/nation')
const matchFormRegex = require('../../../../assets/libs/matchFormRegex')


export class detailsMatterController extends ControllerBase {
  constructor() {
    super();
  }
  @Inject('http') http: any;
  @Inject('store') store: any
  @Inject("downloadFunc") downloadFunc: any;

  @Emit('getdata')
  childrengetInfoDetail(data) { }
  @Prop() tabtype:string;

  @Prop() mapupdatesize: boolean;
  private nationList: any = nationList;

  private addParmes = {
    xbId:null, // 续报ID
    attachmentList:[], // 附件
    infoDescription:'',// 续报内容
    deathNum: '', // 死亡人数
    seriousInjureNum: '', // 重伤人数
    minorInjureNum: '', //  轻伤人数
    woundNum: '', //  受伤人数
    lossNum: '', // 失踪
    trappedNum: '', // 受困
    eventLevelCode:'',
    eventType:''
  }
  private allDeathPersonId: Array<any> = []; // 所有伤亡人数的ID
  private editParmes:any = {}
  private beforeOpenListPop: any = {
    deathNum: 0, // 死亡人数
    seriousInjureNum: 0, // 重伤人数
    minorInjureNum: 0, // 轻伤人数
    woundNum: 0, // 受伤人数
    lossNum: 0, // 失踪人数
    trappedNum: 0, // 受困人数
  };
  private numType: any = {
    deathNum: '0', // 死亡
    seriousInjureNum: '1', // 重伤
    minorInjureNum: '2', // 轻伤
    woundNum: '3', // 受伤
    lossNum: '4', // 失踪
    trappedNum: '5', // 受困
    0: 'deathNum',
    1: 'seriousInjureNum',
    2: 'minorInjureNum',
    3: 'woundNum',
    4: 'deathNum',
    5: 'trappedNum',
  };
  private isSave: Boolean = false
  private reportList :any[] = [] // 续报列表
  private firstReport:any  = {}
  private phonePanelVisible: boolean = false // 拨号盘显隐控制
  private cbFlag:boolean = false // 是否展示呈报上报按钮
  //页面的信息详情id
  private  detailUrlinfoId:any
  // @Prop() expectDraft:boolean

  private temp = {
    style: require('../../style/infoManage/detailsMatter.less'),
  };
  private propId;
  //private expectDraft:boolean
  private flag: boolean = false;
  private ispersonSave: boolean = false; // 新增人员状态
  private ispersonAdd: boolean = false; // 新增人员状态
  private disabled: Boolean = false; //控制生成事件按钮禁用
  private role: Object = {};
  private orgCode: Object = {};
  private roleLevel: boolean;
  private expectDraft: Boolean = true;
  private activeNames = [];
  private data: Object = {};
  private status: Array<any> = ['一般', '较大', '重大'];
  //判断是否为本单位
  private isUnit: boolean = false
  private relativInfo: Array<any> = []; // 关联信息
  private handleInfo: Object = {
    instruction: [],
    propose: [],
    check: [],
    transfer: [],
    append: [],
  }; // 处理信息
  private sendContent:string = ''; // 默认填入的短信信息内容
  private messageDom: any = null;
  private sendBackFlag: boolean = false; // 退回按钮状态
  private signFlag: boolean = false; // 退回按钮状态
  private scaleList: Array<any> = []; // 事件等级
  private handleType:boolean = false
  // 短信弹窗标题
  private messageDialogTitle = '短信发送';
  // 短信弹窗是否显示
  private messageDialogShow: boolean = false;
  private currentInfoId:string = '';
  private userTenantId:any = ''
  private templateName: any = '';
  private tilteName: any = '';
  private returnId:any = '' // 退回ID
  @Watch('messageDialogShow')
  watchMessageDialog(val) {
    if(!val) {
      this.$set(this.messageDialogData,'sendContent',this.sendContent)
      this.telephoneString = ''
    }
  }

  // 短信弹窗数据
  private messageDialogData: any = {
    // "报送单位+报送人+'于'+报送时间+'报送'+信息标题+'信息' 例如：应急管理厅周飞于2020-02-29 12:51:16报送湖北省发生一起交通事故信息"
    sendContent: "",
    sendTitle: '',
    sendUserInfoDTOS: [{
      personId: '',
      personJob: '',
      personName: '',
      telNumber: ''
    }]
  }
  private sendContentStr = "";
  private callnumber = {
    centerFlag: "0",
    sendUserInfoDTOS: []
  } // 传值号码

  // 请求到的领导列表
  private leaderList: any = []
  // 被选中的领导列表
  private activeLeader = []

  // 输入的电话列表
  private telephoneString: any = ''

  // 分享的标题
  private shareTitle = "分享"
  // 分享弹窗是否显示
  private shareDialogShow: boolean = false;

  private mapInfo: Object = {
    // type: 'singleData'
    type: 'geometry-location',
  };

  // 子弹框组件参数
  private childrenComponent = {
    name: '',
    title: '',
    show: false,
  };
  //打印弹框可见
  private viewDialogPrint: boolean = false
  private docUrl = ""
  //回复意见 start

  //拟办意见 回复框内容
  private approvalContent: string = '';
  private proposeIndex: number = -1;
  //审核意见 回复框内容
  private checkContent: string = '';
  private checkIndex: number = -1;

  // QQ 微信弹窗活跃的index
  private activeIndex: string = '1'

  // QQ 微信分享框
  private shareIframeData: string = ''

  // 活跃ID
  private activeId: any = ''

  //人员列表弹框显示
  private personListDialog: Boolean = false;
  // 当前类型事故人员数
  private currentPersonNumber: Number = 0
  // 当前人员状态
  private currentPersonstatus: string = ""
  // 当前受伤人员类型
  private currentPersonType: string = ""
  // 人员列表数据
  private tableData: Array<any> = []
  private isAdd:Boolean = true // 编辑还是新增
  private manageDialog:boolean = false; // 信息处理弹框
  @Watch('mapupdatesize')
  getData(val) {
    // debugger
    // if (val === true) {
    setTimeout(this.updateMapSize, 2000)
    // }
  }
  get activeData() {
    return this.tableData.filter((item, index) => {
      return this.currentPersonType === item.type
    })
  }
  //签收
  private signFor(item) {
    console.log(item)
    this.$confirm('是否确认签收?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: "warning" }).then(() => {
      let infoParams = { infoId: item.infoId };
      this.http.GempInfoBaseRequest.signInfo(infoParams).then(res => {
        if (res.status == 200) {
          this.$message.success('操作成功')
          this.changeTabType('1')
          this.changeInfoId(item)
        }

      });
    }).catch(() => {
      this.$message({ type: "info", message: "已取消签收" })
    })

  }

  // 获取信息级别
  getInfoLevelList() {
    this.http.GempInfoBaseRequest.getInfoLevel({}).then(item => {
      if (item.status === 200) {
        this.scaleList = item.data
      }
    })
  }
  // 切换右侧处理过程的infoId
  changeInfoId(item) {
    this.currentInfoId = item.infoId
    this.emit('changeInfoId', this.currentInfoId)
  }
  // 信息处理弹框开启
  showManageDialog(data,type){
    this.handleType = type
    this.cbFlag = data.cbFlag;
    console.log(this.handleType)
    this.currentInfoId = data.infoId;
    this.manageDialog = true;
  }
  editSubmit(data){
    this.$confirm('是否确认提交?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      const parmes = JSON.parse(JSON.stringify(data))
      this.currentInfoId = data.infoId;
      parmes.reportDate = new Date(parmes.reportDate);
      parmes.incidentDate = new Date(parmes.incidentDate);
      this.http.GempInfoBaseRequest.copyReport(parmes).then(res => {
        if (res.status === 200) {
          this.currentInfoId = data.infoId;
          data.infoStatus = '1';
          this.$message.success('提交成功！')
        } else {
          this.$message({
            type: 'error',
            message: '提交失败!'
          })
        }
      })
    })
  }
  // 信息处理弹框关闭
  cancelPop() {
    this.manageDialog = false;
    this.relativeInfo(this.detailUrlinfoId);
    this.getInfoDetail(this.detailUrlinfoId);
    this.getHandleInfo(this.detailUrlinfoId);

  }
  // 编辑续报
  editContinue(data) {
    this.isAdd = false;
    if(this.tabtype !=='1') {
      this.editParmes = data
    }
    Object.keys(this.addParmes).forEach(item=>{
      if(item === 'xbId') {
        this.addParmes[item] = data.infoId
      }else{
        this.addParmes[item] = data[item]

      }
    })

  }
  // 0 保存 1 提交
  submit(type) {
    if(this.tabtype === '1') {
      if (!this.addParmes.infoDescription) {
        this.$message.warning('请输入续报内容')
        return
      }
      let parmes = { ...this.addParmes, infoStatus: type, infoId: this.detailUrlinfoId }
      this.http.DetailOperationsRequest.continueBaseInfo(parmes).then(res => {
        if (res.status === 200) {
          this.$message.success('操作成功！')
          this.changeTabType(this.tabtype)
        } else {
          this.$message.error(res.msg)
        }
      })
    }else{
      if (!this.addParmes.infoDescription) {
        this.$message.warning('请输入汇报内容')
        return
      }

      if(this.isAdd) {
        let parmes = {
          infoDescription: this.addParmes.infoDescription,
          attachmentList: this.addParmes.attachmentList,
          infoReportType: Number(this.tabtype) - 2,
          gempId: this.detailUrlinfoId,
          infoStatus: type,
          actId: '', // 后端判断是都是首次上传
          deleteflag: 0, // 0是未删除的数据
        }
        this.http.GempInfoBaseRequest.addActionInfo(parmes).then(res => {
          if (res.status === 200) {
            this.$message.success('操作成功！')
            this.changeTabType(this.tabtype)
          } else {
            this.$message.error('操作失败！')
          }
        })
      }else{
        this.editParmes.infoDescription = this.addParmes.infoDescription
        this.editParmes.attachmentList = this.addParmes.attachmentList
        this.editParmes.infoStatus = type
        this.http.GempInfoBaseRequest.eidtActionInfo(this.editParmes).then(res => {
          if (res.status === 200) {
            this.$message.success('操作成功！')
            this.changeTabType(this.tabtype)
          } else {
            this.$message.error('操作失败！')
          }
        })
      }

    }
  }
  // 点击编辑按钮
  private editPersonState(value) {
    if (this.ispersonSave === true) {
      (this.$message as any).closeAll();
      this.$message({
        type: 'warning',
        message: '请先保存再编辑！'
      })
      return
    }
    value.isEdit = true
    value.disabled = false
    this.ispersonSave = true
  }
  //草稿删除
  draftDelect(data) {
    this.$confirm('是否确认删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'confirmButtonClass',
      cancelButtonClass: 'confirmButtonClass',
    })
      .then(() => {
        if(this.tabtype === '1') {
          let infoParams = { infoId: data.infoId };
          this.http.DetailOperationsRequest.remove(infoParams).then((res) => {
            if (res.status == 200) {
              this.$message.success('操作成功！')
              this.changeTabType(this.tabtype)
            } else {
              this.$message({
                message: '删除失败',
                type: 'error',
              });
            }
          });
        }else{
          let parmes = {
            infoStatus: 0,
            infoReportType: Number(this.tabtype) - 2,
            infoDescription: this.addParmes.infoDescription,
            gempId: data.gempId,
            attachmentList: this.addParmes.attachmentList,
            actId: data.actId, // 后端判断是都是首次上传
            deleteflag: 1, // 0是未删除的数据
          }
          this.http.GempInfoBaseRequest.deleteActionInfo(parmes).then((res) => {
            if (res.status == 200) {
              this.$message.success('操作成功！')
              this.changeTabType(this.tabtype)
            } else {
              this.$message({
                message: '删除失败',
                type: 'error',
              });
            }
          });
        }

      })
      .catch(() => {
        this.$message({
          message: '已取消操作',
        });
      });
  }
  // 获取受伤人员
  private findByInfoIdAndType(type, callback?: any) {
    let data: any = {
      infoId: this.addParmes.xbId,
      type: type,
    }
    this.http.GempInfoBaseRequest.findByInfoIdAndType(data).then(item => {
      if (item.status === 200) {
        this.tableData = item.data.map((value, index) => {
          value.disabled = true
          value.isEdit = false
          return value
        })
        callback && callback.call(this, this.tableData);
      } else {
        console.log("......")
      }
    })
  }
  // 获取初报信息
  getEditData() {
    this.http.GempInfoBaseRequest.getInfoById({ infoId: this.detailUrlinfoId }).then(res => {
      if (res.status === 200) {
        this.firstReport = res.data;
        this.currentInfoId = this.firstReport.infoId;
      }
    })
  }
  editEvent(){
    this.$router.push({
      path: '/information/detailsEdit',
      query: { id: this.detailUrlinfoId, routeType:'details', type:this.$route.query.type},
    });
  }
  private closePersonListDialog() {
    const temp: any = {
      '死亡': 'deathNum',
      '重伤': 'seriousInjureNum',
      '轻伤': 'minorInjureNum',
      '受伤': 'woundNum',
      '失踪': 'lossNum',
      '受困': 'trappedNum',
    };
    this.ispersonSave = false;
    const prop = temp[this.currentPersonstatus];
    let total = this.activeData.length;
    if (this.addParmes[prop] < total) {
      this.addParmes[prop] = total;
    }

  }
  changeTabType(type) {
    this.isAdd = true;
    // 续报新增
    Object.keys(this.addParmes).forEach(key => {
      this.$set(this.addParmes, key, key === 'attachmentList' ? [] : '')
    });
    if (this.$refs.upload) {
      (this.$refs.upload as any).propIndex = 0
    }
    if (type === '1') {
      this.reportList = []
      // 查询续报列表
      // this.getEditData()
      this.http.GempInfoBaseRequest.getReportList(this.detailUrlinfoId).then(res=>{
        if(res.status === 200) {
          this.reportList = res.data || [];
          this.firstReport = res.data[res.data.length-1];
          this.addParmes.eventType = this.firstReport.eventType;
          this.addParmes.eventLevelCode = this.firstReport.eventLevelCode;
          const temp = ['deathNum','seriousInjureNum','minorInjureNum','woundNum','lossNum','trappedNum',]
          temp.forEach(item=>{
            this.addParmes[item] = this.reportList[0][item]
          })

          this.currentInfoId = this.firstReport.infoId;
          this.reportList.pop()
        }
      })

    }else{
      const parmes = {
        gempId: this.detailUrlinfoId,
        deleteflag:0, // 0是未删除的数据
        infoReportType: Number(type) - 2
      }
      this.http.GempInfoBaseRequest.otherExtends(parmes).then(res=>{
        if (res.status === 200) {
          this.reportList = res.data || []
        }
      })
    }
  }
  // 死亡 受伤人数列表弹框
  private listPop(type, number) {
    this.personListDialog = true // 打开人员列表弹框
    this.currentPersonNumber = number ? number : 0
    this.currentPersonType = type
    switch(type) {
      case '0':
        this.currentPersonstatus = "死亡"
        this.findByInfoIdAndType(type)
        break
      case '1':
        this.currentPersonstatus = "重伤"
        this.findByInfoIdAndType(type)
        break
      case '2':
        this.currentPersonstatus = "轻伤"
        this.findByInfoIdAndType(type)
        break
      case '3':
        this.currentPersonstatus = "受伤"
        this.findByInfoIdAndType(type)
        break
      case '4':
        this.currentPersonstatus = "失踪"
        this.findByInfoIdAndType(type)
        break
      case '5':
        this.currentPersonstatus = "受困"
        this.findByInfoIdAndType(type)
        break
      default:
        break
    }
  }
  // 点击保存按钮
  private savePersonState(value) {
    (this.$message as any).closeAll();
    if (!value.name) {
      this.$message({
        type: "warning",
        message: "姓名不能为空！"
      })
      return;
    }
    if (value.country && value.idCard && value.country.indexOf('中国') > -1 && !matchFormRegex.default.IDCardNo.regexFun(value.idCard)) {
      this.$message.warning('身份证号码错误！');
      return false;
    }
    if (value.country && value.nation && value.country.indexOf('中国') > -1) {
      let tempInc = this.nationList.findIndex((it) => {
        return it.name === value.nation;
      });
      if (tempInc === -1) {
        this.$message.warning('民族不存在！');
        return;
      }
    }
    let curProp = this.numType[value.type];
    this.currentPersonNumber = this.beforeOpenListPop[curProp] <= this.tableData.length ? this.tableData.length : this.beforeOpenListPop[curProp];
    value.disabled = true
    this.isSave = false
    this.updateDeathPersonState(value)
  }
  // 更新伤亡人员数据
  private updateDeathPersonState(value: any) {
    let data: any = {
      country: value.country,
      id: value.id,
      idCard: value.idCard,
      infoId: this.addParmes.xbId,
      name: value.name,
      nation: value.nation,
      sex: value.sex,
      remarks: value.remarks,
      type: this.currentPersonType
    }
    this.http.GempInfoBaseRequest.updateDeathPersonState(data).then(item => {
      if (item.status === 200) {
        // 如果是新建，就把添加的伤亡id推入数组
        if (!this.addParmes.xbId && (value.id !== item.data)) {
          value.id = item.data
          this.allDeathPersonId.push(item.data)
        }
        value.isEdit = false
        this.findByInfoIdAndType(this.currentPersonType)
      }
    })
  }
  // 增加人员列表
  private addPersonList() {
    if (this.ispersonSave) {
      (this.$message as any).closeAll();
      this.$message({
        type: 'warning',
        message: '请先保存再添加！'
      })
      return
    }
    this.isSave = true
    const baseList: any = {
      isEdit: !this.ispersonAdd, // 是否是新建状态
      country: "中国",
      id: "",
      idCard: "",
      infoId: this.detailUrlinfoId,
      name: "",
      nation: "",
      sex: "",
      type: this.currentPersonType,
      randomId: Math.random(),
    }
    this.tableData.push(baseList)
  }


  // 重绘地图尺寸
  private updateMapSize() {
    if (this.$refs.detailMap) {
      this.$refs.detailMap['updateMapSize']()
    }
  }

  // 处理切换
  private handleSelect(key, keyPath) {
    this.activeIndex = keyPath[0]
  }

  // 切换短信弹窗的显示
  private showMessageDialog() {
    this.messageDialogShow = !this.messageDialogShow;
    this.messageDialogData = {
        sendContent: this.sendContentStr,
        sendTitle: '',
        sendUserInfoDTOS: [{
            personId: '',
            personJob: '',
            personName: '',
            telNumber: ''
        }]
    };
    this.activeLeader = [];
    this.telephoneString = '';
  }
  // 发送短信
  private sendMessageInfo() {
    const data = this.telephoneString;
    let messageData: any = [];
    let actualData: any = [];
    // let uploadData: any = [];
    if (data !== '') {
      if (data.includes(',')) {
        messageData = data.split(',')
        messageData.map((item, index) => {
          if (item.length !== 11) {
            this.$message.info("您填写的电话号码有问题！");
            return
          } else {
            actualData.push({
              personId: '',
              personJob: '',
              personName: '',
              telNumber: item
            })
          }
        })
      } else {
        if (data.length !== 11) {
          this.$message.info("您填写的电话号码有问题！");
          return
        } else {
          actualData.push({
            personId: '',
            personJob: '',
            personName: '',
            telNumber: data
          })
        }
      }
    }
    this.messageDialogData.sendUserInfoDTOS = [...actualData, ...this.activeLeader];
    // console.log(this.messageDialogData.sendUserInfoDTOS);

    if (Array.isArray(this.messageDialogData.sendUserInfoDTOS)) {
      if (this.messageDialogData.sendUserInfoDTOS.length === 0) {
        this.$message.warning("请选择或填写接收人信息!")
        return
      }
    }
    if (this.messageDialogData.sendContent === '') {
      this.$message.warning("请填写发送内容!")
      return
    }
    this.http.GempInfoBaseRequest.sendMessageInfo(this.messageDialogData).then(res => {
      if (res.status === 200) {
        this.$message.info("短信发送成功");
        this.activeLeader = [];
        this.messageDialogData.sendUserInfoDTOS = [{
          personId: '',
          personJob: '',
          personName: '',
          telNumber: ''
        }];
        this.messageDialogShow = false;
      } else {
        this.$message.warning("短信发送失败，请重新发送！");
      }
    })
  }
  //拨打电话
  callUp(data) {

    this.phonePanelVisible = true
    if (data == "1") {
      this.callnumber.sendUserInfoDTOS[0] = {}
      let obj = {}
      obj['telNumber'] = this.data ? this.data['reportPersonPhone'] : ""
      obj['personId'] = this.data ? this.data['personId'] : ""
      obj['personJob'] = this.data ? this.data['personJob'] : ""
      obj['personName'] = this.data ? this.data['reportPerson'] : ""
      this.callnumber.sendUserInfoDTOS[0] = obj
    } else if (data == "2") {
      this.callnumber.sendUserInfoDTOS[0] = {}
      let obj = {}
      obj['telNumber'] = this.data ? this.data['reportPersonPhone'] : ""
      obj['personId'] = this.data ? this.data['personId'] : ""
      obj['personJob'] = this.data ? this.data['personJob'] : ""
      obj['personName'] = this.data ? this.data['orgName'] : ""
      this.callnumber.sendUserInfoDTOS[0] = obj
    }
  }
  /**   关闭拨打电话的弹出框
  *
  */
  closePhone() {
    this.$confirm('是否确认关闭?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'confirmButtonClass',
      cancelButtonClass: 'confirmButtonClass'
    }).then(res => {
      this.phonePanelVisible = false
    })
  }
  // 获取领导列表
  private getLeaderList() {
    // this.http.GempInfoBaseRequest.getLeaderList(this.orgCode).then(res => {
    //   this.leaderList = res.data.map((item, index) => {
    //     let itemData = {
    //       personId: item.userId,
    //       personJob: '',
    //       personName: item.name,
    //       telNumber: item.cellphone
    //     }
    //     return itemData
    //   })
    // })
    //用户可以在录入信息拟办时选择领导GEMP-176
    this.http.DetailOperationsRequest.getUserGroup({
      groupCode: "10004"
    }).then(res => {
      this.leaderList = res.data;
    });
  }

  private addClass(e, curPerson) {
    var incIndex = this.activeLeader.findIndex(item => {
      return item.userId == curPerson.userId;
    })
    if (incIndex == -1) {
      this.activeLeader.push(curPerson);
    } else {
      this.activeLeader.splice(incIndex, 1);
    }
  }
  //打印弹框
  priintDialog() {
    this.viewDialogPrint = true
    let obj = {
      id: this.$route.query.id || this.activeId,
      type: 101
    }
    this.http.GempInfoBaseRequest.getPDF(obj).then(res => {
      this.docUrl = res.data
    })
  }
  handleCancel() {
    this.viewDialogPrint = false
  }
  // 切换分享弹窗的显示
  private showShareDialog() {
    this.shareDialogShow = !this.shareDialogShow;
    if (this.shareDialogShow) {
      this.copyUrl()
    }
  }

  // 复制网址
  private copyUrl() {
    var Url2 = this.shareIframeData;
    var oInput = document.createElement('input');
    oInput.value = Url2;
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    oInput.className = 'oInput';
    oInput.style.display = 'none';
  }

  //点击提交回复 obj:当前回复数据 type: 提交类型 content: 提交内容
  sendApplyContent(obj, type, content, event) {
    let params = {
      attachmentList: null,
      disposeId: obj.infoDisposeId,
      replyContent: content,
      type: type,
    };
    if (!content) {
      if (this.messageDom) {
        this.messageDom.close();
      }
      this.messageDom = this.$message('回复内容不能为空');
      return;
    }
    this.http.GempInfoBaseRequest.sendApplyContent(params).then(res => {
      this.$message(res.msg);
      this.getHandleInfo(this.detailUrlinfoId);
      //隐藏对应type的回复框,清空意见
      switch (type) {
        case 32:
          this.approvalContent = '';
          this.proposeIndex = -1;
          break;
        case 33:
          this.checkContent = '';
          this.checkIndex = -1;
          break;
      }
    });
  }
  cancelApply(e) {
    //点击取消时，隐藏所有回复框，显示回复按钮
    this.proposeIndex = -1;
    this.checkIndex = -1;
  }
  showApply(type, index, e, checkItem) {
    if ((this.role as any).userId === checkItem.disposePersonId) {
      this.$message('不能自己对自己进行回复')
      return
    }
    //点击回复时，清空所有回复框的内容
    this.approvalContent = '';
    this.checkContent = '';
    this.proposeIndex = -1;
    this.checkIndex = -1;
    //根据点击的意见，显示对应的回复框
    switch (type) {
      case 'propose':
        this.proposeIndex = index;
        break;
      case 'check':
        this.checkIndex = index;
        break;
    }
  }
  //回复意见 end
  created() {
    if (this.$route.query.detailUrlId) {
      this.$route.query.id = this.$route.query.detailUrlId;
    }
    this.detailUrlinfoId =  this.$route.query.id;
    // 从提醒信息跳转的时候
    var url = window.location.href;
    let urlCode = getRequestUrl(url)
    if (urlCode && urlCode['detailUrlId']) {
      this.detailUrlinfoId = urlCode['detailUrlId'];
      this.activeId = this.detailUrlinfoId
    }
    this.shareIframeData = top.window.location.href;
    this.role = JSON.parse(sessionStorage.getItem('role'));
    this.orgCode = { 'orgCode': JSON.parse(sessionStorage.getItem('role')).orgCode };
    this.roleLevel = this.role['isYjb'] > 0;
    this.onNotify();
    this.relativeInfo(this.detailUrlinfoId);
    this.getInfoDetail(this.detailUrlinfoId);
    this.getHandleInfo(this.detailUrlinfoId);
    this.getInfoLevelList()
    this.getLeaderList(); // 获取领导列表
    this.updateMessageRemindData();
  }
  mounted() {
      this.changeTabType('1')

  }
  /**
  * 获取用户基本信息
  */
  getUserInfo(id) {
    let params = {
      userId: id
    }
    if (params.userId) {
      this.http.MainRequest.getBaseInfo(params).then(res => {
        if (res.status == 200) {
          this.userTenantId = res.data.tenantId
        }
      })
    }
  }

  // 更新消息提醒的滚动条，弹框，铃铛
  updateMessageRemindData() {
    let data = {
      type:"updateMessageRemind",
    }
    setTimeout(() => {
      parent.postMessage(data,"*")
    }, 2000);
  }
  // 地图渲染完成
  mapRenderFinish() {
    // 增加窗口变化的监听
    window.onresize = () => {
      if (this.updateMapSize) {
        setTimeout(this.updateMapSize, 2000)
      }
    }
    // let id = this.$route.query.id;
    // var url = window.location.href;
    // let urlCode = getRequestUrl(url)
    // if (urlCode && urlCode['detailUrlId']) {
    //   id = urlCode['detailUrlId']
    // }
    this.getInfoDetail(this.detailUrlinfoId);
    // this.$refs.detailMap['setMapDiot'](this.mapInfo)
  }

  handleChange(val) {
    // console.log(val);
  }

  // 获取关联信息和续报信息
  // modify by liuwenlei 有相关信息则默认展开折叠栏
  relativeInfo(id, fun?) {
    let infoParams = { infoId: id };
    this.http.GempInfoBaseRequest.getChainContinueList(infoParams).then(res => {
      this.$set(this, 'relativInfo', res.data);
      if (this.relativInfo.length) this.activeNames.push("1")
      if (fun) {
        fun();
      }
    });
  }

  /**
   * modify by 刘文磊 关联信息后刷新页面包括拟办，审核 转办
   */

  onNotify() {
    this.on('udpateassocciationinfoview', function (data) {
      this.relativeInfo(
        this.$route.query.id,
        this.getHandleInfo(this.$route.query.id),
      );
    });
  }

  // 获取信息详情
  getInfoDetail(id) {
    let infoParams = { infoId: id };
    this.http.GempInfoBaseRequest.getInfoById(infoParams).then(res => {
      this.store.dispatch('setHandleState',res.data.handleFlag)
      this.$set(this, 'data', res.data);
      console.log(res.data)
      if (this.role['orgCode'] != res.data.orgCode) {
        this.isUnit = false
      } else {
        this.isUnit = true
      }
      // this.messageDialogData.sendTitle = res.data.infoTitle; // 获取信息标题
      sessionStorage.setItem('data', JSON.stringify(res.data));
      this.childrengetInfoDetail(res.data);
      // 短信发送内容
      this.messageDialogData.sendContent = (this.role as any).orgName + (this.role as any).name + "于" + (this.data as any).incidentDate + "报送" + (this.data as any).infoTitle;
      this.sendContentStr = this.messageDialogData.sendContent;
      //获取信息后，得到位置对应的经纬度,地图数据更新，给地图发送消息
      // this.$set(this.mapInfo, 'data', [res.data.longitude, res.data.latitude]);
      this.$set(this.mapInfo, 'data', { location: { x: res.data.longitude, y: res.data.latitude } });
      // this.$refs.detailMap['setMapDiot'](this.mapInfo);
      this.emit("initUnreadOnNotify", "")
    });
  }

  // 获取处理类型信息
   // modify by liuwenlei 有相关信息则默认展开折叠栏
  getHandleInfo(id) {
    this.http.GempInfoBaseRequest.getDisposeByinfoId({
      infoId: id,
      types: ['2', '3', '4', '5', '19'],
    }).then(res => {
      this.emit('setprocess', '');
      this.getInfoDetail(id);
      if (res.data.length > 0)
        res.data.forEach(item => {
          if (item.value.length > 0) {
            item.value.map(_ => {
              _.show = true;
            });
            this.$set(this.handleInfo, item.name, item.value);
          } else {
            this.$set(this.handleInfo, item.name, item.value);
          }
        });
       // modify by liuwenlei 有相关信息则默认展开折叠栏
      if (this.handleInfo['propose'].length) this.activeNames.push("2")
      if (this.handleInfo['check'].length) this.activeNames.push("3")
      if (this.handleInfo['transfer'].length) this.activeNames.push("4")
    });
  }

  // 子弹框控制
  changeCompoent(name, title, type?: string) {
    let obj = {};
    if (type) {
      obj = { name, title, type: type };
    } else {
      obj = { name, title };
    }
    obj['show'] = true;
    this.$set(this, 'childrenComponent', obj);
  }
  //补充信息按钮点击事件
  showSupplement() {
    this.showParentSupplement({ infoId: this.$route.query.id });
  }
  //补充信息按钮点击事件
  @Emit('supplementbtnclick')
  showParentSupplement(data) {
    return data;
  }
  //补充信息保存成功回调
  dialogcallback(infoId) {
    this.getInfoDetail(infoId);
    this.getHandleInfo(infoId);
    this.changeInfoId({ infoId: infoId})
  }
  private click(el: string, name: string, item) {
    this.returnId = item.infoId
    this.flag = true;
    this.templateName = el;
    this.tilteName = name;
  }
  // 自定义NTKO页面
  routeToNtko() {
    let str = window.location.href.split('#')[0];
    window.open(str + '#/ntko?id=' + this.$route.query.id + '&type=102');
  }
  //生成事件
  createEvent() {
    this.$confirm('是否将该信息生成事件？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      this.http.GempInfoBaseRequest.createEvent(this.$route.query.id).then(
        res => {
          if (res.status == 200) {
            this.disabled = true;
            // this.$message('信息处置成功');
            this.$message('事件生成成功');
            this.emit('setprocess', '');
          } else {
            this.$message(res.msg);
          }
        },
      );
    });
  }
  // 点击删除按钮
  private deletePersonState(value) {
    this.$confirm('确认删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.ispersonSave = false
      if (value.randomId) {
        this.tableData = this.tableData.filter((item, index) => {
          return item.randomId !== value.randomId
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        let curProp = this.numType[value.type];
        this.currentPersonNumber = this.beforeOpenListPop[curProp] <= this.tableData.length ? this.tableData.length : this.beforeOpenListPop[curProp];
      } else {
        this.deleteDeathPersonState(value)
      }
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      });
    });
    // value.disabled = false
  }
  // 删除人员列表
  private deleteDeathPersonState(value) {
    let id = value.id;
    let data: any = {
      id: id
    }
    this.http.GempInfoBaseRequest.deleteDeathPersonState(data).then(item => {
      if (item.status === 200) {
        this.tableData = this.tableData.filter((item, index) => {
          return item.id !== id
        })
        this.$message({
          type: "success",
          message: "删除成功！"
        })
        let curProp = this.numType[value.type];
        this.currentPersonNumber = this.beforeOpenListPop[curProp] <= this.tableData.length ? this.tableData.length : this.beforeOpenListPop[curProp];
      }
    })
  }
  // 退回弹窗关闭
  closeDialogCall(infoId,type) {
    this.flag = false
    if(type ){
      if (this.$route.query.id === this.returnId) { // 退回的是初报
        this.go('/information/infoManage', {
          type: this.$route.query.type,
        });
      }else{
        this.changeTabType('1')
        this.changeInfoId({ infoId: this.$route.query.id })
      }
    }else{
      this.changeTabType('1')
      this.changeInfoId({ infoId: this.$route.query.id })
    }
  }
  download(file) {
    const fileId = file.url.split('=');

    if (fileId.length > 1 && fileId[1]) { // 手动上传的附件
      const params = { fileId: fileId[1] }
      this.http.GempInfoBaseRequest.Attachmentdownload(params).then(res => {
        this.downloadFunc(res)
      })
    } else {
      if (file.url.includes('api/attachment/download/v1')) { // 上传的传真
        this.http.MailListRequest.recvFaxAttachmentdownload(file.name, file.name).then(res => {
            this.downloadFunc(res);
          });
      }else { // 录音
        this.downloadFunc({
          filename: file.name,
          url: file.url,
        });
      }
    }
  }
}
