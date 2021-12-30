import { ControllerBase, Inject, Prop, Emit } from 'prism-web';
export class FestivalEditController extends ControllerBase {
  constructor() {
    super();
  }

  @Inject('http') http: any;

  private searchlist = {
    holidayImportantId: "",
    dutyCategory: "0",
    orgCode: "",
  }
  // 带班人员列表
  private options = [];
  private tableData = [];

  created() {
    this.searchlist.holidayImportantId = this.$route.query.id.toString()
    this.searchlist.orgCode = this.$route.query.orgcode.toString()
    this.getPersonList()
    this.loadData()


  }


	/**
	 * 返回
	 */
  goBack() {
    this.$router.push({ path: "/workforceManagement/festival", query: this.$route.query });
  }

  /**
   * author by 刘文磊 获取人员列表
   */
  getPersonList() {
    this.http.LeaderShiftRequest.holidayPeople(this.searchlist).then(res => {
      if (res.status == 200) {
        this.options = res.data
      } else {
        this.$message.error(res.msg)
      }
    })
  }
  /**
   * author by 刘文磊 数据初始化
   */
  loadData() {
    this.http.LeaderShiftRequest.holidayList(this.searchlist).then(res => {
      if (res.status == 200) {
        if (res.data.list.length > 0)
          this.tableData = res.data.list;
        else {
          let arr = this.getALLDate(this.getRoute().start, this.getRoute().end)
          this.tableData = arr.map(item => {
            return item = {
              dutyCategory: "0",
              dutyDate: item,
              dutyWeek: this.getWeek(item),
              dutyPeopleId: '',
              dutyPeopleName: '',
              groupId: "",
              orgCode: this.searchlist.orgCode
            }
          })
        }
      } else {
        this.$message.error(res.msg)
      }
    });
  }

  /**
   * author by 刘文磊 选择人员下拉事件
   */
  peopleSelect(row) {
    for (let i = 0, length = this.options.length; i < length; i++) {
      if (row.dutyPeopleId == this.options[i].userId) {
        row.dutyPeopleName = this.options[i].userName
        row.groupId = this.options[i].groupId
      }
    }
  }
  /**
   * author by 刘文磊 保存
   */
  submit() {
    if (this.tableData[0].dutyArrangeId)
      this.holidayUpdate('holidayEdit')
    else {
      this.holidayUpdate('holidayUpdate')
    }

  }

  
  //author by 刘文磊 格式化时间工具 yyyy-mm-dd
  formatTime(time) {
    time = new Date(time)
    let mouth = time.getMonth() + 1 >= 10 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1)
    let day = time.getDate() >= 10 ? time.getDate() : '0' + time.getDate()
    return time.getFullYear() + '-' + mouth + '-' + day
  }

  /**
   * author by 刘文磊  获取时间天数
   */
  getALLDate(start, end) {
    let dateArr = []
    let startArr = new Date(start.replace(/\-\g/, "/")).getTime()
    let endArr = new Date(end.replace(/\-\g/, "/")).getTime()
    let jian = 24 * 60 * 60 * 1000
    let zhongjian = endArr - jian;
    for (let i = 1; startArr < zhongjian; i++) {
      zhongjian = endArr - jian * i
      if (startArr < zhongjian)
        dateArr.unshift(this.formatTime(zhongjian))
    }

    if (startArr == endArr) {
      dateArr.unshift(start)
      return dateArr
    }
    dateArr.unshift(start)
    dateArr.push(end)
    return dateArr
  }

  /**
   * author by 刘文磊 计算星期几
   */
  getWeek(val) {
    let weekArray = ['日', '一', '二', '三', '四', '五', '六']
    return "周" + weekArray[new Date(val).getDay()]
  }
  /**
   * author by liuwenlei 编辑或新增接口
   */ 
  holidayUpdate(meth) {
    let params={}
    if (meth =="holidayEdit"){
       params={
        orgCode: this.searchlist.orgCode,
        updateList: this.tableData
      }
    }
    else {
    params=this.tableData
    }
    this.http.LeaderShiftRequest[meth](params).then(res => {
      if (res.status == 200) {
        this.$message.success("保存成功")
      } else {
        this.$message.error(res.msg)
      }
    })
  }
}
