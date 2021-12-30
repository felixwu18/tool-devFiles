import { ControllerBase, Inject, Prop } from 'prism-web'

export class ChooseDutyController extends ControllerBase {
    private temp = {
        style: require('../../style/documentHandle/chooseDuty.less')
    }
    constructor() {
        super()
    }
    @Inject('http') http: any
    @Prop() propdata
    private search_time: Array<any> = []
    private messageDom: any = null //message实体
    private handleSingleSelect = []
    private searchData = {
        "dutyPeopleName": "",//人员名称
        "endTiime": "",//值班时间止
        "nowPage": 1,//当前页数
        "orgCode": "",//组织编码
        "pageSize": 3,//每页条数
        "startTime": ""//值班时间起
    }
    private propData = {
        isCheck: true,
        isSingleSelect: true,
        pageSize: 10,
        total: 1,
        config: [
            {
                type: 'string',
                label: '值班人员',
                width: '/',
                prop: 'dutyPeopleName',
                // badge: true,
            },
            {
                type: 'string',
                label: '值班开始时间',
                width: '200',
                prop: 'startTime'
            },
            {
                type: 'string',
                label: '值班结束时间',
                width: '200',
                prop: 'endTiime'
            },
            {
                type: 'string',
                label: '工作事项',
                width: '/',
                prop: 'workItem'
            }
        ],
        data: []
    }
    created() {
        this.handleSingleSelect=[]
        this.searchData['orgCode'] = this.propdata
        this.search()
    }
    //排序
    sort(data) {

    }
    // 列表按钮点击响应
    tablecallback(data) {
        // console.log(data)
        this[data.type](data)
    }

    trSelectChange(data){
        // console.log(data)
       
    }
    //获取选中列表
    handleselection(data) {
        // console.log(data);
        // console.log(data.type);
        
        this.handleSingleSelect = data.type
        // console.log(data.type);
        
    }
    handlePageChange(data) {
        this.searchData['nowPage'] = data.rowVal
        this.search()
    }
    //查询列表信息
    search() {
        if (this.searchData['orgCode'] == "") {
            if (window.sessionStorage.getItem("role")) {
                let role = JSON.parse(window.sessionStorage.getItem("role"))
                this.searchData['orgCode'] = role.orgCode
            }
        }
        if (this.search_time) {
            this.searchData['startTime'] = this.search_time[0]
            this.searchData['endTime'] = this.search_time[1]
        } else {
            this.searchData['startTime'] = ''
            this.searchData['endTime'] = ''
        }
        this.http.DutySituationRequest.dutySituationQuery(this.searchData).then(res => {
            if (res.status == 200) {
                this.propData.total = res.data.total;
                this.propData.pageSize = res.data.pageSize
                this.$set(this.propData, 'data', res.data.list);
                // console.log('this.propData', this.propData);
            }
        });
    }
    //导入按钮
    uploadInfo() {
        if (this.handleSingleSelect && this.handleSingleSelect.length > 0) {
            this.emit('handleChooseDuty',this.handleSingleSelect)
        } else {
            if (this.messageDom)
                this.messageDom.close()
            return this.messageDom = this.$message({ type: "warning", message: "请选择信息!" })
        }
    }
}