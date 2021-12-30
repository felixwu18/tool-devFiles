import { ControllerBase, Prop, Inject, Watch } from 'prism-web'
import xujian from '../../../assets/libs/xujian_cometd/sub'
import { log } from 'util'
export class PhonePanelController extends ControllerBase {
    constructor() {
        super()
    }

    private temp = {
        style: require("../style/phonePanel.less")
    }

    @Inject('http') http: any
    @Inject('funsion') funsion: any
    @Prop() callnumber // 传入拨打电话号码
    private meetData = {
        meetingId: "",
        phone: ""
    }
    private messageDom: any
    private phoneNumber: string = '' // 拨打电话号码
    private messageCount: any // 弹出框控制
    private searchList = []  //快速检索查出来的值
    private phonePanelValue = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '#', '0', '*']
    private liasionList = [] // 相关联系人列表
    // 通话状态
    private online: boolean = false
    private callDuration: string = "00:00:00"  //通话时长
    private interval: any //定时器
    // 通话人员
    private callPerson: object = {}
    private timeing = false
    @Watch("callnumber")
    watchNumber(val) {
        this.phoneNumber = val.sendUserInfoDTOS[0]['telNumber'].replace(/[^\d]/g, '')
        console.log( this.phoneNumber);
        this.changeSearchStatus(val.sendUserInfoDTOS[0]['telNumber'])
    }

    @Watch("phoneNumber")
    watchPhoneNumber(val) {
        if(val){
        this.changeSearchStatus(val)
        }
    }

    created() {
        xujian(this.getmessage, this.getfax, this.getAnswer)
        if (this.callnumber) {
            this.phoneNumber = this.callnumber.sendUserInfoDTOS[0]['telNumber'].replace(/[^\d]/g, '')
            this.changeSearchStatus(this.callnumber.sendUserInfoDTOS[0]['telNumber'])
        }

    }
    getmessage() { }
    getfax() { }
    /**
     * Author by chenzheyu
     * 添加phoneNumber号码
     * @param value
     */
    appendNumber(value: string) {
        this.phoneNumber += value
        this.changeSearchStatus(this.phoneNumber)
    }

    /**
     * Author by chenzheyu
     * 删除phoneNumber号码
     */
    deleteNumber() {
        if (this.phoneNumber.length > 0) {
            this.phoneNumber = this.phoneNumber.slice(0, this.phoneNumber.length - 1)
        }
    }

    /**
     * Author by chenzheyu
     * 切换关系人电话
     * @param num
     */
    toggleLiasion(num: string) {
        this.phoneNumber = num
    }

    /**
     * Author by liuwenlei
     * 单点呼叫功能
     */
    dial() {
        if (this.phoneNumber.length > 2) {
            this.online = true
            // 第三方
            // this.funsion.dial(this.phoneNumber)
            let params = {
                centerFlag: "0",
                sendUserInfoDTOS: this.callnumber.sendUserInfoDTOS,
                mask: true
            }
            params.sendUserInfoDTOS[0].telNumber = this.phoneNumber
            this.http.AddressBookRequest.telrecordPeople(params).then(res => {
                if (res.status == 200) {
                    this.meetData.meetingId = res.data
                    this.meetData.phone = this.phoneNumber
                } else {
                    this.$message.error(res.msg)
                }
            })
        } else {
            if(this.messageDom)
            this.messageDom.close()
            this.messageDom=this.$message.warning("最少输入3位号码");
        }
    }

    /**
     * Author by chenzheyu
     * 单点挂断功能
     */
    hangup() {
        this.http.AddressBookRequest.onecallOver(this.meetData).then(res => {
            if (res.status == 200 || res.status == 204) {
                this.online = false
                this.timeing = false
                window.clearInterval(this.interval)
                this.callDuration = "00:00:00"
            } else {
                this.$message.error(res.msg)
            }
        })
        // this.funsion.dialRelease()
    }

    /* author by  快速检索部分
   *  Modify by chenzheyu 完善电话快速检索功能
   */
  private peopledata= {
    nowPage: 1,
    orgCode: "",
    pageSize: 10,
    keyWord: "",
    mask:true
  }


  private timeout:any
    changeSearchStatus(val) {
        this.phoneNumber = this.phoneNumber.replace(/[^\d]/g, '')
        if (this.phoneNumber.length > 2) {
            this.peopledata.keyWord=val
            if(this.timeout)
            clearTimeout(this.timeout);
           this.timeout=setTimeout(()=>{

                this.http.AddressBookRequest.maillistPersion(this.peopledata).then(res => {
                    if (res.status === 200) {
                        this.liasionList = res.data
                        this.liasionList.forEach(item => {
                            if (item.telNumber == this.phoneNumber) {
                                this.$set(this, 'callPerson', item)
                            }
                        })
                    }
                })
            },1000)
        }else{
            this.liasionList=[]
        }
    }
    getCallDuration() {
        let start = 0;
        let second = 0
        this.interval = window.setInterval(() => {
            this.callDuration = this.callFormat(start, second)
            start++
            second++
            if (second > 59)
                second = 0
        }, 1000)
    }

    callFormat(interval: number, second): string {
        let hour = Math.floor(interval / 3600)
        interval = interval % 43200
        let minute = Math.floor(interval / 60)
        interval = interval % 3600
        let time = (hour >= 10 ? hour : '0' + hour) + ":" + (minute >= 10 ? minute : '0' + minute) + ":" + (second >= 10 ? second : '0' + second)
        return time
    }

    private sss = "hhh"
    // 号码接通函数
    getAnswer(val) {
        console.log(val);
        if (val.data.status == "callst_answer") {
            this.timeing = true
            window.clearInterval(this.interval)
            this.callDuration = "00:00:00"
            this.getCallDuration()
        }
        if (val.data.status == "callst_idle") {
            this.online = false
            window.clearInterval(this.interval)
            //  if (this.messageDom)
            //   this.messageDom.close() 
            //  this.messageDom = this.$message.warning("通话已结束")
        }
    }

}