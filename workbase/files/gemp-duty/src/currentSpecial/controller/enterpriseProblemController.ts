import { ControllerBase, Inject, Watch, Emit, Prop } from 'prism-web'
import searchSession from '../../../assets/libs/searchData'


export class baseViewController extends ControllerBase {
  private temp = {
    style: require('../style/specialWork.less')
  }
  @Inject('http') http: any
  constructor() {
    super()
  }
  @Inject("redisService") redis: any
  @Emit('dialogcallback')
  closeDialogCall(val) {
    return val
  }
  //列表请求参数
  private listParams = {
    "groupId": "",
    "nowPage": 1,
    "pageSize": 100
  }
  private allleader = []
  private handleSelect = [
  ]


  private defaultchecked = ''
  //判断是否创建选择领导的li
  private check: boolean = false
  private messageDom: any = null // message实体
  private mutipleSelection = [] //当前选中的列表项
  private totalselect = []
  private defaultCode = ""
  private currentlyCode: any = {} //组合的对象
  @Prop() propdata;
  private type: string = '';
  created() {
    this.defaultchecked = JSON.parse(JSON.stringify(searchSession.getter({ name: 'role' }))).orgCode
    // this.$set(this.searchData, 'orgCode', this.redis.getter({ name: "role" }).orgCode)
    this.getData()
  }
  //列表数据
  private propData = []
  // 列表按钮点击响应
  tablecallback(data) {
    this[data.type](data)
  }
  //翻页操作
  handlePageChange(data) {
    // this.searchData['nowPage'] = data.rowVal
  }
  getDomData(val, index) {
    let dom = this.allleader.indexOf(val)
    if (dom != -1) this.allleader.splice(dom, 1)
    this.totalselect = this.allleader
    this.getData()
  }
  cleanAll() {
    this.check = false
  }

  mounted() {
    let dialog = document.querySelector(".addPeople").parentNode.parentNode
    dialog['style'].width = '90%'
  }
  private searchData: Object = {
    keyWord: "",
    nowPage: 1,
    orgCode: "cc41e4965f8c43518ecc731c697dabc2",
    pageSize: 100,
    queryType: "0",
    updateTime: ""
  };
  /* author by xinglu 机构的回调
  *
  */
  getOrg(val) {
    this.defaultCode = val.prop.id;
    this.defaultchecked = val.prop.id;

    this.listParams.groupId = this.defaultCode
    this.searchData['orgCode'] = this.defaultCode;
    if (!val.prop.virtualNode) {
      this.searchData['queryType'] = '0';
    } else {
      this.searchData['queryType'] = '1';
    }
    this.totalselect = this.allleader
    this.getData()
  }
  getData() {
    console.log(777)
    this.http.SpecialCampaignRequest.maillistPersonList(this.searchData).then((res) => {
      if (res.status == 200) {
        this.propData = res.data.list.map(item => {
          return item
        })
        this.$nextTick(() => {
          this.toggleSelect(this.totalselect)
        })
      }
    })


  }
  /**
   * 加入后总勾选后去重操作
   * 
   * @memberof AddPeopleController
   */
  joinTeam() {
    this.totalselect = this.totalselect.concat(this.mutipleSelection)
    const obj = {}
    const newObjArr = []
    for (let i = 0; i < this.totalselect.length; i++) {
      if (!obj[this.totalselect[i].personId]) {
        newObjArr.push(this.totalselect[i])
        obj[this.totalselect[i].personId] = true
      }
    }

    this.totalselect = newObjArr
    this.allleader = newObjArr
  }

  /**
   * 处理列表选中项
   * 
   */
  handleSelectionChange(obj, val) {
    this.mutipleSelection = obj
    let dom = obj.findIndex((item, index, arr) => {
      return item.personId == val.personId
    })
    // console.log(dom)
    if (dom == -1) {
      let tempArr = [...this.totalselect];
      tempArr.forEach((item, index) => {
        if (item.personId == val.personId) {
          tempArr.splice(index, 1);
          this.totalselect = tempArr
          this.allleader = tempArr
        }
      })
    }
  }
  join() {
    if (this.mutipleSelection.length == 0) {
      if (this.messageDom) { this.messageDom.close() }
      this.messageDom = this.$message.warning("请选择人员")
      return
    }
    this.joinTeam()
  }
  /** 
  * 处理全部勾选事件
  *  
  */
  handleAllSelection(val) {
    this.mutipleSelection = val

  }
  //默认勾选项函数
  toggleSelect(rows) {
    // console.log(rows);
    for (let j = 0; j < this.propData.length; j++) {
      for (var i = 0; i < rows.length; i++) {
        // console.log(this.propData[j].id,rows[i].id);
        if (this.propData[j].personId == rows[i].personId) {

          // console.log(rows[i].id);
          // console.log(this.propData[j]);

          this.$refs.mutipleTable['toggleRowSelection'](this.propData[j])
        }

      }
      // })
    }
  }
  /**
   * 确定按钮事件
   * 
   * @memberof AddPeopleController
   */
  choosePeople() {
    console.log(this.propdata.index, 888)
    this.$emit('proplenum', this.allleader, this.propdata.index)
    this.propdata.allleader = this.allleader
    this.closeDialogCall('新增人员')
  }

  /**
   * Author by chenzheyu
   * 树节点点击回调
   */
  treecallback(data) {
    this[data.type](data)
  }

  /**
   * Author by chenzheyu
   * 关闭弹框
   */
  closeDialog() {
    this.closeDialogCall('新增人员')
  }

}

