import { ControllerBase, Inject, Watch, Prop, Emit } from 'prism-web'
// import { setImmediate } from 'timers';
import { uniqueBy } from '../../../utils/tools'

export class InformationHandlingTreeController extends ControllerBase {
  constructor() {
    super();
  }

  @Inject('http') http: any;
  // @Prop() curIndex: any;
//   private style = require('../style/dutySearchTree.less');
  private temp = {
    style: require('../../style/infoManage/informationHandlingTree.less'),
};
  private keyword: String = '';
  private searchPanelShow: boolean = false;
  private searchList: any = [];

  private treeData: any = []
  private temptemp: any = []
  private treeData_district: any = [];
  private treeData_group: any = [];
  private uniqueDatas: any = [];

  private defaultProps = {
    children: 'children',
    label: 'personName'
  };


  async created() {
    try {
      this.treeData_district = await this.fetchAllDutyDatas()
      // this.treeData_group = await this.fetchAllDutyDatas_specail()
    } catch (error) {
      console.log(error)
    }
    this.initOrChangeData() // 初始化数据 深拷贝
    this.on('treeNodeUncheck', this.treeNodeUncheck);
    this.on('treeClearChecked', this.treeClearChecked);
    this.on('treeNodeCheckCur', this.treeNodeCheckCur); // 回显已勾选状态
  }

  beforeDestroy() {
    this.off('treeNodeUncheck');
    this.off('treeClearChecked');
    this.off('treeNodeCheckCur');
  }


  @Watch('keyword')
  watchKeyword(val) {
    if (val) {
      this.uniqueDatas = this.getAllUniqueNodes();
      this.searchPanelShow = true;
      this.searchList = this.uniqueDatas.filter(node => node.personName.includes(val));
    }
  }
  // @Watch('curIndex')
  // curIndexChange(val) {
  //   // 切换tab时, 更换数据源
  //   this.initOrChangeData()
  // }
  // 关闭右侧单个tag标签
  treeNodeUncheck(data) {
    const tree: any = this.$refs.tree;
    if (tree) {
      const item = data[0];
      tree.setChecked(item.id, false);
    }
  }

  treeClearChecked() {
    const tree: any = this.$refs.tree;
    if (tree) {
      tree.setCheckedKeys([]);
    }
  }
  // 切换恢复选中
  treeNodeCheckCur(val) {
    this.temptemp = val[0] || []
    const tree: any = this.$refs.tree;
    if (tree && val) {
      this.$nextTick(() => {
        tree.setCheckedNodes(val[0])
      })
    }
  }
  handleNodeClick(item) {
    if (item.hasOwnProperty('children')) {
      this.$emit('getTableData', item.children)
    } else {
      this.$emit('getTableData', [item])
    }
  }


  async fetchAllDutyDatas() {
    const res = await this.http.DetailOperationsRequest.getTodayAllDuty();
    if (res.status === 200) {
      const data = res.data;
      return data.map((item, index) =>
      ({
        ...item, id: index + 1, personName: item.districtName, children: item.detailList2?.concat(item.detailList1)?.map((sub, idx) =>
          ({ ...sub, id: `${idx + 1}-${sub.personId}`,  districtName: item.districtName, personName: sub.personName, groupName: `${sub.groupName}${sub.mechanisFlagName ? '(' + sub.mechanisFlagName +  ')' : ''}` })) ?? []
      }))
    }
    return [];
  }
  async fetchAllDutyDatas_specail() {
    const res = await this.http.MailListRequest.searchGroupList();
    if (res.status === 200) {
      const data = res.data;
      return data.map((item, index) =>
      ({
        ...item, id: index + 1, personName: item.groupName, children: item.list?.map((sub, idx) =>
          ({ ...sub, id: `${idx + 1}-${sub.personId}`, personName: `${sub.personName}${sub.personName.length <= 2 ? '       ' : '   '}${sub.orgName}${sub.mechanisFlagName ? '(' + sub.mechanisFlagName +  ')' : ''}` })) ?? [] // 样式控制空格输出 勿动
      }))
    }
    return [];
  }
  initOrChangeData() {
    this.treeData = JSON.parse(JSON.stringify(this.treeData_district));
    // if (this.curIndex === 0) {
    // }
    // if (this.curIndex === 1) {
    //   this.treeData = JSON.parse(JSON.stringify(this.treeData_group));
    // }
  }
  // 数据去重
  getAllUniqueNodes() {
    const concatChildren = this.treeData.reduce((cur, item) => cur.concat(item.children), [])
    // return concatChildren
    return uniqueBy(concatChildren, ele => ele.personId)
  }

  checkTreeNode(curNode, data) {
    const checkedNodes = data.checkedNodes.filter(node => !this.backNotSelectIndexArr().includes(node.id));
    // 数据去重
    const uniqueArr: any = uniqueBy(checkedNodes, ele => ele.personId)
    if (curNode.hasOwnProperty('children')) {
        this.$emit('test', {curNodes: uniqueArr})
    } else {
        if (data.checkedNodes.includes(curNode)) {
            this.$emit('test', {curNodes: [curNode]})
        } else {
            this.$emit('test', { treeFlag: 1, curNodes: [curNode]})
        }
    }
  }

  backNotSelectIndexArr() {
    return this.treeData.map((item, index) => index + 1)
  }
  // 搜索下来框选中后交互
  handleSelect(person) {
    this.searchPanelShow = false;
    const tree: any = this.$refs.tree;
    if (tree) {
      // 设为当前节点
      tree.setCurrentKey(person.id);
      const node = tree.getNode(person.id);
      const parent = node.parent;
      // 展开父节点
      if (!parent.expanded) {
        parent.expand();
      }

      setTimeout(() => {
        const currentDom = tree.$el.querySelector('.is-current');
        currentDom.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    }
  }
}