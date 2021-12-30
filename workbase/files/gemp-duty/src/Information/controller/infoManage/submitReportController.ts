import { ControllerBase, Inject, Watch } from 'prism-web'
import { showLoading } from 'service/Loading/loading';
import searchSession from '../../../../assets/libs/searchData'

export class detailsEditController extends ControllerBase {
  constructor() {
    super()
  }

  private previewshow = false
  private previewUrl = ""
  private title: string
  //添加页面地址搜索的值
  private searchAddr: string = '';
  //信息新增和呈报上报页面：公开和抄送
  private isOpenAndcopy: Boolean = false;

  // 全屏状态
  private fullScreenStatus: boolean = false

  // 是否显示智能模板解析
  private showTemplate: boolean = false
  //公开和抄送弹框显示
  private viewDialog: Boolean = false;
  //公开或抄送的数据
  private type: string = '1';
  private orgInfo: Array<any> = [];

  // input的placeholder
  private eventTypePlaceholder: string = '请输入事件类型关键字'

  // 事发时间绑定数据
  private initTime = new Date()
  @Watch("initTime")
  timeChange(val) {
    this.ruleForm.incidentDate = val
  }

  // 接报时间绑定数据
  private reportTime = new Date()
  @Watch("reportTime")
  reportTimeChange(val) {
    this.ruleForm.reportDate = val
  }



  // 控制地图显影
  private showMapFLag: boolean = false

  // 值班信息文档地址
  private docUrl: string = ''

  private ruleForm = {
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
    editer: "", // 编辑者
    checker: "", // 校对者
    issuer: "", // 签发者
    deathNum: null,  // 死亡人数
    woundNum: null,  // 受伤人数
    seriousInjureNum: null, //重伤人员
    minorInjureNum: null, // 轻伤人员
    lossNum: null,  // 失踪人员
    trappedNum: null, // 受困人员
    reportDate: new Date(), // 接报时间
    reportWay: "", // 接报方式
    districtCode: '', // 区划编码
    districtName: '' // 区划名称
  }

  private rules = {
    infoTitle: [{ required: true, message: '请输入信息标题', trigger: 'blur' }],
    incidentDate: [{ required: true, message: '请输入事发时间', trigger: 'change' }],
    reportDate: [{ required: true, message: '请输入接报时间', trigger: 'change' }],
    reportWay: [{ required: true, message: '请选择接报方式', trigger: 'change' }],
    infoAddress: [{ required: true, message: '请输入事发地点', trigger: ['change', 'blur'] }],
    eventLevelCode: [{ message: '请输入事发等级', trigger: 'change' }],
    eventType: [{ required: true, message: '请选择事件类型', trigger: 'change' }],
    // woundNum: [{ required: true, message: '请输入受伤人数', trigger: 'blur' },{type:'number',message:'请输入数字',trigger:['change','blur']}],
    // deathNum: [{ required: true, message: '请输入死亡人数', trigger: 'blur' },{type:'number',message:'请输入数字',trigger:['change','blur']}],
    // seriousInjureNum: [{ required: true, message: '请输入重伤人数', trigger: 'blur' },{type:'number',message:'请输入数字',trigger:['change','blur']}],
    // minorInjureNum: [{ required: true, message: '请输入轻伤人数', trigger: 'blur' },{type:'number',message:'请输入数字',trigger:['change','blur']}],
    // lossNum: [{ required: true, message: '请输入失踪人数', trigger: 'blur' },{type:'number',message:'请输入数字',trigger:['change','blur']}],
    // trappedNum: [{ required: true, message: '请输入受困人数', trigger: 'blur' },{type:'number',message:'请输入数字',trigger:['change','blur']}],
    woundNum: [{ validator: this.validateNum, trigger: ['change', 'blur'] }],
    issueNumber: [{ validator: this.validateNum, trigger: ['change', 'blur'] }],
    deathNum: [{ validator: this.validateNum, trigger: ['change', 'blur'] }],
    seriousInjureNum: [{ validator: this.validateNum, trigger: ['change', 'blur'] }],
    minorInjureNum: [{ validator: this.validateNum, trigger: ['change', 'blur'] }],
    lossNum: [{ validator: this.validateNum, trigger: ['change', 'blur'] }],
    trappedNum: [{ validator: this.validateNum, trigger: ['change', 'blur'] }],
    infoDescription: [{ required: true, message: '请输入信息描述', trigger: 'blur' }],
    latitude: [{ required: true, message: '请输入经度', trigger: 'blur' }],
    longitude: [{ required: true, message: '请输入纬度', trigger: 'blur' }],
    editer: [{ required: true, message: '请输入编辑者', trigger: 'blur' }],
    // checker: [{ required: true, message: '请输入校对者', trigger: 'blur' }],
    // issuer: [{ required: true, message: '请输入签发者', trigger: 'blur' }],
  }

