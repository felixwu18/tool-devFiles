import { promiseUtils } from '../../utils/promiseUtils'
import Http from '../../service/httpService'
import Http2 from '../../service/httpService2'
import { get } from 'http';
import loadHttp from '../../service/blobHttpService';
import { orgUrl, baseUrl, uploadUrlFlie, eventUrl } from '../../config/base';

export class GempInfoBaseRequest {
  // 抄送上报信息
  public copyReportInformation(dto: Object): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/baseinfo/copyReport/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }
  // 获取值班人员列表
  public getCurrentDutyPerson(dto: Object): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/plan/govern/day/org/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }
  // 根据infoId和类型type查找人员情况
  public findByInfoIdAndType(dto: Object): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/baseinfoPerson/findByInfoIdAndType/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }
  // 新增/更新伤亡人员情况
  public updateDeathPersonState(dto: Object): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/baseinfoPerson/add/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }
  // 根据id删除人员情况
  public deleteDeathPersonState(dto: Object): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/baseinfoPerson/delete/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }

  // 获取成都市的行政区划
  public getDistCodeList(): Promise<any> {
    let promiseData = Http.post(
      orgUrl + '/api/gemp/user/org/list/subOrg/v1',
      { parentCode: 'ce9e45b1e1b34ec6a1549ba164326b2b' },
    );
    return promiseUtils(promiseData);
  }

  public add(dto: Object): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/baseinfo/add/v1 ',
      dto,
    );
    return promiseUtils(promiseData);
  }
  public edit(dto: Object): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/baseinfo/edit/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }
  public delete(dto: Object): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/transact/delete/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }

  public addAssocciation(dto: Object): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/baseinfo/assocciate/add/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }

  public presentat(dto: Object): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/baseinfo/presentat/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }
  // 续报上报呈报
  public presentatFollow(dto: Object): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/baseinfo/presentatFollow/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }
  public getAll(dto: Object): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/baseinfo/list/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }

  public getInfoById(dto: Object): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/baseinfo/id/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }

  public getInfoChainById(dto: Object): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/baseinfo/chain/list/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }

  public cancelAssocciation(dto: Object): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/baseinfo/assocciate/cancel/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }
  public setMainAssocciation(dto: Object): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/baseinfo/assocciate/main/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }

  public getDisposeByinfoId(dto: Object): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/baseinfo/dispose/list/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }
  public editDisoseOrderByDid(dto: Object): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/baseinfo/instruction/order/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }

  public getGempInfoProgressList(dto: Object): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/baseinfo/progress/list/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }

  public getConnectList(dto: Object): Promise<any> {
    // new add
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/baseinfo/connect/list/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }

  public getInfoLevel(dto: Object): Promise<any> {
    // new add
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/event/level/list/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }

  public getInfoType(): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/event/type/list/v1',
      {},
    );
    return promiseUtils(promiseData);
  }

  /*
   * Author by huihui 信息管理模块保存草稿
   */
  public toDraft(dto: Object): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/baseinfo/draft/add/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }

  public signInfo(dto: Object): Promise<any> {
    //信息详情的签收
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/baseinfo/id/sign/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }

  public getChainContinueList(dto: Object): Promise<any> {
    // 关联和续报列表 newadd
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/baseinfo/assocciate/list/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }
  // 标为已读
  public baseInfoClean(): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/baseinfo/clean/vl',
      {},
    );
    return promiseUtils(promiseData);
  }
  //信息重报
  public repeat(dto: Object): Promise<any> {
    // new add
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/baseinfo/repeat/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }
  // 列表未读数查询功能
  public baseInfoUnread(): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/baseinfo/unread/vl',
      {},
    );
    return promiseUtils(promiseData);
  }
  //转办督办信息追加发送
  public msgAppendSend(dto: Object): Promise<any> {
    // new add
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/transact/paticiptor/append/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }
  //生成事件
  // public createEvent(infoId: String): Promise<any> {
  //   let promiseData = Http.post(baseUrl + `/api/gemp/duty/info/event/${infoId}/add/v1`, infoId)
  //   return promiseUtils(promiseData)
  // }
  public createEvent(infoId: String): Promise<any> {
    let promiseData = Http.post(
      eventUrl + `/api/gemp/event/eventbase/generate/v1`,
      { infoId: infoId },
    );
    return promiseUtils(promiseData);
  }

  //信息督办根据事件处置ID获取处置详情
  public getHandelDetail(dto: Object): Promise<any> {
    // new add
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/transact/id/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }
  //转办督办信息签收  wangjian
  public signHandel(id: String): Promise<any> {
    let promiseData = Http.post(
      baseUrl + `/api/gemp/duty/info/transact/${id}/receipt/v1`,
      { disposeId: id },
    );
    return promiseUtils(promiseData);
  }
  //拟办、审核、转办督办提交回复
  public sendApplyContent(dto: Object): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/transact/disposeId/reply/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }
  //转办督办催收
  public infoCollection({ disposeId }): Promise<any> {
    let promiseData = Http.post(
      baseUrl + `/api/gemp/duty/info/transact/${disposeId}/receipt/urge/v1`,
      { disposeId },
    );
    return promiseUtils(promiseData);
  }

  // 信息pdf获取
  public getPDF(obj): Promise<any> {
    let promiseData = Http.get(
      baseUrl + `/api/gemp/duty/info/file/${obj.type}/${obj.id}/v1`,
    );
    return promiseUtils(promiseData);
  }

  // 信息doc文档获取
  public getDocInfo(obj): Promise<any> {
    let promiseData = Http.get(
      baseUrl + `/api/gemp/duty/info/file/${obj.type}/${obj.id}/v1`,
    );
    return promiseUtils(promiseData);
  }

  // 获取事件模版的内容
  public getTemplateContent(typeCode: string): Promise<any> {
    let promiseData = Http.get(
      baseUrl + `/api/gemp/duty/info/analysis/${typeCode}/template/v1`,
    );
    return promiseUtils(promiseData);
  }

  // 获取情况描述示例
  public getExampleCase(): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/analysis/example/case/v1',
      {},
    );
    return promiseUtils(promiseData);
  }

  // 智能模板解析
  public intellectParse(data: object): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/analysis/content/fill/v1',
      data,
    );
    return promiseUtils(promiseData);
  }
  //相关法律法规
  public lawsReg(dto: Object): Promise<any> {
    // new add
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/event/law/relate/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }
  //相关知识
  public getknowledge(dto: Object): Promise<any> {
    // new add
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/event/knowledge/relate/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }

  //危险源下载文件
  public ResourcedownloadFlie(id: String): Promise<any> {
    let promiseData = loadHttp.get(
      baseUrl + '/api/attachment/template/download/v1?templateName=' + id,
    );
    return promiseData;
  }
  //附件下载
  public Attachmentdownload(url: String): Promise<any> {
    let promiseData = loadHttp.post(
      uploadUrlFlie + '/api/attachment/download/v1',
      url,
    );
    return promiseData;
  }

  // 判断用户是否是上下级
  public getUserLevel(dto: Object): Promise<any> {
    let promiseData = Http.post(orgUrl + '/api/user/super/v1', dto);
    return promiseUtils(promiseData);
  }

  // 获取值班信息文档
  public getDoc(dto: Object): Promise<any> {
    let promiseData = Http.post(baseUrl + '/api/gemp/duty/info/baseinfo/transTemplate/v1', dto);
    return promiseUtils(promiseData);
  }

  // 预览呈报上报值班信息文档
  public getViewDoc(dto: Object): Promise<any> {
    let promiseData = Http.post(baseUrl + '/api/gemp/duty/info/baseinfo/trans/view/template/v1', dto);
    return promiseUtils(promiseData);
  }
  
  // 预览呈报上报文档（未呈报）
  public getNotViewDoc(dto: Object): Promise<any> {
    let promiseData = Http.post(baseUrl + '/api/gemp/duty/info/baseinfo/not/trans/view/template/v1', dto);
    return promiseUtils(promiseData);
  }
  // 获取语音转文本
  public videoTransferText(file: File): Promise<any> {
    let data = new FormData()
    data.append("file",file)
    let promiseData = Http2.post(baseUrl + '/api/gemp/duty/service/v1/asr', data)
    return promiseUtils(promiseData)
  }

  // 获取文本分类
  public textTransferSort(content: Object): Promise<any> {
    let promiseData = Http.post(baseUrl + '/api/gemp/duty/service/contentDetail', content)
    return promiseUtils(promiseData)
  }

  public test(dto: Object): Promise<any> {
    let promiseData = loadHttp.post('http://127.0.0.1/aipservice/aip/v1/asr', dto)
    return promiseData
  }

  // 发送短信接口
  public sendMessageInfo(content: Object): Promise<any> {
    let promiseData = Http.post(baseUrl + '/api/gemp/duty/service/add/v1', content)
    return promiseUtils(promiseData)
  }

  // 获取领导列表
  public getLeaderList(data: Object): Promise<any> {
    let promiseData = Http.post(baseUrl + '/api/gemp/duty/service/list/leader/v1', data)
    // let promiseData = Http.post(baseUrl + '/api/gemp/duty/info/baseinfo/leader/list/v1', data)
    return promiseUtils(promiseData)
  }
  //抄报接口
  public copyReport(data: Object): Promise<any> {
    let promiseData = Http.post(baseUrl + '/api/gemp/duty/info/baseinfo/copy/add/v1', data)
    return promiseUtils(promiseData)
  }
  //已报信息
  public getReInformation(dto: Object): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/baseinfo/presentat/list/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }
   // 预览已报信息呈报上报值班信息文档
   public getReViewDoc(dto: Object): Promise<any> {
    let promiseData = Http.post(baseUrl + '/api/gemp/duty/info/baseinfo/presentat/view/template/v1', dto);
    return promiseUtils(promiseData);
  }
  //报平安
  public getReportPingan(dto: Object): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/daily/list/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }
  //报平安权限
  public getReportPromiss(): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/quick/report/role/v1',
      {},
    );
    return promiseUtils(promiseData);
  }
  /*
   * 保存上报平安
   */
  public saveReportPingan(dto: Object): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/daily/report/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }
  //一键已读报平安
  public getAllRead(): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/daily/clean/vl',
      {},
    );
    return promiseUtils(promiseData);
  }
  /*
   * 查看平安
   */
  public getReportPinganData(dto: Object): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/daily/show/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }
  /*
   * 查看是否已经报平安
   */
  public getIsReportPinganData(dto: Object): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/info/daily/check/v1',
      dto,
    );
    return promiseUtils(promiseData);
  }

  // 报送信息的时间链
  public reportListByTime(infoId: string): Promise<any> {
    let promiseData = Http.post(baseUrl + `/api/gemp/duty/info/baseinfo/reportListByTime?infoId=${infoId}`, {});
    return promiseUtils(promiseData);
  }

  // 报送信息的时间链按类型分
  public reportListByType(infoId: string): Promise<any> {
    let promiseData = Http.post(baseUrl + `/api/gemp/duty/info/baseinfo/reportListByType?infoId=${infoId}`, {});
    return promiseUtils(promiseData);
  }

  // 现场汇报等新增
  public addActionInfo(dto: Object): Promise<any> {
    let promiseData = Http.post(baseUrl + `/api/gemp/duty/info/otherExtends/add/actionInfo`, dto);
    return promiseUtils(promiseData);
  }
  // 现场汇报等删除
  public deleteActionInfo(dto: Object): Promise<any> {
    let promiseData = Http.post(baseUrl + `/api/gemp/duty/info/otherExtends/delete/v1`, dto);
    return promiseUtils(promiseData);
  }
  // 现场汇报等编辑
  public eidtActionInfo(dto: Object): Promise<any> {
    let promiseData = Http.post(baseUrl + `/api/gemp/duty/info/otherExtends/edit/v1`, dto);
    return promiseUtils(promiseData);
  }
  // 现场汇报等查询
  public otherExtends(dto: any): Promise<any> {
    let promiseData = Http.post(baseUrl + `/api/gemp/duty/info/otherExtends/list`, dto);
    return promiseUtils(promiseData);
  }

  // 报送事件信息时间表
  public getReportList(id: String): Promise<any> {
    let promiseData = Http.post(baseUrl + `/api/gemp/duty/info/baseinfo/getReportList?infoId=${id}`,{});
    return promiseUtils(promiseData);
  }
}
