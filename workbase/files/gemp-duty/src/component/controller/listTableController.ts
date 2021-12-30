import { ControllerBase, Prop, Emit, Inject, Watch } from 'prism-web'

export class ListTableController extends ControllerBase {
    constructor(){
        super()
    }

    @Prop() propdata;
    // 是否需要排序按钮 true为不需要
    @Prop() unsortable:boolean;
    @Prop() classname:Function;
    private dialogvisible:Boolean = false;
    private dialogprop = {};
    private selecteddata = [];
    //单选行
    private currentRow:null
    // 记录每列排序状态
    private orderStatusList = {}

    private temp = {
       style:require("../style/listTable.less")
    }

    mounted(){
        let that=this
        setTimeout(function(){console.log(that.propdata)},2000)
        if(this.$refs.table){
            this.$refs.table['doLayout']()
        }
    }

    handleSelectionChange(val){
        if(this.propdata.isSingleSelect){
            let length = val.length;
            if(length == 0){
                return this.handleSelectionData([]);
            }
            let curRow = val.slice(length - 1, length)[0]
            if(length > 1){
                this.$refs.table['toggleRowSelection'](val[0], false);
            }
            this.$refs.table['toggleRowSelection'](curRow, true);
            this.selecteddata = [curRow];
            this.operatBtnClick('trSelectChange', curRow, null);
        } else {
            this.selecteddata = val;
        }
        return this.handleSelectionData(this.selecteddata)
    }

    @Emit('handleselection')
    handleSelectionData(data) {
        return {type:data}
    }

    //表格排序
    sortBntClick(operatName,item,index) {
        let tempSortType = '';
        if(item.sortType == '') {
            tempSortType = 'desc';
        } else {
            tempSortType = item.sortType == 'desc' ? 'asc' : 'desc';
        }
        let childItem = this.propdata.sortData.data;
        for(var i = 0; i < childItem.length; i++){
            childItem[i].sortType = '';
        }
        item.sortType = tempSortType;
        this.$set(this.propdata.sortData, index, item);
        //执行表格排序方法
        this.operatBtnClick(operatName, item, null);
    }

    //打开表格的详情弹框页
    viewDialogOpen(row) {
        this.dialogvisible = true;
        this.dialogprop = {...row};
    }
    //表格操作按钮点击事件
    operateFun(operatName, curTr, buttonItem) {
        if(buttonItem.viewDialog){
           this.dialogvisible = true;
           this.dialogprop = {...curTr};
           this.$set(this.propdata, 'viewDialog', buttonItem.viewDialog)

           return;
        }
        this.operatBtnClick(operatName, curTr,buttonItem);
    }

    @Emit('tablecallback')
    operatBtnClick(operatName, curTr?, buttonItem?) {
        return {type:operatName,rowVal:curTr,buttonItem: buttonItem};
    }

    //分页
    handlePageChange(val) {
        this.operatBtnClick('handlePageChange', val, this.propdata);
    }

    // 表单自定义表头排序
    tableSortChange(column){
        if(!column.order) {
            this.$message({
                type:'warning',
                message:'已按当前条件排序'
            })
            return false
        }
        let data = {sort:column.order,prop:column.prop}
        this.operatBtnClick('sort',data,null)
    }

    //关闭弹框
    closeCurDialogCall(dialogprop) {
        this.dialogvisible = false;
        this.operatBtnClick('closeDialogCall', null, null);
    }

    //列点击事件（场景：当前行信息已删除，点击title列，则弹出提示信息）
    colClick(emit, row) {
        this.operatBtnClick(emit, row, null);
    }
}