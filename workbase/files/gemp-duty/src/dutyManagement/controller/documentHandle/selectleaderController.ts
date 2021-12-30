import { ControllerBase, Inject, Prop } from 'prism-web'
import { LowerHairDocumentAddController } from '@/dutyManagement/controller/documentHandle/lowerHairDocument/lowerHairDocumentAddController';

export class SelectLeaderController extends ControllerBase {
    private temp = {
        style: require('../../style/documentHandle/selectleader.less')
    }
    @Inject('http') http: any
    constructor() {
        super()
    }

    private leaderList = []
    private orgCodes = JSON.parse(window.sessionStorage.getItem('role')).orgCode
    private checkPage: string = '1'
    private allleader = []
    private selectLeader = {}
    //判断是否创建选择领导的li
    private check: boolean = false
    private messageDom: any = null // message实体
    @Prop() propdata;
    private type: string = '';
    created() {
        // console.log(this.propdata.type)
        // this.type = this.propdata.type
        this.onNotify()
    }
    getDomData(val) {

        this.selectLeader = val
        this.check = true
        console.log(val);

    }
    /* author by xinglu 监听选中的值
    *
    */
    onNotify() {
        // this.on("dutySelectLeader", (data) => {
        //     // this.closeDialogCall()
        //     data.forEach(element => {
        //         this.leaderList = element
        //     });
        //     // if (data[0].children) {
        //     //     if (this.messageDom) { this.messageDom.close() }
        //     //     this.messageDom = this.$message({
        //     //         type: 'warning',
        //     //         message: '该节点不能选中'
        //     //     })
        //     //     return false
        //     // }
            
        // })
        this.allleader = []
            this.selectLeader = {}
            this.check = false
            // let orgCodes = this.leaderList['id']
            let orgCodes = this.orgCodes
            this.http.DocumentHandleRequest.getdutyPeopleList(orgCodes).then(res => {
                console.log(res)
                if (res.status == 200) {
                    this.allleader = res.data
                }
            });
    }
    /* author by xinglu 选择领导
    *
    */
    choosePeople() {
        if (!this.selectLeader['name']) {
            this.$message({
                type: 'warning',
                message: '请选择领导'
            })
        } else {
            let personId = this.selectLeader['personId']
            this.http.DocumentHandleRequest.getdutyPeopleDetail(personId).then(res => {
                if (res.status == 200) {
                    let dataInfo = res.data
                    // console.log(dataInfo['type']);
                    this.emit('getSelectLeaderDetail', dataInfo)
                    this.selectLeader = []
                    this.allleader = []
                    this.check=false
                }else {
                    this.$message({
                        type:"warning",
                        message:res.msg
                    })
                }
            });
        }

    }
    /* author by xinglu 选择全部按钮
    *
    */
    selectAll() {
        this.selectLeader = []
        this.check = false
    }
    private defaultchecked = JSON.parse(sessionStorage.getItem("role")).orgCode
    private searchData: Object = {
        deleteFlag: null,
        startTime: '',
        endTime: '',
        keyWord: '',
        listOrder: {
            prop: '',
            sort: ''
        },
        nowPage: 1,
        pageSize: 10
    };
    /* author by xinglu 机构的回调
    *
    */
    getOrg(val) {
        this.orgCodes = val.prop.id
        this.$set(this.searchData, 'orgCode', val);
        this.onNotify()
    }


    /* author by xinglu 条件查询
    *
    */
    getListData() { }

    closeDialog() {
        this.emit('getSelectLeaderDetail')
    }
}