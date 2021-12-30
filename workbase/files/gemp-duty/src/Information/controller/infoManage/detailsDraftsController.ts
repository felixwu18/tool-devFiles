import { ControllerBase, Inject, Watch } from 'prism-web';
import searchSession from '../../../../assets/libs/searchData'
const matchFormRegex = require('../../../../assets/libs/matchFormRegex')
const {nationList} = require('../../../../assets/libs/nation')

export class detailsEditController extends ControllerBase {
  constructor() {
    super();
  }
  private nationList: any = nationList;

  // 危化选项的id列表
  private list: string[] = [ '170203000000', '170203010000', '170203020000', '170203030000', '170203040000', '170203050000', '170203990000',]
  //信息新增和呈报上报页面：公开和抄送
  private isOpenAndcopy: Boolean = false;

  //公开和抄送弹框显示
  private viewDialog: Boolean = false;
  //人员列表弹框显示
  private personListDialog: Boolean = false;
  // 当前人员状态
  private currentPersonstatus: string = ""
  // 当前类型事故人员数
  private currentPersonNumber: any = 0
  // 是否有未保存的状态
  private isSave: Boolean = false
  // 当前受伤人员类型
  private currentPersonType: string = ""
  // 当前值班人员
  private currentDutyPerson: Array<any> = [];
  // 值班人员树数据
  private dutyPersonTreeDate: Array<any> = [];
  // 被选择的值班人员
  private selectedDutyPerson: Array<any> = [];
  // 格式化后的被选择的值班人员
  private selectedDp: Array<any> = [];
  // 所有伤亡人数的ID
  private allDeathPersonId: Array<any> = [];
  // 人员列表数据
  private tableData: Array<any> = []
  //接收单位配置参数
  private optionProps = {
    value: 'orgCode',
    label: 'orgName',
    children: 'list',
    multiple: true,
  }
  //公开或抄送的数据
  private type: string = '1';
  private orgInfo: Array<any> = [];

  //报送单位名称
  private orgName: string = ""

  // 是否显示智能模板解析
  private showTemplate: boolean = false;

  private distCodeList: any = []

  // input的placeholder
  private eventTypePlaceholder: string = '请输入事件类型关键字'

  // 时间选择器
  private start_Date = {
    disabledDate: time => {
      return time.getTime() > Date.now()
    }
  }

  // 公开选项是否显示
  get isPublicStatu() {
    return searchSession.getter({ name: 'role' }).sysPublicSwitch === 'N';
  }

  get activeData() {
    return this.tableData.filter((item, index) => {return this.currentPersonType === item.type})
  }

  // 点击取消按钮
  private cancelPersonState(value) {
    value.isEdit = false
    value.disabled = true
    this.isSave = false
    this.findByInfoIdAndType(value.type);
  }

  // 事发时间绑定数据
  private initTime = new Date();
  @Watch('initTime')
  timeChange(val) {
    this.ruleForm.incidentDate = val;
  }

  // 接报时间绑定数据
  private initTime2 = new Date()
  @Watch("initTime2")
  timeChange2(val) {
    this.ruleForm.reportDate = val
  }

   // 修改经纬度更新地图显示
  //  @Watch("ruleForm.latitude", {deep:true})
  //  latitudeChange() {
  //    this.$set(this.mapInfo, 'data', { location: { x: this.ruleForm.longitude, y: this.ruleForm.latitude } });
  //    this.$refs.detailMap['getAddressToDiot'](this.mapInfo); // 设置地图点
  //  }
 
  //  @Watch("ruleForm.longitude", {deep:true})
  //  longitudeChange() {
  //    this.$set(this.mapInfo, 'data', { location: { x: this.ruleForm.longitude, y: this.ruleForm.latitude } });
  //    this.$refs.detailMap['getAddressToDiot'](this.mapInfo); // 设置地图点
  //  }

