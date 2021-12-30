import { ControllerBase, Inject, Watch, Prop } from 'prism-web'
import { timeFormat, downloadFuncs } from '../../../assets/libs/commonUtils'



export class CurrentSpecialListController extends ControllerBase {
  private temp = {
    style: require('../style/currentSpecialList.less')
  }
  constructor() {
    super()
  }
  @Inject('http') http: any
  // @Prop() propdata
  // @Watch('propdata')
  // getpropdata(val){
  //     // this.description=""
  //     console.log(val)
  // }
  private currentTime: any = new Date(new Date().setHours(23, 59, 59, 0)).toJSON()
  private person: any = [{ personName: '请选择人员' }]
  // 当前时间绑定数据
  private initTime = timeFormat(new Date())
  @Watch("initTime")
  async timeChange(val) {
    this.person = [{ personName: '请选择人员' }]
    this.currentTime = timeFormat(val)
    await this.getCampaignDetail()
    console.log(this.currentTime)
  }
  // // 开始时间绑定数据
  // private initStartTime = timeFormat(new Date())
  // @Watch("initStartTime")
  // startTimeChange(val) {
  //   this.ruleForm.startTime = timeFormat(val)
  // }
  // // 结束时间绑定数据
  private initEndTime = ''
  @Watch("initEndTime")
  change(val) {
    // this.ruleForm.endTime = timeFormat(val)
    console.log(val, 888)
    // console.log(indec, 888)
    // console.log(jdex, 888)
  }

  //向弹出框配置参数
  private dialogConfig: Object = {
    viewDialog: false, //弹框是否显示
    templateName: '', //弹框组件名
    tilteName: '',//标题头
    propsData: {}
  }
  private ruleForm: any = {
    currentTime: '', //当前时间
    startTime: '', //开始时间
    endTime: '', //结束时间
  }
  private options: any = []
  private objectoptions: any = []
  private inspectoptions: any = []
  private problemNum: any = [
    {
      problemContent: '',
    }
  ];
  private counterNum: any = [
    {
      objectName: '',
      industryName: '',
      districtCode: '',
      objectProblemAddDTOs: [
        {
          problemContent: '',
        }
      ]
    }
  ];
  private currentSpecialId: any = '';
  private counter: any =
    {
      dailyAcitivity: '',
      majorActivityId: '',
      dailyActivityId: '',
      workGroupAddDTOs: [
        {
          groupName: '',
          groupRemarks: '',
          districtCode: '',
          inspectObjectAddDTOS: [
            {
              objectName: '',
              industryName: '',
              districtCode: '',
              objectProblemAddDTOs: [
                {
                  problemContent: '',
                }
              ]
            }
          ],
          workGroupMemberAddDTOs: [
            {
              personId: '',
            },
          ]
        }
      ]
    }
  private activityName: any = '';
  // private activityName: any = '';

  private institution: Array<any> = [];
  private institution1: Array<any> = [];
  //接收单位配置参数
  private optionProps = {
    value: 'id',
    label: 'label',
    children: 'children',
    emitPath: false,
    multiple: false,
    checkStrictly: true
  }
  private orgtree: any = [];
  private restaurants: any = [];

  private value: any = '';
  private isDetail: boolean = false; // 判断有没有详情
  mounted() {
    if (this.$route.query.cname) {
      console.log(this.$route.query.majorActivityId, 999)
      this.activityName = this.$route.query.cname;
      this.currentTime = this.$route.query.dailyAcitivity
      let detail = {
        majorActivityId: this.$route.query.majorActivityId,
        dailyAcitivity: this.$route.query.dailyAcitivity
      }
      this.getDetail(detail)
    } else {
      this.getNewSpecialCampaign();
    }
    this.getAllSpecialCampaign()
    // this.getNewSpecialCampaign();
    this.getOrgTree()
    this.getDistrictTrees()
    this.getDistrictTrees1()
    // console.log(this.dialogConfig['propsData'], 8888)
    // console.log(this.counter.workGroupAddDTOs[0].groupName)
  }
  // mounted() {

  // }
  // // 时间选择器
  // private start_Date = {
  //   disabledDate: time => {
  //     return time.getTime() > Date.now()
  //   }
  // }

