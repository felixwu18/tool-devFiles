import { promiseUtils } from '../../utils/promiseUtils'
import Http from '../../service/httpService'
import { orgUrl,baseUrl,generalUrl} from '../../config/base'


export class SetondutyRequest {
  // 节假日 重要时段列表
  public holidayList(dto: Object): Promise<any> {
    let promiseData = Http.post(baseUrl+'/api/gemp/duty/plan/holiday/list/v1', dto)
    return promiseUtils(promiseData)
  }
  // 节假日重要时段删除
  public holidayDelete(dto: Object): Promise<any> {
    let promiseData = Http.post(baseUrl+'/api/gemp/duty/plan/holiday/delete/v1', dto)
    return promiseUtils(promiseData)
  }

  // 节假日重要时段新增
  public holidayAdd(dto: Object): Promise<any> {
    let promiseData = Http.post(baseUrl+'/api/gemp/duty/plan/holiday/add/v1', dto)
    return promiseUtils(promiseData)
  }

  // 分组人员列表
  public groupList(dto: String): Promise<any> {
    let promiseData = Http.post(baseUrl + "/api/gemp/duty/plan/group/people/list/v1", dto)
    return promiseUtils(promiseData)
  }

  // 机构下的人员列表
  public orgPeople(dto: Object): Promise<any> {
    let promiseData = Http.post(baseUrl + "/api/gemp/duty/plan/group/org/people/v1", dto)
    return promiseUtils(promiseData)
  }
  
  // 分组人员名单添加
  public groupAdd(dto: Object): Promise<any> {
    let promiseData = Http.post(baseUrl + "/api/gemp/duty/plan/group/people/add/v1", dto)
    return promiseUtils(promiseData)
  }

    // 分组人员名单删除
  public groupDelete(dto: Object): Promise < any > {
    let promiseData = Http.post(baseUrl + "/api/gemp/duty/plan/group/people/delete/v1", dto)
    return promiseUtils(promiseData)
  }

  // 节假日重要时段编辑
  public holidayUpdate(dto: Object): Promise<any> {
    let promiseData = Http.post(baseUrl + "/api/gemp/duty/plan/holiday/update/v1", dto)
    return promiseUtils(promiseData)
  }
}