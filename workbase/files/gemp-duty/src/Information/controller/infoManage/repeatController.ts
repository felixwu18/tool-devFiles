import { ControllerBase, Inject, Watch } from 'prism-web'
import { showLoading } from 'service/Loading/loading';
import { baseUrl } from '../../../../service/config/base'
import searchSession from '../../../../assets/libs/searchData'

const Recorder = require('../../../../assets/libs/recorder.mp3.min.js')
const $ = require('jquery')
const matchFormRegex = require('../../../../assets/libs/matchFormRegex')
const {nationList} = require('../../../../assets/libs/nation')

export class repeatController extends ControllerBase {
  constructor() {
    super()
  }
  private nationList: any = nationList;
  private role:object
  // 用户名
  private userName: string
  //是否显示智能模板解析
  private title: string
  //添加页面地址搜索的值
  private searchAddr: string = '';
  //信息新增和呈报上报页面：公开和抄送
  private isOpenAndcopy: Boolean = false;

  //公开和抄送弹框显示
  private viewDialog: Boolean = false;
  //公开或抄送的数据
  private type: string = '1';
  private orgInfo: Array<any> = [];

  // 是否显示智能模板解析
  private showTemplate: boolean = false

  // 是否显示智能模板按钮
  private showIntelligenceBtn: boolean = true;

  // 更多要素信息状态显示
  private moreInfoStatu: boolean = false;

  //人员列表弹框显示
  private personListDialog: Boolean = false;
  // 当前人员状态
  private currentPersonstatus: string = ""
  // 当前类型事故人员数
  private currentPersonNumber: Number = 0
  // 是否有未保存的状态
  private isSave: Boolean = false
  // 当前受伤人员类型
  private currentPersonType: string = ""
  // 当前值班人员
  private currentDutyPerson: Array<any> = [];
  // 所有伤亡人数的ID
  private allDeathPersonId: Array<any> = [];

  // 时间选择器
  private start_Date = {
    disabledDate: time => {
      return time.getTime() > Date.now()
    }
  }

  // 事发时间绑定数据
  private initTime = new Date()
  @Watch("initTime")
  timeChange(val) {
    this.ruleForm.incidentDate = val
  }

  // 接报时间绑定数据
  private initTime2 = new Date()
  @Watch("initTime2")
  timeChange2(val) {
    this.ruleForm.reportDate = val
  }

  // 修改经纬度更新地图显示
  // @Watch("ruleForm.latitude", {deep:true})
  // latitudeChange() {
  //   this.$set(this.mapInfo, 'data', { location: { x: this.ruleForm.longitude, y: this.ruleForm.latitude } });
  //   this.$refs.detailMap['getAddressToDiot'](this.mapInfo); // 设置地图点
  // }

  // @Watch("ruleForm.longitude", {deep:true})
  // longitudeChange() {
  //   this.$set(this.mapInfo, 'data', { location: { x: this.ruleForm.longitude, y: this.ruleForm.latitude } });
  //   this.$refs.detailMap['getAddressToDiot'](this.mapInfo); // 设置地图点
  // }

  // 是否填充弹框
  private smartFillDialog: boolean = false

  // 智能分析框数据
  private smartTextData = "请上报事件时间、地点、事件经过与人员伤亡情况。例：今日16时20分，山西省临汾市洪洞县广胜寺镇柴村一民营化工厂发生爆炸，已造成1人死亡，2人轻伤，1人重伤。伤者已送医院，事故原因正在调查"

  get activeData() {
      return this.tableData.filter((item, index) => {
          return this.currentPersonType === item.type
      })
  }

  get showAddState() {
      const data = this.tableData.filter((item, index) => {
          return this.currentPersonType === item.type
      })
      return data.length < (this as any).currentPersonNumber
  }

  private ruleForm = {
    seriousInjureNum: null, // 重伤人数
    minorInjureNum: null, // 轻伤人数
    lossNum: null, // 失踪人数
    trappedNum: null, // 受困人数
    deathNum: null,  // 死亡人数
    woundNum: null,  // 受伤人数
    editer: '', // 编辑人
    checker: '', // 校对人
    issuer: '', // 签发人
    reportWay: '3', // 接报方式
    reportDate: new Date(), // 接报时间
    eventLevelCode: "", // 事件等级
    eventType: '', // 事件类型
    incidentDate: new Date(), // 事发时间
    infoAddress: "", // 事发地点
    infoDescription: "", // 事件描述
    infoId: "", // 信息ID,新增制空
    infoTitle: "",  // 信息标题
    infoType: "", // 信息类型
    latitude: 0,  // 纬度
    longitude: 0, // 经度
    attachmentList: [], // 上传附件列表
    elements: [],//动态模板
    districtName: '', // 行政区划名称
    districtCode: '', // 行政区划码
    ecoLosses: '', // 经济损失
    directEcoLosses: '', // 直接经济损失
    indirectEcoLosses: '' // 间接经济损失
  }

