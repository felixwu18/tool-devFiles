import { ControllerBase, Inject } from 'prism-web';
import vue from 'vue';
//查看页面
export class GempConferenceApplyDetailController extends ControllerBase {
  constructor() {
    super();
  }

  @Inject('http') http: any;
  private temp = {
    style: require('../../style/conferenceapply/gempConferenceApplyDetail.less'),
  };

  //获取详情的数据
  private data = {};
  private id = '';
  private roomSelect: any = [];
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
  async created() {
    let id = this.$route.query.id;
    let res = await this.http.ConferenceroomapplyRequest.findGempConferenceApplyById(
      id
    );
    if (res.status === 200) {
      this.$set(this, 'ruleForm', res.data);
    }
    this.getRoomSelectData();
  }
  async getRoomSelectData() {
    const res = await this.http.ConferenceroomRequest.conferenceRoomSelectData();
    if (res.status === 200) {
      this.roomSelect = res.data;
    }
  }
}
