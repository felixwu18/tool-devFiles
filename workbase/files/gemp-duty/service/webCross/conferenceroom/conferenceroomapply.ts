import { promiseUtils } from '../../utils/promiseUtils';
import Http from '../../service/httpService';
import loadHttp from '../../service/blobHttpService';
import { orgUrl, baseUrl, generalUrl } from '../../config/base';

export class ConferenceroomapplyRequest {
  // 新增
  public saveGempConferenceApply(dto: Object): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/room/apply/add/v1',
      dto
    );
    return promiseUtils(promiseData);
  }
  // 根据编号删除记录
  public deleteGempConferenceApplyById(id: String): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/room/apply/delete/v1',
      {
        applyId: id,
      }
    );
    return promiseUtils(promiseData);
  }
  // 根据编号查看详情
  public findGempConferenceApplyById(id: String): Promise<any> {
    let promiseData = Http.post(baseUrl + '/api/gemp/duty/room/apply/id/v1', {
      applyId: id,
    });
    return promiseUtils(promiseData);
  }
  // 列表
  public pageListGempConferenceApply(dto: Object): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/room/apply/list/v1',
      dto
    );
    return promiseUtils(promiseData);
  }
  // 修改
  public modifyGempConferenceApply(dto: Object): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/room/apply/modify/v1',
      dto
    );
    return promiseUtils(promiseData);
  }
  // 退回申请单
  public backGempConferenceApply(id: String): Promise<any> {
    let promiseData = Http.post(baseUrl + '/api/gemp/duty/room/apply/back/v1', {
      applyId: id,
    });
    return promiseUtils(promiseData);
  }
  // 预定申请单
  public reserveGempConferenceApply(dto: Object): Promise<any> {
    let promiseData = Http.post(
      baseUrl + '/api/gemp/duty/room/apply/reserve/v1',
      dto
    );
    return promiseUtils(promiseData);
  }
}
