import { ControllerBase, Inject, Prop, Emit, Watch} from 'prism-web'
import { downloadFuncs } from './../../../../assets/libs/commonUtils'

export class GovermentDutyController extends ControllerBase {
  private temp = {
    style: require('../../style/govermentduty/govermentdutyList.less')
  }

  constructor() {
    super()
  }
  @Inject('http') http: any

  private defaultchecked = ""
  @Prop() tabledata
  
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
    this.tabledata.forEach(item => {
      if (item.dateFlag == "1")
        item.dutyList.forEach(itemduty => {
          params.dutyInfoList.push(itemduty)
        });
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

  private dialogOption = {
    titleName: '',
    flag: false,
    formdata: {},
    type: ''
  }

  /**
   * author by 刘文磊 查看替换班详情
   */
  displaceDetail(duty) {
    this.dialogOption.titleName =duty.personStatus == '1' ? '查看替班情况' : '查看换班班情况'
    this.http.GovermentdutyRequest.swapInstead(duty).then(res => {
      if (res.status == 200) {
        this.dialogOption.formdata = res.data
        this.dialogOption.flag = true
      }
    })

  }
  /**
   *  author by 刘文磊删除替换班
   */
  displaceColese(data) {
    this.$set(data, 'personStatus', '2')
    this.$set(data, 'personId', '')
  }
 
  /**
   * author by 刘文磊  选择值班人员事件
   */ 
  selectpeople(dutyList,arr){
    if(arr)
    for(let i=0,length=arr.length;i<length;i++){
      if (dutyList.personId == arr[i].peopleId){
        dutyList.groupId = arr[i].groupId
        dutyList.personId = arr[i].peopleId
        dutyList.personName =arr[i].peopleName
      }
    }
  }

// 保存成功后向父组件告知 by 刘文磊
@Emit('updatetable')
updatetable() {}
}
