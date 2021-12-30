import { ControllerBase, Inject, Prop } from 'prism-web'
// import { navDataRight } from '../../../../interfaces/navDataRight'
import searchSession from '../../../../assets/libs/searchData'

export class detailsNavRightController extends ControllerBase {
  // detailsnavrightList: Array<navDataRight>
  private role: string //当前角色
  private navbtnFlag:Boolean = true//应急预案 相关法律法规 相关知识显示隐藏控制
  @Inject('routerService') routerService: any

  @Inject('getApp') appService: any

  @Prop() signforflag   //接受父组件传过来的值直接给子组件用

  @Prop() expectDraft   //接受父组件传过来的值直接给子组件用
 

  @Prop() detailsright
  // created() {
  //   this.detailsnavrightList = [{ name: '处理过程', temp: '<details-process></details-process>' }, { name: '关联信息', temp: '<details-relevance></details-relevance>' }]
  // }

  // private activeIndex = '1'
  private activeName = 'first'
  private planeName = ''

  // 相关知识是否显示
  get relatedKnowledgeTabStatu() {
    return searchSession.getter({ name: 'role' }).sysRelatedKnowledgeSwitch === 'N';
  }


  constructor() {
    super()
  }
  private handleChange(val) {
    console.log(val)
  }

  /**
   * Modify by chenzheyu 修改关联列表点击事件
   * @param val 
   */
  private handleClick(val) {
    switch(val.name) {
      case 'second':
          this.$refs.detailRelecvance['getRelevanceList']()
          break;
      case 'third':
          this.$refs.detailsplan['getDetailsPlanList']()
          break;
      case 'fourth':
          this.$refs.detailslaw['getHandleList']()
          break;
      case 'five':
          this.$refs.detailsknowledge['getHandleList']()
          break;
      case 'six':
          this.$refs.detailsofficial['getRelativeBriefList']()
          break;
    }
    console.log(val)
  }
  private temp = {
    style: require('../../style/infoManage/detailsNavRight.less')
  }

  created(){
    this.role = sessionStorage.getItem("role")
    if(this.role.indexOf('应急') < 0 ){
      this.navbtnFlag = false
    }
  }

}
