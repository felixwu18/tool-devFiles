import { ControllerBase,Inject } from 'prism-web'

export class LowerHairDocumentEditController extends ControllerBase {
  private temp = {
    style: require('../../../style/documentHandle/lowerHairDocument/lowerHairDocumentEdit.less')
  }
  constructor() {
    super()
  }

   //向弹出框传递参数
   private propsData: Object = {}

   //处理过程参数
   private handlelist = []

   private activeNamex = 'first' //tab栏选中

   //向弹出框配置参数
   private dialogConfig: Object = {
     viewDialog: false, //弹框是否显示
     templateName: '', //弹框组件名
     tilteName: '' //标题头
   }
   
   //请求参数
   private listParams = {
     gempBriefInstructDTOs: [
       {
         instructContent: '', //	批示内容
         instructTitle: '' //批示标题
       }
     ],
     id: '', //公文Id
     infoId: '', //事件id
     reportContent: '', //内容
     reportTitle: '' //标题
   }
   @Inject('http') http: any

   created() {
     this.getListData()
   }

   // 获取列表数据
   getListData() {}

   /* author by chengyun 关闭弹框
    *  Modify by
    */
   closeDialogCall() {
     //关闭弹框
     this.dialogConfig['viewDialog'] = false
   }

   /* author by chengyun 保存
    *  Modify by
    */
   addReportInfo() {}

   handleClick(val) {

   }
}
