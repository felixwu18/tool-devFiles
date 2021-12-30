import { promiseUtils } from '../../utils/promiseUtils';
import Http from '../../service/httpService';
import loadHttp from "./../../service/blobHttpService"
import { orgUrl,baseUrl,generalUrl} from '../../config/base'

export class LeaderShiftRequest {
  /**
   * 节假日/重要时刻 带班详情
   * @param dto
   */
  public holidayList(dto: Object): Promise<any> {
    let promiseData = Http.post(baseUrl + '/api/gemp/duty/plan/leader/holiday/people/list/v1', dto);
    return promiseUtils(promiseData);
  }

  /**
   * 节假日/重要时刻带班 可选人员列表
   */
  public holidayPeople(dto: Object): Promise<any> {
    let promiseData = Http.post(baseUrl + '/api/gemp/duty/plan/leader/holiday/people/search/v1', dto);
    return promiseUtils(promiseData);
  }

  /**
   * 节假日/重要时刻  编辑
   */
  
  
  public holidayUpdate(dto: Object): Promise<any> {
    let promiseData = Http.post(baseUrl + '/api/gemp/duty/plan/leader/holiday/people/add/v1', dto);
    return promiseUtils(promiseData);
  }

  // /**
  //  * 导出
  //  */
  // '/api/gemp/duty/plan/leader/holiday/people/export/v1'
 
  public holidayExport(dto: Object): Promise<any> {
    let promiseData =loadHttp.post(baseUrl+'/api/gemp/duty/plan/leader/holiday/people/export/v1', dto);
    return promiseData;
  }
 // 领导代表编辑
  public holidayEdit(dto: Object): Promise<any> {
    let promiseData = Http.post(baseUrl + '/api/gemp/duty/plan/leader/holiday/people/update/v1', dto);
    return promiseData;
  }
}
