import { ControllerBase, Prop, Emit, Inject, Watch } from 'prism-web';

//值班管理左侧机构树的组件
export class InformationHandlingSearchTreeController extends ControllerBase {
  constructor() {
    super();
  }

  private temp = {
    style: require('../../style/infoManage/informationHandlingSearchTree.less')
  };

  @Inject('http') http: any;

  @Prop() lazyload: boolean // 是否为懒加载
  //请求方法
  @Prop() listtype: string;
  // 默认选中值
  @Prop({ default: () => ({}) }) configtree: any; //参数配置
  @Prop() defaultchecked: any;
  @Watch('defaultchecked')
  // by liuwenlei 默认值变化赋值
  checkDefaultChecked(val) {
    if (val && val.length > 0) {
      this.defaultcheckeds = val;
      this.$refs.tree['setCurrentKey'](val)
    } else {
      return false;
    }
  }
  //选中参数回传
  @Emit('change')
  selectSlideChange(item) {
    if (item) {
      item = { prop: item };
    }
    return item;
  }

  @Emit('check')
  emitCheckedNodes(nodes) {
    return nodes;
  }

  private render: Function  // resolve方法
  private quickSearchParam = { // 快速搜索param
    nowPage: 1,
    keyWord: '',
    pageSize: 10
  }
  private placeholderText = "数据加载中..."  // tree展示字
  //选中参数
  private selectData = null
  //搜索关键字参数
  private slideValue: string = '';
  //展开参数
  private showSlide: Boolean = false;
  // 树节点数据
  private treeData: Array<any> = [];
  // 是否为用户搜索
  private searchKey: boolean = false;
  // 搜索返回的查询信息
  private searchList: Array<any> = [];

  // 默认值
  // by 刘文磊 默认值为当前登录角色机构
  private defaultcheckeds = ""
  private insertNode: any
  //指定树的属性值
  private getDefaultProps = {
    children: 'children',
    label: 'label'
  };

  created() {
    this.getTreeData(this.listtype);
    this.defaultcheckeds = this.defaultchecked ? this.defaultchecked : JSON.parse(sessionStorage.getItem('role')).orgCode;
  }

  mounted() {
    this.scrollerEvent()

  }

  /**
   * Modify by chengyun 机构树请求
   * @param method
   */
  async getTreeData(method) {
    let res = await this.http.TreeNode[method]()
    this.placeholderText = '暂无数据'
    if (res.data.treeData) {
      this.treeData = res.data.treeData;
    } else {
      this.treeData = res.data
      //处理角色管理左侧机构树
      if (res.data[0].groupName && res.data[0].systemCode) {
        this.treeData = res.data.map(item => {
          item.label = item.groupName
          return item
        })
      }
    }
    if (this.configtree.disabledChecBox) {
      this.treeData[0].disabled = true
      this.treeData[0].children[0].disabled = true
    }
    if (!!this.lazyload) {
      let response = await this.http.TreeNode.provincetoorg(this.defaultcheckeds)
      if (this.configtree.disabledChecBox) {
        response.data[0].disabled = true
        response.data[0].children[0].disabled = true
      }
      if (response.status == 200) {
        this.resolveChildData(response.data, this.defaultcheckeds)
      }
    }
  }
  /**
 * 树节点
 * @param treeNode
 */
  /**
   * Modify by chengyun 树组件当前选择的值
   * @param item
   */
  getCurrentNodes() {
    return this.$refs.tree['getCurrentNode']()
  }

  /**
   * Author by chenzheyu
   * 父级组件对该组件中el-tree的操作
   * @param type  操作的方法名
   * @param data  传参
   */
  handleTree(type: string, data?) {
    data = data instanceof Array ? data : new Array(data)
    return this.$refs.tree[type].apply(this.$refs.tree, data)
  }

