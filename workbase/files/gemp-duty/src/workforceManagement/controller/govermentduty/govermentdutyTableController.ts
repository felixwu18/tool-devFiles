import { ControllerBase, Inject, Prop, Watch, Emit } from 'prism-web'
import { downloadFuncs } from './../../../../assets/libs/commonUtils'

export class GovermentDutyTableController extends ControllerBase {
  private temp = {
    style: require('../../style/govermentduty/govermenttable.less')
  }

  constructor() {
    super()
  }
  @Inject('http') http: any
  private viewlog = false
  private defaultchecked = ""
  private dayform = {
    date: "",
    week: "",
    dutyList: [{}, {}, {}, {}, {}, {}]
  }
  private dayData = []

  @Prop() tabledata

  private dialogOption = {
    titleName: '',
    flag: false,
    formdata: {},
    type: ''
  }
  //白班带班人员选项 
  @Prop() day1
  @Prop() day2
  @Prop() day3

  //夜班带班人员选项 
  @Prop() night1
  @Prop() night2
  @Prop() night3

  @Prop() submitflag
  @Watch('submitflag')
  /**
   * author by 刘文磊 保存
   */
  submit() {
    let params = {
      dutyInfoList: [],
      dynac: ""
    }
    this.tabledata.forEach(week => {
      week.dayList.forEach(day => {
        if (day.dateFlag == "1")
          day.dutyList.forEach(duty => {
            params.dutyInfoList.push(duty)
          })
      })
    })
    this.http.GovermentdutyRequest.governUpdata(params).then(res => {
      if (res.status == 200) {
        this.$message.success("保存成功")
        this.updatetable()
      } else {
        this.$message.error(res.msg)
      }
    })
  }


  /**
 * author by 刘文磊 查看替换班详情
 */
  displaceDetail(duty) {
    this.dialogOption.titleName =duty.personStatus == '1' ?  '查看替班情况':'查看换班情况'
    this.http.GovermentdutyRequest.swapInstead(duty).then(res => {
      if (res.status == 200) {
        this.dialogOption.formdata = res.data
        this.dialogOption.flag = true
      }
    })
  }





  /**
   * author by 刘文磊 值班设置弹框
   */
  dutySet(days, week, day) {
    if (days.dateFlag == "0") return
    this.dayData[0] = week
    this.dayData[1] = day
    this.dayform = JSON.parse(JSON.stringify(days))
    this.viewlog = true;
  }

  /**
 * author by 刘文磊  选择值班人员事件
 */
  selectpeople(dutyList, arr) {
    if (arr)
      for (let i = 0, length = arr.length; i < length; i++) {
        if (dutyList.personId == arr[i].peopleId) {
          dutyList.groupId = arr[i].groupId
          dutyList.personName = arr[i].peopleName
          break;
        }
      }
  }

  /**
   * author by liuwenlei 选择人员确定按钮
   */
  clonepeople() {
    this.tabledata[this.dayData[0]].dayList[this.dayData[1]] = JSON.parse(JSON.stringify(this.dayform))
    this.viewlog = false

  }
 
// 保存成功后向父组件告知 by 刘文磊
  @Emit('updatetable')
  updatetable() { }

}
