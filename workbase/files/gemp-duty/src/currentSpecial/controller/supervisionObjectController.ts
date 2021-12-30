import { ControllerBase, Inject, Watch } from 'prism-web'

export class baseViewController extends ControllerBase {
  private temp = {
      style: require('../style/specialWork.less')
  }
  private problemNum: any = [
    {
      objectName: '',
      industry: '',
    }
  ];

  constructor() {
    super()
  }
  @Inject('http') http:any

  private objectName = ''
  @Watch("objectName")
  workNameChange(val) {
    this.problemNum.objectName = val
    this.$emit('problemnum', this.problemNum)
  }
  private industry = ''
  @Watch("industry")
  industryChange(val) {
    this.problemNum.industry = val
    this.$emit('problemnum', this.problemNum)
  }
  private institution: Array<any> = [];
  //接收单位配置参数
  private optionProps = {
    value: 'id',
    label: 'label',
    children: 'children',
    multiple: false,
  }
  created(){
    this.getDistrictTrees()   
  }
  addProblem() {
    if (this.problemNum[this.problemNum.length-1].industry == '') {
      this.$message.error('请先录入问题');
    } else {
      this.problemNum.push({industry: '',})
    }
    console.log(this.problemNum , 999)
  }
  getDistrictTrees(){
    this.http.SpecialCampaignRequest.getDistrictTrees().then(res => {
      if (res.status == 200) {
        this.institution = res.data
      }
    });
  }
  industrynum(val) {
    console.log(val,11111)
  }
  
}