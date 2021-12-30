import { ControllerBase, Prop, Emit, Inject, Watch } from 'prism-web'

export class IamsSelectListController extends ControllerBase {
  constructor() {
    super()
  }

  @Inject('http') http: any
  @Prop() listtype: string //接口方法名
  @Prop() parentprop //如存在回传对象(当前点击的和传入的),不存在回传value 或 id
  @Prop() defaultchecked:string //默认参数
  @Prop() disabled //是否禁用
  @Watch('defaultchecked')
  checkdefaultchecked(val) {
    if(!val){ return false}
    val.toString()
    if (val && val.length > 0) {
      this.selectlistDefault.id = this.defaultchecked.toString()
    }
  }
  //
  /**
   * 选中的回调
   * author by liuwenlei
   * @param value 
   */ 
  @Emit('input')
  handleNode(value) {
    return value
  }

  //物资来源
  private data = {}
  //新组件list参数
  private selectlistData: Array<any> = []
  //初始选中 by 刘文磊 添加是否禁用变量
  private selectlistDefault = { id: '',disabled:false }
  created() {
    // by 刘文磊 初始化 选中和禁用
    this.selectlistDefault.id = this.defaultchecked||""
    this.selectlistDefault.disabled = this.disabled || false
    this.getSearchSlideListData(this.listtype)
    // this.getSearchSlideListData('InfoDutyRequest','urgencyLevel')
    this.bind(this)
  }

  // 获取list组件内部信息方法
  getSearchSlideListData(method) {
    // InfoDutyRequest.urgencyLevel
    this.http.SelectNode[method]().then((res) => {
    // this.http[method][fun]().then((res) => {
      // this.selectlistDefault.id = this.defaultchecked ? this.defaultchecked.toString() : '' //刘京注释，这个地方可不必加上
      this.selectlistData = res.data
    })
  }

  private temp = {
    style: require('../style/iamsSelectList.less')
  }

  // 绑定全局点击
  bind(el) {
    function documentHandler(e) {
      try {
        if (el.$el.contains(e.target)) {
          el.showSlide = true
        } else {
          el.showSlide = false
        }
      } catch (error) {}
    }
    document.addEventListener('click', documentHandler)
  }
}
