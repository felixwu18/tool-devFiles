import { Row } from 'element-ui';
import { ControllerBase, Inject, Watch, Prop} from 'prism-web'
import { timeFormat } from '../../../../assets/libs/commonUtils'
const _ = require('lodash')

export class InformationHandlingController extends ControllerBase {
    constructor() {
        super()
    }
    @Inject("http") http: any;
    @Prop() infoid:any;
    @Prop() detailUrlinfoId:any;
    @Prop({default:false}) cbflag:Boolean;
    @Prop({ default: false }) handletype: any;
    private curIndex: number = 0;
    private temp = {
        style: require('../../style/infoManage/informationHandling.less'),
    };
    private manageType:string = '1'; // 处理类型
    private cacheManageType:string = '1'; // 处理类型 缓存记录上次
    private manageDialog:boolean = true; // 信息处理弹框
    private viewMapDialog:boolean = false; // 地图选择弹框
    private proposeOption: any[] = []; // 信息拟办人员名单
    private checkOption: any[] = []; // 信息审核人员名单
    private leaderOption: any[] = []; // 领导批示人员名单
    private proposeList: any[] = []; // 信息拟办选择人员名单
    private checkList: any[] = []; // 信息审核选择人员名单
    private leaderList: any[] = []; // 领导选择人员名单
    private approvalContent:any = ''; // 审核意见
    private role:any = null; // 用户信息
    private sjUser:any = false;
    private reportFlag:any = true;
    private orgDefaultcheckeds = '' // 机构树默认高亮节点
    private activeAllList = []
    private checkBoxContent: any = []    // 选中的内容
    private namekeyWord = '' // 人员姓名搜索框
    private activePersonNameList = [] // 选中的人员名单
    private cacheTreeOrgChecked = [] // 组织机构选中缓存
    private toggleRowSelectionFlag = false; // 避免selection-change被动触发
    private tabChangeOrClickNodeFlag = false; // 避免tab切換或者组织机构点击节点table重置selection-change被动触发
    // private nodeClick = 0; // 记录点击 还是勾选状态触发表格选择事情
    private treeFlag = 0; // 标记tree触发取消
    private tableData = {
        tableData_duty: [],
        tableData_org: [],
    } // 右边表格
    private sendType = '1';

    // 人员列表查询列表查询参数
    private searchData = {
        keyWord: "",
        nowPage: 1,
        pageSize: 5,
        orgCode: ""
    }
    private configtree = {
        checkbox: true,
        checkStrictly: true, //不级联
        disabledChecBox: true,// 只有最后一个层级可以选（针对短信收发）
      };
      private treeSearchData = {
        groupId: "",
        nowPage: 1,
        pageSize: 5,
        keyWord: '',
      }
    private headCols = [];
    private headCols_duty = [
        { prop: 'districtName', label: '行政区划' },
        { prop: 'groupName', label: '值班类型' },
        { prop: 'personName', label: '姓名' }
    ];
    private headCols_org = [
        { prop: 'personName', label: '姓名' },
        { prop: 'personJob', label: '职务' },
        { prop: 'dutyNumber', label: '办公电话' },
        { prop: 'telNumber', label: '移动电话' },
    ];
    private propData = {
        isCheck: true,
        pageSize: 5,
        nowPage: 1,
        total: 0,
        config: [
          {
            type: 'string',
            label: '姓名',
            prop: 'personName'
          },
          {
            type: 'string',
            label: '职务',
            prop: 'personJob'
          },
          {
            type: 'string',
            label: '办公电话',
            prop: 'dutyNumber'
          },
          {
            type: 'string',
            label: '移动电话',
            prop: 'telNumber',
          }
        ],
        data: []
      }

    private defaultchecked = JSON.parse(sessionStorage.getItem('role')).orgCode //机构树默认选中

