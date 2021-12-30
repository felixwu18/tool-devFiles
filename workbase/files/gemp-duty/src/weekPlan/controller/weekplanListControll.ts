import { ControllerBase, Inject, Watch, Prop } from 'prism-web'

export class WeekplanListControll extends ControllerBase {
    private temp = {
        style: require('../style/weekplanList.less')
    }

    constructor() {
        super()
    }
    @Inject("http") http: any
    private search_time = []
    @Watch('search_time')
    watchTime(val) {
        if (this.search_time == null) {
            let start = new Date()
            let end = new Date()
            let CURRENT_DAY = start.getDay() == 0 ? 7 : start.getDay()
            start.setTime(start.getTime() - 24 * 60 * 60 * 1000 * (CURRENT_DAY - 1))
            end.setTime(end.getTime() + 24 * 60 * 60 * 1000 * (7 - CURRENT_DAY))
            this.searchData['startTime'] = start
            this.searchData['endTime'] = end
        } else {
            this.searchData['startTime'] = val[0]
            this.searchData['endTime'] = val[1]
        }

    }
    private searchlist = { searchkey: "" }
    private defaultchecked = ""
    //编辑记录弹框控制
    private editRecordVisible: boolean = false
    // 编辑记录数据列表
    private editRecord: Array<any> = []
    // 新增备注弹框控制
    private addRemarkVisible: boolean = false
    // 领导列表
    private leaderList: Array<any> = []
    // 备注信息
    private remarkNote: string = ""
    // 当前机构默认领导
    private defaultLeaderId:string = ''
    // 条件搜索周工作安排
    private searchData: object = {
        endTime: "",
        keyWord: "",
        nowPage: 1,
        userId: "",
        pageSize: 10,
        startTime: ""
    }

    // 工作安排更新数据
    private updateData: object = {
        gooutFlag: "",
        id: "",
        note: "",
        userId: ""
    }
    // 保存修改周工作安排
    private weekArrange: object = {
        arrangeWork: "",
        isRemind: "",
        period: "",
        reminderTime: "",
        weekArrangeWorkId: ""
    }
    // 默认展开周工作安排
    private defaultCollapse = 'morning'
    treecallback() {

    }
    // 当前选中排班数据
    private currentWorkPlanList: object = {}
    private tableData = []

    private egressop = [{ label: '不外出', value: "0" }, { label: '驻地', value: "1" }, { label: '国外', value: "2" }, { label: '省内', value: "3" }, { label: '省外', value: "4" }]

    private dialogVisible = false

    private radio = '0'

    private value3 = ''

    private textarea = ''
    private checkList = []
    private timepart = [{
        label: "上午", value: "1"
    }, {
        label: "下午", value: "2"
    }, {
        label: "晚上", value: "3"
    }, {
        label: "全天", value: "4"
    }]

    private pickerOptions = { // 时间框选择配置
        shortcuts: [{
            text: '本周',
            onClick(picker) {
                let start = new Date()
                let end = new Date()
                let CURRENT_DAY = start.getDay() == 0 ? 7 : start.getDay()
                start.setTime(start.getTime() - 24 * 60 * 60 * 1000 * (CURRENT_DAY - 1))
                end.setTime(end.getTime() + 24 * 60 * 60 * 1000 * (7 - CURRENT_DAY))
                picker.$emit('pick', [start, end])
            }
        }, {
            text: '上周',
            onClick(picker) {
                let start = new Date()
                let end = new Date()
                let CURRENT_DAY = start.getDay() == 0 ? 7 : start.getDay()
                start.setTime(start.getTime() - 24 * 60 * 60 * 1000 * (6 + CURRENT_DAY))
                end.setTime(end.getTime() - 24 * 60 * 60 * 1000 * CURRENT_DAY)
                picker.$emit('pick', [start, end]);
            }
        }, {
            text: '下周',
            onClick(picker) {
                let start = new Date()
                let end = new Date()
                let CURRENT_DAY = start.getDay() == 0 ? 7 : start.getDay()
                start.setTime(start.getTime() + 24 * 60 * 60 * 1000 * (8 - CURRENT_DAY))
                end.setTime(end.getTime() + 24 * 60 * 60 * 1000 * (14 - CURRENT_DAY))
                picker.$emit('pick', [start, end]);
            }
        }]
    }

    private noData = false //没有数据时显示

