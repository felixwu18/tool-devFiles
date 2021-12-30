import { ControllerBase, Prop, Emit, Inject, Watch } from 'prism-web';

export class IamsComboboxController extends ControllerBase {
  constructor() {
    super()
  }

  @Prop() listtype: string
  // 默认选中值
  @Prop() defaultchecked: any
  @Prop({default:false}) disabled: boolean
  @Prop() receive
  @Watch("defaultchecked")
  checkDefaultChecked(val) {
    if (val && val.length > 0) {
      if (typeof (val) == 'string') {
        this.defaultInputVal(val, this.treeData)
      } else {
        this.defaultCheckedMultiple(val, this.treeData)
      }
    }
  }

  // 父子节点不关联(默认为单选)  true 表示父子节点不关联  false表示父子节点关联
  @Prop() rootcheck: boolean
  // 父子节点不关联是否可多选
  @Prop() multiple: boolean

  // 父组件传递prop(下拉框选中)
  @Prop() parentprop: string
  // 是否未异步
  @Prop({
    default: false
  }) islazy: boolean
  // 异步获取数据的方法
  @Prop() lazymethod: string

  // input的placeholder
  @Prop() placeholder: string

  private slideValue: string = ''

  private showSlide: Boolean = false
  // 常用列表选中index
  private commonSelectIndex: number = -1

  // 常用列表数据
  private listData: Array<any> = []
  // 树节点数据
  private treeData: Array<any> = []
  // 是否为用户搜索
  private searchKey: boolean = false
  // 搜索返回的查询信息
  private searchList: Array<any> = []
  private singlecheckedNodes
  // 懒加载选中数组
  private lazyCheckNodes: Array<any> = []
  created() {
    this.getTreeData(this.listtype)
    this.bind(this)
  }

  private getDefaultProps = {
    children: 'children',
    label: 'label'
  }

  private temp = {
    style: require('../style/iamsCombobox.less')
  }

  @Inject('http') http: any

  getTreeData(method) {
    this.http.TreeNode[method]().then(res => {
      this.treeData = res.data.treeData || res.data
      this.listData = res.data.commonData || []
      if (this.receive) {
        this.getAll(this.treeData)
      }
      //过滤抄送单位和当前登录的单位一致的问题
      if(method =='getMultipleOrgTree'){
        let orgCode = JSON.parse(sessionStorage.getItem('role')).orgCode
        this.listData.forEach((el,index) => {
          if(el.id == orgCode) {
            this.listData.splice(index,1)
          }
        })
        this.treeData = this.treeDataFilters(this.treeData,orgCode)
      }
      let that = this
      if (this.defaultchecked && this.defaultchecked.length > 0) {
        if (typeof (this.defaultchecked) == 'string') {
          this.defaultInputVal(this.defaultchecked, this.treeData)
        } else {
          this.defaultCheckedMultiple(this.defaultchecked, this.treeData)
        }
      }
    })
  }

  treeDataFilters(data,id) {
    data.map((item,index) => {
      if(id == item.id) { item.disabled = true}
      if (item.children) {
        this.treeDataFilters(item.children,id)
      }
    });
    return data;
  }

  getAll(arr, label?) {
    arr.forEach(item => {
      item.disabled = item.virtualNode
      if (label) {
        // item.parentLabel = label
      }
      // console.log(item)
      if (item.children && item.children.length) {
        this.getAll(item.children, item.label)
      } else {

      }
    })

  }

  // 树组件点击回调
  /**
   * Modify by chenzheyu 修改点击回调当节点disabled为true时，父子节点关联，子节点全选删除该父节点节点
   * @param item
   * @param node
   */
  handleNodeClick(item, node) {
    let checkArr = this.$refs.tree['getCheckedKeys']()
    this.slideValue = ''
    if (this.rootcheck && !this.multiple) {
      // this.slideValue = item.label  机构名称统一用parentLabel，不做拼接
      this.slideValue = item.parentLabel || item.label || ''
      // console.log(item, node,checkArr);
      this.selectSlideChange(item.id)
      this.slideChange(item.id)
      if (checkArr.length >= 1) {
        let arr = []
        arr.push(item.id)
        this.$refs.tree['setCheckedKeys'](arr)
        this.showSlide = false
      }
      if (checkArr.length == 0) {
        this.slideValue = ""
        this.$nextTick(() => {
          this.$refs.tree['setCheckedKeys']([])
          this.selectSlideChange(""),
          this.slideChange("")
        })
        // console.log(this.$refs.tree)
      }
    } else {
      let nodeArr = JSON.parse(JSON.stringify(node.checkedKeys))
      node.checkedNodes.forEach((item, index) => {
        if (!item.disabled) {
          // this.slideValue += item.parentLabel || '' + item.label 机构名称统一用parentLabel，不做拼接
          this.slideValue += item.parentLabel || item.label || ''
          if (index < node.checkedNodes.length - 1) {
            this.slideValue += ','
          }
        } else {
          nodeArr.splice(index, 1)
        }
      })
      this.selectSlideChange(nodeArr)
      this.slideChange(nodeArr)
    }
    this.$refs.input['focus']()
  }