  // 事发企业列表
  private timer: any = null
  private timer2: any = null;
  private loading: boolean = false
  private whpEntList: any[] = []
  private tempRuleForm: any;
  private ruleForm = {
    deathNum: 0, // 死亡人数
    seriousInjureNum: null, // 重伤人数
    minorInjureNum: null, // 轻伤人数
    lossNum: null, // 失踪人数
    trappedNum: null, // 受困人数
    eventLevelCode: '', // 事件等级
    eventType: '', // 事件类型
    incidentDate: new Date(), // 事发时间
    infoAddress: '', // 事发地点
    infoDescription: '', // 事件描述
    infoId: '', // 信息ID,新增制空
    infoTitle: '', // 信息标题
    infoType: '', // 信息类型
    latitude: '', // 纬度
    longitude: '', // 经度
    woundNum: 0, // 受伤人数
    distName: '', // 行政区划名称
    distCode: '', // 行政区划码
    attachmentList: [], // 上传附件列表
    elements: [], //动态模板
    reportDate: new Date(), // 接报时间
    reportWay: 0, // 接报方式
    editer: '', // 编辑人
    // checker: '', // 校对人
    // issuer: '', // 签发人
    whpEntId: '', // 企业id
    whpParkId: '', // 工业园区id
    whpEntName: '',
    whpParkName: '',
  };

  selectEventType(val) {
    this.getDynamic(val);
  }

  private rules = {
    reportWay: [{ required: true, message: '请选择接报方式', trigger: 'change' }],
    editer: [{ required: true, message: '请输入编辑者', trigger: 'blur' }],
    // checker: [{ required: true, message: '请输入校对者', trigger: 'blur' }],
    // issuer: [{ required: true, message: '请输入签发者', trigger: 'blur' }],
    // woundNum: [{type:'number',message:'请输入数字',trigger:['change','blur']}],
    // deathNum: [{type:'number',message:'请输入数字',trigger:['change','blur']}],
    // seriousInjureNum: [{type:'number',message:'请输入数字',trigger:['change','blur']}],
    // minorInjureNum: [{type:'number',message:'请输入数字',trigger:['change','blur']}],
    // lossNum: [{type:'number',message:'请输入数字',trigger:['change','blur']}],
    // trappedNum: [{type:'number',message:'请输入数字',trigger:['change','blur']}],
    woundNum: [{ validator: this.validateNum, trigger: ['change', 'blur'] }],
    deathNum: [{ validator: this.validateNum, trigger: ['change', 'blur'] }],
    seriousInjureNum: [{ validator: this.validateNum, trigger: ['change', 'blur'] }],
    minorInjureNum: [{ validator: this.validateNum, trigger: ['change', 'blur'] }],
    lossNum: [{ validator: this.validateNum, trigger: ['change', 'blur'] }],
    trappedNum: [{ validator: this.validateNum, trigger: ['change', 'blur'] }],
    reportDate: [{ required: true, message: '请输入接报时间', trigger: 'change' }],
    distCode: [{required: true, message: '请选择行政区划', trigger: 'change'}],
    infoTitle: [
      { required: true, message: '请输入信息标题', trigger: 'blur' },
      { max: 50, message: '最大长度为50', trigger: 'change' },
    ],
    incidentDate: [
      { required: true, message: '请输入事发时间', trigger: 'change' },
    ],
    infoAddress: [{required: true, message: '请输入事发地点', trigger: ['change', 'blur']}],
    eventLevelCode: [{ message: '请输入事件等级', trigger: 'change' }],
    eventType: [{ required: true, message: '请输入事件类型', trigger: 'change' }],
    infoDescription: [
      { required: true, message: '请输入信息描述', trigger: 'blur' },
    ],
    latitude: [{ required: true, message: '请输入经度', trigger: 'blur' }],
    longitude: [{ required: true, message: '请输入纬度', trigger: 'blur' }],
    whpEntId: [{ required: true, message: '请选择下拉列表中的事发企业', trigger: 'blur' }],
  };

