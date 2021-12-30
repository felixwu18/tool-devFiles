import { ControllerBase, Prop, Inject, Emit } from 'prism-web';
import {  downloadFuncs } from '../../../../assets/libs/commonUtils'
export class PreviewControler extends ControllerBase {
  // 数据绑定接口
  private continueReportData = {
    infoId: '',
    attachmentList: [],
    infoDescription: '',
  };
  private messageDom: any = null; // message实体
  @Prop() propdata;
  @Prop({ default: false, required: false }) isbtn: boolean

  @Inject('http') http: any;

  private temp = {
    style: require('../../style/infoManage/preview.less'),
  };
   // 值班信息文档地址
 private docUrl:string = ''
  
 // 全屏状态
 private fullScreenStatus: boolean = false

  constructor() {
    super();
  }


  created(){
    // 获取值班信息文档
    let param = {
      infoId:this.propdata.infoId
    }
    this.http.GempInfoBaseRequest.getViewDoc(param).then((res) => {
      if (res.status == 200) {
        this.docUrl = res.data
      } else {
        this.$message(res.msg)
      }
    })
  }
  activated() {}

// 下载文件
downloadDoc(){
  downloadFuncs(this.docUrl)
}

public handleFullScreen(){
  const el: any = document.getElementById("docUrl")
  // 判断是否已经是全屏
  // 如果是全屏，退出
  if (this.fullScreenStatus) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitCancelFullScreen) {
        (document as any).webkitCancelFullScreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
      console.log('已还原！');
  } else {    // 否则，进入全屏
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.webkitRequestFullScreen) {
        el.webkitRequestFullScreen();
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
      } else if (el.msRequestFullscreen) {
          // IE11
          el.msRequestFullscreen();
      }
      console.log('已全屏！');
  }
  // 改变当前全屏状态
  this.fullScreenStatus = !this.fullScreenStatus;
}

  // 办理页面
  handle() {
    this.$router.push({
      path: '/information/detailsManage',
      query: { id: this.propdata.infoId },
    });
  }

  //续报
  // saveFun() {
  //   this.$set(this.continueReportData, 'infoId', this.propdata.infoId);
  //   if (this.continueReportData.infoDescription.trim() == '') {
  //     if (this.messageDom) {
  //       this.messageDom.close();
  //     }
  //     this.messageDom = this.$message('续报信息内容不能为空！');
  //     return;
  //   }
  //   //续报保存按钮点击事件
  //   this.http.DetailOperationsRequest.continueBaseInfo(
  //     this.continueReportData,
  //   ).then(res => {
  //     if (res.status !== 200) {
  //       this.$message(res.msg);
  //       return;
  //     }
  //     this.closeDialogCall(this.propdata.infoId);
  //   });
  // }




  
  @Emit('dialogcallback')
  closeDialogCall(infoId) {}
  //附件改变
  handleFileChange() {}

  //返回
  cancleFun() {
    this.closeDialogCall(this.propdata.infoId);
  }

  handleCancel() {
    this.closeDialogCall(this.propdata.infoId);
  }
}
