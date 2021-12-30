
import { ControllerBase, Prop, Emit, Watch } from 'prism-web'
import searchSession from '../../../assets/libs/searchData'

export class IamsReplyBox extends ControllerBase {
  constructor() {
    super()
  }
  @Prop() value
  @Prop() placeholder:string

  private textarea = ''

  // 表情symbol配置
  private emoticonList = {
    '[闭嘴]': '#icon-bizui',
    '[白眼]': '#icon-baiyan',
    '[色]': '#icon-aixin',
    '[呲牙]': '#icon-ziya',
    '[汗]': '#icon-hanyan',
    '[开心]': '#icon-kaixin',
    '[大哭]': '#icon-liulei',
    '[睡觉]': '#icon-shuizhuo',
    '[笑出泪]': '#icon-xiaochulei',
    '[星星眼]': '#icon-xingxingyan',
    '[酷]': '#icon-ku',
    '[累]': '#icon-yousiliao',
    '[衰]': '#icon-shuai',
    '[凶]': '#icon-xiong',
    '[疑问]': '#icon-yiwen',
    '[晕]': '#icon-yun',
    '[可怕]': '#icon-shimo',
    '[点赞]': '#icon-dianzan',
    '[爱你]': '#icon-aini',
    '[爱心]': '#icon-aixin1'
  }
  private showEmoticon: boolean = false

  private temp = {
    style: require("../style/emoticonArea.less")
  }

  private message = null

  private emojiInput = `emojiInput${new Date().getTime()}`

  private elInput = null

  private regExp = /\[[\u4e00-\u9fa5]{1,4}\]/ig

  // 表情标签是否显示
  get expressionLabelStatu() {
    return searchSession.getter({ name: 'role' }).sysExpressionSwitch === 'N';
  }

  mounted() {
    this.elInput = document.getElementById(this.emojiInput)
  }

  @Watch('textarea')
  textareaChange(val) {
    if(this.regExp.test(val)) {
      this.replaceEmoji(val)
      return
    }
    this.$emit('input', val)
  }

  // 点击表情插入文本
  insertText(val) {
    if (this.textarea.length + val.length > 500) {
      if (this.message) {
        this.message.close()
      }
      this.message = this.$message.warning('剩余字符不足，无法添加表情!')
      return
    }

    let elInput = this.elInput

    if (!elInput) {
      this.elInput = document.getElementById(this.emojiInput)
    }

    const startPos = elInput['selectionStart']
    const endPos = elInput['selectionEnd']

    if (startPos === undefined || endPos === undefined) {
      return
    }

    const txt = this.textarea;
    // 将表情添加到选中的光标位置
    const result = txt.substring(0, startPos) + val + txt.substring(endPos)
    this.textarea = result;// 赋值给input的value
    // 重新定义光标位置
    elInput.focus()
  }

  replaceEmoji(val) {
    const newVal = val.replace(this.regExp, oldVal => `&nbsp;<svg class="icon" aria-hidden="true"><use xlink:href="${this.emoticonList[oldVal]}"></use></svg>&nbsp`)
    return this.$emit('input', newVal)
  }

  updateContent(val) {
    this.textarea = val
  }
}