  // 信息级别列表
  private scaleList: Array<any> = [];
  private role: object;
  private reportRoleLevel: boolean;

  private mapInfo: Object = {
    type: 'geometry-location',
  };

  private temp = {
    style: require('../../style/infoManage/detailsEdit.less'),
  };

  @Inject('http') http: any;
  private editId;
  private messageDom: any = null; // message实体

  created() {
    let route = this.getRoute();
    this.editId = route.id;
    this.isOpenAndcopy = false;
    // this.getEditData();
    this.$set(this.mapInfo, 'type', 'geometry-location');
    this.role = JSON.parse(sessionStorage.getItem('role'));
    this.orgName = this.role['orgName']
    this.reportRoleLevel = this.role['isBuYjb'];

    // 获取信息级别
    this.getInfoLevelList();
    // 获取抄送人员数据
    // this.getdutyPersonTree();

    this.getDistrictCodeList();
  }

  // 获取行政区划列表
  private getDistrictCodeList() {
    this.http.GempInfoBaseRequest.getDistCodeList().then(res => {
        if (res.status === 200) {
            this.distCodeList = res.data.map((item: any) => ({
                distCode: item.districtCode,
                distName: item.orgName === '市本级' ? '成都市' : item.orgName,
            }));
        }
    })
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
    if (!this.ruleForm['infoTitle']) {
      if (this.messageDom) {
        this.messageDom.close();
      }
      this.messageDom = this.$message({
        type: 'warning',
        message: '请填写标题',
      });
      return false;
    } else {
      if (this.ruleForm['infoTitle'].length > 50) {
        if (this.messageDom) {
          this.messageDom.close();
        }
        this.messageDom = this.$message({
          type: 'warning',
          message: '标题最大长度为50',
        });
        return false;
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
        this.http.GempInfoBaseRequest.toDraft({ ...drafsform, reportDate: new Date(drafsform.reportDate).toJSON()}).then(item => {
          // item.data = drafsform
          if (item.status === 200) {
            this.$message('存储为草稿成功！');
            this.$router.push(
              '/information/detailsManage?id=' + item.data,
            );
            //this.$router.push('/information/infoManage')
          }
        });
        //     }
        //   }
        // });
      }
    }
  }

