import { promiseUtils } from '../../utils/promiseUtils'
import Http from '../../service/httpService'
import loadHttp from "./../../service/blobHttpService"
import { orgUrl,baseUrl,generalUrl} from '../../config/base'


export class GovermentdutyRequest {
  // 政务值班列表 天
  public governDay(dto: Object): Promise<any> {
    let promiseData = Http.post(baseUrl + "/api/gemp/duty/plan/govern/day/search/v1",dto)
    return promiseUtils(promiseData)
  }

  // 政务值班列表 周
  public governWeek(dto: Object): Promise<any> {
    let promiseData = Http.post(baseUrl + "/api/gemp/duty/plan/govern/week/search/v1", dto)
    return promiseUtils(promiseData)
  }

  // 政务值班 相应班次的可选人员列表
  public governPeople(dto: Object): Promise<any> {
    let promiseData = Http.post(baseUrl + "/api/gemp/duty/plan/govern/group/people/list/v1", dto)
    return promiseUtils(promiseData)
  }

  // 政务值班 保存
  public governUpdata(dto: Object): Promise<any> {
    let promiseData = Http.post(baseUrl + "/api/gemp/duty/plan/govern/add/v1", dto)
    return promiseUtils(promiseData)
  }

  // 替换班详情查看
  public swapInstead(dto: Object): Promise<any> {
    let promiseData = Http.post(baseUrl + "/api/gemp/duty/plan/people/swapinstead/search/detail/v1", dto)
    return promiseUtils(promiseData)
  }

  // 导出
  public governExport(dto: Object): Promise<any> {
    let promiseData = loadHttp.post(baseUrl + "/api/gemp/duty/plan/govern/export/v1", dto)
    return promiseData
  }
}