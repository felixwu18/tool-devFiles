import { ControllerBase, Inject, Watch } from 'prism-web'
import { timeFormat, getRequestUrl } from '../../../../assets/libs/commonUtils'
import searchSession from '../../../../assets/libs/searchData'
const $ = require('jquery')

export class DetailHistoryControler extends ControllerBase {
  constructor() {
    super()
  }
  @Inject("http") http: any
  private temp = {
    style: require('../../style/conferencereserve/addManagement.less')
  }
  
  private ruleForm: any = {
    enablingMultimedia:'',
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

  private  detailUrlinfoId :any

  created() {
    if (this.$route.query.id) {
      this.getData();
    } else {
      var url = window.location.href;
      let urlCode = getRequestUrl(url)
      if (urlCode && urlCode['reserveId']) {
      this.detailUrlinfoId = urlCode['reserveId']
      let publi = { reserveId: this.detailUrlinfoId }
      this.getData(publi)
      }
    }
  }

  async getData(data?) {
    let id = this.$route.query.id
    let params = {
      reserveId: id,
    };
    await this.http.ConferenceroomRequest.historyDetail(data?data:params).then(item => {
      this.$set(this, 'ruleForm', item.data);
    });
  }


  getBack() {
    this.go('/conferenceroom/history')
  }
}
