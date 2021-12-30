import { ControllerBase, Inject, Prop } from 'prism-web';
import { getRequestUrl } from '../../../../assets/libs/commonUtils'
import searchSession from '../../../../assets/libs/searchData'

export class detailsManageListController extends ControllerBase {
  constructor() {
    super();
  }
  @Prop() disabled;
  private tabType:string = '1';
  private leftContentWidth: string = '57.85rem'
  private rightMap:string = '0'
  private flag: Boolean = false;
  private isLeftMapShow: Boolean = false;
  private handleFlag: boolean = false
  private infoPublicLabel: String = '公开'; //公开按钮默认文字
  private isInfoPublic: Boolean = true; //是否公开
  private infoPublicIcon: String = 'el-icon-lock'; //公开按钮图标控制
  private templateName: string = '';
  private tilteName: string = '';
  private propsData: Object = {};
  private propId;
  private signInfoStauts;
  private signForFlag = true;
  private showAllBtn = false;
  private expectDraft = false;
  private roleLevel: boolean=true;
  private reportFlag: boolean
  private role: object;
  private currentOrg: string = '';
  private reportRoleLevel: boolean; //呈报上报
  private isSupple: boolean = false; // 是否为呈报上报
  private openingDisableFlag: boolean = true; // 是否为呈报上报
  private submitFlag: boolean; // ("是否呈报（0：未呈报，1：呈报发送方、2：呈报接收方）")
  private infoStatus: boolean; // ("上报状态(未上报（草稿）:0,已上报:1)")
  private tenantId: boolean; // 租户ID
  private messageDom: any
  private copyList = [] //抄送单位
  private viewDialog = false //抄送弹窗
  private userTenantId = ""
  private copyFlag:boolean = false
  private sjUser: boolean = false
  private eventDisabled:boolean = false
  // 公开按钮是否显示
  get isPublicStatu() {
    return searchSession.getter({ name: 'role' }).sysPublicSwitch === 'N';
  }

  created() {
    this.propId = this.$route.query.id;
    // http://localhost:8080/exam_questions?type=3
    // 从提醒信息跳转的时候
    var url = window.location.href;
    let urlCode = getRequestUrl(url)
    if (urlCode && urlCode['detailUrlId']) {
      this.propId = urlCode['detailUrlId']
    }

    this.role = JSON.parse(sessionStorage.getItem('role'));
    // this.roleLevel = this.role['isYjb'];
    this.reportRoleLevel = this.role['isBuYjb'];
    this.sjUser = this.role['tenantId'] == 'GJ.JSS';
    this.getInfoData(this.propId);
    // this.reportRoleLevel = this.role['roleLevel'].indexOf('应急部') < 0
  }
  submitAReport() {
    // go('/information/submitReport',)
    this.$router.push({
      path: '/information/submitReport',
      query: { id: this.propId, page: 'presenationReport' }
    });
  }
  private toggleShowMap() {
    this.isLeftMapShow = !this.isLeftMapShow;
    if (this.rightMap === '0') {
      this.rightMap = '-21rem';
      this.leftContentWidth = '100%'
    }else{
      this.rightMap = '0';
      this.leftContentWidth = '57.85rem'
    }
  }
  private click(el: string, name: string) {
    this.flag = true;
    this.templateName = el;
    this.tilteName = name;
    this.propsData;
  }
  private temp = {
    style: require('../../style/infoManage/detailsManageList.less'),
  };

  @Inject('http') http: any;
  @Inject('store') store: any
  //关闭信息拟办、信息审核、领导批示等弹框的回调函数
  closeDialogCall(callInfo) {
    //关闭弹框
    this.flag = false;
    //重新刷新当前页面数据
    this.$refs.detaiWrap['getHandleInfo'](this.propId);
  }

  // 呈报上报
  presenationReport() {
    this.$confirm('确认提交？', '提示')
      .then(_ => {
        this.http.GempInfoBaseRequest.presentat(this.$route.query.id).then(
          res => {
            if (res.status == 200) {
              //监听弹出框成功后刷新数据
              this.emit('setprocess', '');
              this.$message({
                message: '上报成功',
                type: 'success',
              });
            }
          },
        );
      })
      .catch(_ => { });
  }

