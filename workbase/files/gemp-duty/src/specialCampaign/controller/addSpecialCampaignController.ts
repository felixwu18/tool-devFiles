import { ControllerBase, Inject, Watch } from 'prism-web'
import { timeFormat, downloadFuncs } from '../../../assets/libs/commonUtils'

// import { getRequestUrl } from '../../../assets/libs/commonUtils'


export class addSpecialCampaignController extends ControllerBase {
  private temp = {
    style: require('../style/addSpecialCampaign.less')
  }
  constructor() {
    super()
  }
  @Inject('http') http:any
  // 当前时间绑定数据
  private initTime = timeFormat(new Date())
  @Watch("initTime")
  timeChange(val) {
    this.ruleForm.currentTime = timeFormat(val)
  }
  // // 开始时间绑定数据
  // private initStartTime = timeFormat(new Date())
  // @Watch("initStartTime")
  // startTimeChange(val) {
  //   this.ruleForm.startTime = timeFormat(val)
  // }
  // // 结束时间绑定数据
  // private initEndTime = timeFormat(new Date())  
  // @Watch("initEndTime")
  // endTimeChange(val) {
  //   this.ruleForm.endTime = timeFormat(val)
  // }
  
  private rules = { 
    currentSpecial: [{ required: true, message: '请输入当前专项名称', trigger: 'blur' }],
    // currentTime: [{ required: true, message: '请选择当前时间', trigger: 'change' }],
    startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
    endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  }
  private ruleForm: any = {
    currentSpecial: '',
    description: '', // 活动说明
    currentTime: '', //当前时间
    startTime: '', //开始时间
    endTime:'', //结束时间
  }
  // 时间选择器
  private start_Date = {
    disabledDate: time => {
      return time.getTime() > Date.now()
    }
  }
  // private value1 = new Date(new Date().setHours(0, 0, 0, 0)).toJSON()
  // private value2 = new Date(new Date().setHours(23, 59, 59, 0)).toJSON()
  created(){
    if (this.$route.query.id) {
      console.log(this.$route.query.id, 999)
      this.ruleForm.currentSpecial = this.$route.query.activityName
      this.ruleForm.description = this.$route.query.acitivityContent
      this.ruleForm.startTime = this.$route.query.startTime
      this.ruleForm.endTime = this.$route.query.endTime
    }
  }
  saveDraft() {
      if (this.$route.query.id) {
        let prarm = {
          activityName: this.ruleForm.currentSpecial,
          majorActivityId: this.$route.query.id || '',
          endTime:　'',
          startTime: '',
        }
        prarm.startTime = this.ruleForm.startTime
        prarm.endTime = this.ruleForm.endTime
        this.http.SpecialCampaignRequest.modifySpecialCampaign(prarm).then(res=> {
          if (res.status !== 200) {
            this.$message.error(res.msg);
            return;
          }
          if (res.status == 200) {
            this.$message({
              message: res.msg,
              type: 'success'
            });
            this.$router.push({path: '/specialCampaign/specialCampaignList'})  
          }
        });
      } else {
        let prarms = {
          activityName: this.ruleForm.currentSpecial,
          acitivityContent: this.ruleForm.description,
          endTime:　'',
          startTime: '',
        }
        prarms.startTime = new Date(this.ruleForm.startTime.setHours(0, 0, 0, 0)).toJSON()
        prarms.endTime = new Date(this.ruleForm.endTime.setHours(23, 59, 59, 0)).toJSON()
        this.http.SpecialCampaignRequest.addSpecialCampaign(prarms).then(res=> {
          if (res.status !== 200) {
            this.$message.error(res.msg);
            return;
          }
          if (res.status == 200) {
            this.$message({
              message: res.msg,
              type: 'success'
            });
            this.$router.push({path: '/specialCampaign/specialCampaignList'})  
          }
        });
      }
  }
  // 返回
  getBack() {
    this.go('/specialCampaign/specialCampaignList')
  }
  
}