import { ControllerBase, Prop, Inject, Emit } from 'prism-web'

export class MsgTransferApplyDialogController extends ControllerBase {
  constructor() {
    super()
  }

  @Prop() propdata
  @Emit('dialogcallback')
  closeDialogCall(infoId) { }
  @Inject('http') http: any
  private flag: Boolean = false
  private approvalContent: string = ''
  private temp = {
    style: require('../../style/transfer/msgTransferApplyDialog.less')
  }
  private transferData = {
    infoId: '', //事件id
    title: '', //转办事项
    attachmentList: [],// 上传附件列表
    approvalContent: ''
  }

  private message = null
  private rules = {
    approvalContent: [{ required: true, message: '请输入回复内容', trigger: 'blur' }]
  }
  created() {
    this.transferData['infoId'] = this.propdata.infoDisposeId;
  }

  //转办督办回复保存按钮
  saveTransfer() {
    this.$refs.transferDialog['validate'](valid => {
      if (valid) {
        let approvalContent = this.transferData.approvalContent.trim()
        if (!approvalContent.length) {
          if (this.message) {
            this.message.close()
          }
          this.message = this.$message.warning('内容不能为空，请输入内容！')
          return
        }
        let params = {
          attachmentList: this.transferData.attachmentList,
          disposeId: this.transferData.infoId,
          replyContent: approvalContent,
          type: 34
        };
        this.http.GempInfoBaseRequest.sendApplyContent(params).then(res => {
          this.$message(res.msg);
          this.closeDialogCall(this.transferData.infoId)
          this.emit("setTransferProcess", "")

        });
      }
    })
  }

  //   /**
  //    *
  //    * 去除空格标签以及换行
  //    * @param {*} params
  //    * @returns
  //    * @memberof MsgTransferApplyDialogController
  //    */
  //   trim(params) {
  //     return params.trim()
  //                 .replace(/^((&nbsp;|\s)*)/ig, '')
  //                 .replace(/((&nbsp;|\s)*)$/ig, '')
  //                 .replace(/^((<div><br><\/div>)*)/ig, '')
  //                 .replace(/^((&nbsp;|\s)*)/ig, '')
  //                 .replace(/((&nbsp;|\s)*)$/ig, '')
  //                 .replace(/(<div><br><\/div>)*$/ig, '')
  //                 .replace(/^((<div>((&nbsp;|\s)*)<\/div>)*)/ig, '')
  //                 .replace(/((<div>((&nbsp;|\s)*)<\/div>)*)$/ig, '')
  //                 .replace(/^((&nbsp;|\s)*)/ig, '')
  //                 .replace(/((&nbsp;|\s)*)$/ig, '')
  //                 .replace(/^((<div><br><\/div>)*)/ig, '')
  //                 .replace(/(<div><br><\/div>)*$/ig, '')
  //                 .trim()
  //   }

  //转办督办回复关闭按钮
  closeTransfer() {
    this.closeDialogCall(this.propdata.infoDisposeId)
  }
}
