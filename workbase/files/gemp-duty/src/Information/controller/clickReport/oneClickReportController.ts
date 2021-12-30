import { ControllerBase, Inject, Watch, Prop } from 'prism-web';
import { downloadFuncs , timeFormat} from '../../../../assets/libs/commonUtils'
import { dataUrl } from 'service/config/base';

export class OneClickReportController extends ControllerBase {

    constructor() {
        super();
    }
    @Prop() navselectcode: string
    @Watch('navselectcode')
    navselectcodeChange() {
      console.log(67777)

    }
    @Inject('http') http: any;
    private reportFlagType: Boolean = false;
    private roleLevel: Boolean = false;
    private isRolesIncludeDuty: Boolean = false; //值班员角色
    private temp = {
        style: require('../../style/clickReport/oneClickReport.less'),
    };
    
    private value1 = new Date(new Date().setHours(0, 0, 0, 0)).toJSON()
    private value2 = new Date(new Date().setHours(23, 59, 59, 0)).toJSON()

    private pickerOptions = {
        disabledDate:(time)=>{
            return time.getTime() < new Date(new Date().setHours(0, 0, 0, 0)).getTime()
        }
    };

    @Watch('value1')
    timeValue1(val) {
        if(val) {
            this.searchData.reportDateStrStart =  new Date(val).toJSON()
            this.pickerOptions['disabledDate'] = (time) => {
                    return time.getTime() < val.getTime()
            }
        }
    }
    @Watch('value2')
    timeValue2(val) {
        if(val) {
            this.searchData.reportDateStrEnd =  new Date(val.setHours(23, 59, 59, 0)).toJSON()
        }
    }

    /**
     * 一键上报按钮
     */
    addReport() {

    }
    // 列表时间查询参数
    private search_time: Array<any> = [new Date(new Date().setHours(0, 0, 0, 0)).toJSON(),new Date(new Date().setHours(23, 59, 59, 0)).toJSON()];
    // 列表查询参数
    private searchData = {
        "nowPage": 1,
        "pageSize": 10,
        "reportDateStrEnd":  "",          // "2020-05-14T07:15:26.131Z",
        "reportDateStrStart": "",        // "2020-05-14T07:15:26.131Z",
        "tenantCode": ""   //不传，查询当前登录人机构和该机构的下一级机构所有数据
      }
    // 当前角色信息
    private role: object;
    




    created() {
        this.searchData.reportDateStrStart =  this.value1
        this.searchData.reportDateStrEnd =  this.value2
        this.role = JSON.parse(sessionStorage.getItem('role'));
        this.roleLevel = this.role['isYjb'];
        this.isRolesIncludeDuty = this.role['roleRelationDTO'].isRolesIncludeDuty//值班员角色
        this.http.ClickReportRequest.getReportPromiss().then(res => {
            this.reportFlagType = res.data
            // console.log(this.reportFlagType, 999)
        })
        // this.getFlag();
        this.getListData();
    }
    private propData = {
        pageSize: 0,
        total: 0,
        // emptyText: "加载中",
        config: [
            {
                type: 'link',
                label: '标题',
                basehref: '/information/detailsClickReport',
                passProp: 'quickId',
                width: '/',
                badge: true,
                prop: 'quickTitle',
            },
            {
                type: 'string',
                label: '报送单位',
                width: '240',
                prop: 'quickOrgCode',
            },
            {
                type: 'string',
                label: '接报时间',
                width: '240',
                prop: 'quickTime',
            },

            // {
            //     type: 'string',
            //     label: '签收',
            //     width: '/',
            //     prop: 'reportPerson',
            // },
            {
                type: 'button',
                label: '下载',
                width: '500',
                prop: 'operate',
            },
            {
                type: 'string',
                label: '状态',
                width: '150',
                prop: 'quickStatus',
            },
            {
                type: 'button',
                label: '操作',
                width: '260',
                prop: 'isoperate'
            }
        ],
        data: [],
    };
    // 按钮功能数组
    private btnGroup: object = {
        // edit: {
        //     name: '编辑',
        //     emit: 'edit',
        //     type: 'warning',
        //     expression: true,
        // },
        // report: {
        //     name: '一键上报',
        //     emit: 'report',
        //     type: 'primary',
        //     expression: true,
        // },
        handle: { name: '撤回', emit: 'handle', type: 'success', expression: true },
        report: {
            name: '重报',
            emit: 'report',
            type: 'primary',
            expression: true,
        }
    }
    private btnObject: object = {
        // look: {
        //     name: '查看',
        //     emit: 'look',
        //     type: 'primary',
        //     expression: true,
        // },
        attachdownload: [
            // {
            //     name: '下载',
            //     emit: 'attachdownload',
            //     type: 'primary',
            //     expression: true,
            //     index: 0
            // },
            // {
            //     name: '下载',
            //     emit: 'attachdownload',
            //     type: 'primary',
            //     expression: true,
            //     index: 0
            // }
        ]
    }
    /**
     * 编辑
     */
    edit(data){

    }
    /**
     * 一键上报
     */
    // report(data){

