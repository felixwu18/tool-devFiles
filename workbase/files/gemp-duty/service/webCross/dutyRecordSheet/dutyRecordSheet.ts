import { promiseUtils } from '../../utils/promiseUtils';
import http from '../../service/httpService';
import { orgUrl, baseUrl, generalUrl } from '../../config/base'


export class DutyRecordSheet {
  /**
   * 值班记录单---新增值班记录单
   *
   */
  public dutySituationAdd(dto: Object): Promise<any> {
    let promiseData = http.post(
      baseUrl + '/api/gemp/duty/plan/recording/add/v1',
      dto
    );
    return promiseUtils(promiseData);
  }

  /**
   * 值班记录单---分页查询值班记录单
   *
   */
  public dutySituationList(dto: Object): Promise<any> {
    let promiseData = http.post(
      baseUrl + '/api/gemp/duty/plan/recording/list/v1',
      dto
    );
    return promiseUtils(promiseData);
  }

  /**
   * 值班记录单---删除值班记录单
   *
   */
  public dutySituationDelect(dto: Object): Promise<any> {
    let promiseData = http.post(
      baseUrl + '/api/gemp/duty/plan/recording/delete/v1',
      dto
    );
    return promiseUtils(promiseData);
  }

  /**
   * 值班记录单---修改值班记录单
   *
   */
  public dutySituationModify(dto: Object): Promise<any> {
    let promiseData = http.post(
      baseUrl + '/api/gemp/duty/plan/recording/modify/v1',
      dto
    );
    return promiseUtils(promiseData);
  }
  /**
  * 值班记录单---id查询单条记录单信息
  *
  */
  public dutySituationDetail(dto: Object): Promise<any> {
    let promiseData = http.post(
      baseUrl + '/api/gemp/duty/plan/recording/detail/v1',
      dto
    );
    return promiseUtils(promiseData);
  }
  /**
   * 值班记录单---获取当天的值班人员
   *
   */
  public dutySituationDutyman(dto: Object): Promise<any> {
    let promiseData = http.post(
      baseUrl +
      `/api/gemp/duty/plan/recording/people/list/v1?orgCode=${dto['orgCode']}`,
      {}
    );
    return promiseUtils(promiseData);
  }
}
