import { ControllerBase, Inject, Prop, Emit } from 'prism-web'
import { CLIENT_RENEG_LIMIT } from 'tls';
export class GroupController extends ControllerBase {

  constructor() {
    super()
  }
  private temp = {
    style: require('../../style/setonduty/group.less')
  }
  @Inject('http') http: any
  private index = 0
  private groupId = ""
  private mulselect = []
  private tableData = []
  private select = "2"
  private defaultchecked = ""
  private searchlist = {
    orgCode: "",
    userName: ''
  }
  private viewlog = false
  private staff = []

  created() {
    this.searchlist.orgCode = JSON.parse(window.sessionStorage.getItem('role')).orgCode
    this.changeDuty();
    this.getStaff()
  }
  /**
   * author by 刘文磊 选择机构
   */
  getOrg(val) {
    this.searchlist.orgCode = val.prop.id
    this.changeDuty()
  }


  /**
   * author by 刘文磊 表数据
   */
  changeDuty() {
    let params = {
      dutyGroupCategory: this.select,
      orgCode: this.searchlist.orgCode
    }
    this.http.SetondutyRequest.groupList(params).then(res => {
      if (res.status == 200) {
        this.tableData = res.data
      }
    })
  }

  /**
   * author by 刘文磊 人员列表
   */
  getStaff() {
    this.http.SetondutyRequest.orgPeople(this.searchlist).then(res => {
      if (res.status == 200) {
        this.staff = res.data
      }
    })
  }
  /**
   * author by 刘文磊 点击添加/删除人员 
   */
  selectStaff(row, index) {
    this.groupId = row.groupId
    this.index = index;
    // if (row.groupPerson.length>0)
    //   row.groupPerson.forEach(item => {
    //     for (let i = 0,length = this.staff.length;  i <length;i++){
    //       let staffitem = this.staff[i]
    //       if (item.userId == staffitem.userId){
    //         // 设置默认勾选项
    //         this.$refs.stafftable['toggleRowSelection'](staffitem, true)
    //         break;
    //       }
    //     }
    //   });

    this.viewlog = true;
  }

  /**
   * author by 刘文磊 获取人员的勾选项
   */
  handleSelectionChange(val) {
    this.mulselect = val
  }

  /**
   * author by 刘文磊 添加人员
   */
  submit() {
    let params = {
      groupId: this.groupId,
      orgCode: this.searchlist.orgCode,
      peopleList: this.mulselect
    }

    this.http.SetondutyRequest.groupAdd(params).then(res => {
      if (res.status == 200) {
        this.$message.success("人员变更成功")
        this.changeDuty()
        this.viewlog = false;
      } else {
        this.$message.error(res.msg)
      }
    })
  }
  /**
   * author by liuwenlei 人员删除
   */
  deletstaff(row, id) {
    this.$confirm('删除后不可恢复，是否继续?','提示').then(() => {
      let params = {
        groupId: row.groupId,
        orgCode: this.searchlist.orgCode,
        peopleId: id
      }
      this.http.SetondutyRequest.groupDelete(params).then(res => {
        if (res.status == 200) {
          this.$message.success("删除成功")
          this.changeDuty();
        } else
          this.$message.error(res.msg)
      })
    })
      // this.$confirm("删除后不可恢复，是否继续").then(()=>{

      // })
      .catch(() => { })

  }

  selectable(row) {
    if (this.tableData.length==0) return true
    let flag = true
    let people = this.tableData[this.index].groupPerson
    if (people.length > 0) {
      people.forEach(item => {
        if (item.userId == row.userId){
          flag=false
        }
      });
    }
    else {
      flag=true
    }
    return flag
  }
}