  // 信息级别列表
  private scaleList: Array<any> = []

  // 是否展开更多要素信息
  private moreInfoFlag: boolean = true

  private mapInfo: Object = {
    type: 'geometry-location'
  };

  private temp = {
    style: require('../../style/infoManage/submitReport.less')
  }

  @Inject("http") http: any
  private editId
  private isAdd: Boolean = false
  private messageDom: any = null

  // 智能解析按钮是否显示
  get smartBtnStatu() {
    return searchSession.getter({ name: 'role' }).sysEreportSwitch === 'N';
  }
  // 重伤+轻伤不等于受伤
  // @Watch('ruleForm.seriousInjureNum', { deep: true })
  // private handleSeriousInjureNum() {
  //   if ((this.ruleForm.seriousInjureNum === null || this.ruleForm.seriousInjureNum === "") && (this.ruleForm.minorInjureNum === null || this.ruleForm.minorInjureNum === "")) {
  //     this.ruleForm.woundNum = null
  //   } else {
  //     this.ruleForm.woundNum = Number(this.ruleForm.seriousInjureNum) + Number(this.ruleForm.minorInjureNum)
  //   }
  // }

  // @Watch('ruleForm.minorInjureNum', { deep: true })
  // private handleMinorInjureNum() {
  //   if ((this.ruleForm.seriousInjureNum === null || this.ruleForm.seriousInjureNum === "") && (this.ruleForm.minorInjureNum === null || this.ruleForm.minorInjureNum === "")) {
  //     this.ruleForm.woundNum = null
  //   } else {
  //     this.ruleForm.woundNum = Number(this.ruleForm.seriousInjureNum) + Number(this.ruleForm.minorInjureNum)
  //   }
  // }

  created() {
    let route = this.getRoute();
    this.editId = route.id

    if (this.editId) {
      if (route.page == 'presenationReport') {
        this.title = '呈报上报'
        this.isOpenAndcopy = true
      } else {
        this.title = '编辑'
        this.isOpenAndcopy = false
      }
      this.getEditData()
      this.$set(this.mapInfo, 'type', 'geometry-location')
    } else {
      this.title = '新增'
      this.$set(this.mapInfo, 'type', 'geometry-location')
      this.isOpenAndcopy = true
      this.isAdd = true;
    }
    const vm = this
    // 获取信息级别
    this.getInfoLevelList()

  }

  mounted() {
    let that=this
    window.onresize = function(){
      if(!that.checkFull()){
        // 退出全屏后要执行的动作
        that.escwatch()
      }
    }
    // //方法二 监听全屏状态改变时的事件
    // (document as any).addEventListener('fullscreenchange', this.escwatch);
    // (document as any).addEventListener('webkitfullscreenchange', this.escwatch);
    // (document as any).addEventListener('mozfullscreenchange', this.escwatch);
    // (document as any).addEventListener('MSFullscreenChange', this.escwatch);

  }

