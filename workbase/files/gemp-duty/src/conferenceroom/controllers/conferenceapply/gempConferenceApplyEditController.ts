import { ControllerBase, Inject } from 'prism-web';
import vue from 'vue';
//查看页面
export class GempConferenceApplyEditController extends ControllerBase {
  constructor() {
    super();
  }

  @Inject('http') http: any;
  private temp = {
    style: require('../../style/conferenceapply/gempConferenceApplyEdit.less'),
  };
  private messageDom: any = null; // message实体

  private roomSelect: any = [];
  //获取详情的数据
  private data = {};
  //表单参数
  private ruleForm: any = {
    applyId: '', //记录唯一标识
    roomId: '', //会议室id
    meetingDate: '', //会议室使用日期
    meetingStartTime: '', //会议室开始时间
    meetingEndTime: '', //会议室结束时间
    participantNum: '', //参会人数
    enablingMultimedia: '', //是否启用多媒体   1启用 0不启用
    usingLeader: '', //使用领导
    tenantId: '', //租户id
    reserveName: '', //预定人
    reservePhone: '', //预定人电话
    reserveDept: '', //预定人处室
    meetingAgenda: '', //会议议题
    remarks: '', //备注
    operatorId: '', //经办人ID
    operatorName: '', //经办人姓名
    operatorPhone: '', //经办人电话
    applyStatus: '', //申请状态 申请  预定成功  退回
    createTime: '', //创建时间
    createBy: '', //创建人ID
    createName: '', //创建人名字
    updateTime: '', //最后修改时间
    updateBy: '', //最后修改人ID
    updateName: '', //最后修改人名字
    deleteFlag: '', //删除标识  0--未删除  1--已删除
  };

  private rules = {
    meetingDate: [
      {
        required: true,
        type: 'date',
        message: '请选择会议日期',
        trigger: 'blur',
      },
    ],
    meetingStartTime: [
      {
        required: true,
        message: '请选择会议开始时间',
        trigger: ['change', 'blur'],
      },
    ],
    meetingEndTime: [
      {
        required: true,
        message: '请选择会议结束时间',
        trigger: ['change', 'blur'],
      },
    ],
    participantNum: [
      {
        required: true,
        message: '请输入参会人数',
        trigger: ['change', 'blur'],
      },
    ],
    reserveName: [
      {
        required: true,
        message: '请输入预定人',
        trigger: ['blur'],
      },
      {
        min: 1,
        max: 50,
        message: '长度在1到50个字符之间',
        trigger: ['blur'],
      },
    ],
    reservePhone: [
      {
        required: true,
        message: '请输入预定人电话',
        trigger: ['change', 'blur'],
      },
    ],
    reserveDept: [
      {
        required: true,
        message: '请输入预定人处室',
        trigger: ['blur'],
      },
      {
        min: 1,
        max: 50,
        message: '长度在1到50个字符之间',
        trigger: ['blur'],
      },
    ],
    meetingAgenda: [
      {
        required: true,
        message: '请输入会议议题',
        trigger: ['blur'],
      },
      {
        min: 1,
        max: 50,
        message: '长度在1到50个字符之间',
        trigger: ['blur'],
      },
    ],
  };

  //保存方法
  submit() {
    if (!this.ruleForm['meetingDate']) {
      if (this.messageDom) {
        this.messageDom.close();
      }
      this.messageDom = this.$message({
        type: 'warning',
        message: '请选择会议日期',
      });
      return false;
    } else if (!this.ruleForm['meetingStartTime']) {
      if (this.messageDom) {
        this.messageDom.close();
      }
      this.messageDom = this.$message({
        type: 'warning',
        message: '请选择会议开始时间',
      });
      return false;
    } else if (!this.ruleForm['meetingEndTime']) {
      if (this.messageDom) {
        this.messageDom.close();
      }
      this.messageDom = this.$message({
        type: 'warning',
        message: '请选择会议结束时间',
      });
      return false;
    } else if (!this.ruleForm['participantNum']) {
      if (this.messageDom) {
        this.messageDom.close();
      }
      this.messageDom = this.$message({
        type: 'warning',
        message: '请输入参会人数',
      });
      return false;
    } else if (!this.ruleForm['reserveName']) {
      if (this.messageDom) {
        this.messageDom.close();
      }
      this.messageDom = this.$message({
        type: 'warning',
        message: '请输入预定人',
      });
      return false;
    } else if (!this.ruleForm['reservePhone']) {
      if (this.messageDom) {
        this.messageDom.close();
      }
      this.messageDom = this.$message({
        type: 'warning',
        message: '请输入预定人电话',
      });
      return false;
    } else if (!this.ruleForm['reserveDept']) {
      if (this.messageDom) {
        this.messageDom.close();
      }
      this.messageDom = this.$message({
        type: 'warning',
        message: '请输入预定人处室',
      });
      return false;
    } else if (!this.ruleForm['meetingAgenda']) {
      if (this.messageDom) {
        this.messageDom.close();
      }
      this.messageDom = this.$message({
        type: 'warning',
        message: '请输入会议议题',
      });
      return false;
    } else {
      this.saveData();
    }
  }

  async saveData() {
    let formData = this.ruleForm;
    const res = await this.http.ConferenceroomapplyRequest.modifyGempConferenceApply(
      formData
    );
    if (res.status === 603) {
      this.$message.warning(res.msg);
    }
    if (res.status !== 200) {
      return;
    }
    this.$message.success('保存成功！');
    this.$router.push('/conferenceroom/applyList');
  }

  async getRoomSelectData() {
    const res = await this.http.ConferenceroomRequest.conferenceRoomSelectData();
    if (res.status === 200) {
      this.roomSelect = res.data;
    }
  }

  created() {
    this.getRoomSelectData();
    //编辑
    this.getResourceInfo(this.$route.query.id);
  }

  //获取详情的数据
  async getResourceInfo(id) {
    let res = await this.http.ConferenceroomapplyRequest.findGempConferenceApplyById(
      id
    );
    if (res.status == 200) {
      this.$set(this, 'ruleForm', res.data);
    }
  }
}