  // 按照部门获取值班人员
  private getdutyPersonTree() {
    let data: any = {
      dutyDate: new Date(),
      // orgCode: ""
    }
    this.http.GempInfoBaseRequest.getCurrentDutyPerson(data).then(item => {
      if (item.status === 200) {
        this.dutyPersonTreeDate = item.data;
      }
    }) 
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
    this.currentPersonType = type;
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
      if(total > this.currentPersonNumber) {
        this.currentPersonNumber = total;
        this.beforeOpenListPop[this.numType[type]] = this.currentPersonNumber;
      }
    })
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
    if(this.ruleForm[prop] < total) {
      this.ruleForm[prop] = total;
    }
    if(this.ruleForm[prop] === total) {
      this.$refs.ruleForm['validateField'](prop, async valid => {});
    }
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
        console.log("......")
        // this.tableData = [];
      }
    })  
  }

  // 接收人数据
  getReceiverData() {
    this.selectedDp= []
    this.selectedDutyPerson.forEach(it => {
      this.selectedDp.push({
        reportId: it[it.length-1],
        reportName: '',
        reportType: '2',
      });
    })
  }

  // 增加人员列表
  private addPersonList() {
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

  // 点击保存按钮
  private savePersonState(value) {
    (this.$message as any).closeAll();
    if(!value.name) {
      this.$message({
        type: "warning",
        message: "姓名不能为空！"
      })
      return;
    }
    if(value.country && value.idCard && value.country.indexOf('中国') > -1 && !matchFormRegex.default.IDCardNo.regexFun(value.idCard)) {
      this.$message.warning('身份证号码错误！');
      return false;
    }
    if(value.country && value.nation && value.country.indexOf('中国') > -1) {
      let tempInc = this.nationList.findIndex((it) => {
        return it.name === value.nation;
      });
      if(tempInc ===  -1) {
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
      if(value.randomId) {
        this.tableData = this.tableData.filter((item, index) => {
          return item.randomId !== value.randomId
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
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
      type: this.currentPersonType
    }
    this.http.GempInfoBaseRequest.updateDeathPersonState(data).then(item => {
      if (item.status === 200) {
        // 如果是新建，就把添加的伤亡id推入数组
        if(!this.ruleForm.infoId) {
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

  // 改变经纬度获取地图数据
  private changeLonLatGetData(val, index) {
    if (index === '1') {
      this.$set(this.mapInfo, 'data', { location: { x: this.ruleForm.longitude, y: val } });
    } else {
      this.$set(this.mapInfo, 'data', { location: { x: val, y: this.ruleForm.latitude } });
    }
    this.$refs.detailMap['getAddressToDiot'](this.mapInfo); // 设置地图点
  }

  // 处理点击国不在中国的提示
  private mapStatusTips(data) {
    this.$message({
      type: 'warning',
      message: data
    })
  }

  // 提交上报信息
  // by 刘文磊 动态模板添加提交校验
  async addReportInfo() {
    try {
      this.$refs.ruleForm['validate'](async valid => {
        if (!valid) {
          if (this.messageDom) {
            this.messageDom.close();
          }
          this.messageDom = this.$message({
            type: 'warning',
            message: '请按提示正确填写信息',
          });
          return false;
        } else {
          let error = document.getElementsByClassName('el-form-item__error');
          if (error.length > 0) {
            if (this.messageDom) {
              this.messageDom.close();
            }
            this.messageDom = this.$message({
              type: 'warning',
              message: '请按提示正确填写信息',
            });
            return false;
          } else {
            const response = await this.$confirm(!this.role['isYjb'] ? '是否上报该信息？' : '是否抄报该信息？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            })
      
            if(response != 'confirm') {
              return
            }
            this.getReceiverData() // 格式化接收人数据
            //上报
            this.http.GempInfoBaseRequest.add({ ...this.ruleForm, copyPersonList: this.selectedDp, personIds: this.allDeathPersonId, reportDate: new Date(this.ruleForm.reportDate).toJSON() }).then(res => {
              if (res.status === 200) {
                this.editId = res.data;
                this.showOpenAndcopy();
              } else {
                this.$message({
                  type: 'error',
                  message: '信息录入失败!',
                });
              }
            });
          }
        }
      });
    } catch (error) {
      // no thing
    }
  }

  /**
   * 抄报
   */
  copyReport() {
    if (this.ruleForm.reportDate.getTime() <= this.ruleForm.incidentDate.getTime()) {
      this.$message({
        type: 'warning',
        message: '接报时间不能小于或等于事发时间'
      })
      return false
    }
    if (!this.ruleForm.latitude || !this.ruleForm.longitude) {
      this.ruleForm.infoAddress = ''
      return this.$message.warning('请在所输入内容下拉框中选择对应的事发地址！')
    }
    this.$refs.ruleForm['validate'](valid => {
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
        } else {
          this.$confirm('是否提交该信息？','提示')
            .then(() => {
              this.sendCopyReport();
            });
        }
      }
    })
  }

  showOpenAndcopy() {
    this.$confirm(this.role['isYjb'] ? '是否抄送该信息？' : '是否继续抄送该信息','提示')
      .then(_ => {
        this.viewDialog = true;

        this.orgInfo = [];
      })
      .catch(_ => {
        this.$message({
          type: 'success',
          message: this.role['isYjb'] ? '上报成功！' : '抄送成功',
        });
        this.saveCall();
      });
  }

  // 获取编辑信息数据
  getEditData() {
    let infoParams = { infoId: this.$route.query.id };
    this.http.GempInfoBaseRequest.getInfoById(infoParams).then(res => {
      let data = Object.assign({}, this.ruleForm, res.data);
      this.$set(this, 'ruleForm', data);
      this.tempRuleForm = {
        deathNum: data.deathNum, // 死亡人数
        seriousInjureNum: data.seriousInjureNum, // 重伤人数
        minorInjureNum: data.minorInjureNum, // 轻伤人数
        woundNum: data.woundNum, // 受伤人数
        lossNum: data.lossNum, // 失踪人数
        trappedNum: data.trappedNum, // 受困人数
      };
      if (this.ruleForm.eventLevelCode ===" ") {
        this.$set(this.ruleForm, 'eventLevelCode', '');
      }
      if (data.incidentDate) {
        this.initTime = new Date(data.incidentDate.replace('-', '/'));
      } else {
        this.ruleForm['incidentDate'] = new Date();
      }
      if (data.reportDate) {
        this.initTime2 = new Date(data.reportDate.replace('-', '/'));
      } else {
        this.ruleForm['reportDate'] = new Date();
      }
      if (this.ruleForm.eventType && !this.ruleForm.elements)
        this.getDynamic(this.ruleForm.eventType);
      //获取信息后，得到位置对应的经纬度,地图数据更新，给地图发送消息
      this.$set(this.mapInfo, 'data', {location: {x: res.data.longitude, y: res.data.latitude}});
      this.$refs.detailMap['setMapDiot'](this.mapInfo); // 设置地图点
      //this.$refs.detailMap['postMesgToMap'](this.mapInfo);

      this.querySearchAsync(data.whpEntName)
    });
  }

  // 获取信息级别
  getInfoLevelList() {
    this.http.GempInfoBaseRequest.getInfoLevel({}).then(item => {
      if (item.status === 200) {
        this.scaleList = item.data;
      }
    });
  }

  /**
   * author by 刘文磊 动态模板获取
   */
  getDynamic(type) {
    this.http.InfoDutyRequest.getDynamicTemp(type).then(res => {
      if (res.status == 200) {
        this.ruleForm.elements = res.data.dynamicElements;
      }
    });
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

  // 地图渲染完成
  mapRenderFinish() {
    this.getEditData();
    // this.$refs.detailMap['setMapDiot'](this.mapInfo); // 设置地图点
    // this.$refs.detailMap['setMapDiot'](this.mapInfo) 
  }

  //事发地点搜索地址
  searchAddress(val, cb) {
    this.ruleForm.longitude = this.ruleForm.latitude = ''
    val = encodeURI(val);
    this.$refs.detailMap['searchKeyWord'](val).then(result => {
      result.forEach(item => {
        item.value = item.address;
      });
      cb(result);
    });
  }
  //选中搜索到的地址
  selectAddress(item) {
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
    this.ruleForm.attachmentList = data;
  }

  //公开或抄送下拉数据
  getOrg(item) {
    console.log('ddd');

    this.orgInfo = [];
    item.forEach(it => {
      this.orgInfo.push({
        reportId: it,
        reportName: '',
        reportType: '1',
      });
    });
  }
  //保存公开或抄送
  saveFun() {
    if (this.type == "1") {
      if(!this.role['isYjb']){
        this.$message({
          type: 'success',
          message: this.role['isYjb'] ? '上报成功！' : '抄送成功',
        })
        this.saveCall();
      }else{
        this.sendCopyReport()
      }
    } else {
        if (this.orgInfo.length == 0) {
          if (this.messageDom) {
            this.messageDom.close();
          }
          this.messageDom = this.$message({
            type: 'warning',
            message: '请选择抄送单位',
          });
          return false
        }
        this.http.GempInfoBaseRequest.add(this.ruleForm).then(res => {
          if (res.status === 200) {
            this.editId = res.data
            if (this.type == '2') { //定向抄送
              this.afterCopy()
            } else if (this.type == '3') { //公开 open
              this.afterOpen()
            }
          } else {
            this.$message({
              type: 'error',
              message: '信息录入失败!'
            })
          }
        })
    }
  }
  sendCopyReport() {
    this.getReceiverData() // 格式化接收人数据
    const value = Object.assign({}, this.ruleForm, {copyPersonList: this.selectedDp})
    this.http.GempInfoBaseRequest.copyReport(value).then(res => {
      if (res.status === 200) {
        this.editId = res.data
        this.saveCall()
      } else {
        this.$message({
          type: 'error',
          message: '信息录入失败!'
        })
      }
    })
  }
  /**
   * 定向抄送
   */
  afterCopy() {
    this.getReceiverData() // 格式化接收人数据
    let params = {
      infoId: this.editId,
      copyList: this.orgInfo,
      reason: '',
      copyPersonList: this.selectedDp,
    }
    if (params.copyList.length == 0) {
      if (this.messageDom) {
        this.messageDom.close();
      }
      this.messageDom = this.$message({
        type: 'warning',
        message: '请选择抄送单位',
      });
      return false
    }
    this.http.DetailOperationsRequest.copy(params).then((res) => {
      if (res.status == 200) {
        this.$message.success('抄送成功！')
        this.saveCall();
      } else {
        this.$message(res.msg)
      }
    })
  }
  /**
   * 本级公开
   */
  afterOpen() {
    let infoParams = { infoId: this.editId ? this.editId : '' }
    this.http.DetailOperationsRequest.open(infoParams).then((res) => {
      if (res.status == 200) {
        this.$message('公开成功！')
        this.saveCall();
      } else {
        this.$message(res.msg)
      }
    })
  }
  /**
   * 取消公开/抄送
   * Author by chenzheyu
   */
  cancelOpen() {
    this.$message('取消信息抄报');
    this.saveCall();
  }

  saveCall() {
    this.viewDialog = false;
    this.getBack();
  }
  // 返回
  getBack() {
    //呈报上报页面
    if (this.getRoute().type == 'fromDraft') {
      this.go('/information/detailsManage', { id: this.$route.query.id });
    } else {
      //新增页面
      this.go('/information/infoManage');
    }
    // if(!this.isAdd) {
    //   this.go('/information/detailsManage',{id:this.$route.query.id})
    // } else {
    //   //新增页面
    //   this.go('/information/infoManage')
    // }
  }

  // 获取解析数据
  getparsedata(val: Object) {
    let arrLenth = Object.getOwnPropertyNames(val);
    let newObj = {};
    for (let i = 0; i < arrLenth.length; i++) {
      if (val[arrLenth[i]]) {
        newObj[arrLenth[i]] = val[arrLenth[i]];
      }
    }
    newObj = Object.assign({}, this.ruleForm, newObj);
    this.$set(this, 'ruleForm', newObj);
    if (newObj['incidentDate']) {
      this.initTime = new Date(newObj['incidentDate'].replace('-', '/'));
    } else {
      this.ruleForm['incidentDate'] = new Date();
    }
    if (newObj['reportDate']) {
      this.initTime2 = new Date(newObj['reportDate'].replace('-', '/'));
    } else {
      this.ruleForm['reportDate'] = new Date();
    }
    //获取信息后，得到位置对应的经纬度,地图数据更新，给地图发送消息
    //this.$set(this.mapInfo, 'data', [data.longitude, data.latitude])
  }

  /**
   * author by 刘文磊动态模板number的校验
   */
  validateNumber(rule, value, callback) {
    if (value) {
      let data = /^(0|[1-9]\d*)$/.test(value);
      if (!data) {
        return callback(new Error('请输入正整数'));
      }
    } else {
      callback();
    }
  }

  /**
   * author by 刘文磊动态模板float的校验
   */
  validateFloat(rule, value, callback) {
    if (value) {
      let data = /^(([1-9]\d*)|(0{1}))(\.\d{1,2})?$/.test(value);
      if (!data) {
        return callback(new Error('请输入正数最多两位小数'));
      }
    } else {
      callback();
    }
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

  //校验正整数
  validateNum(rule, value, callback) {
    if(!this.editId) {
      if (value == 0 || value == null) return callback()
      if (!value) {
        return callback(new Error("请输入正整数"))
      }
      else {
        if (!/^\+?(0|[1-9][0-9]*)$/.test(value)) {
          return callback(new Error("请输入正整数"))
        } else {
          // return callback()
          const fullField = rule.fullField;
          if(this.activeData.length === 0) {
            return callback()
          }
          if(this.ruleForm[fullField] >= this.activeData.length) {
            return callback();
          }
          clearTimeout(this.timer2);
          this.timer2 = setTimeout(() => {
            if(this.ruleForm[fullField] < this.activeData.length) {
              this.ruleForm[fullField] = this.activeData.length;
              this.$refs.ruleForm['validateField'](fullField, async valid => {});
            }
          }, 1000);
          return callback(new Error("与人员详细信息数量不一致"));
        }
      }
    }
    const fullField = rule.fullField;
    this.findByInfoIdAndType(this.numType[fullField], (tableData) => {
      const num = tableData.length;
      if(value == 0 || value == null) {
        if(num === 0) {
          return callback()
        }
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          if(this.ruleForm[fullField] < num) {
            this.ruleForm[fullField] = num;
            this.$refs.ruleForm['validateField'](fullField, async valid => {});
          }
        }, 1500);
        return callback(new Error("与人员详细信息数量不一致"));
      }
      if (!value) {
        return callback(new Error("请输入正整数"))
      }
      else {
        if (!/^\+?(0|[1-9][0-9]*)$/.test(value)) {
          return callback(new Error("请输入正整数"))
        } else {
          if(value < num) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
              if(this.ruleForm[fullField] < num) {
                this.ruleForm[fullField] = num;
                this.$refs.ruleForm['validateField'](fullField, async valid => {});
              }
            }, 1000);
            return callback(new Error("与人员详细信息数量不一致"));
          }
          return callback()
        }
      }
    });
  }

  changeIdCard(val, row) {
    if(!val) {
      return;
    }
    if(row.country.indexOf('中国') > -1) {
      if(val.length !== 18) {
        this.$message.warning('身份证号码错误！');
        return false;
      }
      if(!matchFormRegex.default.IDCardNo.regexFun(val)) {
        this.$message.warning('身份证号码错误！');
        return false;
      }
    }
  }

  // 搜索事发企业
  async querySearchAsync(queryString: string) {
    if(this.timer) { // 防抖
      clearTimeout(this.timer)
      this.timer = null
    }

    if(!queryString.trim().length) {
      return 
    }

    this.timer = setTimeout(async () => {
      this.loading = true
      const res = await this.http.GempDangerousEnterprise.gempDangerousEnterpriseList({ enterpriseName: queryString})

      this.loading = false
      if(res.status === 200) {
        this.whpEntList = res.data.list
      }
    }, 3e2)
  }

  // 选择事发企业
  async handlewhpEntListSelect(enterpriseId) {
    const find = this.whpEntList.find(item => item.enterpriseId === enterpriseId)
    if(find) {
      this.ruleForm.whpParkId = find.id
      this.ruleForm.whpParkName = find.typeName
      this.ruleForm.whpEntName = find.name
    }
    // if(find) {
    //   this.ruleForm.whpParkId = find.parkId
    //   this.ruleForm.whpParkName = find.parkName
    //   this.ruleForm.whpEntName = find.enterpriseName
    // }
  }
}
