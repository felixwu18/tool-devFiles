import { ControllerBase, Prop, Emit, Filter, Watch, Inject } from 'prism-web'

export class SearchTableController extends ControllerBase {
    constructor() {
        super()
    }

    private temp = {
        style: require("../style/searchTable.less")
    }

    @Prop() searchplaceholder //搜索输入框placeholder
    @Prop() searchtypes //高级搜索列表参数
    @Prop() noexportbtn //导出按钮
    @Prop() notogglebtn //左侧地图显示和隐藏
    @Inject('searchSession') searchSession: any


    private tags: object = {} //显示选中的检索条件
    private isSupperBtnClicked: Boolean = false //关闭搜索框的变量
    private searchKey: String = '' //搜索条件
    private parentIndexs: Array<any> = [] //存放类型选中变量
    private childIndexs: Array<any> = [] //存放筛选条件选中变量
    private childSelectIndex = []
    private parentSelectIndex = []
    // private searchKeyMany: String = '' //暂存搜索条件
    private isLeftMapShow: Boolean = false //切换左侧地图显示和隐藏按钮显示效果
    private setDateRange: String = '' //选中时间参数
    private placeHolder: string //搜索框默认显示的文字

    created() {
        this.placeHolder = this.searchplaceholder || '请输入名称或地址'
        // if(Object.getOwnPropertyNames(this.tags).length > 1) {
        //   let a = JSON.parse(this.searchSession.getter({name:"search"}))
        //   this.initParentTableData(this.searchKey, a)
        // }
    }

    //显示或隐藏左侧地图
    toggleShowMap() {
        this.emitToggleShowMap(this.isLeftMapShow);
    }
    //触发父组件地图显示和隐藏方法
    @Emit('toggleParentShowMap')
    public emitToggleShowMap(isLeftMapShow) {
        this.isLeftMapShow = !this.isLeftMapShow;
    }

    //导出
    exportTable() {
        this.emitExportTable();
    }
    //触发父组件导出方法
    @Emit('exportTable')
    public emitExportTable() {
        console.log('导出数据');
    }
    //搜索框keyup
    searchKeyUp(event, searchKey) {
        event.stopPropagation()
        //关闭搜索框
        this.isSupperBtnClicked = false
        //回车键查询去
        this.initParentTableData(searchKey, this.tags)
    }
    //触发父组件通过关键字查询列表的方法
    @Emit('initTableData')
    public initParentTableData(searchKey, tags) {
        console.log('关键字搜索表格！');
    }

    //点击全部时,查看所有条件列表
    getAllSearchData(index, parentid, datas) {
        if (Object.getOwnPropertyNames(this.tags).length <= 1) {
            Object.getOwnPropertyNames(this.tags)
            this.searchtypes.forEach((item, index) => {
                this.tags[item.id] = []
            })
        }
        if (this.parentSelectIndex.includes(parentid)) {
            datas.forEach((el, i) => {
                this.$set(this.searchtypes[index].data[i], 'isActive', false)
            })
            this.tags[parentid] = []
            this.parentSelectIndex.splice(this.parentSelectIndex.findIndex(item => item == parentid), 1)
        } else {
            datas.forEach((el, i) => {
                this.tags[parentid].push(el.id)
                this.$set(this.searchtypes[index].data[i], 'isActive', true)
            })
            this.parentSelectIndex.push(parentid)
            this.tags[parentid] = this.dedupe(this.tags[parentid])
        }
        this.initParentTableData(this.searchKey, this.tags)
    }
    //高级搜索按钮点击事件,搜索条件显示和隐藏
    showMoreSearch(event) {
        event.stopPropagation()
        this.isSupperBtnClicked = !this.isSupperBtnClicked
    }

    //高级搜索各类型单选点击事件 (暂不删除)
    // changeSerach(event, parentId, parentIndex, childId, childIndex) {
    //   event.stopPropagation && event.stopPropagation()
    //   this.isSupperBtnClicked = true
    //   let childItem = this.searchtypes[parentIndex]
    //   for (var i = 0; i < childItem.data.length; i++) {
    //     childItem.data[i].isActive = false
    //   }
    //   childItem.data[childIndex].isActive = true
    //   this.$set(this.searchtypes, parentIndex, childItem)
    //   let curChildName = childItem.data[childIndex].name
    //   if (this.tags.length == 0) {
    //     this.tags.push({ id: parentId, childId: childId, name: curChildName || this.dateFormat(event[0]) + '至' + this.dateFormat(event[1]) })
    //   } else {
    //     let incInx = this.tags.findIndex((item) => item.id == parentId)
    //     if (incInx > -1) {
    //       let temp = this.tags[incInx]
    //       temp.name = curChildName || this.dateFormat(event[0]) + '至' + this.dateFormat(event[1])
    //       temp.childId = childId
    //       this.$set(this.tags, incInx, temp)
    //     } else {
    //       this.tags.push({ id: parentId, childId: childId, name: curChildName || this.dateFormat(event[0]) + '至' + this.dateFormat(event[1]) })
    //     }
    //   }

    //   this.initParentTableData(this.searchKey, this.tags)
    // }

    //高级搜索各类型点击事件
    /*
    *  A
    *
    *
    */
    changeSerachMany(event, parentId, parentIndex, childId, childIndex) {
        //初始点击tags变量对应
        if (Object.getOwnPropertyNames(this.tags).length <= 1) {
            Object.getOwnPropertyNames(this.tags)
            this.searchtypes.forEach((item, index) => {
                this.tags[item.id] = []
            })
        }
        //单点击条件查询 和双击去除条件查询
        if (this.childSelectIndex.includes(childId)) {
            this.$set(this.searchtypes[parentIndex].data[childIndex], 'isActive', false)
            this.childSelectIndex.splice(this.childSelectIndex.findIndex(item => item == childId), 1)
            this.tags[parentId].splice(this.childSelectIndex.findIndex(item => item == childId), 1)
        } else {
            this.$set(this.searchtypes[parentIndex].data[childIndex], 'isActive', true)
            this.tags[parentId].push(childId)
            this.tags[parentId] = this.dedupe(this.tags[parentId])
            this.childSelectIndex.push(childId)
        }
        this.initParentTableData(this.searchKey, this.tags)
    }
    showSearchWrap(event) {
        event.stopPropagation()
        this.isSupperBtnClicked = true
    }
    //关闭高级搜索的条件
    // handleClose(tag) {
    //     this.tags.splice(this.tags.indexOf(tag), 1);
    //     this.initParentTableData(this.searchKey, this.tags);
    // }

    //日期时间格式化
    dateFormat(date) {
        var year = date.getFullYear();
        var month = date.getMonth();
        month = month < 10 ? '0' + month : month;
        var date = date.getDate();
        date = date < 10 ? '0' + date : date;
        return year + '-' + month + '-' + date;
    }
    //去重
    dedupe(arr) {
        return Array.from(new Set(arr))
    }
}