  // 智能填报的分析数据
  private smartData = {
    incidentDate: null, // 事发时间
    eventType: '', // 事发类型
    infoAddress: '', // 事发地点
    deathNum: null, // 死亡人数
    seriousInjureNum: null, // 重伤人数
    minorInjureNum: null, // 轻伤人数
    woundNum: null,  // 受伤人数
    code: '', // 事发类型码
    disabled: false, // 是否可编辑
  }


  private rules = {
    //by 刘文磊 
    infoTitle: [{ required: true, message: '请输入信息标题', trigger: 'blur' }],
    incidentDate: [{ required: true, message: '请输入事发时间', trigger: 'change' }],
    reportDate: [{ required: true, message: '请输入接报时间', trigger: 'change' }],
    reportWay: [{ required: true, message: '请选择接报方式', trigger: 'change' }],
    infoAddress: [{ required: true, message: '请输入事发地点', trigger: ['change','blur'] }],
    eventLevelCode: [{ message: '请输入事发等级', trigger: 'change' }],
    eventType: [{ required: true, message: '请选择事件类型', trigger: 'change' }],
    // woundNum: [{ required: true, message: '请输入受伤人数', trigger: 'blur' },{type:'number',message:'请输入数字',trigger:['change','blur']}],
    // deathNum: [{ required: true, message: '请输入死亡人数', trigger: 'blur' },{type:'number',message:'请输入数字',trigger:['change','blur']}],
    // seriousInjureNum: [{ required: true, message: '请输入重伤人数', trigger: 'blur' },{type:'number',message:'请输入数字',trigger:['change','blur']}],
    // minorInjureNum: [{ required: true, message: '请输入轻伤人数', trigger: 'blur' },{type:'number',message:'请输入数字',trigger:['change','blur']}],
    // lossNum: [{ required: true, message: '请输入失踪人数', trigger: 'blur' },{type:'number',message:'请输入数字',trigger:['change','blur']}],
    // trappedNum: [{ required: true, message: '请输入受困人数', trigger: 'blur' },{type:'number',message:'请输入数字',trigger:['change','blur']}],
    woundNum: [{type:'number',message:'请输入数字',trigger:['change','blur']}],
    deathNum: [{type:'number',message:'请输入数字',trigger:['change','blur']}],
    seriousInjureNum: [{type:'number',message:'请输入数字',trigger:['change','blur']}],
    minorInjureNum: [{type:'number',message:'请输入数字',trigger:['change','blur']}],
    lossNum: [{type:'number',message:'请输入数字',trigger:['change','blur']}],
    trappedNum: [{type:'number',message:'请输入数字',trigger:['change','blur']}],
    infoDescription: [{ required: true, message: '请输入信息描述', trigger: 'blur' }],
    latitude: [{ required: true, message: '请输入经度', trigger: 'blur' }],
    longitude: [{ required: true, message: '请输入纬度', trigger: 'blur' }],
    editer: [{ required: true, message: '请输入编辑者', trigger: 'blur' }],
    // checker: [{ required: true, message: '请输入校对者', trigger: 'blur' }],
    // issuer: [{ required: true, message: '请输入签发者', trigger: 'blur' }],
  }

  // 信息级别列表
  private scaleList: Array<any> = []

  // 人员列表数据
  private tableData: Array<any> = []
  private mapInfo: Object = {
    type: 'geometry-location'
  };


  // 智能解析按钮是否显示
  get smartBtnStatu() {
    return searchSession.getter({ name: 'role' }).sysEreportSwitch === 'N';
  }

  // input的placeholder
  private eventTypePlaceholder: string = '请输入事件类型关键字'

  private temp = {
    style: require('../../style/infoManage/detailsEdit.less')
  }

  @Inject("http") http: any
  private editId
  private isAdd: boolean = false
  private messageDom: any = null // message实体

