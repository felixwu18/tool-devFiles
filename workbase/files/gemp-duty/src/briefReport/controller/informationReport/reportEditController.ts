// author by 刘文磊
import { ControllerBase, Inject, Prop, Emit } from 'prism-web'

export class ReportEditController extends ControllerBase {
  constructor() {
    super()
  }
  private temp = {
    style: require('../../style/textFile/textFileAdd.less')
  }
  @Inject('http') http: any
  @Inject('store') store: any
  private type = 'REPORT'
  // 附件参数
  private openDocByurl = ""
  // 处理过程
  private handlelist = []
  private officeShow = false //保存按钮显示
  private breifDownloadData = { reportType: '', issueInfo: '' }

  // 弹窗配置
  private dialogOption = {
    titleName: "",
    flag: false,
    templateName: "",
    propsData: {
      materialId: "",//附件id
      reportType: "REPORT", //简报类型
      id: "",//简报id
      reportTitle: "",//标题
      comments: "",//说明
      on_off: true, //by 刘文磊 判断弹框是否打开开关
    },
  }


  // 获取附件

  created() {
    let id = this.$route.query.id
    this.getBrifeInfo(id) //基本信息
    this.getBrifeProcess(id) //处理过程
    // this.reportsAddId()

  }

  // reportsAddId() {
  //     this.on("reportAddmaterialId", (data) => {
  //         this.dialogOption.propsData.materialId = data[0] //附件id
  //     })
  // }

  /* author by chengyun 保存
  */
  savePreservation() {
    this.$refs.processedcom['saveReport']()
  }

  // 按钮操作 author by 刘文磊
  examine(component, name) {
    this.dialogOption.propsData.on_off = !this.dialogOption.propsData.on_off
    this.dialogOption.flag = true
    this.dialogOption.templateName = component //弹框组件
    this.dialogOption.titleName = name //弹框标题
    // if (component == "preservation") {
    //     this.$refs.processedcom["saveReport"]()
    // }
  }

  //关闭弹窗后的回调 author by 刘文磊
  closeDialogCall(infoId) {
    this.dialogOption.flag = false
    if (infoId != 'justclose') {
      this.getBrifeProcess(infoId.id)
      // this.getBrifeInfo(infoId.id)
      this.$router.push(`/briefReport/informationReport`)
    }
  }

  /* author by 刘文磊 查询简报基本信息
     编辑时清空 说明 by刘文磊
  */
  getBrifeInfo(id) {
    let briefDetail = { briefId: id }
    this.http.briefReportRequest.dutyBrief(briefDetail).then(res => {
      if (res.status == 200) {
        this.dialogOption.propsData.reportTitle = res.data.reportTitle
        // this.dialogOption.propsData.comments = res.data.reportContent,
        this.dialogOption.propsData.id = res.data.id
        Object.keys(this.breifDownloadData).forEach(item => {
          if (res.data[item]) {
            this.breifDownloadData[item] = res.data[item]
          }
        })
        if (this.store.state.SYSTEMOFFICE === 'ONLYOFFICE') {
          this.store.dispatch('setMaterialId', res.data.materialId)
          this.openDocByurl = res.data.onlyOfficeUrl
        } else {
          this.openDocByurl = res.data.attachUrl
        }
        window.setTimeout(() => {
          this.officeShow = true
        }, 5000)
      }
    })
  }

  /* author by 刘文磊  根据id查询简报处理过程
  *   Modify by chengyun
  */
  getBrifeProcess(id) {
    let briefProcessDetail = { briefId: id }
    this.http.briefReportRequest.briefProcess(briefProcessDetail).then(res => {
      if (res.status == 200) {
        this.handlelist = res.data
      }
    })
  }

  /* author by chengyun 另存为按钮
 *  Modify by chengyun
 */
  SaveToLocal() {
    // this.emit('specialSaveToLocal', 'SPECIAL')
    this.$refs.processedcom['processedcomSave']()

  }

  /* author by chengyun 预览为按钮
  *  Modify by chengyun
  */
  TANGER_OCX_Printview() {
    this.emit('printviewParent', 'SPECIAL')
  }
}