import { promiseUtils } from '../../utils/promiseUtils'
import Http from '../../service/httpService'
import { orgUrl,baseUrl,generalUrl} from '../../config/base'


export class WorkforceManagementRequest {
    /**
	 * 换班替班-换班替班列表页
	 */
    public getSubstituteList(dto:object): Promise<any> {
      let promiseData = Http.post(baseUrl +'/api/gemp/duty/plan/people/swapinstead/search/list/v1', dto)
        return promiseUtils(promiseData)
    }
    /**
	 * 换班替班-换班替班新增
	 */
    public SubstituteAdd(dto:object): Promise<any> {
      let promiseData = Http.post(baseUrl +'/api/gemp/duty/plan/people/swapinstead/add/v1', dto)
        return promiseUtils(promiseData)
    }
    /**
	 * 换班替班-换班替班编辑
	 */
    public SubstituteEdit(dto:object): Promise<any> {
      let promiseData = Http.post(baseUrl +'/api/gemp/duty/plan/people/swapinstead/modify/v1', dto)
        return promiseUtils(promiseData)
    }
    /**
	 * 换班替班-换班替班删除
	 */
    public Substitutedelete(dto:object): Promise<any> {
      let promiseData = Http.post(baseUrl +'/api/gemp/duty/plan/people/swapinstead/delete/v1', dto)
        return promiseUtils(promiseData)
    }
    /**
	 * 换班替班-换班替班人员列表
	 */
    public getSubstitutePeople(dto:object): Promise<any> {
        let promiseData = Http.post(baseUrl+'/api/gemp/duty/plan/group/org/people/v1', dto)
        return promiseUtils(promiseData)
    }
}
