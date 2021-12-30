import { ControllerBase, Inject, Prop, Emit } from 'prism-web'
export class majorTimeContrller extends ControllerBase {
  private temp = {
    style: require('../../style/setonduty/restTime.less')
  }
  constructor() {
    super()
  }
  @Inject('http') http: any
  private messageDom: any = null //message实体
  private viewlog = false
  private searchlist = {
    abscriptYear:"",
    leaderScheduleType: "1",
    nowPage: 1,
    pageSize: 10
  }
  private propData = {
    isCheck: false,
    pageSize: 10,
    total: 0,
    config: [

      {
        type: 'string',
        label: '名称',
        prop: 'name',
      },
      {
        type: 'string',
        label: '开始时间',
        prop: 'startTime',
      },
      {
        type: 'string',
        label: '结束时间',
        prop: 'endTime'
      },
      {
        type: 'button',
        label: '操作',
        prop: 'operate'
      }
    ],
    data: []
  }
  private formdata = {
    name: "",
    startTime: "",
    endTime: "",
    leaderScheduleType:"1"
  }
  private rules = {
    name: [{ required: true, message: "请输入重要时段名称", trigger: 'blur' },
    { max: 20, message: "长度最大为20", trigger: 'change' }
    ],
    startTime: [{ required: true, message: "请选择开始时间", trigger: 'blur' }],
    endTime: [{ required: true, message: "请选择结束时间", trigger: 'blur' }]
  }

  created() {
    this.searchlist.abscriptYear = new Date().getFullYear().toString()
    this.loadData()
  }
  tablecallback(data) {
    this[data.type](data)
  }
  // 翻页功能
  handlePageChange(data) {
    this.searchlist['nowPage'] = data.rowVal
    this.loadData()
  }
  /**
   * 
   * @param data author by 刘文磊 列表删除按钮
   */
  delet(data) {
    let param = {
      holidayImportantId: data.rowVal.holidayImportantId,
      code:""
    }
    this.$confirm('删除后不可恢复，是否继续?','提示').then(() => {
      this.http.SetondutyRequest.holidayDelete(param).then(res => {
        if (res.status == 200) {
          this.$message.success("删除成功")
          this.searchlist['nowPage'] = 1
          this.loadData()
        } else {
          this.$message.error(res.msg)
        }
      })
    }).catch(() => { })
  }

  /**
   * author by刘文磊 新增
   */
  add() {
    this.formdata = {
      name: "",
      startTime: "",
      endTime: "",
      leaderScheduleType:"1"
    }
    this.viewlog = true
  }

  /**
   * author by 刘文磊 新增保存
   */
  submit() {
    this.$refs.form['validate']((valid) => {
      if (valid) {
        // let meth = this.formdata.hasOwnProperty('holidayImportantId') ? "holidayUpdate" : "holidayAdd"
        this.holidayUpdate("holidayAdd")
        this.viewlog = false;
      } else {
        if (this.messageDom) {
          this.messageDom.close()
        }
        this.messageDom = this.$message.warning('请按照提示正确填写信息');
      }
    })
  }

  /**
   *  author by liuwenlei 查询列表
   */
  loadData() {
    this.http.SetondutyRequest.holidayList(this.searchlist).then(res => {
      if (res.status == 200) {
        this.propData.total = res.data.total
        this.propData.data = res.data.list.map(item => {
          item.operate = {
            // edit: { name: '编辑', type: 'primary', emit: 'edit', expression: true },
            delete: { name: '删除', type: 'danger', emit: 'delet', expression: true }
          }
          return item
        })
      }
    })
  }

  /**
 * author by 刘文磊 编辑
 */
  edit(data) {
    this.formdata = JSON.parse(JSON.stringify(data.rowVal))
    this.formdata.leaderScheduleType="1"
    this.viewlog = true
  }

  /**
 * author by 刘文磊 新增/编辑
 */
  holidayUpdate(meth) {
    this.http.SetondutyRequest[meth](this.formdata).then(res => {
      if (res.status == 200) {
        this.$message.success(res.msg)
        this.searchlist['nowPage'] = 1
        this.loadData()
      } else {
        this.$message.error(res.msg)
      }
    })
  }
}