  /**
   * Modify by chenzheyu  修改签收的判断字段为handleStatus
   */
  private getInfoDetail(data) {
    this.signInfoStauts = data.handleStatus;
    this.isSupple = data.sourceId;
    if (this.signInfoStauts == '0') {
      this.signForFlag = false;
    }

    if (data.buttonDisableFlag == '1') {
      this.openingDisableFlag = false;
    }
  }
  //签收
  private signFor() {
    this.$confirm('是否确认签收?','提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: "warning" }).then(() => {
      let infoParams = { infoId: this.propId };
      this.http.GempInfoBaseRequest.signInfo(infoParams).then(res => {
        if (res.status == 200) {
          this.signForFlag = true;
        }
        this.$refs.detaiWrap['getHandleInfo'](this.propId);
        //刷新右侧处理过程数据
        this.emit('setprocess', '');
      });
    }).catch(() => {
        this.$message({ type: "info", message: "已取消签收" })
    })
    
  }

  // 获取信息详情
  /**
   * Modify by chenzheyu  新增默认的公开状态判断
   * @param id
   */
  getInfoData(id) {
    let infoParams = { infoId: id };
    this.http.GempInfoBaseRequest.getInfoById(infoParams).then(res => {
      // 若生成过事件,按钮置灰
      if (res.data.eventId || res.data.infoStatus == 0) {
        this.eventDisabled = true;
      }
      this.getUserInfo(res.data.createPerson)
      this.currentOrg = res.data.orgCode;
      this.propsData = res.data;
      this.handleFlag = res.data.handleFlag
      this.store.dispatch('setHandleState', res.data.handleFlag)
      this.reportFlag = res.data.reportFlag
      this.submitFlag = (res.data.submitFlag === '0')
      this.infoStatus = (res.data.infoStatus === '1')
      this.tenantId = res.data.tenentId
      this.copyFlag = res.data.copyFlag
      if (res.data.isOpen == '0') {
        this.isInfoPublic = true;
      } else {
        this.isInfoPublic = false;
      }

      this.infoPublicLabel = this.isInfoPublic ? '公开' : '取消公开';
      if (res.data.infoStatus * 1) {
        this.showAllBtn = true;
        this.expectDraft = true;
      } else {
        this.showAllBtn = false;
        this.$refs.detaiWrap['expectDraft'] = false;
      }
    });
  }
  /**
   * 获取用户基本信息
   */
  getUserInfo(id) {
    let params = {
      userId: id
    }
    if (params.userId) {
      this.http.MainRequest.getBaseInfo(params).then(res => {
        // console.log(res);
        if(res.status==200){
          this.userTenantId = res.data.tenantId
        }
      })
    }
  }
  //生成事件
  createEvent() {
    this.$confirm('是否将该信息生成事件？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      this.http.GempInfoBaseRequest.createEvent(this.propId).then(
        res => {
          if (res.status == 200) {
            this.eventDisabled = true;
            // this.$message('信息处置成功');
            this.$message.success('事件生成成功!');
            this.emit('setprocess', '');
          } else {
            this.$message(res.msg);
          }
        },
      );
    });
  }
  //公开与非公开状态处理
  infoPublicHandle() {
    this.isInfoPublic = !this.isInfoPublic;
    this.infoPublicLabel = this.isInfoPublic ? '公开' : '取消公开';
    this.infoPublicIcon = this.isInfoPublic ? 'el-icon-lock' : 'el-icon-unlock';
    if (!this.isInfoPublic) {
      //公开
      let infoParams = { infoId: this.propId };
      this.http.DetailOperationsRequest.open(infoParams).then(res => {
        this.$message({
          message: '公开成功',
          type: 'success',
        });
        //刷新右侧处理过程数据
        this.emit('setprocess', '');
      });
    } else {
      //取消公开
      let infoParams = { infoId: this.propId };
      this.http.DetailOperationsRequest.openCancel(infoParams).then(res => {
        this.$message({
          message: '取消成功',
          type: 'success',
        });
        //刷新右侧处理过程数据
        this.emit('setprocess', '');
      });
    }
  }
  back() {
    if (this.$route.query.targetUrl) {
      this.$router.push(`${this.$route.query.targetUrl}`)
      return
    }

    if (this.$route.query.transferId) {
      this.go('/information/transferView', {
        id: this.$route.query.transferId,
      });
    } else {
      this.go('/information/infoManage', {
        type: this.$route.query.type,
      });
    }
  }

  /**
   * 选择抄送单位
   * author by liuwenlei
   * @param item 
   */
  getOrg(item) {
    this.copyList = item;

  }

  /**
   * 抄送弹出框显示
   * author by 
   */
  detailsReportDialog(){
    this.viewDialog=true

  }

  /**
   * 抄送
   * author by liuwenlei
   */

  afterCopy() {
    if (this.copyList.length == 0) {
      if (this.messageDom) {
        this.messageDom.close();
      }
      this.messageDom = this.$message({
        type: 'warning',
        message: '请选择抄送单位',
      });
      return false
    }

    this.copyList = this.copyList.map(it => {
      return {
        reportId: it,
        reportName: '',
        reportType: '1',
      }
    })
    let params = {
      infoId: this.$route.query.id,
      copyList: this.copyList,
      reason: ''
    }
    this.http.DetailOperationsRequest.copy(params).then((res) => {
      if (res.status == 200) {
        this.$message.success('抄送成功！')
        this.viewDialog = false
        //刷新右侧处理过程数据
        this.emit('setprocess', '');
      } else {
        this.$message(res.msg)
      }
    })
  }

  /**
  * author by 刘文磊
  * 返回顶部
  */
  private gobackbtn = false
  private tagert: any

  // 返回顶部按钮
  gotop() {
    this.tagert['scrollTop'] = 0
    this.gobackbtn=false
  }
  // 切换办理类型
  changeTabType(type) {
    this.tabType = type;
    this.emit('changeInfoId', this.$route.query.id);
    (this.$refs.detaiWrap as any).changeTabType(type)
  }
  mounted() {
    //  滚动窗口
    // this.tagert = document.getElementById('countscoll').firstChild
    // addEventListener('mousewheel', () => {
    //   this.gobackbtn = this.tagert['scrollTop'] > 200 ? true : false
    // }, false)
  }
}
