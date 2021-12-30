// author by 刘文磊
import { ControllerBase, Inject, Prop, Emit } from 'prism-web'
import sessionSearch from '../../../../assets/libs/searchData'

export class SpecialReportAddController extends ControllerBase {
  constructor() {
    super()
  }
  private temp = {
    style: require('../../style/textFile/textFileAdd.less')
  }
  private type = 'SPECIAL'
  // 附件参数
  private openDocByurl = ""
  private officeShow = false //保存按钮显示
  // 是否需要获取新增模板
  private baseoffice: boolean
  // 引入接口
  @Inject('http') http: any
  @Inject('store') store: any
  // 弹窗配置
  private dialogOption = {
    titleName: "",
    flag: false,
    templateName: "",
    propsData: {
      materialId: "",//附件id
      reportType: "SPECIAL", //简报类型
      id: "",//简报id
      reportTitle: "",//标题
      comments: "",//说明
    },
  }

  // 处理过程
  private handlelist = []
  created() {
    if (Object.keys(this.$route.params).length) {
      this.openDocByurl = this.$route.params.inparameter['onlyOfficeUrl']
      this.store.dispatch('setMaterialId', this.$route.params.inparameter['materialId'])
      this.baseoffice = false
    } else {
      this.baseoffice = true
    }
  }
  mounted() {
    this.$refs.specialAdd['style'].display = 'block'
    window.setTimeout(() => {
      this.officeShow = true
    }, 5000)
  }
  /* author by chengyun 保存
  */

  savePreservation() {
    this.$refs.processedcom['saveReport']()
  }

  // 按钮操作 author by 刘文磊
  examine(component, name) {
    this.dialogOption.flag = true
    this.dialogOption.templateName = component //弹框组件
    this.dialogOption.titleName = name //弹框标题
  }

  //关闭弹窗后的回调 author by 刘文磊
  closeDialogCall(infoId) {
    this.dialogOption.flag = infoId.flag
    if (infoId != 'justclose') {
      this.$refs.specialAdd['style'].display = 'none'
      this.$router.push({ path: `/briefReport/specialReport` })
    }
  }
  /* author by chengyun 另存为按钮
  *  Modify by chengyun
  */
  SaveToLocal() {
    // this.emit('specialSaveToLocal', 'SPECIAL')
    this.$refs.processedcom['processedcomSave']()

  }

  /* author by chengyun 预览按钮
  *  Modify by chengyun
  */
  TANGER_OCX_Printview() {
    this.emit('printviewParent', 'SPECIAL')
  }
}