    private pickerOptions = {
        disabledDate: (time) => {
            return time.getTime() > Date.now()
        }
    }
    private instructTime: String = new Date().toJSON();//批示时间
    private orgCheckedChildrenMap = {}; //机构组织 树节点 与 关联的children数据map
    // created() {
    //     this.$on('getTableData', (data) => {
    //         debugger
    //         this.tableData = data
    //     });
    // }
    // beforeDestroy() {
    //     this.$off('getTableData');
    // }
    private getTableData(data) {
        // console.log('getTableData(val)----');
        // this.tableData = data
        // this.nodeClick = 1
        this.tableData.tableData_duty = data
        const tree = (this.$refs.informationHandlingTree as any)?.$refs?.tree
        const temp =tree?.getCheckedNodes()
        this.$nextTick(() => {
            data.forEach(item => {
                temp.includes(item)&&(this.$refs.tableRef as any).toggleRowSelection(item)
            });
        })
    }
    private handleRadio(manageType) {
        if (!this.checkBoxContent.length) { return; }
        this.$confirm('切换会清除当前已选名单，确定切换？', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消'
            })
            .then(() => {
                this.cacheManageType = manageType
                this.clearCheck()
            })
            .catch(_ => {
                this.manageType = this.cacheManageType
            });
    }
    // 勾选树组件-值班人员
    treeCheck(data) {
        // alert('测试通过--treeCheck')
        // console.log(data, 'treeCheckChange(val)----');
        const {curNodes, treeFlag } = data
        this.treeFlag = treeFlag
        // this.tableData = data
        this.tableData.tableData_duty = curNodes
    //    if (this.treeFlag) {
    //         this.selectionChange(curNodes || []) // debug 取消时  不触发该方法
    //     }
        // 表格勾选
        this.$nextTick(() => {
            // tree触发取消时 table不勾选
            if(!this.treeFlag) {
                curNodes.forEach(row => {
                    this.toggleRowSelectionFlag = true;
                    (this.$refs.tableRef as any).toggleRowSelection(row)
                    // console.log('tree触发取消时 table不勾选====');
                });
            } else {
                curNodes.forEach(row => {
                    this.toggleRowSelectionFlag = true;
                    (this.$refs.tableRef as any).toggleRowSelection(row)
                    setTimeout(() => {
                        (this.$refs.tableRef as any).toggleRowSelection(row, false)
                    })
                    // console.log('tree触发取消时 table不勾选====');
                });
            }
            // else {
            //     curNodes.forEach(row => {
            //         this.toggleRowSelectionFlag = true;
            //         (this.$refs.tableRef as any).toggleRowSelection(row, false)
            //         console.log('tree触发取消时 table不勾选====');
            //     });
            // }
        })
    }
    test(val) {
        // alert('测试通过')
        this.treeCheck(val)
    }
    // treeChecktreeCheck() {
    //     alert('测试通过--treeChecktreeCheck')
    // }
    // 表格触发选中
    private selectionChange(val) {
        console.log(val, 'selectionChange---val--start');
        // console.log(this.tabChangeOrClickNodeFlag, 'tabChangeOrClickNodeFlag-----start');
        // console.log(this.toggleRowSelectionFlag, 'toggleRowSelectionFlag-----start');

        // debugger
        // if(this.nodeClick === 1) {
        //     this.nodeClick = 0
        //     return
        // }
        // 值班人员 this.curIndex === 0
        if(!this.tabChangeOrClickNodeFlag) {
            if (this.curIndex === 0) {
                const tree = (this.$refs.informationHandlingTree as any).$refs.tree
                const temp =tree.getCheckedNodes()
                    if (val.length) {
                        // if (this.treeFlag) { this.treeFlag = 0; return; }
                        // 检测treechecked没有checked的item，并checked
                        const waitTreeChecked = val.filter(item => !temp.includes(item))
                        if (waitTreeChecked.length) {
                                waitTreeChecked.forEach(checkedRow => {
                                    tree.setChecked(checkedRow.id, true)
                            });
                        }
                        // 检测treechecked无需checked的item，并unchecked
                        const curTableNotChecked = this.tableData.tableData_duty.filter(ele => !val.includes(ele))
                        temp.forEach(element => {
                            curTableNotChecked.includes(element)&&tree.setChecked(element.id, false)
                        });
                        // console.log(this.cacheTreeOrgChecked, 'this.cacheTreeOrgChecked--1-val-has');
                    } else {
                        this.tableData.tableData_duty.forEach(cur => {
                            temp.includes(cur)&&tree.setChecked(cur.id, false)
                        });
                        // console.log(this.cacheTreeOrgChecked, 'this.cacheTreeOrgChecked--1-val-none');
                    }

                // 已选人员列表 tags 回显
                this.$nextTick(() => {
                    // if (!this.checkBoxContent.length) {
                    //     this.checkBoxContent = val
                    //     debugger
                    // } else {
                        // console.log(tree.getCheckedNodes(), 'tree.getCheckedNodes()-----');
                        // debugger

                        const res = this.backTreeData(tree.getCheckedNodes())
                        // debugger
                        // const res2 = (this.$refs.informationHandlingSearchTree as any).$refs.tree.getCheckedNodes()
                        const allChecked = res.concat(this.cacheTreeOrgChecked)
                        // allChecked.forEach(checkedRow => {
                        //     if (!this.checkBoxContent.includes(checkedRow)) {
                        //         this.checkBoxContent.push(checkedRow)
                        //     }
                        // });
                        this.checkBoxContent = allChecked
                        // console.log(this.cacheTreeOrgChecked, allChecked, 'cacheTreeOrgChecked---allChecked---tab1------');
                    // }
                })
            }
        }
        // 组织机构 特殊处理 this.curIndex === 1
        if(!this.toggleRowSelectionFlag&&!this.tabChangeOrClickNodeFlag) {
            // if (!this.tabChangeOrClickNodeFlag) {
                if (this.curIndex === 1) {
                    this.handleSelectTable(val)
                }
        //    } else {
            //    this.tabChangeOrClickNodeFlag = false;
            //    }
        } else {
            this.toggleRowSelectionFlag = false;
            this.tabChangeOrClickNodeFlag = false;
        }
    }
    // 值班人员 过滤非叶子节点
    private backTreeData(treeData) {
       return treeData.filter(ele =>!ele.hasOwnProperty('children'))
    }
      /**
 * 手动操作表格勾选列表触发事件 -- 组织机构下
 * @param data
 */
    private handleSelectTable(data) {
    console.log('handleSelectTable(data)----');
    // if (!this.checkBoxContent.find(ele => { return ele.personId === data.personId })) {
    // //   this.checkBoxContent.push(data)
    // this.checkBoxContent = data
    //   if (data.personName.includes(this.namekeyWord) && this.namekeyWord) {
    //     this.activePersonNameList.push(data.personId)
    //   }
    // } else {
    //   this.checkBoxContent = this.checkBoxContent.filter(ele => { return ele.personId !== data.personId })
    // }
    // if (this.curIndex === 1) {
        // this.cacheTreeOrgChecked = data
        // console.log(data, 'data---');
        // console.log(this.cacheTreeOrgChecked, 'this.cacheTreeOrgChecked---start');
        const orgTree = (this.$refs.informationHandlingSearchTree as any).$refs.tree
        // console.log(orgTree.getCheckedNodes(), 'orgTree.getCheckedNodes-----');
        if (data.length) {
            data.forEach(ele => {
                // 检查有未check的
               if (!this.cacheTreeOrgChecked.some(item => item.personId === ele.personId)) { this.cacheTreeOrgChecked.push(ele) }
                // 组织机构取消时
               const curTableNotChecked = this.tableData.tableData_org.filter(ele => !data.includes(ele))
               curTableNotChecked.forEach(notCheckedItem => {
                const notCheckedIdx = this.cacheTreeOrgChecked.findIndex(cur => cur.personId === notCheckedItem.personId)
                   if (notCheckedIdx !== -1) {
                    this.cacheTreeOrgChecked.splice(notCheckedIdx, 1)
                    // orgTree.setChecked(notCheckedItem.personId, false)
                   }
               })
            });
            // 表格只要勾选 树即勾线 暂时这样处理 表示 该node下有勾选数据
            // if (data.length === this.tableData.tableData_org.length) {
                orgTree.setChecked(this.searchData.orgCode, true);
            // }
        } else {
            this.tableData.tableData_org.forEach(notCheckedItem => {
             const notCheckedIdx = this.cacheTreeOrgChecked.findIndex(cur => cur.personId === notCheckedItem.personId)
                if (notCheckedIdx !== -1) {
                 this.cacheTreeOrgChecked.splice(notCheckedIdx, 1)
                }
            })
            // 取消机构组织树勾选 this.searchData.orgCode即对应树node-key
            orgTree.setChecked(this.searchData.orgCode, false);
        }

        // console.log(this.cacheTreeOrgChecked, 'this.cacheTreeOrgChecked---end');
    // }
    // 已选人员列表 tags 回显
    const tree = (this.$refs.informationHandlingTree as any).$refs.tree;
    const res = this.backTreeData(tree.getCheckedNodes());
    // const res2 = (this.$refs.informationHandlingSearchTree as any).$refs.tree.getCheckedNodes();

    this.checkBoxContent = res.concat(this.cacheTreeOrgChecked);


    // 要检查左侧的树 有没有被全选
    // let newArr = _.intersection(this.activeAllList.map(item => { return item.personId }), this.checkBoxContent.map(item => { return item.personId })) // 对比两个数组
    // // if (this.sendType === '1') {
    //   let CheckedKeys = this.$refs.informationHandlingSearchTree['$refs'].tree.getCheckedKeys()
    //   if (newArr.length === this.activeAllList.length) { // 长度相等 表示机构所有人员被选中
    //     CheckedKeys.push(this.searchData.orgCode)
    //   } else {
    //     CheckedKeys = _.pull(CheckedKeys, this.searchData.orgCode)
    //   }
    //   this.$refs.informationHandlingSearchTree['$refs'].tree.setCheckedKeys(CheckedKeys);
    // }
    //  else {
    //   let CheckedKeys = (this.$refs.treeBox as any).getCheckedKeys()
    //   if (newArr.length === this.activeAllList.length) { // 长度相等 表示机构所有人员被选中
    //     CheckedKeys.push(this.treeSearchData.groupId)
    //   } else {
    //     CheckedKeys = _.pull(CheckedKeys, this.treeSearchData.groupId)
    //   }
    //   (this.$refs.treeBox as any).setCheckedKeys(CheckedKeys);
    // }
  }
