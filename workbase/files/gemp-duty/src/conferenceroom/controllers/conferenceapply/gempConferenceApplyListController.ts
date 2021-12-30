import { ControllerBase, Inject, TAxiosHttp } from 'prism-web'; //不能改动

export class GempConferenceApplyListController extends ControllerBase {
  constructor() {
    super();
  }
  @Inject('http') http: any;
  @Inject('downloadFunc') downloadFunc: any;

  private temp = {
    style: require('../../style/conferenceapply/gempConferenceApplyList.less'),
  };

  // 搜索条件
  private searchData: object = {
    keyWords: '', //模糊查询关键字
    nowPage: 1, //($int32)当前页数
    pageSize: 10, //($int32)每页条数
  };

  // 按钮功能数组
  private btnGroup: object = {
    edit: { name: '编辑', emit: 'edit', type: 'primary', expression: true },
    reserve: {
      name: '预定',
      emit: 'reserve',
      type: 'primary',
      expression: true,
    },
    delete: {
      name: '删除',
      emit: 'delete',
      type: 'warning',
      expression: true,
    },
  };

  //列表参数
  private propData = {
    isCheck: false,
    //pageSize: this.searchData.pageSize,
    total: 0,
    currentPage: 1,
    config: [
      {
        label: '会议日期',
        type: 'link',
        width: '/',
        prop: 'meetingDate',
        basehref: '/conferenceroom/applyDetail',
        passProp: 'applyId',
      },
      {
        label: '会议开始时间',
        type: 'string',
        width: '/',
        prop: 'meetingStartTime',
      },
      {
        label: '会议结束时间',
        type: 'string',
        width: '/',
        prop: 'meetingEndTime',
      },
      {
        label: '参会人数',
        type: 'string',
        width: '/',
        prop: 'participantNum',
      },
      {
        label: '是否启用多媒体',
        type: 'string',
        width: '/',
        prop: 'enablingMultimediaName',
      },

      {
        label: '预定人',
        type: 'string',
        width: '/',
        prop: 'reserveName',
      },
      {
        label: '预定人电话',
        type: 'string',
        width: '/',
        prop: 'reservePhone',
      },

      {
        label: '申请状态',
        type: 'string',
        width: '/',
        prop: 'applyStatusName',
      },
      {
        type: 'button',
        label: '操作',
        width: '180',
        prop: 'operate',
      },
    ],
    data: [],
    sortData: {
      data: [],
      handle: 'sortTable',
    },
  };

  created() {
    this.getResourceList(this.searchData);
  }

  /*
   * 列表按钮点击响应
   *
   */
  tablecallback(data) {
    // 点击分页
    if (data.type === 'handlePageChange') {
      this.$set(this.searchData, 'nowPage', data.rowVal);
      this.getResourceList(this.searchData);
    }
    // 点击删除
    if (data.type === 'delete') {
      this.delete(data.rowVal);
    }
    // 点击编辑
    if (data.type === 'edit') {
      this.edit(data.rowVal.applyId);
    }
    // 点击预定
    if (data.type === 'reserve') {
      this.reserve(data.rowVal.applyId);
    }
  }

  /*
   * 条件查询列表
   *
   */
  async getResourceList(prams) {
    let res = await this.http.ConferenceroomapplyRequest.pageListGempConferenceApply(
      prams
    );
    if (res.status === 200) {
      this.propData.total = res.data.total;
      let resourceData = res.data.list.map(item => {
        let obj = JSON.parse(JSON.stringify(this.btnGroup));
        if (item.applyStatus === 'PASS') {
          obj['edit'].expression = false;
          obj['delete'].expression = false;
          obj['reserve'].expression = false;
        }
        item['operate'] = obj;
        return item;
      });
      this.$set(this.propData, 'data', resourceData);
    }
  }

  /*
   * 编辑当前列表
   *
   */
  edit(id) {
    this.$router.push({ path: '/conferenceroom/applyEdit', query: { id: id } });
  }

  /*
   * 预定
   *
   */
  reserve(id) {
    this.$router.push({
      path: '/conferenceroom/applyReserve',
      query: { id: id },
    });
  }

  // 查看功能
  preview(data) {
    this.$router.push({
      path: '/conferenceroom/applyDetail',
      query: { applyId: data.rowVal.applyId },
    });
  }

  /*
   * 删除方法
   *
   */
  delete(val) {
    this.$confirm(`确定删除此申请信息吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        this.http.ConferenceroomapplyRequest.deleteGempConferenceApplyById(
          val.applyId
        ).then(res => {
          if (res.status === 603) {
            this.$message.warning(res.msg);
            return;
          }
          if (res.status === 200) {
            this.$message.success('删除成功！');
            this.getResourceList(this.searchData);
          } else {
            this.$message.warning('删除失败！');
          }
        });
      })
      .catch(() => {
        this.$message.info('已取消删除');
      });
  }

  //表格排序
  sortTable(sortItem) {}
}
