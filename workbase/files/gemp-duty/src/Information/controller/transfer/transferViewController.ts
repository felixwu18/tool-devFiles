import { ControllerBase, Inject } from 'prism-web'
import { getRequestUrl } from '../../../../assets/libs/commonUtils'

export class TransferViewController extends ControllerBase {
  constructor() {
    super()
  }
  @Inject('http') http: any

  private temp = {
    style: require('../../style/transfer/transferView.less'),
  };
  // closeDialogCall(infoId) {}
  private checkPage: string = '1'
  private templateName: string = ''
  private tilteName: string = ''
  private propsData: Object = { infoDisposeId: '' }
  private propId
  //父组件传给追加发送子组件的值
  private msgappendinfo = null
  private signrecord = null //父组件传给签收记录子组件的值
  private flag: Boolean = false
  // 当前角色信息
  private role: object
  private signLabel: string = '签收'
  private appendSendIsShow: Boolean = false//追加发送按钮显示隐藏
  private signIsShow: Boolean = true//签收按钮显示隐藏
  private signFlag: Boolean = false//签收按钮禁用
  private collectionIsShow: Boolean = false//催收按钮显示隐藏
  private replyIsShow: Boolean = false//回复按钮是否禁用
  // 是否显示标准打印弹框
  private printFlag: Boolean = false
  private showTransferApply: Boolean = false
  // 是否全部签收
  private allSignFlag: boolean = true

  //打印弹框可见
  private viewDialogPrint: boolean = false
  private docUrl = ""

  // 路由id
  private infoId: any = ''
  //接收单位
  private receiveUnit
  openDialog(el: string, name: string) {
    this.showTransferApply = el == 'transferApply-dialog' ? true : false
    this.flag = true
    this.templateName = el
    this.tilteName = name
    this.propsData
    if(el=="appendSend-dialog"){
      this.propsData['orgCodes'] = this.receiveUnit
    }
  }

  created() {
    this.infoId = this.$route.query.id

    // 从提醒信息跳转的时候
    var url = window.location.href;
    let urlCode = getRequestUrl(url)
    if (urlCode && urlCode['detailUrlId']) {
      this.infoId = urlCode['detailUrlId']
    }

    this.propsData = {
      infoDisposeId: this.infoId
    }//如果登录角色是县公安局下级单位显示签收禁用追加发送以及催收按钮
    this.role = JSON.parse(sessionStorage.getItem("role"))
    let infoParams = { disposeId: this.infoId }
    this.http.GempInfoBaseRequest.getHandelDetail(infoParams).then(res => {
      if (res.status == 200) {
        this.msgappendinfo = res.data.infoDTO//传值到追加发送弹框子组件
        this.propsData['disposePriority'] = res.data.disposePriority
        //当该条转办督办记录未签并且接收单位或者接收人中存在当前角色，显示签收弹框提示
        if (res.data.handleStatus == '0' /* &&(res.data['recvOrgNames'].indexOf(this.role) >= 0 || res.data['recvPersonNames'].indexOf(this.role) >= 0) */) {
          // this.$alert('请签收此信息，再进行其他操作', '注意')  范红月 要求和信息上报保持一直，不要提示框

        } else if (res.data.handleStatus == '1') {
          this.signLabel = '已签'
          this.signFlag = true

        } else if (res.data.handleStatus == '2') {
          this.signIsShow = false
          this.signFlag = true

        }
        let units = res.data.extendedData
        this.receiveUnit = JSON.parse(units).orgCodes
        // console.log(this.receiveUnit);
        
        //登陆角色与信息转办督办的接收单位或接收人不一致，隐藏签收按钮
        if (res.data.disposeOrgCode == this.role['orgCode']) {
          this.appendSendIsShow = true//如果是上级单位显示追加发送按钮
          this.collectionIsShow = true//如果是上级单位显示催收按钮
        }
        //转办督办发起人为自已时不显示回复
        if (res.data.disposePersonId == this.role['userId']) {
          this.replyIsShow = true//转办督办发起人为自已时不显示回复
        }
        // 刷新navbar已读数据
        this.emit("initUnreadOnNotify", "")
      }
    })
  }



  closeDialogCall(callInfo) {
    //关闭弹框
    this.flag = false
    this.$refs.transferInfo['getTransactReply'](this.propsData['infoDisposeId']);//获取回复最新内容
  }

  closeDialog() {
    // this.$refs.childrenDialog['resetForm'] && this.$refs.childrenDialog['resetForm']()
  }
  //签收处理
  signHandle() {
    this.$confirm('是否确认签收?','提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: "warning" }).then(() => {
      this.http.GempInfoBaseRequest.signHandel(this.infoId).then(res => {
        if (res.status != 200) {
          this.$message(res.data)
          return;
        } else if (res.status == 200) {
          this.$message(res.data)
          this.signLabel = '已签'
          this.signFlag = true
          // this.signIsShow = true
          //如果签收成功同步刷新
          this.$refs.transferInfo['getTransactReceipt'](this.propsData['infoDisposeId'])
          //this.$refs.processPage['getProcessList']()
          this.emit("setTransferProcess", "")
        }
      })
    }).catch(() => {
      this.$message({ type: "info", message: "已取消签收" })
  });

  }
  //催收处理
  collectionHandle() {
    this.$confirm('是否对所有未签收单位发催收？', '催收', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then(() => {
      let infoParams = { disposeId: this.infoId }
      this.http.GempInfoBaseRequest.infoCollection(infoParams).then(res => {
        if (res.status == 200) {
          this.$message(res.data)
          //this.$refs.processPage['getProcessList']()
          this.emit("setTransferProcess", "")
        }
      })
    })
  }

  // 自定义打印
  routeToNtko() {
    let str = window.location.href.split('#')[0]
    window.open(str + '#/ntko?id=' + this.infoId + '&type=202')
  }

  //打印弹框
  priintDialog() {
    this.viewDialogPrint = true
    let obj = {
      id: this.$route.query.id,
      type: 201
    }
    this.http.GempInfoBaseRequest.getPDF(obj).then(res => {
      this.docUrl = res.data
    })
  }
  handleCancel() {
    this.viewDialogPrint = false
  }

  closeAppendDialogCall(propsData) {/* author by rendaming  关闭追加发送弹框刷新签收记录*/
    //关闭弹框
    this.flag = false
    this.$refs.transferInfo['getTransactReceipt'](propsData['infoDisposeId']);
  }

}



