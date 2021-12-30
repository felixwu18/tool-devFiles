// author by 刘文磊
import { ControllerBase, Inject, Prop, Emit } from 'prism-web'

export class WallBulletinAddController extends ControllerBase {
  constructor() {
    super()
  }
  private temp = {
    style: require('../../style/textFile/textFileAdd.less')
  }

  @Inject('http') http: any
  @Inject('store') store: any
  private type = 'BRIEF' //简报类型
  private handlelist = [] // 处理过程
  // 附件参数
  private openDocByurl = ''
  // 是否需要获取新增模板
  private baseoffice: boolean
  private officeShow = false //保存按钮显示

  // 弹窗配置
  private dialogOption = {
    titleName: '',
    flag: false,
    templateName: '',
    propsData: {
      reportRouter: '/briefReport/wallBulletin',
      materialId: '', //附件id
      reportType: 'BRIEF', //简报类型
      id: '', //简报id
      reportTitle: '', //标题
      comments: '' //说明
    }
  }

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
    this.$refs.wallBulletinAdd['style'].display = 'blcok'
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
    this.dialogOption.flag = false
    if (infoId != 'justclose') {
      this.$refs.wallBulletinAdd['style'].display = 'none'
      this.$router.push(`/briefReport/wallBulletin`)
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
