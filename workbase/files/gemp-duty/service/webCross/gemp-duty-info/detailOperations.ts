import { promiseUtils } from '../../utils/promiseUtils'
import Http from '../../service/httpService'
import { orgUrl, baseUrl } from '../../config/base'
export class DetailOperationsRequest {
    public audit(dto: Object): Promise<any> {
        let promiseData = Http.post(baseUrl + '/api/gemp/duty/info/baseinfo/audit/v1', dto)
        return promiseUtils(promiseData)
    }

    public saveContinueMessge(dto: Object): Promise<any> {
        let promiseData = Http.post(baseUrl + '/api/gemp/duty/info/detail/continuemessge/save/v1', dto)
        return promiseUtils(promiseData)
    }

    public continueBaseInfo(dto: Object): Promise<any> {
        let promiseData = Http.post(baseUrl + '/api/gemp/duty/info/baseinfo/continue/v1', dto)
        return promiseUtils(promiseData)
    }
    public remove(dto: Object): Promise<any> {
        let promiseData = Http.post(baseUrl + '/api/gemp/duty/info/baseinfo/remove/v1', dto)
        return promiseUtils(promiseData)
    }

    public instruct(dto: Object): Promise<any> {
        let promiseData = Http.post(baseUrl + '/api/gemp/duty/info/baseinfo/instruct/v1', dto)
        return promiseUtils(promiseData)
    }

    public open(dto: Object): Promise<any> {
        let promiseData = Http.post(baseUrl + '/api/gemp/duty/info/baseinfo/open/v1', dto)
        return promiseUtils(promiseData)
    }

    public copy(dto: Object): Promise<any> {
        let promiseData = Http.post(baseUrl + '/api/gemp/duty/info/baseinfo/copy/v1', dto)
        return promiseUtils(promiseData)
    }


    public openCancel(dto: Object): Promise<any> {
        let promiseData = Http.post(baseUrl + '/api/gemp/duty/info/baseinfo/open/cancel/v1', dto)
        return promiseUtils(promiseData)
    }

    public opinion(dto: Object): Promise<any> {
        let promiseData = Http.post(baseUrl + '/api/gemp/duty/info/baseinfo/opinion/v1', dto)
        return promiseUtils(promiseData)
    }

    public leaderList(): Promise<any> {
        let promiseData = Http.post(baseUrl + '/api/gemp/duty/info/baseinfo/leader/list/v1', {})
        return promiseUtils(promiseData)
    }
    //信息管理-审核、拟办的人员信息
    public auditUserList(dto: Object): Promise<any> {
        // let promiseData = Http.post(baseUrl+'/api/gemp/duty/info/baseinfo/audit/user/list/v1',dto)
        let promiseData = Http.post(baseUrl + '/api/gemp/duty/info/baseinfo/chief/operator/user/list/v1', dto)
        return promiseUtils(promiseData)
    }

    //批阅领导人员信息
    public readerUserList(dto: Object): Promise<any> {
        let promiseData = Http.post(baseUrl + '/api/gemp/duty/info/baseinfo/audit/user/list/v1', dto)
        // let promiseData = Http.post(baseUrl+'/api/gemp/duty/info/baseinfo/chief/operator/user/list/v1',dto)
        return promiseUtils(promiseData)
    }
    public opinionUserList(): Promise<any> {
        let promiseData = Http.post(baseUrl + '/api/gemp/duty/info/baseinfo/opinion/user/list/v1', {})
        return promiseUtils(promiseData)
    }

    public back(dto: Object): Promise<any> {
        let promiseData = Http.post(baseUrl + '/api/gemp/duty/info/baseinfo/back/v1', dto)
        return promiseUtils(promiseData)
    }

    public top(dto: Object): Promise<any> {
        let promiseData = Http.post(baseUrl + '/api/gemp/duty/info/baseinfo/top/v1', dto)
        return promiseUtils(promiseData)
    }
    public delect(dto: Object): Promise<any> {
        let promiseData = Http.post(baseUrl + '/api/gemp/duty/info/baseinfo/draft/delete/v1', dto)
        return promiseUtils(promiseData)
    }

    public topCancel(dto: Object): Promise<any> {
        let promiseData = Http.post(baseUrl + '/api/gemp/duty/info/baseinfo/top/cancel/v1', dto)
        return promiseUtils(promiseData)
    }

    public append(dto: Object): Promise<any> {
        let promiseData = Http.post(baseUrl + '/api/gemp/duty/info/baseinfo/append/v1', dto)
        return promiseUtils(promiseData)

    }
    //信息管理应急预案列表页查询
    public detailsPlan(dto: Object): Promise<any> {
        let promiseData = Http.post(baseUrl + '/api/gemp/duty/info/event/plan/relate/v1', dto)
        return promiseUtils(promiseData)
    }

    // 相关公文列表页查询
    public relativeBrief(dto: object): Promise<any> {
        let promiseData = Http.post(baseUrl + '/api/gemp/duty/info/event/brief/relate/v1', dto)
        return promiseUtils(promiseData)
    }

    // 根据常用语ID查询该组常用语
    public getCommonLanguage(dto: object): Promise<any> {
        let promiseData = Http.post(orgUrl + '/api/gemp/group/comword/list/orgCode/v1', dto)
        return promiseUtils(promiseData)
    }

    // 根据用户组ID查询该用户组
    public getUserGroup(dto: object): Promise<any> {
        let promiseData = Http.post(orgUrl + '/api/gemp/group/user/list/orgCode/v1', dto)
        return promiseUtils(promiseData)
    }

    public pushStatus({id, pushStatus }): Promise<any> {
        let promiseData = Http.post(baseUrl + `/api/gemp/duty/info/baseinfo/update/pushStatus/v1?id=${id}&pushStatus=${pushStatus}`, {})
        return promiseUtils(promiseData)
    }
   /**
   * 值班总览--获取当日各区县市的值班信息
   */
   public getTodayAllDuty(): Promise<any> {
    let promiseData = Http.get(baseUrl + '/api/gemp/duty/plan/govern/all/today/v1');
    return promiseUtils(promiseData);
  }
    /**
    * 通过组织机构获取人员列表
    */
    public orgCodeByUserList(dto: Object) {
    let promiseData = Http.post(orgUrl + '/api/gemp/user/maillist/person/list/v1', dto)
    return promiseUtils(promiseData)
  }
}
