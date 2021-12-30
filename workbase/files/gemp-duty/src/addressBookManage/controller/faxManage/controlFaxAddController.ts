import { ControllerBase,Inject } from 'prism-web'

export class ControlFaxAddController extends ControllerBase {
  private temp = {
    style: require('../../style/faxManage/controlFaxAdd.less')
  }
  constructor() {
    super()
  }

  @Inject('http') http: any

  private activeNames = ['1','2']
  //tab栏切换参数
  private checkPage = '1'

  private ruleForm = {
    attachmentList: [], // 上传附件列表
    elements: []//动态模板
  }
  private formdata = {
    data: {
      reportTitle: '我是大帅哥'
    },
    config: [
      {
        span: [24],
        dataProp: [
          [
            {
              label: '传真标题：',
              prop: 'reportTitle',
              type: 'text',
              requireType: ['required',  'length'],
              maxlength: 80,
            }
         ]
        ]
      }
    ]
  }

  private checkBox= []    // 选中的index
  private checkBoxContent= []    // 选中的内容

  private clickAll=false    // 是否全选

  //存放选中的列表
  private activeForm = []

  //展示所有分组的列表数据
  private formName = [
    {
      name:'毛汉进',
      position:'主任科员',
      unit:'市政府总值班室'
    },
    {
      name:'毛汉进',
      position:'主任科员',
      unit:'市政府总值班室'
    },
    {
      name:'毛汉进',
      position:'主任科员',
      unit:'市政府总值班室'
    },
    {
      name:'毛汉进',
      position:'主任科员',
      unit:'市政府总值班室'
    },
    {
      name:'毛汉进',
      position:'主任科员',
      unit:'市政府总值班室'
    },
    {
      name:'毛汉进',
      position:'主任科员',
      unit:'市政府总值班室'
    },
    {
      name:'毛汉进',
      position:'主任科员',
      unit:'市政府总值班室'
    },
    {
      name:'毛汉进',
      position:'主任科员',
      unit:'市政府总值班室'
    },
    {
      name:'毛汉进',
      position:'主任科员',
      unit:'市政府总值班室'
    },
    {
      name:'毛汉进',
      position:'主任科员',
      unit:'市政府总值班室'
    },
    {
      name:'毛汉进',
      position:'主任科员',
      unit:'市政府总值班室'
    },
    {
      name:'毛汉进',
      position:'主任科员',
      unit:'市政府总值班室'
    }
  ]

  created() {
    this.getListData()
  }


  // 获取列表数据
  getListData() {


  }

  /* author by chengyun 发送按钮
   *  Modify by
   */
  sendMessage(){
    let newData = this.$refs.simpleTable['formdata'].data

  }

  /* author by chengyun 分组展开和收起
   *  Modify by
   */
  handleChange(val) {

  }

  /* author by chengyun 点击当前选中
   *  Modify by
   */
  choosed(item,index) {
    var idx = this.checkBox.indexOf(index);
    var idc = this.checkBoxContent.indexOf(index)
    if(this.$refs.orgName[index].className == 'outbox-org-conut') {
        // 添加类--选中状态
        this.$refs.orgName[index].className = 'outbox-org-conut active';
        this.checkBox.push(index);
        this.checkBoxContent.push(item);
        // this.checkBox[index] = item;
    } else {
        // 选中再取消
        this.$refs.orgName[index].className = 'outbox-org-conut';
        this.checkBox.splice(idx, 1);
        this.checkBoxContent.splice(idc, 1);
    }
  }
  
  /* author by chengyun 全部选中
   *  Modify by
   */      
    checkAll() {
      var len = this.formName.length;
      this.checkBox = [];
      for (var i = 0; i < len; i++) {
          this.checkBox.push(i);
          this.$refs.orgName[i].className = 'outbox-org-conut active';
      }
      this.checkBoxContent = this.formName

      // this.clickAll=true;

  }

  /* author by chengyun 清除全部选中
   *  Modify by
   */        
    clearCheck() {
      // this.clickAll = false;
      this.checkBox.forEach(element => {
        this.$refs.orgName[element].className = 'outbox-org-conut'
      })
      this.checkBox = []
      this.checkBoxContent = []
  }
}
