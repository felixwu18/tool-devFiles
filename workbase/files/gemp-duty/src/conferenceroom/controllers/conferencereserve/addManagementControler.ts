import { ControllerBase, Inject, Watch } from 'prism-web'
import { timeFormat, downloadFuncs } from '../../../../assets/libs/commonUtils'
import searchSession from '../../../../assets/libs/searchData'
const $ = require('jquery')

export class AddManagementController extends ControllerBase {
  constructor() {
    super()
  }
  @Inject("http") http: any
  private temp = {
    style: require('../../style/conferencereserve/addManagement.less')
  }
  
  private ruleForm: any = {
    roomName:'',
    enabledFlag: "1",
    multimediaFlag: "0",
    surroundingNum:'',
    totalNum: '',
    chairmanNum: ''
  }
  private messageDom: any = null // message实体

  private rules = {
    roomName: [{ required: true, message: '请输入会议室名称', trigger: 'blur' }],
    surroundingNum: [{ required: false, type: 'number', message: '请输入数字', trigger: ['change', 'blur'] }],
    totalNum: [{ required: false, type: 'number', message: '请输入数字', trigger: ['change', 'blur'] }],
    chairmanNum: [{ required: false, type: 'number', message: '请输入数字', trigger: ['change', 'blur'] }],
  }


  created() {
    
  }


  getBack() {
    this.go('/conferenceroom/management')
  }

  async saveDraftPr() {
    let drafsform = this.ruleForm;
    const res = await this.http.ConferenceroomRequest.add(drafsform)
    if (res.status !== 200) {
      return
    }
    this.$message.success('添加成功！')
    this.$router.push('/conferenceroom/management')
  }

   saveDraft() {
    if (!this.ruleForm['roomName']) {
      if (this.messageDom) {
        this.messageDom.close();
      }
      this.messageDom = this.$message({
        type: 'warning',
        message: '请填写会议室名称',
      });
      return false;
    } else {
      if (this.ruleForm['roomName'].length > 50) {
        if (this.messageDom) {
          this.messageDom.close();
        }
        this.messageDom = this.$message({
          type: 'warning',
          message: '会议室名称最大长度为50',
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
        this.saveDraftPr()
      }
    }
  }
}