    private rules = {
        note: [{ required: true, message: "请输入备注", trigger: 'blur' }],
    }
    created() {
        let start = new Date()
        let end = new Date()
        let CURRENT_DAY = start.getDay() == 0 ? 7 : start.getDay()
        start.setTime(start.getTime() - 24 * 60 * 60 * 1000 * (CURRENT_DAY - 1))
        end.setTime(end.getTime() + 24 * 60 * 60 * 1000 * (7 - CURRENT_DAY))
        this.searchData['startTime'] = start
        this.searchData['endTime'] = end
        let orgId = JSON.parse(sessionStorage.getItem("role"))['orgCode']
        this.searchLeaderList(orgId)
    }

    // by 刘文磊 时间按钮
    thisWeek() {

    }

    // by 刘文磊 机构选择
    getOrg(data) {
        console.log(data)
        let orgId = data.prop.id
        this.searchLeaderList(orgId)
    }

    /**
     * Author by chenzheyu
     * 查询机构相关领导
     * @param id
     * @param func
     */
    searchLeaderList(id: string) {
        this.http.WeekPlanRequest.searchLeader({ orgCode: id }).then(res => {
            this.$set(this, 'leaderList', res.data)
            if (res.data.length > 0) {
                this.defaultLeaderId = res.data[0].userId
                this.$set(this.searchData, 'userId', res.data[0].userId)
                this.search()
            } else {
                this.$set(this.searchData, 'userId', ' ')
                this.search()
                this.$message({
                    type: "error",
                    message: "当前机构未配置领导"
                })
            }
        })
    }

    //by weiqiming 弹框关闭
    handleClose(done) {
        if (this.weekArrange['arrangeWork'] == '' && this.weekArrange['period'] == '') {
            this.search()
            done()
        } else {
            this.$confirm('确认关闭？','提示')
                .then(_ => {
                    this.weekArrange['arrangeWork'] = '';
                    this.weekArrange['period'] = '';
                    this.search()
                    done()
                })
                .catch(_ => { })
        }

    }

    /**
     * Author by weiqiming 添加工作安排
     * Modify by chenzheyu
     * @param data
     */
    dialogVisibleOpen(data, list) {
        this.$set(this.weekArrange, 'weekArrangeWorkId', data)
        this.$set(this, 'currentWorkPlanList', list)
        this.dialogVisible = true
    }

    /**
     * 查询周工作安排
     * Author by chenzheyu
     */
    search(data?) {
        let searhData = data && !data.target ? data : this.searchData
        let intervalTime = searhData.endTime.getTime() - searhData.startTime.getTime()
        if (intervalTime / (24 * 60 * 60 * 1000) > 7) {
            this.$message({
                type: 'error',
                message: '只能选择一个自然周'
            })
            return false
        }
        this.http.WeekPlanRequest.searchWorkList(searhData).then(res => {
            if (res.status != 200) {
                this.$message({
                    type: "error",
                    message: "请求数据失败"
                })
            } else {
                if (res.data.list.length !== 0) {
                    this.$set(this, 'tableData', res.data.list)
                    this.noData = false
                } else {
                    this.$set(this, 'tableData', res.data.list)
                    this.noData = true
                }
            }
        })


    }

    /**
     * Author by chenzheyu
     * 重置
     */
    resetWork() {
        let resetObj = {
            arrangeWork: this.weekContent==""?"":this.weekContent,
            id: "",
            isRemind: "",
            period: this.weekContentTime==""?"":this.weekContentTime,
            reminderTime: "",
        }
        Object.assign(this.weekArrange, resetObj)
        this.$message({
            type: 'success',
            message: '数据重置成功'
        })
    }

