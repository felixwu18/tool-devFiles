import { ControllerBase, Emit, Prop } from 'prism-web'
//值班要情查看
export class RecordPlayDialogController extends ControllerBase {
  private temp = {
    style: require('../../style/telephoneMessage/recordPlayDialog.less')
  }

  constructor() {
    super()
  }


  private audioSrc = '../../../../assets/video/my.mp3'

  @Prop() audioSrcs

  @Emit('dialogcallback')
  closeDialogCall() {
    return
  }

  created() {
  }


  //点击取消按钮
  cancelOpen() {
    this.closeDialogCall()
  }

  audioDialog(){

  }

  ready(){

    console.log("play click")
  }

  pause(){

  console.log("pause click")
  }

}
