import { ControllerBase, Inject, Watch } from 'prism-web'

export class baseViewController extends ControllerBase {
  private temp = {
      style: require('../style/specialWork.less')
  }
  private counterNum: any = [
    {
      workName: '',
      workNote: '',
    }
  ];

  constructor() {
    super()
  }
  @Inject('http') http:any
  private workNote = ''
  @Watch("workNote")
  timeChange(val) {
    this.counterNum.workNote = val
    this.$emit('counternum', this.counterNum)
  }
  private workName = ''
  @Watch("workName")
  workNameChange(val) {
    this.counterNum.workName = val
    this.$emit('counternum', this.counterNum)
  }
  private problemNum: any = [
    {
      // objectName: '',
      industry1: '',
    }
  ];
  private institution: Array<any> = [];
  //接收单位配置参数
  private optionProps = {
    value: 'id',
    label: 'label',
    children: 'children',
    multiple: false,
  }
  private orgtree: any = [];
  private value: any = '';
  created(){
    this.getOrgTree()
    this.getDistrictTrees()
    this.getDistrictTrees1()   

  }
  addObject() {
    this.counterNum.push({})
  }
  getOrgTree() {
    this.http.SpecialCampaignRequest.getOrgTrees().then(res => {
      this.orgtree = res.data.treeData
    });
  }
  getDistrictTrees(){
    this.http.SpecialCampaignRequest.getDistrictTrees().then(res => {
      if (res.status == 200) {
        this.institution = res.data
      }
    });
  }
  addProblem() {
    if (this.problemNum[this.problemNum.length-1].industry1 == '') {
      this.$message.error('请先录入问题');
    } else {
      this.problemNum.push({industry1: '',})
    }
    console.log(this.problemNum , 999)
  }
  getDistrictTrees1(){
    this.http.SpecialCampaignRequest.getDistrictTrees().then(res => {
      if (res.status == 200) {
        this.institution = res.data
      }
    });
  }
  // // 接收子组件传值
  // problemNum(val) {
  //   console.log(val, 88877)
  // }
}