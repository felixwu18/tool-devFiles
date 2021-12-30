/**
 * author by xinglu 删除
 */
import { ControllerBase, Inject, Watch, Prop } from 'prism-web'

export class WeekTemplateControll extends ControllerBase {
  private temp = {
    style: require('../style/weekplanTemplate.less')
  }

  constructor() {
    super()
  }
  private viewlog=false
  private tempOption=[]
  // 带班人员列表
  private options = [{ name: '时间', value: '1' }, { name: '文本',value: '2' }, { name: '数字', value: '3' }, { name: '文本+数字', value: '4' }, { name: '下拉菜单', value: '5' }]

  private tableData = [{ name: '日期', tempType: '1' }, { name: "下拉菜单", tempType: '5', optable: [{ name: "出国", opvalue: '1' }, { name: "出省", opvalue:"2"}]}]
  // by xinglu 删除按钮
  // by 刘文磊 删除功能补充
  delet(index) {

    this.tableData.splice(index,1)
  }
  // by xinglu 返回
  searchUnread(){
    this.$router.push({
      path:'/weekPlan/list'
    })
  }
  /**
   * author by liuwenlei 保存按钮
   */ 
  submit(){

  }
  
  /**
   * author by liuwenlei 新增按钮
   */
  reportAdd(){
    this.tableData.push({ name: "", tempType: null})
  }

  /**
   * author by liuwnelei 选择空间类型后事件
   */ 
  tempchange(val,row){
   if(val=='5'){
     if (!row.hasOwnProperty('optable')){
       this.$set(row, 'optable', [{ name: "", opvalue: "" }, { name: "", opvalue: "" }])
     }
     this.viewlog = true
     this.tempOption=row.optable
   }
  }

  /**
   * author by liuwenlei 选项新增
   * @param data 
   */ 
  opadd(data){
    data.push({ name: "", opvalue: "" })
  }

  /**
   * author by liuwenlei 选项删除
   * @param data 
   */
  deletop(index){
    this.tempOption.splice(index,1)
  }
}