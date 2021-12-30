// author by 刘文磊
import { ControllerBase, Prop, Inject, Emit, Watch } from 'prism-web'

export class PreservationController extends ControllerBase {
  constructor() {
    super()
  }

  private temp = {
    style: require('../../briefReport/style/preservation.less')
  }
  @Prop() propdata

  @Inject('http') http: any
  @Inject('store') store:any
  private messageDom: any = null //message实体
  private materialIds = null
  @Watch('materialIds')
  dataMaterialId(val) {
    if (val) {
      this.briefRequest()
    }
  }
  private formData = {
    id: '',
    comments: '',
    materialId: '',
    reportTitle: '',
    reportType: ''
  }

  created() {
    let _this = this
    this.formData = JSON.parse(JSON.stringify(_this.propdata))
    this.reportsAddId()
  }


  /* author by chengyun 保存弹出框事件
   *
   *
   */
  reportsAddId() {
    this.on('reportAddmaterialId', (data) => {
      this.$set(this.formData, 'materialId', data[0])
      this.materialIds = data[0] //附件id
    })
  }

  briefRequest() {
    if(this.$route.params.infoId){
      this.$set(this.formData,'infoId',this.$route.params.infoId)
    }
    // 有简报id做编辑保存
    if (this.propdata.id) {
      this.http.briefReportRequest.briefModify(this.formData).then((res) => {
        if (res.status == 200) {
          this.$message.success('保存成功!')
          setTimeout(() => {
            this.closeDialogCall(this.formData)
          }, 100)
        } else this.$message.error(res.message)
      })
    } else {
      // 没有简报id 做新增保存
      this.http.briefReportRequest.briefAdd(this.formData).then((res) => {
        if (res.status == 200) {
          this.$message.success('保存成功!')
          // 返回简报id
          this.formData.id = res.data
          // 关闭弹框
          setTimeout(() => {
            this.closeDialogCall(this.formData)
          }, 100)
        } else this.$message.error(res.message)
      })
    }
  }

  // author by 刘文磊 保存按钮
  saveFun() {
    if (this.formData.reportTitle.trim() == '') {
      if (this.messageDom) {
        this.messageDom.close()
      }
      return (this.messageDom = this.$message.warning('请输入报告名称'))
    }
    if(this.store.state.SYSTEMOFFICE === 'ONLYOFFICE') {
      this.$set(this.formData,'materialId',this.store.state.METERIALID)
      this.briefRequest()
    } else {
      this.reportDialogId()
    }
  }
  /* author by 刘文磊 关系弹出呢个操作
   *
   *
   */
  @Emit('dialogcallback')
  closeDialogCall(infoId) {
    return infoId
  }

  /* author by chengyun 父组件的保存方法
   *
   *
   */

  @Emit('reportsid')
  reportDialogId() {}

  /*author by 刘文磊 弹框的值
   */

  @Watch('propdata', { deep: true })
  getForm(val) {
    this.formData = JSON.parse(JSON.stringify(val))
  }
}