  // @Emit('change')
  // selectSlideChange(item) {
  //   if (this.parentprop) {
  //     item = { prop: this.parentprop, value: item }
  //   }
  //   return item
  // }

  /**
   * 选择后的回调
   * author by liuwenlei
   * @param item 
   */
  @Emit('input')
  selectSlideChange(item) {
    return item
  }

  @Emit('change')
  slideChange(item) {
    return item
  }

  // 绑定全局点击
  /**Author by chenzheyu
   * Modify by chenzheyu 修改下拉框显隐的判断条件，选中常用项时关闭下拉框
   * @param el
   */
  bind(el) {
    function documentHandler(e) {
      try {
        let list = el.$el.getElementsByClassName("el-tab-pane")[0]
        if (el.$el.contains(e.target) && !list.contains(e.target)) {
          el.showSlide = true
        } else {
          el.showSlide = false
        }
      } catch (error) {

      }
    }
    document.addEventListener('click', documentHandler)
  }

  // 处理单选选中返回值回填
  defaultInputVal(val: string, arr,flagArray?) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id == val) {
        if(flagArray) {
          this.slideValue += arr[i].label +','
        }else {
          this.slideValue = arr[i].label
        }
        break
      } else if (arr[i].children) {
        if(flagArray) {
          this.defaultInputVal(val, arr[i].children,flagArray)
        }else {
          this.defaultInputVal(val, arr[i].children)
        }
      } else {
        continue
      }
    }
  }

  // 多选选中值回填
  defaultCheckedMultiple(checkList: Array<any>, arr: Array<any>) {
    checkList.forEach(item => {
      this.defaultInputVal(item, arr,true)
    })
  }

   /**
   * 列表点击事件处理
   * Author by chenzheyu
   * Modify by 
   * @param val 搜索列表选中的数据
   * @param index 索引
   */
  handleSelect(val, index) {
    this.commonSelectIndex = index
    if (!this.multiple && this.rootcheck) {
      this.selectSlideChange(val.id)
      this.slideChange(val.id)
    } else {
      let arr = []
      arr.push(val.id)
      this.selectSlideChange(arr)
      this.slideChange(arr)
    }
    this.slideValue = val.parentLabel || val.label || ''
    this.$refs.input['focus']()
    this.$refs.tree['setCheckedKeys']([val.id])
  }

  // 搜索事件
  // by 刘文磊 搜索后已勾选项清空，传递值清空
  changeSearchStatus(e) {
    this.$refs.tree['setCheckedKeys']([])
    this.selectSlideChange('')
    this.slideChange("")
    if (this.slideValue != '') {
      this.searchList = []
      let arr = this.treeDataFilter(this.slideValue, this.treeData)
      this.$set(this, 'searchList', arr)
      this.searchKey = true
    } else {
      this.searchKey = false
    }
  }

   /**
   * 树形数据过滤器
   * Author by chenzheyu
   * Modify by chengyun item.label 修改为-item.parentLabel,优化机构树的查询。
   * @param data 查询的数组集合
   * @param name 机构名称
   */
  treeDataFilter(name, data) {
    let newArr = []
    let itemData :any
    data.forEach(item => {
      itemData = item.parentLabel ? item.parentLabel : item.label
      if (itemData.indexOf(name) > -1 && !item.children) {
        newArr.push(item)
      } else if (itemData.indexOf(name) > -1 && item.children) {
        newArr.push(item)
        newArr = newArr.concat(this.treeDataFilter(name, item.children))
      } else if (itemData.indexOf(name) == -1 && item.children) {
        newArr = newArr.concat(this.treeDataFilter(name, item.children))
      }
    });
    return newArr
  }

  /**
   * 机构懒加载
   * Author by chenzheyu
   * @param data 
   * @param node 
   */
  treeLoad(data, node) {
    if (!!this.islazy) {
      if (this.$refs['tree']['getNode'](data)['childNodes'].length == 0) {
        this.http.TreeNode.treeByCode(node.key).then(res => {
          if (res.status == 200) {
            this.$refs['tree']['updateKeyChildren'](node.key, res.data)
            node.expanded = true
          }
        })
      } else {
        node.expanded = !node.expanded
      }
    }
  }

  /**
   * 懒加载节点选中事件
   * Author by chenzheyu
   * @param data 
   */
  lazyHandleClick(data) {
    if (data.data.checked) {
      this.lazyCheckNodes.push(data.data.id)
      this.slideValue === "" ? this.slideValue += data.data.label : this.slideValue += ',' + data.data.label
    } else {
      this.lazyCheckNodes.forEach((item, index) => {
        if (item === data.data.id) {
          this.lazyCheckNodes.splice(index, 1)
          let slideValueArr = this.slideValue.split(',')
          slideValueArr.forEach((cells, num) => {
            if (cells === data.data.label) {
              slideValueArr.splice(num, 1)
            }
          })
          this.slideValue = slideValueArr.join(",")
        }
      })
    }
    this.selectSlideChange(this.lazyCheckNodes)
    this.slideChange(this.lazyCheckNodes)
  }
}
