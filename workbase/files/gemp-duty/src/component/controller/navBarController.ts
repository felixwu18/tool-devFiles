import { ControllerBase, Prop, Inject, App, Emit, Watch } from 'prism-web'
import searchData from '../../../assets/libs/searchData'

export class TabNavController extends ControllerBase {

  constructor() {
    super()
  }

  @Prop() childrenlist: Array<any>
  @Inject('http') http: any

  private role = null //当前用户信息
  private currentPath: string
  private temp = {
    style: require("../style/navBar.less")
  }

  get activeIndex() {
    let $index: number
    let path = this.$route.path
    this.childrenlist.forEach((item, index) => {
      if (item.router == path) {
        $index = index + 1
      }
      if(item.children) {
        item.children.forEach(_child => {
          if(path.indexOf(_child) > -1) {
            $index = index + 1
            return
          }
        })
      }
    })
    if ($index) {
      this.currentPath = $index.toString()
    }
    return this.currentPath
  }

  created() {
    this.role = searchData.getter({ name: 'role' })

  }
  /*
   * Author by chenzheyu   列表点击切换路由
   * Modify by chenzheyu
  */

  private handleSelect(index, indexPath) {
    let path = this.childrenlist[index - 1].router.toString()
    this.go(path)
  }

  private barChange(item) {
    if(searchData) {
      if (searchData.getter({ name: 'searchData' })) {
        sessionStorage.removeItem('searchData')
      }
      if (searchData.getter({ name: 'searchDatatwo' })) {
        sessionStorage.removeItem('searchDatatwo')
      }
      if (searchData.getter({ name: 'handleselect' })) {
        sessionStorage.removeItem('handleselect')
      }
    }
    this.go(item.router)
    if (item.label) {
      this.handlechange(item.label)
    }
  }

  @Emit('handlechange')
  handlechange(item) {
    return item.label
  }

  @Emit('selectchange')
  selectchange(val) {
    return val
  }
}
