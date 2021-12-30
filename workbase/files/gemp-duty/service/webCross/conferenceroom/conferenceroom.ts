import { promiseUtils } from '../../utils/promiseUtils';
import http from '../../service/httpService';
import { orgUrl, baseUrl, generalUrl } from '../../config/base';

export class ConferenceroomRequest {
  /**
   * 会议室管理-会议室管理列表
   */
  public manageList(dto: Object): Promise<any> {
    let promiseData = http.post(baseUrl + '/api/gemp/duty/room/list/v1', dto);
    return promiseUtils(promiseData);
  }

  /**
   * 会议室管理-获取会议室下拉框
   */
  public conferenceRoomSelectData(): Promise<any> {
    let promiseData = http.post(baseUrl + '/api/gemp/duty/room/select/v1', {});
    return promiseUtils(promiseData);
  }

  /**
   * 会议室管理-删除会议室
   */
  public delete(dto: Object): Promise<any> {
    let promiseData = http.post(baseUrl + '/api/gemp/duty/room/delete/v1', dto);
    return promiseUtils(promiseData);
  }

  /**
   * 会议室管理-新增会议室
   */
  public add(dto: Object): Promise<any> {
    let promiseData = http.post(baseUrl + '/api/gemp/duty/room/add/v1', dto);
    return promiseUtils(promiseData);
  }

  /**
   * 会议室管理-会议室详情
   */
  public detail(dto: Object): Promise<any> {
    let promiseData = http.post(baseUrl + '/api/gemp/duty/room/id/v1', dto);
    return promiseUtils(promiseData);
  }

  /**
   * 会议室管理-修改会议室
   */
  public modify(dto: Object): Promise<any> {
    let promiseData = http.post(baseUrl + '/api/gemp/duty/room/modify/v1', dto);
    return promiseUtils(promiseData);
  }

  /**
   * 会议室管理-会议室预约历史
   */
  public historyList(dto: Object): Promise<any> {
    let promiseData = http.post(
      baseUrl + '/api/gemp/duty/room/reserve/list/v1',
      dto
    );
    return promiseUtils(promiseData);
  }

  /**
   * 会议室管理-修改会议室预定记录
   */
  public reserveModify(dto: Object): Promise<any> {
    let promiseData = http.post(
      baseUrl + '/api/gemp/duty/room/reserve/modify/v1',
      dto
    );
    return promiseUtils(promiseData);
  }

  /**
   * 会议室管理-会议室预定记录历史
   */
  public reserveHistory(dto: Object): Promise<any> {
    let promiseData = http.post(
      baseUrl + '/api/gemp/duty/room/reserve/record/id/v1',
      dto
    );
    return promiseUtils(promiseData);
  }

  /**
   * 会议室管理-会议室预定记录历史删除
   */
  public deleteHistory(dto: Object): Promise<any> {
    let promiseData = http.post(
      baseUrl + '/api/gemp/duty/room/reserve/delete/v1',
      dto
    );
    return promiseUtils(promiseData);
  }

  /**
   * 会议室管理-会议室预约历史详情
   */
  public historyDetail(dto: Object): Promise<any> {
    let promiseData = http.post(
      baseUrl + '/api/gemp/duty/room/reserve/id/v1',
      dto
    );
    return promiseUtils(promiseData);
  }

  /**
   * 会议室管理-会议室预定列表
   */
  public calendar(dto: Object): Promise<any> {
    let promiseData = http.post(
      baseUrl + '/api/gemp/duty/room/calendar/list/v1',
      dto
    );
    return promiseUtils(promiseData);
  }

  /**
   * 会议室管理-新增会议预定
   */
  public addDestine(dto: Object): Promise<any> {
    let promiseData = http.post(
      baseUrl + '/api/gemp/duty/room/reserve/add/v1',
      dto
    );
    return promiseUtils(promiseData);
  }

  /**
   * 会议室管理-会议室预定编辑
   */
  public editDestine(dto: Object): Promise<any> {
    let promiseData = http.post(
      baseUrl + '/api/gemp/duty/room/calendar/id/v1',
      dto
    );
    return promiseUtils(promiseData);
  }
}
