import { ControllerBase, Inject, Prop } from 'prism-web'

export class TextFileAddController extends ControllerBase {
  constructor() {
    super()
  }

  @Inject('http') http: any
  private activeNamex = 'first'
  private reportData = {
    //请参数
    ids: []
  } //信息生成文本的参数

  private textData = ''
  private typereport = {
    reportType: 'BRIEF'
  }
  //传入参数
  private listParams = {
    id: '', //简报Id
    infoId: '', //事件id
    reportContent: '', //简报内容
    reportTitle: '' //简报标题
  }
  private list = []

  private handleClick(val) {}
  private temp = {
    style: require('../../style/textFile/textFileAdd.less')
  }

  private flag: boolean = false //弹窗关闭参数
  private templateName: string = '' //弹窗元素
  private tilteName: string = '' //弹窗名字
  private propsData: Object = {} //数据
  private click(el: string, name: string) {
    this.flag = true
    this.templateName = el
    this.tilteName = name
    this.propsData
  }

  created() {
    this.onNotify()
  }

  mounted() {}
  closeDialogCall(callInfo) {
    //关闭弹框
    this.flag = false
  }
  /*
   * Author by xinglu 保存按钮
   * Modify by chengyun 加判断
   */
  addReportInfo() {
    if (this.listParams.reportTitle.trim() == '' || this.listParams.reportContent.trim() == '') {
      this.$message({
        message: '你还有信息未填写完毕！',
        type: 'error'
      })
    } else {
      this.add().then(res=>{
        if(res.status == 200){
          this.$confirm('文本新增成功，是否生成简报？','提示').then(()=>{
            setTimeout(() => {
              this.click('text-preservation', '生成简报')
            }, 500)
          })
            .catch(()=>{
              if ((this.$route.params.handle = 'textAdd')){
                setTimeout(() => {
                  this.emit('textFileAddSuccess', 'data')
                }, 500)
                this.$router.push('/briefReport/textFile')
                // this.$router.push({ path: '/briefReport/textFileEdit', query: { id: res.data } })
              }else{
                this.listParams['infoId'] = ''
                this.$message({
                  type: 'success',
                  message: '保存文本文件成功！'
                }),
                  this.$router.push('/briefReport/textFile')
              }
            })
        }
      })
      // this.$confirm('文本新增成功，是否生成简报？', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   confirmButtonClass: 'confirmButtonClass',
      //   cancelButtonClass: 'confirmButtonClass'
      // })
      //   .then((_) => {
      //     this.add().then(res=>{
      //       if(res==200)
      //       setTimeout(() => {
      //         this.click('text-preservation', '生成简报')
      //       }, 500)
      //     })
      //   })
      //   .catch((_) => {
      //     if ((this.$route.params.handle = 'textAdd')) {
      //       //信息生成的文本
      //       this.add().then(res=>{
      //         if(res==200){
      //         this.$message({
      //           type: 'success',
      //           message: '保存文本文件成功！'
      //         }),

      //         setTimeout(() => {
      //           this.emit('textFileAddSuccess', 'data')
      //         }, 500),
      //         this.$router.push('/briefReport/textFile')
      //       }
      //       })
      //     } else {
      //       this.listParams['infoId'] = ''
      //       this.add().then(res=>{
      //         if(res==200){
      //         this.$message({
      //           type: 'success',
      //           message: '保存文本文件成功！'
      //         }),
      //         this.$router.push('/briefReport/textFile')
      //       }
      //       })
      //     }
      //   })
    }
  }

  /*
   * author by xinglu  文本新增
   * by 刘文磊
   */
  add() {
    return this.http.briefReportRequest.documentAdd(this.listParams).then((res) => {
      // console.log(res);
      if (res.status == 200) {
        this.propsData['textId'] = res.data
        return res
      }
    })
  }

  /*
   * Author by chengyun 跨级传值 获取信息的id
   * Modify by chengyun
   */
  onNotify() {
    this.reportData.ids = !!this.$route.params.select?JSON.parse(this.$route.params.select) : ''
    this.http.briefReportRequest.documentByInfoId(this.reportData).then((res) => {
      if (res.status == 200) {
        this.listParams.reportTitle = res.data[0].reportTitle
        this.listParams['infoId'] = res.data[0].infoId
        let html = ''
        res.data.forEach((val) => {
          html += val.reportTitle + '\n'
          html += '  ' + val.reportContent + '\n'
          if (val.gempBriefInstructDTOs && val.gempBriefInstructDTOs.length > 0) {
            val.gempBriefInstructDTOs.forEach((element) => {
              html += element.instructTitle + '\n'
              html += '  ' + element.instructContent + '\n'
            })
          }
        })
        this.listParams.reportContent = html
      }
    })
  }
}
