import { ControllerBase, Inject, Watch} from 'prism-web'
import searchSession from '../../../../assets/libs/searchData'
import { timeFormat, dateStandard } from '../../../../assets/libs/commonUtils'

export class DestineControler extends ControllerBase {
  constructor() {
    super()
  }
  
  private temp = {
    style: require('../../style/conferencereserve/destine.less')
  }
  @Inject('http') http: any
  private showSearch = false //精确搜索栏显示 by 刘文磊

  private messageDom: any = null //message实体
  private showTime: any = '' //展示的时间

  // 列表查询参数
  private searchData: object = {
    startTime: "",
    endTime: "", //结束时间
  }

  private tabledata: object = {}

  // 列表时间查询参数
  private search_time: any = new Date()

  private MondayTime: any = ''
  private TuesdayTime: any = ''
  private WednesdayTime: any = ''
  private ThursdayTime: any = ''
  private FridayTime: any = ''
  private SaturdayTime: any = ''
  private SundayTime: any = ''

  created() {
    this.getListData()
  }
  Tweek() {
    this.search_time = new Date()
    this.getListData()
  }
  getListData() {
    let nowTime = this.search_time.getTime() ;
    let day = this.search_time.getDay();
    let oneDayTime = 24*60*60*1000 ;
    let MondayTime = nowTime - (day-1)*oneDayTime ;//显示周一
    let SundayTime =  nowTime + (7-day)*oneDayTime ;//显示周日
    this.showTime = timeFormat(new Date(MondayTime),false) + " 至 " + timeFormat(new Date(SundayTime),false)

    this.MondayTime = timeFormat(new Date(MondayTime),false)
    this.TuesdayTime = timeFormat(new Date(nowTime - (day-2)*oneDayTime),false)
    this.WednesdayTime = timeFormat(new Date(nowTime - (day-3)*oneDayTime),false)
    this.ThursdayTime = timeFormat(new Date(nowTime - (day-4)*oneDayTime),false)
    this.FridayTime = timeFormat(new Date(nowTime - (day-5)*oneDayTime),false)
    this.SaturdayTime = timeFormat(new Date(nowTime - (day-6)*oneDayTime),false)
    this.SundayTime = timeFormat(new Date(SundayTime),false)
    
    this.searchData['startTime'] = timeFormat(new Date(MondayTime),false)
    this.searchData['endTime'] = timeFormat(new Date(SundayTime),false)
    this.http.ConferenceroomRequest.calendar(this.searchData).then(res => {
      if (res.status == 200) {
        let arr = res.data
       var result = [];
       for(var i=0;i < arr.length;i+=7){
        result.push(arr.slice(i,i+7))
       }
       this.tabledata = result
      }
    })

  }
  getChangeData(){
    let changedate = this.search_time.setDate(this.search_time.getDate()+1)
    this.search_time = new Date(changedate)
    this.getListData()
  }

  add(day) {
    
    if(new Date(day.dtime).getTime() >= new Date().getTime()){
      this.$router.push({
        path: '/conferenceroom/addDestine',
        query: { roomId:day.roomId, dtime:day.dtime, roomName:day.roomName},
      });
    }else{
      this.$message({ type: "error", message: "会议室已过预定时限，无法预定" })
    }
  }

  edit(id,time) {
    this.$router.push({
      path: '/conferenceroom/editDestine',
      query: { roomId:id,dtime:time},
    });
  }

  searchDate(flag) {
    if(flag>0){
      let changedate = this.search_time.setDate(this.search_time.getDate()+8)
      this.search_time = new Date(changedate)
    }else{
      let changedate = this.search_time.setDate(this.search_time.getDate()-6)
      this.search_time = new Date(changedate)
    }
    this.getListData()
  }

  closeDialogCall(callInfo) {
    this.getListData()
  }
}