  // 获取最新专项
  async getNewSpecialCampaign() {
    await this.http.SpecialCampaignRequest.getNewSpecialCampaign().then(res => {
      if (res.status == 200) {
        // 默认选中最新专项
        this.activityName = res.data.activityName;
        this.ruleForm.startTime = res.data.startTime;
        this.ruleForm.endTime = res.data.endTime;
        this.currentSpecialId = res.data.majorActivityId;
        this.getCampaignDetail(); //查看详情
      }
    });
  }
  // 获取所有专项
  getAllSpecialCampaign() {
    this.http.SpecialCampaignRequest.allSpecialCampaignList().then(res => {
      if (res.status == 200) {
        this.options = res.data;
        // console.log(this.options)
      }
    });
  }
  // 切换专项下拉框
  async getCurrent(val) {
    // 切换改变当前专项开始结束时间
    this.person = [{ personName: '请选择人员' }]
    this.ruleForm.startTime = this.options[val].startTime;
    this.ruleForm.endTime = this.options[val].endTime;
    this.currentSpecialId = this.options[val].majorActivityId;
    await this.getCampaignDetail(); //查看详情
    // console.log(this.currentSpecialId, 888)
  }

  getCampaignDetail() {
    let detailParam = {
      majorActivityId: this.currentSpecialId,
      dailyAcitivity: ''
    }
    detailParam.dailyAcitivity = new Date(new Date(this.currentTime).setHours(23, 59, 59, 0)).toJSON()
    this.getDetail(detailParam)
  }
  getDetail(item) {
    this.http.SpecialCampaignRequest.getCampaignDetail(item).then(res => {
      if (res.status == 200) {
        if (res.data.workGroupListDTOs !== null && res.data.workGroupListDTOs.length > 0) {
          this.isDetail = true
          this.counter.dailyActivityId = res.data.dailyActivityId;
          let propList = res.data.workGroupListDTOs
          let person1 = []
          for (let i = 0; i < propList.length; i++) {
            if (i > 0) {
              this.person.push({ personName: '' })
            }
            this.person[i].personName = propList[i].workGroupMember
            // person1.push(propList[i].workGroupMemberAddDTOs)
            // this.person[i].personName = ''
            // for(let i = 0;i<person1.length;i++) {
            //   for (let k=0;k<person1[i].length;k++) {
            //     if(k > 0){
            //       this.person.push({personName: ''})
            //     }
            //     this.person[k].personName += person1[i][k].personName + '/'
            //   }
            // }
            for (let j = 0; j < propList[i].inspectObjectAddDTOS.length; j++) {
              // debugger
              console.log(propList, 17788)
              propList[i].inspectObjectAddDTOS[j].objectProblemAddDTOs = []
              for (let p = 0; p < propList[i].inspectObjectAddDTOS[j].objectProblemListDTOs.length; p++) {
                propList[i].inspectObjectAddDTOS[j].objectProblemAddDTOs[p] = propList[i].inspectObjectAddDTOS[j].objectProblemListDTOs[p];
              }
            }
          }
          this.$set(this.counter, 'workGroupAddDTOs', propList)
          console.log(this.counter, 3333)
        } else {
          let propList1 = [
            {
              groupName: '',
              groupRemarks: '',
              districtCode: '',
              inspectObjectAddDTOS: [
                {
                  objectName: '',
                  industryName: '',
                  districtCode: '',
                  objectProblemAddDTOs: [
                    {
                      problemContent: '',
                    }
                  ]
                }
              ],
              workGroupMemberAddDTOs: [
                {
                  personId: 'feiyanshi1820d1wudada47e15101936',
                },
              ]
            }
          ]
          this.$set(this.counter, 'workGroupAddDTOs', propList1)
          this.isDetail = false
        }
      }
    });
  }
  // 保存
  saveDraft() {
    this.counter.dailyAcitivity = new Date(new Date(this.currentTime).setHours(23, 59, 59, 0)).toJSON()
    this.counter.majorActivityId = this.currentSpecialId
    console.log(this.counter, 8887777)
    if (this.isDetail == false) {
      this.counter.dailyActivityId = ''
      this.http.SpecialCampaignRequest.addCampaignData(this.counter).then(res => {
        if (res.status == 200) {
          this.$message({
            message: res.msg,
            type: 'success'
          });
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          });
        }
      });
    } else {
      if (this.$route.query.cname) {
        this.counter.majorActivityId = this.$route.query.majorActivityId
      }
      this.counter.dailyAcitivity = new Date(new Date(this.currentTime).setHours(23, 59, 59, 0)).toJSON()
      this.http.SpecialCampaignRequest.modifyCampaignData(this.counter).then(res => {
        if (res.status == 200) {
          this.$message({
            message: res.msg,
            type: 'success'
          });
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          });
        }
      });
      console.log('有详情', 66)
    }

    // console.log(saveParams, 66)
    // console.log(this.counterNum, 77)
    // console.log(this.problemNum , 999)
  }

  addNewWork() {
    console.log(this.counter.workGroupAddDTOs.slice(-1)[0], 999)
    console.log(this.person.slice(-1)[0].personName, 999)
    if (this.counter.workGroupAddDTOs.slice(-1)[0].groupName == '' ||
      this.counter.workGroupAddDTOs.slice(-1)[0].districtCode == '' ||
      this.person.slice(-1)[0].personName === "请选择人员" ||
      this.counter.workGroupAddDTOs.slice(-1)[0].inspectObjectAddDTOS[0].objectName == '' ||
      this.counter.workGroupAddDTOs.slice(-1)[0].inspectObjectAddDTOS[0].districtCode == '' ||
      this.counter.workGroupAddDTOs.slice(-1)[0].inspectObjectAddDTOS[0].objectProblemAddDTOs[0].problemContent == '' 
      ) {
      this.$message({
        message: '请先录入信息',
        type: 'warning'
      });
    } else {
      this.counter.workGroupAddDTOs.push({
        groupName: '',
        groupRemarks: '',
        districtCode: '',
        inspectObjectAddDTOS: [
          {
            objectName: '',
            industryName: '',
            districtCode: '',
            objectProblemAddDTOs: [
              {
                problemContent: '',
              }
            ]
          }
        ],
        workGroupMemberAddDTOs: [
          {
            personId: '',
          },
        ]
      })
      this.$message({
        message: '新增成功',
        type: 'success'
      });
      this.person.push({ personName: '请选择人员' })
    }

    // console.log(this.counter.workGroupAddDTOs, 999)
  }
  // 删除工作组
  detailNewWork() {
    if (this.counter.workGroupAddDTOs.length > 1) {
      this.counter.workGroupAddDTOs.pop()
    } else {
      this.$message({
        message: '只有一个督查对象，不能进行删除',
        type: 'warning'
      });
    }
  }
  addObject(idex) {
    console.log(idex)
    console.log(this.counter, 7766)
    // this.counter.workGroupAddDTOs[idex].inspectObjectAddDTOS.slice(-1)[0].problemContent == ''
    if (this.counter.workGroupAddDTOs[idex].inspectObjectAddDTOS.slice(-1)[0].objectName == '' ||
      this.counter.workGroupAddDTOs[idex].inspectObjectAddDTOS.slice(-1)[0].districtCode == '') {
      this.$message({
        message: '请先录入信息',
        type: 'warning'
      });
    } else {
      this.counter.workGroupAddDTOs[idex].inspectObjectAddDTOS.push({
        objectName: '',
        industryName: '',
        districtCode: '',
        objectProblemAddDTOs: [
          {
            problemContent: '',
          }
        ]
      })
    }
  }
  // 删除督查对象
  detailObject(idex) {
    if (this.counter.workGroupAddDTOs[idex].inspectObjectAddDTOS.length > 1) {
      this.counter.workGroupAddDTOs[idex].inspectObjectAddDTOS.pop()
    } else {
      this.$message({
        message: '只有一个督查对象，不能进行删除',
        type: 'warning'
      });
    }
  }
  getOrgTree() {
    this.http.SpecialCampaignRequest.getOrgTrees().then(res => {
      this.orgtree = res.data.treeData
    });
  }
  getDistrictTrees() {
    this.http.SpecialCampaignRequest.getDistrictTrees().then(res => {
      if (res.status == 200) {
        this.institution = res.data
      }
    });
  }
  addProblem(idex, jdex) {
    console.log(idex, jdex)
    console.log(this.counter.workGroupAddDTOs[idex].inspectObjectAddDTOS[jdex].objectProblemAddDTOs.slice(-1), 888111)
    if (this.counter.workGroupAddDTOs[idex].inspectObjectAddDTOS[jdex].objectProblemAddDTOs.slice(-1)[0].problemContent == '') {
      this.$message({
        message: '请先录入问题',
        type: 'warning'
      });
    } else {
      this.counter.workGroupAddDTOs[idex].inspectObjectAddDTOS[jdex].objectProblemAddDTOs.push({
        problemContent: '',
      })
    }
  }
  detailProblem(idex, jdex) {
    console.log(idex, jdex)
    if (this.counter.workGroupAddDTOs[idex].inspectObjectAddDTOS[jdex].objectProblemAddDTOs.length > 1) {
      this.counter.workGroupAddDTOs[idex].inspectObjectAddDTOS[jdex].objectProblemAddDTOs.pop()
    } else {
      this.$message({
        message: '只有一个问题，不能进行删除',
        type: 'warning'
      });
    }
  }
  getDistrictTrees1() {
    this.http.SpecialCampaignRequest.getDistrictTrees().then(res => {
      if (res.status == 200) {
        this.institution1 = res.data
      }
    });
  }
  // 模糊查询
  async querySearch(queryString, cb) {
    // console.log(queryString)
    var user = {
      autoCompleteName: queryString,
      completeType: 'obj'
    }
    //这里是从后台获取数据
    await this.http.SpecialCampaignRequest.getAutoComplete(user).then(res => {
      var arr = res.data;
      for (let x = 0; x < arr.length; x++) {
        this.restaurants.push({ value: '' })
        this.restaurants[x].value = arr[x].autoCompleteName
      }
      console.log(this.restaurants, 888)
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results);

    });
  }
  // 模糊查询
  async querySearch1(queryString, cb) {
    // console.log(queryString)
    var user = {
      autoCompleteName: queryString,
      completeType: 'industry'
    }
    //这里是从后台获取数据
    await this.http.SpecialCampaignRequest.getAutoComplete(user).then(res => {
      var arr = res.data;
      for (let x = 0; x < arr.length; x++) {
        this.restaurants.push({ value: '' })
        this.restaurants[x].value = arr[x].autoCompleteName
      }
      console.log(this.restaurants, 888)
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results);

    });
  }
  createFilter(queryString) {
    return (restaurant) => {
      return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
    };
  }
  handleSelect(item) {
    console.log(item);
  }
  handleSelect1(item) {
    console.log(item);
  }
  objectchange(val) {
    console.log(val)
  }
  selectPeople(item) {
    console.log(item, 11)
    this.dialogConfig['tilteName'] = "新增人员"
    this.dialogConfig['viewDialog'] = true
    this.dialogConfig['templateName'] = "enterprise-problem"
    this.dialogConfig['propsData'].index = item
  }
  closeDialogCall() {
    //关闭弹框
    this.dialogConfig['viewDialog'] = false
  }
  proplenum(val, item) {
    if (val.length > 0) {
      this.person[item].personName = ''
      for (let i = 0; i < val.length; i++) {
        this.person[item].personName += val[i].personName + '/'
      }
      let arr = []
      val.forEach(function (item) {
        arr.push({ personId: item.personId })
      });
      this.counter.workGroupAddDTOs[item].workGroupMemberAddDTOs = arr
    }
  }

  changeplace(index){
    // console.log(this.counter.workGroupAddDTOs[index].districtCode, 999)
    if(this.counter.workGroupAddDTOs[index].districtCode == '360000') {
      this.$message({
        message: '不能选择江西省',
        type: 'warning'
      });
    }
  }
  changeplace1(index, jndex) {
    if(this.counter.workGroupAddDTOs[index].inspectObjectAddDTOS[jndex].districtCode == '360000') {
      this.$message({
        message: '不能选择江西省',
        type: 'warning'
      });
    }
  }
}