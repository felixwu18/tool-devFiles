import { ControllerBase, Inject } from 'prism-web';
//已发传真---huihui
export class FaxedListController extends ControllerBase {
  private temp = {
    style: require('../../style/faxManage/faxedList.less')
  };
  constructor() {
    super();
  }
  private checkPage: string = '1';
  private search_time: Array<any> = [];
  @Inject('http') http: any;
  // 当前角色级别
  private roleLevel: boolean;
  // 当前角色信息
  private role: object;
  //高级搜索的是否显示
  private showSearch: Boolean = false;
  //查看所有传参(传空)
  private searchData: Object = {
    // "endTime": "2019-10-10T05:58:57.640Z",
    "keyWord": "",
    "nowPage": 1,
    "pageSize":10,
    // "startTime": "2019-10-10T05:58:57.640Z"
  };

  //列表添加操作参数
  private btnGroupSe: object = {  // 已发
    forward: {name: '转发',type: 'primary',emit: 'forwardSe',  expression: true },
    delect:{ name: '删除', emit: 'faxDelete',type: 'danger' ,expression:true}
  }
  // 已发
  private propSedata = {  
    isCheck: false,
    pageSize: 10,
    total: 0,
    config: [
      
      {
        type: 'link',
        label: '传真标题',
        basehref: '/addressBookManage/deliverFaxDetail',
        width: '/',
        prop: 'faxTitle',
      },
      {
        type: 'string',
        label: '传真部门',
        prop: 'faxDept'
      },
      {
        type: 'string',
        label: '传真附件',
        prop: 'attachName'
      },
      {
        type: 'string',
        label: '传真号码',
        prop: 'faxNumber'
      },
      {
        type: 'string',
        label: '传真时间',
        prop: 'faxSendTime'
      },
      {
        type: 'string',
        label: '回执状态',
        prop: 'orgName'
      },
      {
        type: 'button',
        label: '操作',
        width: '/',
        prop: 'operate'
      }
    ],
    data: []
  }

  created() {
    this.getListData()
  }
  mangeListAdd() {}
  // 获取列表数据
  getListData() {
    this.http.MailListRequest.faxList(this.searchData).then((res) => {
      if (res.data) {
        //获取分页
        this.propSedata.total = res.data.total
        this.propSedata.pageSize = res.data.pageSize
        let propSedata = res.data.list.map((item, index) => {
          item.operate=this.btnGroupSe
       //   item.operate = [{ name: '删除', emit: 'faxDelete',type: 'danger', disabled: true ,expression:true}]
          return item
        })
        this.$set(this.propSedata, 'data', propSedata)
      }
    })
  }
  /* author by huihui 列表所有按钮点击响应
   *  Modify by
   */
  tablecallback(data) {
    this[data.type](data);
  }

  /* author by huihui 翻页功能
   *  Modify by
   */
  handlePageChange(data) {
    this.searchData['nowPage'] = data.rowVal;
    this.getListData();
  }

  /* author by huihui 删除
   *  Modify by
   */
  faxDelete(data) {
    console.log(data)
      this.$confirm('是否确认删除?',"提示",{
        confirmButtonText:'确定',
        cancelButtonText:"取消",
        type:'warning',
        confirmButtonClass:'confirmButtonClass',
        cancelButtonClass:"confirmButtonClass",
      }).then(()=>{
        this.http.MailListRequest.faxDelect(data.rowVal.faxSendId).then((res) => {
          if (res.status == 200) {
            this.getListData()
          } else {
            this.$message({
              message: '删除失败',
              type: 'error'
            })
          }
        })
      }).catch(()=>{
        this.$message({
          message:'已取消操作'
        })
      })
  }

  /* author by chengyun 已发传真新增
   *  Modify by
   */
  deliverAdd(){
    // /addressBookManage/controlFaxAdd
    this.$router.push({path:'/addressBookManage/controlFaxAdd',query:{title:'已发传真'}})

  }

  /* author by chengyun 已发转发
   *  Modify by
   */
  forwardSe() {
    // this.$message('已发')
    this.$router.push({ path: '/addressBookManage/forwardFaxDetail'})
  } 
 
  /* author by chengyun 已收转发
   *  Modify by
   */
  forwardRe() {
    // this.$message('已收')
    this.$router.push({ path: '/addressBookManage/forwardFaxDetail'})

  }

}