    /**
     * Author by chenzheyu
     * 保存
     */
    saveWork() {
        if (this.weekArrange['arrangeWork'] == '') {
            this.$message({
                type: 'error',
                message: '未填写任何信息'
            })
        } else if (this.weekArrange['period'] == '') {
            this.$message({
                type: 'error',
                message: '请选择时间'
            })
        } else {
            if (this.weekArrange['isRemind']) {

                this.weekArrange['isRemind'] = "1"
            } else {
                this.weekArrange['isRemind'] = "0"
            }
            this.http.WeekPlanRequest.saveWork(this.weekArrange).then(res => {
                if (res.status == 200) {
                    if(this.weekArrange['period'] == "1"){
                        this.defaultCollapse = "morning"
                    }else if(this.weekArrange['period'] == "2"){
                        this.defaultCollapse = "afternoon"
                    }else if(this.weekArrange['period'] == "3"){
                        this.defaultCollapse = "moonnight"
                    }else{
                        this.defaultCollapse = "allday"
                    }
                    this.singlePlanCheck(this.weekArrange['weekArrangeWorkId'])
                    this.weekArrange['arrangeWork'] = '';
                    this.weekArrange['period'] = '';
                    this.weekArrange['id'] = '';
                    this.weekContent = ''
                    this.weekContentTime = ''
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg || '保存失败'
                    })
                }

            })
        }

    }

    /**
     * Author by chenzheyu
     * 删除该条安排记录
     * @param obj
     */
    deleteRecord(obj: object) {
        this.$confirm('是否要删除？', '提示',{ confirmButtonText: '确定', cancelButtonText: '取消', type: "warning" }).then(()=>{
            if (obj['reminderTime']) {
                obj['reminderTime'] = new Date(obj['reminderTime'])
            }
            this.http.WeekPlanRequest.deleteWork(obj).then(res => {
                if (res.status == 200) {
                    this.search()
                    this.singlePlanCheck(this.weekArrange['weekArrangeWorkId'])
                }
            })
        }).catch(() => {
            this.$message('取消删除')
        })
    }

    private weekContent = ""
    private weekContentTime = ""
    /**
     * Author by chenzheyu
     * 编辑该条安排记录
     * @param obj
     */
    editSingleRecord(obj: object) {
        obj['isRemind'] = obj['isRemind'] == '1' ? true : false
        this.$set(this, 'weekArrange', obj)
        this.weekContent = this.weekArrange["arrangeWork"]
        this.weekContentTime = this.weekArrange["period"]
    }

    /**
     * 单调记录查询
     * @param id
     */
    singlePlanCheck(id: string) {
        this.http.WeekPlanRequest.singleCheck(id).then(res => {
            this.$set(this, 'currentWorkPlanList', res.data.contentListMap)
        })
    }

    /**
     * Author by chenzheyu
     * 查看更新记录
     * @param list
     */
    showUpdateRecord(list: Array<any>) {
        this.$set(this, 'editRecord', list)
        this.editRecordVisible = true
    }

    /**
     * Author by chenzheyu
     * 周工作安排更新
     * @param data
     * @param item
     */

    weekPlanSave(data?) {
        if (this.updateData["note"] !== "" && this.updateData["note"] !== null) {
            if (data && !data.target) {
                let arr: Array<string> = Object.getOwnPropertyNames(this.updateData)
                arr.forEach(item => {
                    this.updateData[item] = data[item]
                })
            }
            this.http.WeekPlanRequest.updateWeekRecord(this.updateData).then(res => {
                if (res.status == 200) {
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    })
                    if (this.addRemarkVisible) {
                        this.addRemarkVisible = false
                    }
                    this.search()
                } else {
                    this.$message({
                        type: 'error',
                        message:res.msg || '数据修改失败'
                    })
                }
            })
        } else {
            this.$message({
                type: "warning",
                message: "请输入修改的内容"
            })
        }

    }
    /**
     * Author by zhangmanyu
     * 周工作安排更新
     * @param data
     * @param item
     */
    weekPlanSaveSelect(data?) {
        if (data && !data.target) {
            let arr: Array<string> = Object.getOwnPropertyNames(this.updateData)
            arr.forEach(item => {
                this.updateData[item] = data[item]
            })
        }
        this.http.WeekPlanRequest.updateWeekRecord(this.updateData).then(res => {
            if (res.status == 200) {
                this.$message({
                    type: 'success',
                    message: '修改成功'
                })
                if (this.addRemarkVisible) {
                    this.addRemarkVisible = false
                }
                this.search()
            } else {
                this.$message({
                    type: 'error',
                    message: res.msg || '数据修改失败'
                })
            }
        })
    }

    /**
     * Author by chenzheyu
     * 周工作备注修改
     * @param data
     */
    changeRemark(data) {
        let arr: Array<string> = Object.getOwnPropertyNames(this.updateData)
        arr.forEach(item => {
            this.updateData[item] = data[item]
        })
        this.addRemarkVisible = true
    }

    submitForm() {
        this.$refs.form['validate'](valid => {
            if (!valid) {
                return false
            } else {
                this.weekPlanSave();
            }
        })
    }

    /** 
     * 重置按钮
    */
    
    clearSearch() {
        let start = new Date()
        let end = new Date()
        let CURRENT_DAY = start.getDay() == 0 ? 7 : start.getDay()
        start.setTime(start.getTime() - 24 * 60 * 60 * 1000 * (CURRENT_DAY - 1))
        end.setTime(end.getTime() + 24 * 60 * 60 * 1000 * (7 - CURRENT_DAY))
        this.searchData['startTime'] = start
        this.searchData['endTime'] = end
        this.search_time = [] 
        this.searchData['keyWord'] = ''
        this.searchData['userId'] = this.defaultLeaderId
        this.search()
    }
    
}
