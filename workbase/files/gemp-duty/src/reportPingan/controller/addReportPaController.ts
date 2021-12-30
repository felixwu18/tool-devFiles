import { ControllerBase, Inject, Watch } from 'prism-web'
// import searchSession from '../../../assets/libs/searchData'
// import { baseUrl } from '../../../service/config/base'
// import { isRegExp } from 'util';
// import { get } from 'http';
import { timeFormat, downloadFuncs } from '../../../assets/libs/commonUtils'
import searchSession from '../../../assets/libs/searchData'
// import Recorder from '../../../../assets/libs/recorder.mp3.min.js'
// const Recorder = require('../../../assets/libs/recorder.mp3.min.js')
const $ = require('jquery')
// const vgif = require('../../../assets/image/videogif.gif')
// const transferImg = require('../../../assets/image/transfer.png')

export class addReportPaController extends ControllerBase {
  constructor() {
    super()
  }
  @Inject("http") http: any
  private temp = {
    style: require('../style/addReportPa.less')
  }
   // 事发时间绑定数据
   private initTime = timeFormat(new Date())
   @Watch("initTime")
   timeChange(val) {
     this.ruleForm.dailyTime = timeFormat(val)
   }
   
    // 时间选择器
  private start_Date = {
    disabledDate: time => {
      return time.getTime() > Date.now()
    }
  }
  private msgData: any = {
    limit:'office'
  }


  private ruleForm: any = {
    dailyId:'',
    dailyTitle: '', //标题
    dailyTime: '', //时间
    dailyContent:'', //内容
    attachmentList: [] // 上传附件列表
  }
  private messageDom: any = null // message实体 
  private btnShow:any 

  private rules = {
    //by 刘文磊 
    dailyTitle: [{ required: true, message: '请输入事件标题', trigger: 'blur' }],
    dailyTime: [{ required: true, message: '请输入上报时间', trigger: 'change' }],
    dailyContent: [{ required: true, message: '请输入信息描述', trigger: 'blur' }],
  }
  private role :any

  created() {
    this.ruleForm['dailyTitle'] = `${searchSession.getter({ name: 'role' }).orgName || ''} ${timeFormat(new Date(),false)} 报平安`   //标题
    this.ruleForm['dailyTime'] = timeFormat(new Date())   //时间
    this.role = JSON.parse(window.sessionStorage.getItem('role'))
    console.log(this.role.isGj)
    this.role.isGj?this.btnShow = false:this.btnShow = true

  }


  getBack() {
    this.go('/reportPingan/reportPinganList')
  }

  getDomData(e) {
    this.ruleForm.dailyContent = '今日无突发事件发生，平安。'
  }

  async saveDraftPre() {
    let drafsform = this.ruleForm;
    const res = await this.http.GempInfoBaseRequest.saveReportPingan(drafsform)
    if (res.status !== 200) {
      return
    }
    this.$message.success('上报成功！')
    this.$router.push('/reportPingan/reportPinganList')
  }

  async saveDraftPr() {
    const obj = {
      dailyTime: this.ruleForm.dailyTime
    }
    const res = await this.http.GempInfoBaseRequest.getIsReportPinganData(obj)
    console.log(res)
      if (res.status !== 200) {
        return
      }
      
      if(res.data.dailyId){
        // this.$set(this.ruleForm, 'dailyId', res.data.dailyId)
          this.$confirm('当前单位已上报，是否要覆盖？', "提示", {
            confirmButtonText: '确定',
            cancelButtonText: "取消",
            confirmButtonClass: 'confirmButtonClass',
            cancelButtonClass: "confirmButtonClass",
        }).then(() => {this.saveDraftPre()})
      }else{
        this.saveDraftPre()
      }
  }

   saveDraft() {
    // this.$set(this.ruleForm, 'dailyId', this.getRoute().id)
    if (!this.ruleForm['dailyContent']) {
      if (this.messageDom) {
        this.messageDom.close();
      }
      this.messageDom = this.$message({
        type: 'warning',
        message: '请填写内容',
      });
      return false;
    }else{
      if (this.ruleForm['dailyContent'].length > 500) {
        if (this.messageDom) {
          this.messageDom.close();
        }
        this.messageDom = this.$message({
          type: 'warning',
          message: '内容最大长度为500',
        });
        return false;
      }
    }
    if (!this.ruleForm['dailyTitle']) {
      if (this.messageDom) {
        this.messageDom.close();
      }
      this.messageDom = this.$message({
        type: 'warning',
        message: '请填写标题',
      });
      return false;
    } else {
      if (this.ruleForm['dailyTitle'].length > 50) {
        if (this.messageDom) {
          this.messageDom.close();
        }
        this.messageDom = this.$message({
          type: 'warning',
          message: '标题最大长度为50',
        });
        return false;
      } else {
        // let error = document.getElementsByClassName('el-form-item__error')
        // if (error.length > 0) {
        //   if (this.messageDom) {
        //     this.messageDom.close()
        //   }
        //   this.messageDom = this.$message({
        //     type: 'warning',
        //     message: '请按提示正确填写信息'
        //   })
        //   return false
        // }
        this.saveDraftPr()
      }
    }
  }
}
