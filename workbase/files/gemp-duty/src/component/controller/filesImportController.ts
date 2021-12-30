import { ControllerBase, Prop, Emit, Inject, Watch } from 'prism-web'
import { uploadUrl } from '../../../service/config/base'
import { showLoading , hideLoading } from '../../../service/Loading/loading'

//导入组件
export class FilesImportController extends ControllerBase {
  constructor() {
    super()
  }

  // 上传文件地址
  private filesAddress = ''
  private dialogVisible: Boolean = false
  private dialogImageUrl = ''
  private header = {
    token: ''
  }

  private temp = {
    style: require('../style/filesImport.less')
  }

  private uploadList: Array<any> = []

  // 已上传附件数组
  @Prop() attachmentlist: Array<any>

  @Prop() importconfig
  /* limit: number  限制上传数量
  *  filesExgep: RegExp 上传文件正则
  *  filsImportAddress: 上传地址
  *  awayuploadflag  是否手动提交
  */

  //导入成功的回调
  @Emit('importsuccess')
  uploadSuccessData(val){
    return val
  }


  created() {
    this.importconfig.filsImportAddress ? this.filesAddress = this.importconfig.filsImportAddress : this.filesAddress = uploadUrl
    this.header.token = sessionStorage.getItem('token')
  }

  handlePictureCardPreview(file) {
    this.dialogImageUrl = file.url
    this.dialogVisible = true
  }


  /**
   * Modify by chengyun 文件上传的格式限定
   * @param file
   */
  beforeFileName(val) {
    let flag = this.importconfig.filesExgep.test(val.name.toLowerCase())
    if(!flag) {
        this.$message({type:'error',message: '文件格式错误'})
        return this.$refs.elupload['clearFiles']()
    }
  }

  // 文件上传失败回调
  showError(err, file, fileList) {
    hideLoading()
    this.$message({
      type: 'error',
      message: '文件导入失败'
    })
  }

  // 文件上传成功回调
  uploadSuccess(response, file, fileList) {
    this.uploadList = this.listTool(fileList)
    if(response.status == 200) {
      hideLoading()
      this.$message({
        type: 'success',
        message: '文件导入成功'
      })
      this.emit('uploadsuccess','data')
      this.uploadSuccessData(response.data)
    }else {
      hideLoading()
      if(response.msg){
        this.$message({
          type: 'error',
          dangerouslyUseHTMLString:true,
          message: response.msg
        })
      }else {
        this.$message({
          type: 'error',
          dangerouslyUseHTMLString:true,
          message: '导入失败,请重新导入!'
        })
      }
    }
  }

  //上传时的回调
  uploadProgress(val){
  }



  // 文件超出限制回调
  exceed(file, fileList) {
    this.$message({
      type: 'error',
      message: '只能上传' + this.importconfig.limit + '个文件'
    })
  }

  // // 自定义文件删除
  fileRemove(file, fileList) {
    this.uploadList = this.listTool(fileList)

  }

  //uploadList数据处理方法
  listTool(list: Array<any>) {
    let arr = []
    list.forEach((item) => {
      if (item.response) {
        arr.push(item.response)
      } else {
        arr.push(item)
      }
    })
    return arr
  }


  /*
 * Modify by chengyun 清空文件列表
 */
  handleRemove(file) {
    this.$refs.elupload['clearFiles']()
  }

  /*
 * Modify by chengyun 手动提交文件
 */
  importUpload(){
    if(!this.importconfig.awayuploadflag){
      this.$refs.elupload['submit']()
    }
  }

}
