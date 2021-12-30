import { ControllerBase, Inject } from 'prism-web';
//编辑值班记录单
export class DutyRecordSheetEditController extends ControllerBase {
  private temp = {
    style: require('../../style/dutyRecordSheet/dutyRecordSheetEdit.less')
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
      dutyRecordId: '', //主鍵id编号
      handlingPeople: '', //经办人
      handlingTime: '', //办理时限
      attachmentLink: '', //附件链接
      workContent: '', //工作内容
      orgCode: '', //组织id
      recoredType: '' //值班记录事项类型
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
              maxlength: 250,
              requireType: ['required'],
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
  @Inject('http') http: any;
  created() {
    this.onNotify();
  }

  // 监听详情信息
  onNotify() {
    let query = this.$route.query;
    let recoredType;
    let recoredTypeCode = this.$route.query.recoredType;
    switch (Number(recoredTypeCode)) {
      case 0:
        recoredType = '已办事项';
        break;
      case 1:
        recoredType = '待办事项';
        break;
      case 2:
        recoredType = '关注事项';
        break;
      default:
        break;
    }
    let data = {
      dutyRecordId: query.dutyRecordId,
      handlingPeople: query.handlingPeople,
      handlingTime: new Date(query.handlingTime.toString().replace(/\-/g, '/')),
      attachmentLink: query.attachmentLink,
      workContent: query.workContent,
      orgCode: query.orgCode,
      recoredType: recoredType
    };
    this.$set(this.formdata, 'data', data);
  }


  //返回
  goBack() {
    let newData = this.$refs.simpleTable['formdata'].data;
    let orgCode = {
      orgCode: newData.orgCode
    }
    this.$router.push({ path: '/dutyManagement/dutyRecordSheet', query: orgCode })
  }
  
  // 保存修改
  submit() {
    this.$refs.simpleTable['$refs'].simpletableform.validate(valid => {
      let recoredType;
      if (valid) {
        let recoredTypeCode = this.$refs.simpleTable['formdata'].data
          .recoredType;
        switch (recoredTypeCode) {
          case '已办事项':
          case '0':
            recoredType = 0;
            break;
          case '待办事项':
          case '1':
            recoredType = 1;
            break;
          case '关注事项':
          case '2':
            recoredType = 2;
            break;
          default:
            break;
        }
        this.$set(
          this.$refs.simpleTable['formdata'].data,
          'recoredType',
          recoredType
        );
        let newData = this.$refs.simpleTable['formdata'].data;
        let orgCode = {
          orgCode: newData.orgCode
        }
        this.http.DutyRecordSheet.dutySituationModify(newData).then(res => {
          if (res.status === 200) {
            this.$router.push({ path: '/dutyManagement/dutyRecordSheet', query: orgCode })
            this.$message({ message: res.msg, type: 'success' });
            this.format(recoredTypeCode, recoredType);
          } else {
            this.$message({ message: '修改失败!', type: 'error' });
            this.format(recoredTypeCode, recoredType);
          }
        });
      }
    });
  }
  
  // 格式化 事项类型 by 黄超
  format(recoredTypeCode, recoredType) {
    recoredTypeCode = this.$refs.simpleTable['formdata'].data.recoredType;
    switch (recoredTypeCode) {
      case 0:
        recoredType = '已办事项';
        break;
      case 1:
        recoredType = '待办事项';
        break;
      case 2:
        recoredType = '关注事项';
        break;
      default:
        break;
    }
    this.$set(
      this.$refs.simpleTable['formdata'].data,
      'recoredType',
      recoredType
    );
  }
}