//    private backAllItems(data) {
//     // data.map(ele =>{
//     //     ele.children
//     // })
//     // data.reduce((acc, cur) => {

//     // })
//     data.map(ele => {
//         if (ele.hasOwnProperty('children')) {
//             return this.backAllItems(ele.children)
//         } else {
//             return [ele]
//         }
//     })
//    }

    mounted() {

        this.role = JSON.parse(sessionStorage.getItem('role'));
        this.sjUser = this.role['tenantId'] == 'GJ.JSS';
        this.getProposeOption();
        this.getCheckOption();
        this.getLeaderOption();
        this.headCols = this.headCols_duty;
    }
   private handleTabs(index) {
        // this.tableData = []
        if (this.curIndex === index) { return; }
        this.curIndex = index;
        this.checkBoxContent.length&&(this.tabChangeOrClickNodeFlag = true)
        if (index === 0) {
            this.headCols = this.headCols_duty;
            // 回显
            this.$nextTick(() => {
                const tree = (this.$refs.informationHandlingTree as any).$refs.tree
                const temp =tree.getCheckedNodes()
                this.tableData.tableData_duty.forEach(item => {
                    this.toggleRowSelectionFlag = true;
                    temp.some(cur => cur.personId === item.personId)&&(this.$refs.tableRef as any).toggleRowSelection(item);
                });
                this.asyncHandleFlag()
            })
        } else {
            // 组织机构table回显check
            this.headCols = this.headCols_org;
            // 回显
            this.$nextTick(() => {
                // const tree = (this.$refs.informationHandlingTree as any).$refs.tree
                // const temp =tree.getCheckedNodes()
                this.tableData.tableData_org.forEach(item => {
                    this.toggleRowSelectionFlag = true;
                    this.cacheTreeOrgChecked.some(cur => cur.personId === item.personId)&&(this.$refs.tableRef as any).toggleRowSelection(item)
                });
                this.asyncHandleFlag()
            })
        }
        (this.$refs.tableRef as any).doLayout();
    }
   private asyncHandleFlag() {
        setImmediate(() => {
            this.toggleRowSelectionFlag = false;
            this.tabChangeOrClickNodeFlag = false;
        })
    }
    submitAReport() {
        // this.$router.push({
        //     path: '/information/submitReport',
        //     query: { id: this.infoid, page: 'presenationReport' }
        // });
        this.$router.push({
            path: '/information/detailsEdit',
            query: { id: this.infoid, routeType: 'presenationReport', type: this.$route.query.type, handletype: this.handletype, detailUrlinfoId: this.detailUrlinfoId},
        });
    }

    // 选择或者取消选择 1信息拟办 2信息审核 3领导批示
    chosePersonnel(type,item) {
        // console.log('chosePersonnel(data)----');
        // let arr = type === 1 ? this.proposeList : type === 2 ? this.checkList : this.leaderList;

        // const index = arr.findIndex(ele => { return ele.userId === item.userId });
        // if (index !== -1) { // 取消
        //     switch (type) {
        //         case 1:
        //             this.proposeList = arr.filter(ele => { return ele.userId !== item.userId });
        //             break;
        //         case 2:
        //             this.checkList = arr.filter(ele => { return ele.userId !== item.userId });
        //             break;
        //         case 3:
        //             this.leaderList = arr.filter(ele => { return ele.userId !== item.userId });
        //             break;
        //     }
        // }else {
        //     if (type === 3) { // 领导批示是
        //         this.leaderList = [];
        //         this.leaderList.push(item)
        //     }else{
        //         arr.push(item)
        //     }
        // }
    }
    // getChecked(nodes) {
    //         console.log(nodes, 'getChecked()---查看全选取消-1');
    //         if (nodes.status) {
    //         this.searchData.orgCode = nodes.id
    //         this.searchData.keyWord = ""
    //         this.getAllListData(true)
    //         } else {
    //             (this.$refs.tableRef as any).clearSelection()
    //         }
    // }

      // 组织机构 手动触发tree全选事件
  checkTree(data) {
    // console.log(data, 'getChecked()---查看全选取消-2');
    this.searchData.orgCode = data.id
    if (data.status) { //  全选
      this.searchData.keyWord = ""
    //   this.searchData.nowPage = 1
    //   this.propData.total = 1
      this.getAllListData(true, {checkedFlag: 1, data})
    } else {
        // this.orgCheckedChildrenMap[data.id].forEach(row => {
        //     this.toggleRowSelectionFlag = true;
        //     (this.$refs.tableRef as any).toggleRowSelection(row)
        //     setTimeout(() => {
        //         (this.$refs.tableRef as any).toggleRowSelection(row, false)
        //     })
        //     console.log('tree触发取消时 table不勾选====');
        // });
        this.getAllListData(false, {checkedFlag: 0, data})
    }
    //  else { // 取消全选
    //     // (this.$refs.tableRef as any).clearSelection()
    // }
  }
    /* author by chengyun 清除全部选中
   *  Modify by
   */
    clearCheck() {
        console.log('clearCheck()----');
        this.checkBoxContent = [];
        this.cacheTreeOrgChecked = []; // 清除组织机构选中数据
        // const table = this.curIndex === 0 ? this.tableData.tableData_duty : this.tableData.tableData_org;
        // 表格取消选择
        [this.tableData.tableData_duty, this.tableData.tableData_org].forEach((table, index) => {
            table.forEach((cur, idx) => {
                index === 1 && (this.toggleRowSelectionFlag = true);
                (this.$refs.tableRef as any).toggleRowSelection(cur, false)
            });
        });
        // if (this.curIndex === 0) {
        //     const table = this.curIndex === 0 ? this.tableData.tableData_duty : this.tableData.tableData_org;
        //     table.forEach((cur, idx) => {
        //         this.curIndex === 1 && (this.toggleRowSelectionFlag = true);
        //         (this.$refs.tableRef as any).toggleRowSelection(cur, false)
        //     });
        // }
        // (this.$refs.tableRef as any).clearSelection()
        // 去除树选中
        this.$nextTick(() => {
            (this.$refs.informationHandlingTree as any).$refs.tree.setCheckedKeys([])
            // 组织机构树 节点取消选中
            const nodeKeys =  Object.keys(this.orgCheckedChildrenMap)
            if (nodeKeys.length) {
                const orgTree = (this.$refs.informationHandlingSearchTree as any).$refs.tree
                nodeKeys.forEach(id => {
                    orgTree.setChecked(id, false);
                })
            }
        })
        // (this.$refs.treeBox as any).setCheckedKeys(this.checkBoxContent);
        // this.propData.data.forEach(item => {
        //   this.toggleRowSelectionFlag = true;
        //   this.$refs.listTable['$refs'].table.toggleRowSelection(item, false)
        // })
        // this.activePersonNameList = []
    }
      /**
   * 点击当前删除选择人员
   * @param index 当前索引
   * @param items 当前项
   */
    choosed(index, items) {
    console.log('choosed()----');
    this.checkBoxContent.splice(index, 1);
    // if (this.curIndex === 0) {

    // }
    const tree = (this.$refs.informationHandlingTree as any).$refs.tree
    // const res = tree.getCheckedNodes()
    // const res2 = (this.$refs.informationHandlingSearchTree as any).$refs.tree.getCheckedNodes()
    this.$nextTick(() => {
        // this.tableData.tableData_duty.findIndex(cur => cur === items.id) !== -1 && (this.$refs.tableRef as any).toggleRowSelection(items)
        // 取消当前表格选中
        const table = this.curIndex === 0 ? this.tableData.tableData_duty : this.tableData.tableData_org;
        table.forEach((cur, idx) => {
            if (cur.personId === items.personId) {  (this.$refs.tableRef as any).toggleRowSelection(cur, false) }
        });

        //位于值班人员状态下删除存在于组织结构选中的数据
        if (this.curIndex === 0) {
            this.deleteOrgCacheSelect(items)
        }
        // if (this.curIndex === 0) {
        // }
        // this.tableData.tableData_org.forEach((cur, idx) => {
        //     if (cur.personId === items.personId) {  (this.$refs.tableRef as any).toggleRowSelection(cur, false) }
        // });
        // if (this.curIndex === 1) {
        // }
        // 取消值班员tree选中
        tree.setChecked(items.id, false)
        // data.forEach(row => {
            // (this.$refs.tableRef as any).toggleRowSelection(row)
        // });
    })

// this.propData.data.forEach(item => {
    //   if (item.personId === items.personId) {
    //     this.$refs.listTable['$refs'].table.toggleRowSelection(item, false)
    //   }
    // })
    // this.activePersonNameList = this.activePersonNameList.filter(item => { return item.personId !== items.personId })
    // // 要检查左侧的树 有没有被全选
    // let newArr = _.intersection(this.activeAllList.map(item => { return item.personId }), this.checkBoxContent.map(item => { return item.personId })) // 对比两个数组
    // if (this.sendType === '1') {
    //   let CheckedKeys = this.$refs.informationHandlingSearchTree['$refs'].tree.getCheckedKeys()
    //   if (newArr.length === this.activeAllList.length) { // 长度相等 表示机构所有人员被选中
    //     CheckedKeys.push(this.searchData.orgCode)
    //   } else {
    //     CheckedKeys = _.pull(CheckedKeys, this.searchData.orgCode)
    //   }
    //   this.$refs.informationHandlingSearchTree['$refs'].tree.setCheckedKeys(CheckedKeys);
    // } else {
    //   let CheckedKeys = (this.$refs.treeBox as any).getCheckedKeys()
    //   if (newArr.length === this.activeAllList.length) { // 长度相等 表示机构所有人员被选中
    //     CheckedKeys.push(this.treeSearchData.groupId)
    //   } else {
    //     CheckedKeys = _.pull(CheckedKeys, this.treeSearchData.groupId)
    //   }
    //   (this.$refs.treeBox as any).setCheckedKeys(CheckedKeys);
    // }
    }
    private deleteOrgCacheSelect(items) {
        const orgNotSelectIdx = this.cacheTreeOrgChecked.findIndex(ele => ele.personId === items.personId)
        if (orgNotSelectIdx !== -1) {
            this.cacheTreeOrgChecked.splice(orgNotSelectIdx, 1)
        }
        // if(!this.cacheTreeOrgChecked.length) {
        const nodeKeys =  Object.keys(this.orgCheckedChildrenMap)
        if (nodeKeys.length) {
            const orgTree = (this.$refs.informationHandlingSearchTree as any).$refs.tree
            const cacheTreeOrgCheckedPersonId = this.cacheTreeOrgChecked.map(ele => ele.personId)
            nodeKeys.forEach(id => {
                if (!this.orgCheckedChildrenMap[id].some(item => cacheTreeOrgCheckedPersonId.includes(item.personId) )) {
                    orgTree.setChecked(id, false);
                }
            })
        }
}

    // 根据机构获取所有的人员
  /**
   *
   * @param type true 选中 false 不选中
   */
   getAllListData(type, orgCheckedObj={checkedFlag: null, data: {id: '', data: []}}) {
    console.log('getAllListData()----');
    let searchData = {
      keyWord: "",
      nowPage: 1,
      pageSize: 100000,
      orgCode: this.searchData.orgCode
    }
    this.searchData.keyWord = ''

    if (!this.searchData.orgCode)  {
        console.warn('orgCode没有机构id!');
        return
    }
    this.http.DetailOperationsRequest.orgCodeByUserList(searchData).then((res) => {

      if (res.status == 200) {
        // if (type) {
        //   res.data.list.forEach(ele => {
        //     if (!this.checkBoxContent.find(item => { return item.personId === ele.personId })) {
        //       this.checkBoxContent.push(ele)
        //       if (ele.personName.includes(this.namekeyWord) && this.namekeyWord) {
        //         this.activePersonNameList.push(ele.personId)
        //       }
        //     }
        //   });
        // }
        // this.activeAllList = res.data.list
        this.tableData.tableData_org = res.data.list
        // console.log(this.cacheTreeOrgChecked, 'cacheTreeOrgChecked--------------');
        // 缓存 机构组织节点与children数据map
        const { checkedFlag, data: { id } } = orgCheckedObj
        if (checkedFlag) {
            this.orgCheckedChildrenMap[id] = res.data.list
        }
        // console.log(this.orgCheckedChildrenMap, 'this.orgCheckedChildrenMap-----map');

        // this.cacheTreeOrgChecked.
        // 表格勾选
        this.$nextTick(() => {
                    if (type) {
                        // tree触发取消时 table不勾选
                        // if(!this.treeFlag) {
                            // res.data.list.forEach(row => {
                                // });
                        res.data.list.forEach(row => {
                            // this.toggleRowSelectionFlag = true;
                            (this.$refs.tableRef as any).toggleRowSelection(row) // 机构树勾选
                        });
                        // }
                    } else {
                        // 机构组织 取消全选
                        if (checkedFlag === 0) {
                            this.tableData.tableData_org.forEach(ele => {
                                if(this.cacheTreeOrgChecked.some(cur => cur.personId === ele.personId)) {
                                    // this.toggleRowSelectionFlag = true;
                                    (this.$refs.tableRef as any).toggleRowSelection(ele, false)
                                }
                            })
                        } else {
                            // 组织机构tree 点击node检测回显
                            this.tableData.tableData_org.forEach(ele => {
                                if(this.cacheTreeOrgChecked.some(cur => cur.personId === ele.personId)) {
                                    this.toggleRowSelectionFlag = true;
                                    (this.$refs.tableRef as any).toggleRowSelection(ele)
                                }
                            })
                        }
                    }
                })
            } else {
                this.$message.error(res.msg)
            }
            //   this.changeFirstPage()
    })
  }
  /**
   * 机构组织树 click机构树node
  */
   getOrg(val) {
    this.searchData.orgCode = val.prop.id
    this.orgDefaultcheckeds = val.prop.id
    this.searchData.keyWord = '';
    this.checkBoxContent.length&&(this.tabChangeOrClickNodeFlag = true) // 组织机构点击Node，避免触发select-change
    // this.changeFirstPage()
    this.getAllListData(false)
  }

    // 信息拟办人员名单
    getProposeOption () {
        // console.log('getProposeOption()----');
        this.http.DetailOperationsRequest.getUserGroup({
            groupCode: "10001"
        }).then(res => {
            res.data.forEach(ele => {
            if (!this.proposeOption.find(item=>{return item.userId === ele.userId})) {
                this.proposeOption.push(ele)
                }
            });
        });
    }
    // 信息审核人员名单
    getCheckOption() {
        // console.log('getCheckOption()----');
        this.http.DetailOperationsRequest.getUserGroup({
            groupCode: "10002"
        }).then(res => {
            res.data.forEach(ele => {
                if (!this.checkOption.find(item => { return item.userId === ele.userId })) {
                    this.checkOption.push(ele)
                }
            });
        });
    }
    // 领导批示人员名单
    getLeaderOption() {
        this.http.DetailOperationsRequest.getUserGroup({
            groupCode: "10003"
        }).then(res => {
            res.data.forEach(ele => {
                if (!this.leaderOption.find(item => { return item.userId === ele.userId })) {
                    this.leaderOption.push(ele)
                }
            });
        });
    }
    // 提交
    saveFun() {
        if(this.manageType === '4') {
            this.submitAReport()
            return
        }
        // let arr = this.manageType === '1' ? this.proposeList : this.manageType === '2' ? this.checkList : this.leaderList;
        if(!this.checkBoxContent.length) {
            this.$message.error('发送人员不能为空！');
            return false
        }
        if (!this.approvalContent) {
            const str = this.manageType === '1' ? '拟办意见' : this.manageType === '2' ? '信息审核内容' : '批示意见';
            this.$message.error(`${str}不能为空!`);
            return;
        }
        let leaderArr = []
        this.checkBoxContent.map(it => {
            leaderArr.push(
                {
                    "reportId": it.personId,
                    "reportName": it.personName,
                    "reportType": "2"
                }
            )
        })
        let insObj = {
            infoId: this.infoid,
            approvalOrgInfos: leaderArr,
            approvalContent: this.approvalContent
        };
        if (this.manageType === '1') {
            this.http.DetailOperationsRequest.opinion(insObj).then(res => {
                if (res.status !== 200) {
                    this.$message.error(res.msg);
                    return;
                }
                if (res.status === 200) {
                    this.$message.success('操作成功!');
                    this.cancel()
                    return;
                }
            });
        } else if (this.manageType === '2'){
            this.http.DetailOperationsRequest.audit(insObj).then(res => {
                if (res.status !== 200) {
                    this.$message.error(res.msg);
                    return;
                }
                if (res.status   === 200) {
                    this.$message.success('操作成功!');
                    this.cancel()
                    return;
                }
            });
        } else if (this.manageType === '3') {
            if (!this.instructTime) {
                this.$message.warning('批阅时间不能为空！');
                return;
            }
            this.leaderSave()
        }else{

        }

    }
    //领导批示 instruct({
    leaderSave() {
        let insObj = {
            infoId: this.infoid,
            instructTime: timeFormat(this.instructTime, true),
            leaderId: this.manageType,
            leaderName: this.checkBoxContent[0].personName,
            instructInfo: this.approvalContent,
        };
        //领导批示保存按钮点击事件
        this.http.DetailOperationsRequest.instruct(insObj).then(res => {
            if (res.status === 200) {
                this.$message.success('操作成功')
                this.cancel()
                return;
            }else{
                this.$message.error(res.msg);
            }
        });
    }

    cancel() {
        this.$emit('cancelpop')
    }
}