  public handleFullScreen() {
    const el: any = document.getElementById("docUrl")
    // 判断是否已经是全屏
    // 如果是全屏，退出
    if (this.fullScreenStatus) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitCancelFullScreen) {
        (document as any).webkitCancelFullScreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
      console.log('已还原！');
    } else {    // 否则，进入全屏
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.webkitRequestFullScreen) {
        el.webkitRequestFullScreen();
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
      } else if (el.msRequestFullscreen) {
        // IE11
        el.msRequestFullscreen();
      }
      console.log('已全屏！');
    }
    // 改变当前全屏状态
    this.fullScreenStatus = !this.fullScreenStatus;
  }


  // 提交上报信息
  private addReportInfo() {
    if (this.ruleForm.reportDate.getTime() <= this.ruleForm.incidentDate.getTime()) {
      this.$message({
        type: 'warning',
        message: '接报时间不能小于或等于事发时间'
      })
      return false
    }
    this.$refs.ruleForm['validate'](valid => {
      console.log(valid)
      if (!valid) {
        if (this.messageDom) { this.messageDom.close() }
        this.messageDom = this.$message({
          type: 'warning',
          message: '请按提示正确填写信息'
        })
        return false
      } else {
        // let error = document.getElementsByClassName('el-form-item__error')
        // console.log(error.length)
        // if (error) {
        //   console.log(123)
        //   if (this.messageDom) { this.messageDom.close() }
        //   this.messageDom = this.$message({
        //     type: 'warning',
        //     message: '请按提示正确填写信息1'
        //   })
        //   return false
        // }
        this.$confirm('确认提交？','提示').then((_) => {
          if (this.editId) {//呈报上报页面
            this.$set(this.ruleForm, 'distCode', this.ruleForm.districtCode);
            this.$set(this.ruleForm, 'distName', this.ruleForm.districtName);
            this.http.GempInfoBaseRequest.presentat(this.ruleForm).then((res) => {
              if (res.status == 200) {
                // this.showOpenAndcopy();
                this.getBack()
              } else {
                this.$message(res.msg)
              }
            })
          }
        })
          .catch((_) => { })
      }
    })
  }

  // 处理点击国不在中国的提示
  private mapStatusTips(data) {
    this.$message({
      type: 'warning',
      message: data
    })
  }

  showOpenAndcopy() {
    this.$confirm('是否抄送该信息？','提示')
      .then((_) => {
        this.viewDialog = true;
      }).catch((_) => {
        this.$message({
          type: 'success',
          message: '上报成功！'
          // message: '抄送成功！'
        })
        this.saveCall();
      })
  }

  // 获取编辑信息数据
  // by 刘文磊 页面初始化加载动态模板
  async  getEditData() {
    let infoParams = { infoId: this.$route.query.id }
    await this.http.GempInfoBaseRequest.getInfoById(infoParams).then(res => {
      let data = Object.assign({}, this.ruleForm, res.data)
      // data.deathNum = data.deathNum || 0
      // data.woundNum = data.woundNum || 0
      // data.seriousInjureNum = data.seriousInjureNum || 0
      // data.minorInjureNum = data.minorInjureNum || 0
      // data.lossNum = data.lossNum || 0
      // data.trappedNum = data.trappedNum || 0
      this.$set(this, 'ruleForm', data)
      // this.ruleForm.checker = ""
      // this.ruleForm.issuer = ""
      this.ruleForm.editer = JSON.parse(sessionStorage.getItem('role')).name
      this.reportTime = new Date()
      this.ruleForm['reportDate'] = new Date()
      if (data.incidentDate) {
        this.initTime = new Date(data.incidentDate.replace('-', '/'))
      } else {
        this.ruleForm['incidentDate'] = new Date()
      }
      if (this.ruleForm.eventType && (!this.ruleForm.elements))
        this.getDynamic(this.ruleForm.eventType)
      //获取信息后，得到位置对应的经纬度,地图数据更新，给地图发送消息
      this.$set(this.mapInfo, 'data', { location: { x: res.data.longitude, y: res.data.latitude } });
      // this.$refs.detailMap['setMapDiot'](this.mapInfo); // 设置地图点
      //this.$refs.detailMap['postMesgToMap'](this.mapInfo);
    })
    // 获取值班信息文档
    let param = {
      infoId: this.ruleForm.infoId,
      orgCode: searchSession.getter({ name: 'role' }).orgCode
    }
    await this.http.GempInfoBaseRequest.getDoc(param).then((res) => {
      if (res.status == 200) {
        this.docUrl = res.data
      } else {
        this.$message(res.msg)
      }
    })
  }

  // 地图渲染完成
  mapRenderFinish() {
    this.$refs.detailMap['setMapDiot'](this.mapInfo); // 设置地图点
    // this.$refs.detailMap['setMapDiot'](this.mapInfo) 
  }

  // 监听标题/描述/编辑者/签发者修改更新文档方法
  docInfoTitle() {
    //编辑
    this.http.GempInfoBaseRequest.edit(this.ruleForm).then(item => {
      if (item.status === 200) {
        // 调文档方法
        // 获取值班信息文档
        let param = {
          infoId: this.ruleForm.infoId,
          orgCode: searchSession.getter({ name: 'role' }).orgCode
        }
        this.http.GempInfoBaseRequest.getDoc(param).then((res) => {
          if (res.status == 200) {
            this.docUrl = res.data
          } else {
            this.$message(res.msg)
          }
        })
      }
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


  // 获取事件类型选中列表
  // by 刘文磊 根据时间类型生成动态模板
  selectEventType(val) {
    // this.ruleForm.eventType = val
    this.getDynamic(val)
  }
  /**
* author by 刘文磊 动态模板获取
*/
  getDynamic(type) {
    this.http.InfoDutyRequest.getDynamicTemp(type).then(res => {
      if (res.status == 200) {
        this.ruleForm.elements = res.data.dynamicElements
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
  //   //事发地点搜索地址
  //   async searchAddress(val, cb) {
  //     let result = await this.$refs.detailMap['searchAddrByKey'](val);
  //     cb(result);
  //   }
  //   //选中搜索到的地址
  //   selectAddress(item){
  //     let latIn = item.name.split('-')
  //     this.$set(this.mapInfo, 'type', 'singleData')
  //     this.$set(this.mapInfo, 'data', [latIn[0], latIn[1]])
  //     this.$refs.detailMap['postMesgToMap'](this.mapInfo);
  //     this.$set(this.ruleForm, 'latitude', latIn[1])
  //     this.$set(this.ruleForm, 'longitude', latIn[0])
  //   }

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
  getBack() {
    //呈报上报页面
    if (!this.isAdd) {
      this.go('/information/detailsManage', { id: this.$route.query.id })
    } else {
      //新增页面
      this.go('/information/infoManage')
    }
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
  /**
   * 预览
   * author by liuwenlei
   */
  preview() {
    this.previewshow = true
    // this.previewshow = true
    this.http.GempInfoBaseRequest.getNotViewDoc(this.ruleForm).then(res => {
      if (res.status == 200) {
        this.previewUrl = res.data
          const el: any = document.getElementById("previewUrl")
          {    // 否则，进入全屏
            if (el.requestFullscreen) {
              el.requestFullscreen();
            } else if (el.webkitRequestFullScreen) {
              el.webkitRequestFullScreen();
            } else if (el.mozRequestFullScreen) {
              el.mozRequestFullScreen();
            } else if (el.msRequestFullscreen) {
              // IE11
              el.msRequestFullscreen();
            }
            console.log('已全屏！');
          }
      }
      else this.$message.error(res.msg)
    })
  }

  /**
   * 监听esc键盘事件
   */
  escwatch() {
      if (!this.checkFull()) {
        // 退出全屏后要执行的动作
        this.previewshow=false
    }
  }
  checkFull(){
    let isFull = (document as any).mozFullScreen||
		(document as any).fullScreen ||
		//谷歌浏览器及Webkit内核浏览器
		(document as any).webkitIsFullScreen ||
		(document as any).webkitRequestFullScreen ||
		(document as any).mozRequestFullScreen ||
		(document as any).msFullscreenEnabled
		if(isFull === undefined) {
        isFull = false
    }
    return isFull;
  }

  //校验正整数
  validateNum(rule, value, callback) {
    if(value == 0 || value == null) return callback()
    if (!value) {
        return callback(new Error("请输入正整数"))
    }
    else {
        if (!/^\+?(0|[1-9][0-9]*)$/.test(value)) {
            return callback(new Error("请输入正整数"))
        } else {
            return callback()
        }
    }
  }
}
