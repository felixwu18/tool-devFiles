import { ControllerBase, Inject } from 'prism-web'


export class CommonCommunicationListController extends ControllerBase {

  private temp = {
    style: require('../../style/commonCommunication/commonCommunicationList.less')
  }
  private loadrNumber = [{ num: "18310655295" }]
  private dutyNumber = [{ num: "11111111" }]
  // 列表时间查询参数
  constructor() {
    super()
  }

  private defaultchecked = ''
  private search_time: Array<any> = []

  @Inject('http') http: any

  // 当前角色级别
  private roleLevel: boolean
  // 当前角色信息
  private role: object
  private callnumber = "" // 传值号码
  //向弹出框配置参数
  private dialogConfig: Object = {
    viewDialog: false, //弹框是否显示
    templateName: '', //弹框组件名
    tilteName: '' //标题头
  };
  private phonePanelVisible: boolean = false; // 拨号盘显隐控制
  // 短信发送弹出窗
  private sendMessageConfig: Object = {
    viewDialog: false,
    templateName: '',
    titleName: ''
  };

  //弹框传递的参数
  private propsData: Object = {};
  private sendMessageProp:Object = {

  }

  //查看所有传参(传空) 查看未删传参(传0)
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
  }

  private propData = {
    isCheck: false,
    pageSize: 10,
    total: 0,
    config: [
      {
        type: 'string',
        label: '姓名',
        width: '/',
        prop: 'infoTitle',
        emit: 'detailDialog'
      },
      {
        type: 'string',
        label: '职务',
        prop: 'infoTypeName'
      },
      {
        type: 'string',
        label: '人员单位',
        prop: 'reportDate'
      },
      {
        type: 'string',
        label: '办公电话',
        prop: 'people',
        icon: 'el-icon-download',
        emit: 'workPhoneCall'
      },
      {
        type: 'string',
        label: '移动电话',
        prop: 'newdate',
        icon: 'el-icon-download',
        emit: 'useMobile'
      },

      {
        type: 'string',
        label: '传真',
        prop: 'xiazai',

      },
      // {
      //   type: 'button',
      //   label: '操作',
      //   width: '120',
      //   prop: 'operate'
      // }
    ],
    data: [
      {
        infoTitle: '赵新望',
        infoTypeName: '副主任',
        reportDate: '市政府总值班室',
        people: '82826345',
        newdate: '18310655292',
        xiazai: '1111111'
      },
      {
        infoTitle: '赵新望',
        infoTypeName: '副主任',
        reportDate: '市政府总值班室',
        people: '82826345',
        newdate: '18310655292',
        xiazai: '1111111'
      },
      {
        infoTitle: '赵新望',
        infoTypeName: '副主任',
        reportDate: '市政府总值班室',
        people: '82826345',
        newdate: '18310655292',
        xiazai: '1111111'
      }, {
        infoTitle: '赵新望',
        infoTypeName: '副主任',
        reportDate: '市政府总值班室',
        people: '82826345',
        newdate: '18310655292',
        xiazai: '1111111'
      },

    ]
  }
  tablecallback(data) {
    this[data.type](data)
  }

  created() {
  }
  getListData() {

  }
  getOrg(val) {
    this.$set(this.searchData, 'orgCode', val)
  }

  tableRowClassName() { }

	/**
	 * 点击姓名的dialog
	 */
	detailDialog(val) {
		this.dialogConfig['viewDialog'] = true;
		let data = {
			viewDialog: true,
			templateName: 'duty-addressbook-detail',
			tilteName: '查看人员'
		};
		this.$set(this, 'dialogConfig', data);
	}


  // 拨打固定电话
  workPhoneCall(val) {
    console.log(111)
    this.phonePanelVisible = true
    this.callnumber = val.rowVal.dutyPhone;
    // TODO改变轮盘值
  }

  // 点击手机需要选择是拨打电话还是发送短信
  useMobile(val) {
    this.$confirm('选择发送短信还是拨打电话？', '提示', {
      distinguishCancelAndClose: true,
      confirmButtonText: '拨打电话',
      cancelButtonText: '发送短信'
    })
      .then(() => {
        this.phonePanelVisible = true
        this.callnumber = val.rowVal.dutyPhone;
      })
      .catch(action => {
        action === 'cancel' ? this.sendMessage() : null;
      });
  }

  // 发送短信
  sendMessage() {
    this.sendMessageConfig['viewDialog'] = true;
    let data = {
      viewDialog: true,
      templateName: 'duty-addressBook-send',
      tilteName: '发送短信'
    };
    this.$set(this, 'sendMessageConfig', data);
  }
  /**
     * 点击关闭弹窗
     */
  closeDialogCall() {
    this.dialogConfig['viewDialog'] = false;
  }

  //关闭短信弹框
  closeSendDialog() {
    this.sendMessageConfig['viewDialog'] = false;
  }

}