  /**
   * Modify by chengyun 树组件点击回调
   * @param item
   */
  handleNodeClick(item) {
    this.selectData = item;
    this.slideValue = '';
    this.slideValue = item.label;
    this.defaultcheckeds = '';
    if (!this.configtree.checkbox || (this.configtree.disabledChecBox && !item.disabled)) {
      this.selectSlideChange(item);
    }
  }
  /**
   * Modify by chengyun 树组件点击回调
   * @param node //点击的节点
   * @param status //选中状态
   */
  handleCheckChange(node, status) {
    // debugger
    if (this.configtree.checkbox) {
      // const checkedNodes = this.$refs.tree['getCheckedNodes']();
      let item = JSON.parse(JSON.stringify(node))
      item.status = status
      this.emitCheckedNodes(item);
    }
  }

  /**
   * Modify by chengyun 搜索结果列表点击事件处理
   * Modify by chenzheyu  添加懒加载反查功能
   * Modify by liuwenlei  搜索结果点击后展开该节点
   * @param val
   */
  async handleSelect(val, index) {
    this.defaultcheckeds = val.orgCode
    this.slideValue = val.label;
    this.$refs.input['focus']();
    if (!this.lazyload || this.$refs['tree']['getNode'](val)) {
      this.$refs.tree['setCurrentKey'](val.id)
    } else {
      let res = await this.http.TreeNode.provincetoorg(val.id)
      if (res.status == 200) {
        console.log(res.data)
        this.resolveChildData(res.data, val.id)
      }
    }
    this.selectSlideChange(val)
    this.searchKey = false;
  }

  /**
   * Author by liuwenlei  搜索时取消项父组件传空值
   * Modify by chengyun 搜索结果列表
   * Modify by chenzheyu 添加懒加载情况下的数据
   * @param data
   */
  async changeSearchStatus(data) {
    if (this.slideValue != '') {
      if (isNaN(data)) {
        this.searchList = []
        this.quickSearchParam.nowPage = 1
      }
      let arr = []
      if (!this.lazyload) {
        arr = this.treeDataFilter(this.slideValue, this.treeData);
      } else {
        this.quickSearchParam.keyWord = this.slideValue
        if (!!data && !isNaN(data)) {
          this.quickSearchParam.nowPage = data
        }
        let result = await this.http.TreeNode.quickSearch(this.quickSearchParam)
        arr = result.data.list
        if (arr.length > 0) {
          arr.map(item => {
            item.label = item.orgName
            item.id = item.orgCode
          })
        }
      }
      let newArr = !!data && !isNaN(data) ? this.searchList.concat(arr) : arr
      this.$set(this, 'searchList', newArr)
      this.searchKey = true;
    } else {
      this.searchKey = false;
    }
  }

  /**
   * Modify by chengyun 操作按钮点击事件
   * @param  operatName curTr  buttonItem
   * 方法名 当前选择机构名 传过来的按钮参数
   */

  operateFun(operatName, buttonItem) {
    this.treeBtnClick(operatName, this.selectData, buttonItem);
  }

  @Emit('treecallback')
  treeBtnClick(operatName, curTr?, buttonItem?) {
    return { type: operatName, rowVal: curTr, buttonItem: buttonItem };
  }
  @Emit('checktree')
  checkTree(data1, data2) {
    // debugger
    let data = {
      id: data1.id,
      status: data2.checkedKeys.includes(data1.id)
    }
    // this.selectSlideChange(data1)
    return data
  }

  /**
   * Modify by chenzheyu  树形数据过滤器
   * @param name
   * @param data
   */
  treeDataFilter(name, data) {
    let newArr = [];
    data.forEach(item => {
      if (item.label.indexOf(name) > -1 && !item.children) {
        newArr.push(item);
      } else if (item.label.indexOf(name) > -1 && item.children) {
        newArr.push(item);
        newArr = newArr.concat(this.treeDataFilter(name, item.children));
      } else if (item.label.indexOf(name) == -1 && item.children) {
        newArr = newArr.concat(this.treeDataFilter(name, item.children));
      }
    });
    return newArr;
  }

