import { ControllerBase, Inject } from 'prism-web'
import { downloadFuncs } from './../../../../assets/libs/commonUtils'

export class GovermentBaseviewController extends ControllerBase {
  private temp = {
    style: require('../../style/govermentduty/govermentbase.less')
  }
  constructor() {
    super()
  }
 
  @Inject('http') http: any
  private searchlist = {
      date: "",
      orgCode:""
    }
  
  
  private switchover=1
  private tableData1 = []
  private tableData2 = []
  private submitflag1=true
  private submitflag2=true
  //白班带班人员选项 
  private day1 = []
  private day2 = []
  private day3 = []

  //夜班带班人员选项 
  private night1 = []
  private night2 = []
  private night3 = []

  created() 
  {
    // 获取当前的月份
    let now = new Date()
    let Y = now.getFullYear()
    let M = now.getMonth() + 1 >= 10 ? now.getMonth() + 1 : '0' + now.getMonth() + 1
    this.searchlist.date = Y + '-' + M
    this.searchlist.orgCode = JSON.parse(window.sessionStorage.getItem('role')).orgCode
    this.loadData1()
    // this.loadData2()
    this.getpeopleList()
  }
  changeType(val){
    this.switchover = val
    val ? this.loadData1() : this.loadData2()
  }
  /**
   * author by liuwenlei 选择机构
   */
  getOrg(val) {
    this.searchlist.orgCode = val.prop.id
    this.loadData1()
    this.loadData2()
    this.getpeopleList()
  }


  /**
   * author by 刘文磊 按周查询值班表
   */ 
  loadData1() {
    this.http.GovermentdutyRequest.governWeek(this.searchlist).then(res => {
      if (res.status == 200) {
        this.tableData1 = res.data
      } else {
        this.$message.error("res.msg")
      }
    })
  }
  
  /**
   * author by 刘文磊 按天查询值班表
   */

  loadData2() {
    this.http.GovermentdutyRequest.governDay(this.searchlist).then(res => {
      if (res.status == 200) {
        this.tableData2 = res.data
      } else {
        this.$message.error("res.msg")
      }
    })
  }

  /**
* author by 刘文磊  人员可选列表获取
*/
  getpeopleList() {
    let params = {
      code: "",
      orgCode: this.searchlist.orgCode
      // orgCode: "4234c7a6c8a14958897087840de2230f"
    }
    this.http.GovermentdutyRequest.governPeople(params).then(res => {
      if (res.status == 200) {
        this.day1 = res.data[0]
        this.day2 = res.data[1]
        this.day3 = res.data[2]
        this.night1 = res.data[3]
        this.night2 = res.data[4]
        this.night3 = res.data[5]
      } else {
        this.$message.error(res.msg)
      }
    })
  }

  /**
* author by 刘文磊 导出
*/
  exporttable() {
    this.http.GovermentdutyRequest.governExport(this.searchlist).then((res) => {
      downloadFuncs(res)
    })
  }
  
  /**
   * author by 刘文磊 保存数据后 更新table
   */  
  updatetable(){
    this.loadData1()
    this.loadData2()
  }
  /**
   * author by 刘文磊 点击保存按钮
   */
  submit(){
    if(this.switchover)
      this.submitflag1 = !this.submitflag1
    else
      this.submitflag2 = !this.submitflag2
  }
}