  // by 刘文磊 信息标题搜索模板
  private restaurants = [
    { value: "四川省宜宾市长宁县发生6.0级地震", id: "11C00" },
    { value: "四川省甘孜州康定市发生3.0级地震" },
    { value: "四川省乐山市金口河区5.0级地震" },
    { value: "四川省雅安市芦山县7.0级地震" },
    { value: "四川省甘孜藏族自治州白玉县5.4级地震" }
  ]

  private isVoice: boolean = false;
  private isVoiceAnalysis: boolean = false;
  private recorder: any;
  private rec: any; // 录音对象

  // 增加人员列表
  private addPersonList() {
      debugger;
      if (this.isSave === true) {
          (this.$message as any).closeAll();
          this.$message({
              type: 'warning',
              message: '请先保存再添加！'
          })
          return
      }
      this.isSave = true
      const baseList: any = {
          isEdit: true, // 是否是新建状态
          country: "中国",
          id: "",
          idCard: "",
          infoId: this.ruleForm.infoId,
          name: "",
          nation: "",
          sex: "",
          type: this.currentPersonType,
          randomId: Math.random(),
      }
      this.tableData.push(baseList)
  }

  // 点击编辑按钮
  private editPersonState(value) {
      if (this.isSave === true) {
          (this.$message as any).closeAll();
          this.$message({
              type: 'warning',
              message: '请先保存再编辑！'
          })
          return
      }
      value.isEdit = true
      value.disabled = false
      this.isSave = true
  }

  // 点击取消按钮
  private cancelPersonState(value) {
      value.isEdit = false
      value.disabled = true
      this.isSave = false
      this.findByInfoIdAndType(value.type);
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

  // 点击删除按钮
  private deletePersonState(value) {
      this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          this.isSave = false
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

  private beforeOpenListPop: any = {
      deathNum: 0, // 死亡人数
      seriousInjureNum: 0, // 重伤人数
      minorInjureNum: 0, // 轻伤人数
      woundNum: 0, // 受伤人数
      lossNum: 0, // 失踪人数
      trappedNum: 0, // 受困人数
  };

  // 死亡 受伤人数列表弹框
  private listPop(type, number) {
      this.personListDialog = true // 打开人员列表弹框
      this.currentPersonNumber = number ? number : 0
      this.beforeOpenListPop[this.numType[type]] = this.currentPersonNumber;
      this.currentPersonType = type
      const temp = {
          0: "死亡",
          1: "重伤",
          2: "轻伤",
          3: "受伤",
          4: "失踪",
          5: "受困"
      };
      this.currentPersonstatus = temp[type];
      this.findByInfoIdAndType(type, (tableData) => {
          let total = tableData.length;
          if (total > this.currentPersonNumber) {
              this.currentPersonNumber = total;
              this.beforeOpenListPop[this.numType[type]] = this.currentPersonNumber;
          }
      });
  }

  // 获取受伤人员
  private findByInfoIdAndType(type, callback?: any) {
      let data: any = {
          infoId: this.ruleForm.infoId,
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
              // this.tableData = [];
              console.log("......")
          }
      })
  }