  /**
   * Author by chenzheyu 懒加载节点方法
   * @param node
   * @param resolve
   */
  treeLoad(data, node) {
    if (!!this.lazyload) {
      if (this.$refs['tree']['getNode'](data)['childNodes'].length == 0) {
        this.http.TreeNode.treeByCode(node.key).then(res => {
          if (res.status == 200) {
            this.placeholderText = '暂无数据'
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
   * Author by chenzheyu 处理返回数据插入节点
   * @param data
   */
  resolveChildData(data: Array<any>, id: String) {
    let exception = {}
    try {
      data.forEach(item => {
        if (item.id === id) {
          this.insertNode = item
          this.renderChild(data, id)
          throw exception
        } else if (item.children.length > 0) {
          if (!!this.$refs['tree']['getNode'](item)) {
            this.insertNode = item
            if (this.$refs['tree']['getNode'](item).childNodes.length == 0) {
              this.renderChild(data, id)
              throw exception
            } else {
              this.resolveChildData(item.children, id)
            }
          }
        }
      })
    } catch (e) {
      if (e !== exception) throw e
    }
  }

  /**
   * Author by chenzheyu 渲染方法
   * @param data
   * @param id
   */
  renderChild(data, id) {
    let renderData: Array<any>
    let index = 0
    data.forEach(item => {
      if (item.id === this.insertNode.id) {
        renderData = item.children
      }
    })
    this.$refs['tree']['updateKeyChildren'](this.insertNode.id, renderData)
    let interval = setInterval(_ => {
      index++
      if (!this.$refs['tree']) {
        clearInterval(interval)
      } else if (!!this.$refs['tree']['getNode'](id)) {
        this.$refs.tree['setCurrentKey'](id)
        clearInterval(interval)
        this.http.TreeNode.treeByCode(id).then(res => {
          if (res.status == 200) {
            this.$refs['tree']['updateKeyChildren'](id, res.data)
            this.scrollCurrent()
          }
        })
      } else if (index == 20) {
        clearInterval(interval)
      }
    }, 100)
  }

  /**
   * Author by chenzheyu  监听滚动事件
   */
  scrollerEvent() {
    let dom = document.getElementById("filter_list")
    function addWheel(obj, fn) {
      function wheel(ev) {
        var oEvent = ev || event;
        var bDown = true;
        bDown = oEvent.wheelDelta ? oEvent.wheelDelta > 0 : oEvent.detail < 0;
        fn && fn(bDown);
        return false;
      }
      if (window.navigator.userAgent.indexOf('Firefox') != -1) {
        obj.addEventListener('DOMMouseScroll', wheel, false)
      } else {
        addEvent(obj, 'mousewheel', wheel);
      }
    }

    function addEvent(obj, sEv, fn) {
      if (obj.addEventListener) {
        return obj.addEventListener(sEv, fn, false);
      } else {
        return obj.attachEvent('on' + sEv, fn);
      }
    }

    addWheel(dom, (e) => {
      let parent = document.getElementById('out_contain').offsetHeight
      let scroll = document.getElementsByClassName("el-scrollbar__wrap")[0].scrollTop
      let inner = dom.offsetHeight
      if (!e && inner <= parent + scroll) {
        this.changeSearchStatus(this.quickSearchParam.nowPage * 1 + 1)
      }
    })
  }

  // 滚动条滚动到默认选中的节点
  scrollCurrent() {
    this.$nextTick(() => {
      // 当前选中项 距离最近有定位元素（父祖级元素）的高度距离
      let current = document.getElementsByClassName("is-current")
      if (current.length == 0) return
      let currentHeight = current[0]['offsetTop'] + 24
      //可视区的高度
      let fixbox = document.getElementById("mainheight").firstChild
      let fixheight = fixbox["clientHeight"]
      if (currentHeight > fixheight) {
        fixbox["scrollTop"] = currentHeight - fixheight + (fixheight / 2)
      }
    })
  }
}
