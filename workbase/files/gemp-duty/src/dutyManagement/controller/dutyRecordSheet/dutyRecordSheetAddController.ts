import { ControllerBase, Inject } from 'prism-web';
//新增值班记录单
export class DutyRecordSheetAddController extends ControllerBase {
  private temp = {
    style: require('../../style/dutyRecordSheet/dutyRecordSheetAdd.less')
  };
  constructor() {
    super();
  }

  private ruleForm = {
    eventLevelCode: '',
    incidentDate: new Date() // 事发时间
  };
  private formdata = {
    data: {
      dutyRecordId: '',
      handlingPeople: '',
      handlingTime: '',
      attachmentLink: '',
      workContent: '',
      onDutyPeople: '',
      onRecordLeader: '',
      orgCode: '',
      recoredType: ''
    },
    config: [
      {
        label: ' * 基本信息:',
        span: [12, 12],
        dataProp: [
          [
            {
              label: '办理时限:',
              type: 'date',
              prop: 'handlingTime',
              requireType: ['required']
            }
          ],
          [
            {
              label: '经办人:',
              type: 'text',
              prop: 'handlingPeople',
              requireType: ['required']
            }
          ]
        ]
      },
      {
        span: [24],
        dataProp: [
          [
            // {
            //   label: '经办人:',
            //   type: 'date',
            //   prop: 'endtime',
            // },
            {
              label: '工作内容:',
              type: 'textarea',
              prop: 'workContent',
              requireType: ['required'],
              maxlength: 250
            }
          ]
        ]
      },
      {
        span: [12, 12],
        dataProp: [
          [
            {
              label: '请选择事项:',
              type: 'option',
              prop: 'recoredType',
              requireType: ['required']
            }
          ]
        ]
      },
      {
        span: [24],
        dataProp: [
          [
            // {
            //   label: '经办人:',
            //   type: 'date',
            //   prop: 'endtime',
            // },
            // {
            //   label: '附件:',
            //   type: 'imgUpload',
            //   prop: 'attachmentLink',
            //   maxlength: 250
            // }
          ]
        ]
      }
    ]
  };

  //查看所有传参(传空)
  private addData: Object = {
    attachmentLink: '',
    dutyRecordId: '',
    handlingPeople: '',
    handlingTime: '2019-10-10T05:58:57.640Z',
    onDutyPeople: '',
    onRecordLeader: '',
    orgCode: '201901',
    recoredType: 0,
    workContent: ''
  };

  private dutyData: Object = {
    orgCode: '', //组织id
    dddd: ''
  };

  @Inject('http') http: any;

  created() {
    let orgCode = this.$route.query.orgCode;
    this.$set(this.formdata.data, 'orgCode', orgCode);
    this.$set(this.dutyData, 'orgCode', orgCode);

    // if (this.$route.query.handlingPeople) {
    //   this.$set(
    //     this.formdata.data,
    //     'handlingPeople',
    //     this.$route.query.handlingPeople
    //   );
    // } else {
      this.getLoginName();
    // }
    this.getDuty();
  }

  getLoginName() {
    //获取登录人的信息
    if (window.sessionStorage.getItem('role')) {
      let role = JSON.parse(window.sessionStorage.getItem('role'));
      this.$set(this.formdata.data, 'handlingPeople', role.userName);
    }
  }
  // 获取值班人员
  getDuty() {
    this.http.DutyRecordSheet.dutySituationDutyman(this.dutyData).then(res => {
      if (res.status == 200) {
        let data = res.data;
        let onDutyPeople = ''; // 值班人员
        let onRecordLeader = ''; // 值班人员
        data.forEach(e => {
          if (e.leaderFlag == 0) {
            onDutyPeople = e.dutyPeopleName;
          } else {
            onRecordLeader = e.dutyPeopleName;
          }
        });
        this.$set(this.formdata.data, 'onDutyPeople', onDutyPeople);
        this.$set(this.formdata.data, 'onRecordLeader', onRecordLeader);
      }
    });
  }

  //返回
  goBack() {
    let newData = this.$refs.simpleTable['formdata'].data;
    let orgCode = {
      orgCode: newData.orgCode
    };
    this.$router.push({
      path: '/dutyManagement/dutyRecordSheet',
      query: orgCode
    });
  }

  // 新增值班记录单
  submit() {
    this.$refs.simpleTable['$refs'].simpletableform.validate(valid => {
      if (valid) {
        let newData = this.$refs.simpleTable['formdata'].data;
        let orgCode = {
          orgCode: newData.orgCode
        };
        this.http.DutyRecordSheet.dutySituationAdd(newData).then(res => {
          if (res.status === 200) {
            this.$router.push({
              path: '/dutyManagement/dutyRecordSheet',
              query: orgCode
            });
            this.$message({ message: res.msg, type: 'success' });
          } else {
            this.$message({ message: '新建失败!', type: 'error' });
          }
        });
      }
    });
  }
}
