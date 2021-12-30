import { ControllerBase, Inject, Watch } from 'prism-web'
import { timeFormat, getRequestUrl } from '../../../../assets/libs/commonUtils'
import searchSession from '../../../../assets/libs/searchData'
const $ = require('jquery')

export class AddDestineControler extends ControllerBase {
  constructor() {
    super()
  }
  @Inject("http") http: any
  private temp = {
    style: require('../../style/conferencereserve/addManagement.less')
  }
  
  private ruleForm: any = {
    roomId: "",
    enablingMultimedia:'0',
    meetingAgenda: "",
    meetingDate: "",
    meetingEndTime:'',
    meetingStartTime: '',
    operatorName: '',
    operatorPhone: '',
    participantNum: '',
    remarks: '',
    reserveDept: '',
    reserveName: '',
    reservePhone: '',
    roomName: '',
    usingLeader: ''
  }

  private messageDom: any = null // message实体

  private rules = {
    meetingStartTime: [{ required: true, message: '请选择会议开始时间', trigger: ['change', 'blur'] }],
    participantNum: [{ required: true, type: 'number', message: '请输入数字', trigger: ['change', 'blur'] }],
    meetingEndTime: [{ required: true, message: '请选择会议结束时间', trigger: ['change', 'blur'] }],
    reserveName: [{ required: true, message: '请输入预订人', trigger: ['change', 'blur'] }],
    reserveDept: [{ required: true, message: '请输入预订人处室', trigger: ['change', 'blur'] }],
    reservePhone: [{ required: true, message: '请输入预订人电话', trigger: 'change' },{ validator: this.validatePhone, trigger:  ['change', 'blur'] },],
    meetingAgenda: [{ required: true, message: '请输入会议议题', trigger: ['change', 'blur'] }],
  }

  created() {
    this.ruleForm['meetingDate'] = this.$route.query.dtime
    this.ruleForm['roomName'] = this.$route.query.roomName
    this.ruleForm['roomId'] = this.$route.query.roomId
    let role = searchSession.getter({ name: "role" }) || {}
    if(role.cellphone){
      this.ruleForm['operatorPhone'] = role.cellphone
    }
    if(role.name){
      this.ruleForm['operatorName'] = role.name
    }
  }

  //校验手机号
  validatePhone(rule, value, callback) {
    if (!value) {
          return callback(new Error("请输入正确的联系电话"))
        }else {
          if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) {
          return callback(new Error("请输入正确的联系电话"))
        } else {
          return callback()
        }
      }
    }

    async saveDraftPr() {
      let drafsform = this.ruleForm;
      const res = await this.http.ConferenceroomRequest.addDestine(drafsform)
      if (res.status !== 200) {
        if (this.messageDom) {
          this.messageDom.close();
        }
        this.messageDom = this.$message({
          type: 'warning',
          message: res.msg
        });
        return false
      }
      this.$message.success('添加成功！')
      this.$router.push('/conferenceroom/conferencereserve')
    }

  saveDraft() {
    if (!this.ruleForm['participantNum']) {
      if (this.messageDom) {
        this.messageDom.close();
      }
      this.messageDom = this.$message({
        type: 'warning',
        message: '请填写会议人数',
      });
      return false;
    }else if (!this.ruleForm['meetingStartTime']) {
      if (this.messageDom) {
        this.messageDom.close();
      }
      this.messageDom = this.$message({
        type: 'warning',
        message: '请选择会议开始时间',
      });
      return false;
    }else if (!this.ruleForm['meetingEndTime']) {
      if (this.messageDom) {
        this.messageDom.close();
      }
      this.messageDom = this.$message({
        type: 'warning',
        message: '请选择会议结束时间',
      });
      return false;
    }else if (!this.ruleForm['reserveName']) {
      if (this.messageDom) {
        this.messageDom.close();
      }
      this.messageDom = this.$message({
        type: 'warning',
        message: '请填写预订人',
      });
      return false;
    }else if (!this.ruleForm['reserveDept']) {
      if (this.messageDom) {
        this.messageDom.close();
      }
      this.messageDom = this.$message({
        type: 'warning',
        message: '请填写预订人处室',
      });
      return false;
    }else if (!this.ruleForm['reserveDept']) {
      if (this.messageDom) {
        this.messageDom.close();
      }
      this.messageDom = this.$message({
        type: 'warning',
        message: '请填写预订人处室',
      });
      return false;
    }else if (!this.ruleForm['reserveDept']) {
      if (this.messageDom) {
        this.messageDom.close();
      }
      this.messageDom = this.$message({
        type: 'warning',
        message: '请填写预订人处室',
      });
      return false;
    }else if (!this.ruleForm['reserveDept']) {
      if (this.messageDom) {
        this.messageDom.close();
      }
      this.messageDom = this.$message({
        type: 'warning',
        message: '请填写预订人处室',
      });
      return false;
    }else if (!this.ruleForm['reservePhone']) {
      if (this.messageDom) {
        this.messageDom.close();
      }
      this.messageDom = this.$message({
        type: 'warning',
        message: '请填写预订人电话',
      });
      return false;
    }else if (!this.ruleForm['meetingAgenda']) {
      if (this.messageDom) {
        this.messageDom.close();
      }
      this.messageDom = this.$message({
        type: 'warning',
        message: '请填写会议议题',
      });
      return false;
    }else {
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
      this.saveDraftPr()
    }
  }

  // async getData(data?) {
  //   let id = this.$route.query.roomId
  //   let params = {
  //     roomId: id,
  //   };
  //   await this.http.ConferenceroomRequest.historyDetail(data?data:params).then(item => {
  //     this.$set(this, 'ruleForm', item.data);
  //   });
  // }


  getBack() {
    this.go('/conferenceroom/conferencereserve')
  }
}