    // }
    /**
     * 查看按钮
     */
    look(data){
        // data.rowVal.quickId
        this.$router.push({ path: '/information/detailsClickReport', query: { id: data.rowVal.quickId } })
        // debugger
    }

    /**
     * author by   
     * 下载文件方法
     * @param url
     */
    attachdownload(data) { 
        let attcahIndex = data.buttonItem.index
        let attachId = data.rowVal.attachmentList[attcahIndex].attachId
        let params = { fileId: attachId }
        this.http.GempInfoBaseRequest.Attachmentdownload(params).then(res => {
            downloadFuncs(res)
        })
    }


    /**
     * 查询按钮
     */
    searchList() {
        this.getListData()
    }
    
    /**
     * 获取列表数据
     */
    getListData() {
        // if (this.search_time) {
        //     let arr = [];
        //     this.search_time.forEach(item => {
        //         arr.push(item);
        //     });
        //     this.searchData['reportDateStrStart'] = arr[0];
        //     this.searchData['reportDateStrEnd'] = arr[1];
        // } else {
        //     this.searchData['reportDateStrStart'] = '';
        //     this.searchData['reportDateStrEnd'] = '';
        // }
        // new Date(this.value1)
        // new Date(this.value2)
        // new Date(new Date().setHours(23, 59, 59, 0)).toJSON()
        this.http.ClickReportRequest.quickList(this.searchData).then(res=>{
            if(res.status == 200) {
                let data = {
                    total: 0,
                    pageSize: 10,
                    data: [],
                  };
                data.total = res.data.total;
                data.pageSize = res.data.pageSize;
                let obj
                data.data = res.data.list.map((item, index) => {
                     obj = JSON.parse(JSON.stringify(this.btnObject));
                    if(!item.attachmentList) {
                        obj['attachdownload'] = []
                    }else {
                        item.attachmentList.forEach((it,index)=>{
                            obj['attachdownload'].push(
                                    {
                                        name: it.name,
                                        emit: 'attachdownload',
                                        type: 'primary',
                                        expression: true,
                                        index: index,
                                        dicname:"附件"+(index + 1),
                                        icon:'el-icon-download'
                                    }
                                )
                        })
                    }
                    item.operate = obj;
                    return item;
                  });
                  this.propData.data = res.data.list.map((jtem, index) => {
                    let obj =  JSON.parse(JSON.stringify(this.btnGroup));
                      if(jtem.isBackFlag == true) {
                        obj['handle'].expression = true
                      } else {
                        obj['handle'].expression = false
                      }
                      if(jtem.quickStatus  == '未上报') {
                        obj['report'].expression = true
                      } else {
                        obj['report'].expression = false
                      }
                      jtem.isoperate = obj
                    return jtem
                  })
                data = Object.assign({}, this.propData, data);
                this.$set(this, 'propData', data);
            }
        })
    }
    // 列表按钮点击响应
    tablecallback(data) {
        this[data.type](data);
        console.log(data.type, 888)
    }

    // 翻页功能
    handlePageChange(data) {
        this.searchData['nowPage'] = data.rowVal;
        this.getListData();
    }

    // tab组件展示未读数功能
    tabUnread(obj: object) {
      this.emit('unread', obj);
    }
    // 更新消息提醒的滚动条，弹框，铃铛
    updateMessageRemindData() {
      let data = {
        type:"updateMessageRemind",
      }
      setTimeout(() => {
        parent.postMessage(data,"*")
      }, 2000);
    }

    // 标为已读
    toread() {
        this.$confirm('此操作将把所有未读消息一键标为已读，是否继续?', "提示", {
              confirmButtonText: '确定',
              cancelButtonText: "取消",
              confirmButtonClass: 'confirmButtonClass',
              cancelButtonClass: "confirmButtonClass",
          }).then(() => {this.sureReport()})
          .catch(() => {
            this.$message({
              message: '已取消操作'
            })
          })
    }
    sureReport() {
        this.http.ClickReportRequest.readInfoClean().then(res => {
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '一键已读成功',
              duration: 1000
            })
            this.tabUnread({
                name: '一键上报',
                unreadCount: 0,
            });
            this.getListData();
            this.updateMessageRemindData();
          }
        })
      }
      // 单个撤回
    handle(data) {
        this.$confirm('此操作将把该条信息撤回，是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            confirmButtonClass: 'confirmButtonClass',
            cancelButtonClass: 'confirmButtonClass',
        })
        .then(() => {
        let paramsRecall = { quickId: data.rowVal.quickId }
        this.http.ClickReportRequest.getReBack(paramsRecall).then(res => {
            if (res.status == 200) {
                this.$message({
                    message: res.msg,
                    type: 'success'
                })
                this.getListData();
            } else {
                this.$message({
                    message: res.msg,
                    type: 'error'
                })
            }
        })
        })
        .catch(() => {
            this.$message({
                message: '已取消操作',
            });
       });
    }
    report(data){
        this.$router.push({ path: '/information/addclickReport', query: { id: data.rowVal.quickId } })
    }
}