  // 更新伤亡人员数据
  private updateDeathPersonState(value: any) {
      let data: any = {
          country: value.country,
          id: value.id,
          idCard: value.idCard,
          infoId: this.ruleForm.infoId,
          name: value.name,
          nation: value.nation,
          sex: value.sex,
          remarks: value.remarks,
          type: this.currentPersonType
      }
      this.http.GempInfoBaseRequest.updateDeathPersonState(data).then(item => {
          if (item.status === 200) {
              // 如果是新建，就把添加的伤亡id推入数组
              if (!this.ruleForm.infoId && (value.id !== item.data)) {
                  value.id = item.data
                  this.allDeathPersonId.push(item.data)
              }
              value.isEdit = false
              this.findByInfoIdAndType(this.currentPersonType)
          }
      })
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
  private tempRuleForm: any = {
      deathNum: 0, // 死亡人数
      seriousInjureNum: 0, // 重伤人数
      minorInjureNum: 0, // 轻伤人数
      woundNum: 0, // 受伤人数
      lossNum: 0, // 失踪人数
      trappedNum: 0, // 受困人数
  };
  private timer: any = null;
  private timer2: any = null;

  //校验正整数
  validateNum(rule, value, callback) {
      if (!this.editId) {
          if (value == 0 || value == null) return callback()
          if (!value) {
              return callback(new Error("请输入正整数"))
          } else {
              if (!/^\+?(0|[1-9][0-9]*)$/.test(value)) {
                  return callback(new Error("请输入正整数"))
              } else {
                  // return callback()
                  const fullField = rule.fullField;
                  if (this.activeData.length === 0) {
                      return callback()
                  }
                  if (this.ruleForm[fullField] >= this.activeData.length) {
                      return callback();
                  }
                  clearTimeout(this.timer2);
                  this.timer2 = setTimeout(() => {
                      if (this.ruleForm[fullField] < this.activeData.length) {
                          this.ruleForm[fullField] = this.activeData.length;
                          this.$refs.ruleForm['validateField'](fullField, async valid => {
                          });
                      }
                  }, 1000);
                  return callback(new Error("与人员详细信息数量不一致"));
              }
          }
      }
      const fullField = rule.fullField;
      this.findByInfoIdAndType(this.numType[fullField], (tableData) => {
          const num = tableData.length;
          if (value == 0 || value == null) {
              if (num === 0) {
                  return callback()
              }
              clearTimeout(this.timer);
              this.timer = setTimeout(() => {
                  if (this.ruleForm[fullField] < num) {
                      this.ruleForm[fullField] = num;
                      this.$refs.ruleForm['validateField'](fullField, async valid => {
                      });
                  }
              }, 1500);
              return callback(new Error("与人员详细信息数量不一致"));
          }
          if (!value) {
              return callback(new Error("请输入正整数"))
          } else {
              if (!/^\+?(0|[1-9][0-9]*)$/.test(value)) {
                  return callback(new Error("请输入正整数"))
              } else {
                  if (value < num) {
                      clearTimeout(this.timer);
                      this.timer = setTimeout(() => {
                          if (this.ruleForm[fullField] < num) {
                              this.ruleForm[fullField] = num;
                              this.$refs.ruleForm['validateField'](fullField, async valid => {
                              });
                          }
                      }, 1000);
                      return callback(new Error("与人员详细信息数量不一致"));
                  }
                  return callback()
              }
          }
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
      this.isSave = false;
      const prop = temp[this.currentPersonstatus];
      let total = this.activeData.length;
      if (this.ruleForm[prop] < total) {
          this.ruleForm[prop] = total;
      }
      if (this.ruleForm[prop] === total) {
          this.$refs.ruleForm['validateField'](prop, async valid => {
          });
      }
  }

  changeIdCard(val, row) {
      if (!val) {
          return;
      }
      if (row.country.indexOf('中国') > -1) {
          if (val.length !== 18) {
              this.$message.warning('身份证号码错误！');
              return false;
          }
          if (!matchFormRegex.default.IDCardNo.regexFun(val)) {
              this.$message.warning('身份证号码错误！');
              return false;
          }
      }
  }

  // 改变经纬度获取地图数据
  private changeLonLatGetData(val, index) {
    if (index === '1') {
      this.$set(this.mapInfo, 'data', { location: { x: this.ruleForm.longitude, y: val } });
    } else {
      this.$set(this.mapInfo, 'data', { location: { x: val, y: this.ruleForm.latitude } });
    }
    this.$refs.detailMap['getAddressToDiot'](this.mapInfo); // 设置地图点
  }

  // 关闭弹窗
  private closeSmartFillDialog() {
    this.smartFillDialog = false
  }

  // 清空语音输入框数据
  private clearSmartText() {
    this.smartTextData = ""
  }

  // 切换更多详情
  private toggleMoreInfo() {
    this.moreInfoStatu = !this.moreInfoStatu;
  }

  // 填充信息到左边
  private msgToLeft() {
    if (this.smartData.incidentDate !=='' && this.smartData.incidentDate !== null) {
      this.initTime = new Date(this.smartData.incidentDate.replace('-', '/'))
      this.ruleForm.incidentDate = new Date(this.smartData.incidentDate);
    }
    if (this.smartData.code !=='') {  
      this.ruleForm.eventType = this.smartData.code;
    }
    if (this.smartData.infoAddress !=='') {
      // this.ruleForm.infoAddress = this.smartData.infoAddress;
      this.$set(this.ruleForm, 'infoAddress', this.smartData.infoAddress)
      this.searchAddress(this.smartData.infoAddress, this.updatedAddressData) // 获取地址
    }  
    this.ruleForm.deathNum = Number(this.smartData.deathNum);
    this.ruleForm.seriousInjureNum = Number(this.smartData.seriousInjureNum);
    this.ruleForm.minorInjureNum = Number(this.smartData.minorInjureNum);
    this.ruleForm.woundNum = Number(this.smartData.woundNum);
    this.smartFillDialog = false
  }

  // 更新智能填充的地址到地图
  private updatedAddressData(result) {
    this.selectAddress(result[0]) // 取搜索到的第一个结果在地图上标点
  }

  // 处理点击国不在中国的提示
  private mapStatusTips(data) {
    this.$message({
      type: 'warning',
      message: data
    })
  }

  // 获取文本分类
  private textTransferSortData() {
    if (this.smartTextData === '') {
      this.$message({
        type: 'error',
        message: '请填写上报信息！'
      })
      return
    }
    const data = {content:this.smartTextData}
    this.http.GempInfoBaseRequest.textTransferSort(data).then(item => {
      if (item.status === 200) {
        this.smartData.infoAddress = item.data.location
        this.smartData.incidentDate = item.data.time
        this.smartData.deathNum = item.data.deathNum
        this.smartData.woundNum = item.data.injuryNum
        this.smartData.minorInjureNum = item.data.lightInjury
        this.smartData.seriousInjureNum = item.data.seriousInjury
        this.smartData.eventType = item.data.type
        this.smartData.code = item.data.code
      }
    })
  }

  // by 刘文磊  信息标题选中事件
  handleSelect(item) {
    if (item.id == "11C00") {
      this.selectEventType("11C00")
    }

  }

  //by 刘文磊 信息标题搜索事件
  querySearch(queryString, cb) {
    var restaurants = this.restaurants;
    var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
    cb(results)
  }

  //by 刘文磊  过滤函数
  createFilter(val) {
    return (item) => {
      return item.value.indexOf(val) != -1
    }
  }
  created() {
    this.allDeathPersonId = [] // 清空受伤人员列表数据
    let route = this.getRoute();
    this.editId = route.id
    if (this.editId) {
      this.title = '编辑上报信息'
      this.isOpenAndcopy = false
      this.getEditData()
      this.$set(this.mapInfo, 'type', 'geometry-location')
    } else {
      this.title = '填写上报信息'
      this.isAdd = true
      this.$set(this.mapInfo, 'type', 'geometry-location')
      this.isOpenAndcopy = true
    }
    this.userName = searchSession.getter({ name: 'role' }).name;
    this.ruleForm.editer = this.userName;
    // 获取信息级别
    this.getInfoLevelList()
    this.role = JSON.parse(sessionStorage.getItem('role'))
    // this.textTransferSort()
  }

  
  /**调用open打开录音请求好录音权限**/
  private recOpen(success){//一般在显示出录音按钮或相关的录音界面时进行此方法调用，后面用户点击开始录音时就能畅通无阻了
    this.rec=Recorder({
        type:"mp3",sampleRate:16000,bitRate:16 //mp3格式，指定采样率hz、比特率kbps，其他参数使用默认配置；注意：是数字的参数必须提供数字，不要用字符串；需要使用的type类型，需提前把格式支持文件加载进来，比如使用wav格式需要提前加载wav.js编码引擎
        ,onProcess:function(buffers,powerLevel,bufferDuration,bufferSampleRate,newBufferIdx,asyncEnd){
            //录音实时回调，大约1秒调用12次本回调
            //可利用extensions/waveview.js扩展实时绘制波形
            //可利用extensions/sonic.js扩展实时变速变调，此扩展计算量巨大，onProcess需要返回true开启异步模式
        }
    });
    //var dialog=createDelayDialog(); 我们可以选择性的弹一个对话框：为了防止移动端浏览器存在第三种情况：用户忽略，并且（或者国产系统UC系）浏览器没有任何回调，此处demo省略了弹窗的代码
    this.rec.open(function(){//打开麦克风授权获得相关资源
        //dialog&&dialog.Cancel(); 如果开启了弹框，此处需要取消
        //rec.start() 此处可以立即开始录音，但不建议这样编写，因为open是一个延迟漫长的操作，通过两次用户操作来分别调用open和start是推荐的最佳流程
        
        success&&success();
    },function(msg,isUserNotAllow){//用户拒绝未授权或不支持
        //dialog&&dialog.Cancel(); 如果开启了弹框，此处需要取消
        console.log((isUserNotAllow?"UserNotAllow，":"")+"无法录音:"+msg);
    });
  };

  /**开始录音**/
private recStart(){//打开了录音后才能进行start、stop调用
  this.rec.start();
};

/**结束录音**/
private recStop(){
  const vm = this;
  vm.isVoiceAnalysis = true;
  this.rec.stop((blob,duration) => {
      console.log(blob,(window.URL||webkitURL).createObjectURL(blob),"时长:"+duration+"ms");
      this.rec.close();//释放录音资源，当然可以不释放，后面可以连续调用start；但不释放时系统或浏览器会一直提示在录音，最佳操作是录完就close掉
      this.rec=null;
      //已经拿到blob文件对象想干嘛就干嘛：立即播放、上传
      
      /*** 【立即播放例子】 ***/
      let audio=document.createElement("audio");
      audio.controls=false;
      document.body.appendChild(audio);
      //简单利用URL生成播放地址，注意不用了时需要revokeObjectURL，否则霸占内存
      audio.src=(window.URL||webkitURL).createObjectURL(blob);
      audio.play();

      let form=new FormData();
      form.append("upfile",blob,"recorder.mp3"); //和普通form表单并无二致，后端接收到upfile参数的文件，文件名为recorder.mp3
      $.ajax({
          url: baseUrl + '/api/gemp/duty/service/v1/asr' //上传接口地址
          ,type:"POST"
          ,headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST",
            'token': searchSession.getter({name:'token'})
          }
          ,contentType:false //让xhr自动处理Content-Type header，multipart/form-data需要生成随机的boundary
          ,processData:false //不要处理data，让xhr自动处理
          ,data: form
          ,success:function(v){
            vm.isVoiceAnalysis = false;
            vm.smartTextData = v.data
            // audio.src=(window.URL||webkitURL).revokeObjectURL();
              console.log("上传成功",v);
          }
          ,error:function(s){
              console.error("上传失败",s);
          }
      });
    },function(msg){
      console.log("录音失败:"+msg);
      this.rec.close();//可以通过stop方法的第3个参数来自动调用close
      this.rec=null;
  });
};

/**点击录音图标**/
private startV() {
  this.isVoice = !this.isVoice
  if(this.isVoice) {
    this.recOpen(this.recStart)
  } else {
    this.recStop()
  }
 
}

  mounted() {
    
  }
  /*
   * Author by huihui 保存草稿
  */
  private saveDraft() {
    if (this.ruleForm.reportDate.getTime() <= this.ruleForm.incidentDate.getTime()) {
      this.$message({
        type: 'warning',
        message: '接报时间不能小于或等于事发时间'
      })
      return false
    }
    this.$set(this.ruleForm, 'id', this.getRoute().id);
    let drafsform = this.ruleForm;
    this.$refs.ruleForm['validate'](async valid => {
        if (!valid) {
            if (this.messageDom) { this.messageDom.close() }
            this.messageDom = this.$message({
                type: 'warning',
                message: '请按提示正确填写信息'
            })
            return false
        } else {
            let error = document.getElementsByClassName('el-form-item__error')
            if (error.length > 0) {
                if (this.messageDom) {
                    this.messageDom.close()
                }
                this.messageDom = this.$message({
                    type: 'warning',
                    message: '请按提示正确填写信息'
                })
                return false
            }
            this.$set(drafsform, 'distCode', drafsform.districtCode);
            this.$set(drafsform, 'distName', drafsform.districtName);
            const res = await this.http.GempInfoBaseRequest.toDraft({...drafsform, personIds: this.allDeathPersonId})
            if (res.status !== 200) {
                return
            }
            this.$message('存储为草稿成功！')
            this.$router.push('/information/detailsManage?id=' + res.data)
        }
    })
  }
  // 提交上报信息
  // by 刘文磊 动态模板添加提交校验
  async addReportInfo() {
    if (this.ruleForm.reportDate.getTime() <= this.ruleForm.incidentDate.getTime()) {
      this.$message({
        type: 'warning',
        message: '接报时间不能小于或等于事发时间'
      })
      return false
    }
    try {
      this.$refs.ruleForm['validate'](async valid => {
        if (!valid) {
          if (this.messageDom) { this.messageDom.close() }
          this.messageDom = this.$message({
            type: 'warning',
            message: '请按提示正确填写信息'
          })
          return false
        } else {
          let error = document.getElementsByClassName('el-form-item__error')
          if (error.length > 0) {
            if (this.messageDom) { this.messageDom.close() }
            this.messageDom = this.$message({
              type: 'warning',
              message: '请按提示正确填写信息'
            })
            return false
          }
          this.$confirm('确认提交?','提示').then(() => {
            this.$set(this.ruleForm, 'distCode', this.ruleForm.districtCode);
            this.$set(this.ruleForm, 'distName', this.ruleForm.districtName);
            this.http.GempInfoBaseRequest.repeat({
              ...this.ruleForm,
              personIds: this.allDeathPersonId,
              incidentDate: new Date(this.ruleForm.incidentDate).toJSON(),
              reportDate: new Date(this.ruleForm.reportDate).toJSON() }).then(res => {
              // debugger
              if (res.status == 200) {
                this.$message({
                  type: 'success',
                  message: '重报成功'
                })
                this.$router.push('/information/infoManage')
                return
              }
              this.$message.error('重报失败！')
            })
          })      
        }
      })
    } catch (error) {
      // no thing
    }
  }

  showOpenAndcopy() {
    this.$confirm('是否抄送该信息？','提示')
      .then((_) => {
        this.viewDialog = true;

        this.orgInfo = [];
      }).catch((_) => {
        this.$message({
          type: 'success',
          message: this.role['isYjb'] ? '上报成功！' : '抄送成功',
        })
        this.saveCall();
      })
  }

  // 获取编辑信息数据
  getEditData() {
    let infoParams = { infoId: this.$route.query.id }
    this.http.GempInfoBaseRequest.getInfoById(infoParams).then(res => {
      let data = Object.assign({}, this.ruleForm, res.data)
      this.$set(this, 'ruleForm', data)
      if (data.incidentDate) {
        this.initTime = new Date(data.incidentDate.replace('-', '/'))
      } else {
        this.ruleForm['incidentDate'] = new Date()
      }
      if (data.reportDate) {
        this.initTime2 = new Date(data.reportDate.replace('-', '/'))
      } else {
        this.ruleForm['reportDate'] = new Date()
      }
      //获取信息后，得到位置对应的经纬度,地图数据更新，给地图发送消息
      // this.$set(this.mapInfo, 'data', [data.longitude, data.latitude])
      // 构造点数据
      this.$set(this.mapInfo, 'data', {location: {x: res.data.longitude, y: res.data.latitude}});
      this.$refs.detailMap['setMapDiot'](this.mapInfo); // 设置地图点
      //this.$refs.detailMap['postMesgToMap'](this.mapInfo);
    })
    if (this.getRoute().type == 'draft') {
      this.isAdd = true
    }
  }

  // 获取信息级别
  getInfoLevelList() {
    this.http.GempInfoBaseRequest.getInfoLevel({}).then(item => {
      if (item.status === 200) {
        this.scaleList = item.data
      }
    })
  }

  // 地图渲染完成(感觉可以不要)
  // mapRenderFinish() {
  //   this.getEditData();
  //   // this.$refs.detailMap['setMapDiot'](this.mapInfo) 
  // }


  // 获取事件类型选中列表
  // by 刘文磊 根据时间类型生成动态模板
  selectEventType(val) {
    // this.ruleForm.eventType = val 
    this.moreInfoStatu = true;
    this.getDynamic(val)
  }

  /**
   * author by 刘文磊 动态模板获取
   */
  getDynamic(type) {
    this.http.InfoDutyRequest.getDynamicTemp(type).then(res => {
      if (res.status == 200) {
        this.$set(this.ruleForm, 'elements', res.data.dynamicElements)
        // by 刘文磊 为演示做的模板数据
        if (type == "11C00") {
          // this.ruleForm.elements[0].elementValue = 6
          // this.ruleForm.elements[1].elementValue = 14
        }
      }
    })
  }

  //地图放大缩小回调的回调函数（给系统发送中心点位置的相关消息）
  mapCallback(msgObj) {
    //地图放大缩小后返回的地理信息展示到页面上
    this.$set(this.ruleForm, 'districtName', msgObj.address_component.district);
    this.$set(this.ruleForm, 'districtCode', msgObj.address_component.adcode);
    this.$set(this.ruleForm, 'infoAddress', msgObj.formatted_address);
    this.$set(this.ruleForm, 'longitude', msgObj.location.x);
    this.$set(this.ruleForm, 'latitude', msgObj.location.y);
  }
  //事发地点搜索地址
  searchAddress(val, cb) {
    val = encodeURI(val)
    this.$refs.detailMap['searchKeyWord'](val).then(result => {
      result.forEach(item => {
        item.value = item.address
      })
      cb(result);
    })
  }
  //选中搜索到的地址
  selectAddress(item) {
    // this.$set(this.mapInfo, 'type', 'singleData')
    this.$set(this.mapInfo, 'data', item);
    this.$set(this.ruleForm, 'longitude', item.location.x)
    this.$set(this.ruleForm, 'latitude', item.location.y)
    this.$set(this.ruleForm, 'districtName', item.address);
    // 调用地图方法获取districtCode
    this.$refs.detailMap['getDistrictCode'](item.location).then(result => {
      this.$set(this.ruleForm, 'districtCode', result.address_component.adcode);
      this.$refs.detailMap['setMapDiot'](this.mapInfo);
    })
  }


  // 获取附件信息列表
  getAttachList(data) {
    this.ruleForm.attachmentList = data
  }

  //公开或抄送下拉数据
  getOrg(item) {
    this.orgInfo = [];
    item.forEach(it => {
      this.orgInfo.push({
        reportId: it,
        reportName: '',
        reportType: '1',
      });
    })
  }
  //保存公开或抄送
  saveFun() {
    let params = {
      infoId: this.editId,
      copyList: this.orgInfo,
      reason: ''
    };
    //公开 open
    if (this.type == '1') {
      let infoParams = { infoId: this.editId ? this.editId : '' }
      this.http.DetailOperationsRequest.open(infoParams).then((res) => {
        if (res.status == 200) {
          this.$message('公开成功！')
          this.saveCall();
        } else {
          this.$message(res.msg)
        }
      })
    } else {
      this.http.DetailOperationsRequest.copy(params).then((res) => {
        if (res.status == 200) {
          this.$message('抄送成功！')
          this.saveCall();
        } else {
          this.$message(res.msg)
        }
      })
    }

  }

  /**
   * 取消公开/抄送
   * Author by chenzheyu
   */
  cancelOpen() {
    this.$message('取消公开/抄送')
    this.saveCall()
  }

  saveCall() {
    this.viewDialog = false;
    this.getBack();
  }
  // 返回
  /**
  * 从列表的草稿按钮进入编辑，返回需要进列表页，路由参数加了参数type
  * Modify by lihuihui
  */
  getBack() {
    //呈报上报页面
    if (!this.isAdd) {
      if (this.getRoute().type == 'draft') {
        this.go('/information/infoManage')
      } else {
        this.go('/information/detailsManage', { id: this.$route.query.id })
      }

    } else {
      //新增页面
      this.go('/information/infoManage')
    }
  }

  // 获取解析数据
  getparsedata(val: Object) {
    let arrLenth = Object.getOwnPropertyNames(val)
    let newObj = {}
    for (let i = 0; i < arrLenth.length; i++) {
      if (val[arrLenth[i]]) {
        newObj[arrLenth[i]] = val[arrLenth[i]]
      }
    }
    newObj = Object.assign({}, this.ruleForm, newObj)
    this.$set(this, 'ruleForm', newObj)
    if (newObj['incidentDate']) {
      this.initTime = new Date(newObj['incidentDate'].replace('-', '/'))
    } else {
      this.ruleForm['incidentDate'] = new Date()
    }
    if (newObj['reportDate']) {
      this.initTime = new Date(newObj['reportDate'].replace('-', '/'))
    } else {
      this.ruleForm['reportDate'] = new Date()
    }
    //获取信息后，得到位置对应的经纬度,地图数据更新，给地图发送消息
    //this.$set(this.mapInfo, 'data', [data.longitude, data.latitude])
  }

  /**
   * author by 刘文磊动态模板number的校验
   */
  validateNumber(rule, value, callback) {
    if (value) {
      let data = /^(0|[1-9]\d*)$/.test(value)
      if (!data) {
        return callback(new Error('请输入正整数'))
      }
    } else {
      callback()
    }
  }

  /**
   * author by 刘文磊动态模板float的校验
   */
  validateFloat(rule, value, callback) {
    if (value) {
      let data = /^(([1-9]\d*)|(0{1}))(\.\d{1,2})?$/.test(value)
      if (!data) {
        return callback(new Error('请输入正数最多两位小数'))
      }
    } else {
      callback()
    }
  }
}

