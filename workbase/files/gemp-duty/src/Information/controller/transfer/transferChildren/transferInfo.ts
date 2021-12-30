import { ControllerBase, Inject, Prop } from 'prism-web'
export class TransferInfoController extends ControllerBase {
  @Prop() propdata
  constructor() {
    super()
  }

  @Prop() transfercontent
  private temp = {
    style: require("../../../style/transfer/transferChildren/transferInfo.less")
  }
  private dialogVisible: Boolean = false;
  private dialogImageUrl: string = ''

  private activeNames = ['1']

  // 图片查看弹框
  private showImage: Boolean = false
  // 图片查看url
  private checkImage: string = ''

  @Inject('http') http: any
  @Inject("downloadFunc") downloadFunc: any

  private transferInfo = {
    infoId: '',
    transferId: '',
    instruction: [],
    detail: {
      info: '',
      items: '',
      time: '',
      warn: '',
      attachmentList: []
    },
    signInfo: {
      receiveUnit: { num: 0, total: 0, status: '已签收', noReceive: '无', timelyReceive: '江汉区政府', lateReceive: '无', delayReceive: '市公安局，江岸区政府' },
      receivePeople: { num: 0, total: 0, status: '已签收', noReceive: '无', timelyReceive: '江汉区政府', lateReceive: '无', delayReceive: '市公安局，江岸区政府' }
    },
    replyInfo: [
      // {disposeOrgName: '市政府总值班室', disposePersonName: '应急平台(辰安科技)', disposeDescription: '已经按照批示进行妥善处理', disposeTime: '2019-08-12',attachmentList: [{name: '应急产品信息接报报送接口文档初稿v1.0.1.docx', url: ''}]},
      // {disposeOrgName: '市政府总值班室', disposePersonName: '应急平台(辰安科技)', disposeDescription: '已经按照批示进行妥善处理', disposeTime: '2019-08-12'},
    ]

  }
  private approvalContent: string = '回复 ';

  created() {
    let disposeId = this.propdata.infoDisposeId;
    //详情
    this.getTransactDetail(disposeId);
    //查询转办督办签收记录
    this.getTransactReceipt(disposeId);
    //查询转办督办回复情况
    this.getTransactReply(disposeId);
    this.updateMessageRemindData();
  }
  // 更新消息提醒的滚动条，弹框，铃铛
  updateMessageRemindData() {
    let data = {
      type:"updateMessageRemind",
    }
    setTimeout(() => {
      parent.postMessage(data,"*")
    }, 2000);
  }
  //详情
  getTransactDetail(disposeId) {
    let dispose = {disposeId:disposeId}
    this.http.InfoDutyRequest.transactDetail(dispose).then(res => {
      if (res.status === 200) {
        this.$set(this.transferInfo, 'infoId', res.data.infoId)
        let infoDTO = res.data.infoDTO;
        this.$set(this.transferInfo, 'detail', {
          info: infoDTO.infoTitle,
          items: res.data.disposeDescription,
          time: res.data.disposeTime,
          warn: res.data.disposePriorityName,
          attachmentList: res.data.attachmentList
        });
        let instruction = res.data.remark ? JSON.parse(res.data.remark) : []
        instruction = instruction.map(it => {
          return {
            indirectPerson: it.person,
            disposeTime: it.date,
            disposeDescription: it.content
          }
        })
        this.$set(this.transferInfo, 'instruction', instruction)
      } else {
        //this.$message(res.message)
      }
    })
  }
  //查询转办督办签收记录
  /**
  * Modify by chenzheyu 全部签收时禁用父组件的催收按钮   
  * @param disposeId 
  */
  getTransactReceipt(disposeId) {
    this.http.InfoDutyRequest.transactDetailReceipt(disposeId).then(res => {
      if (res.status === 200) {
        if (res.data.allSignFlag == '1') {
          this.$parent['allSignFlag'] = false
        }
        let signInfo = this.transferInfo.signInfo;
        signInfo.receiveUnit.num = res.data.signOrgNum
        signInfo.receiveUnit.total = res.data.totalOrgNum
        signInfo.receivePeople.num = res.data.signUserNum
        signInfo.receivePeople.total = res.data.totalUserNum

        let arry = { noReceive: [], timelyReceive: [], lateReceive: [], delayReceive: [] }
        this.tool(res.data.gempReceiptOrgDTO, arry)
        Object.keys(arry).forEach((key) => {
          signInfo.receiveUnit[key] = arry[key].length == 0 ? '无' : arry[key].join(', ');
        })

        arry = { noReceive: [], timelyReceive: [], lateReceive: [], delayReceive: [] }
        this.tool(res.data.gempReceiptUserDTO,arry)
        Object.keys(arry).forEach((key) => {
          signInfo.receivePeople[key] = arry[key].length == 0 ? '无' : arry[key].join(', ');
        })

        this.$set(this.transferInfo, 'signInfo', signInfo);
      } else {
        //this.$message(res.message)
      }
    })
  }
  /**
   * author by 刘文磊 工具方法
   * 
   */ 
  tool(dataarry, arr){
    dataarry.forEach(element => {
      let isUserName = Object.keys(element).includes('userName')
      if (element.isSign == '0') {
        arr.noReceive.push(isUserName ? element.userName : element.orgName)
      }
      if (element.isDelay == '1') {
        arr.delayReceive.push(isUserName ? element.userName : element.orgName)
      }
      if (element.isOverTime == '1') {
        arr.lateReceive.push(isUserName ? element.userName : element.orgName)
      }
      if (element.isInTime == '1') {
        arr.timelyReceive.push(isUserName ? element.userName : element.orgName)
      }
    });
  }

  //查询转办督办回复情况
  getTransactReply(disposeId) {
    this.http.InfoDutyRequest.transactDetailReply(disposeId).then(res => {
      if (res.status === 200) {
        let temp = res.data.map(it => {
          return it;
        });
        this.$set(this.transferInfo, 'replyInfo', temp);
      } else {
        //this.$message(res.msg)
        this.$set(this.transferInfo, 'replyInfo', []);
      }
    })
  }
  //点击回复按钮，显示回复框
  showReceiveDom(item, index) {
    item['show'] = true;
    this.$set(this.transferInfo.replyInfo, index, item);
    this.approvalContent = '回复 ' + item.disposePersonName;
  }
  //隐藏回复框
  hideReceiveDom(item, index) {
    item['show'] = false;
    this.getTransactReply(this.propdata.infoDisposeId)
  }
  //保存回复
  saveReceive(item, index) {
    let params = {
      disposeId: item.disposeId,
      replyContent: this.$refs.emoticon[0].inputText,
      type: '35'
    };
    this.http.GempInfoBaseRequest.sendApplyContent(params).then(res => {
      if (res.status === 200) {
        this.$message('回复成功！')
        this.hideReceiveDom(res, index);
        this.emit("setTransferProcess", "")
      } else {
        this.$message(res.msg)
      }
    })
  }

  // 查看图片方法
  viewImageCheck(url) {
    this.showImage = true
    this.checkImage = url
  }

  /**
     * author by chenzheyu  
     * 下载文件方法
     * @param url
     */
  download(file) {
    let fileId = file.response ? file.response.attachId : file.attachId
    
    let params = { fileId: fileId }
    this.http.GempInfoBaseRequest.Attachmentdownload(params).then(res => {
        this.downloadFunc(res)
    })
  }

  /**
     * Author by chenzheyu
     * 点击展示图片弹框
     * @param file 
     */
  handlePictureCardPreview(file) {
    this.dialogImageUrl = file.url;
    this.dialogVisible = true;
  }
}