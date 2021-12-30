import { promiseUtils } from '../../utils/promiseUtils';
import http from '../../service/httpService';
import { orgUrl,baseUrl,generalUrl} from '../../config/base'

export class DocumentHandleRequest {
	/**
	 * 公文办理-列表
	 *
	 */
    public documentHandleList(dto: Object): Promise<any> {
        let promiseData = http.post(baseUrl + '/api/gemp/duty/plan/document/list/v1', dto);
        return promiseUtils(promiseData);
    }
    /**
     * 公文办理-下发
     * 一级列表
     *
     */
    public documentHairDown(dto: Object): Promise<any> {
        let promiseData = http.post(baseUrl +'/api/gemp/duty/plan/document/list/view/v1', dto);
        return promiseUtils(promiseData);
    }
    /**
     * 公文办理-下发
     * 二级列表
     *
     */
    public documentHairDownChildren(dto: Object): Promise<any> {
        let promiseData = http.post(baseUrl +'/api/gemp/duty/plan/document/list/detaillinkid/v1', dto);
        return promiseUtils(promiseData);
    }

    public dealEvent(dto: Object): Promise<any> {
        let promiseData = http.post(baseUrl + '/api/gemp/duty/plan/document/doucmentstatus/modify/v1', dto);
        return promiseUtils(promiseData);
    }

    // 撤回公文
    public getRecall(dto: Object): Promise<any> {
        let promiseData = http.post(baseUrl + '/api/gemp/duty/plan/document/doucment/withdraw/v1', dto);
        return promiseUtils(promiseData);
    }

	/**
	 * 公文办理-上报值班信息
	 */
    public dutyInformationAdd(dto: Object): Promise<any> {
        let promiseData = http.post(baseUrl + '/api/gemp/duty/plan/document/dutyuplog/add/v1', dto);
        return promiseUtils(promiseData);
    }

	/**
	 * 公文办理-上报外出报备
	 */
    public outgoingReportAdd(dto: Object): Promise<any> {
        let promiseData = http.post(baseUrl + '/api/gemp/duty/plan/document/dutyoutup/add/v1', dto);
        return promiseUtils(promiseData);
    }

	/**
	 * 公文办理-上报请假报备
	 */
    public leaveReportAdd(dto: Object): Promise<any> {
        let promiseData = http.post(baseUrl + '/api/gemp/duty/plan/document/dutyleave/add/v1', dto);
        return promiseUtils(promiseData);
    }

    /**
	 * 公文办理-上报下发公文
	 */
    public receipIssueAdd(dto: Object): Promise<any> {
        let promiseData = http.post(baseUrl + '/api/gemp/duty/plan/document/dutydown/add/v1', dto);
        return promiseUtils(promiseData);
    }

    /**
	 * 公文办理-上报批示下发
	 */
    public receipInstructsIssueAdd(dto: Object): Promise<any> {
        let promiseData = http.post(baseUrl + '/api/gemp/duty/plan/document/dutydownreview/add/v1', dto);
        return promiseUtils(promiseData);
    }
    /**
	 * 公文办理-获取详情
     *
	 */
    public getdutyInformationDetail(dto: Object): Promise<any> {
        let promiseData = http.post(baseUrl + '/api/gemp/duty/plan/document/doucmentinfo/detail/v1',dto);
        return promiseUtils(promiseData);
    }
    /**
	 * 公文办理-上报编辑值班信息
	 */
    public dutyInformationEdit(dto: Object): Promise<any> {
        let promiseData = http.post(baseUrl + '/api/gemp/duty/plan/document/dutyuplog/modify/v1', dto);
        return promiseUtils(promiseData);
    }

	/**
	 * 公文办理-上报编辑外出报备
	 */
    public outgoingReportEdit(dto: Object): Promise<any> {
        let promiseData = http.post(baseUrl + '/api/gemp/duty/plan/document/dutyoutup/modify/v1', dto);
        return promiseUtils(promiseData);
    }

	/**
	 * 公文办理-上报编辑请假报备
	 */
    public leaveReportEdit(dto: Object): Promise<any> {
        let promiseData = http.post(baseUrl + '/api/gemp/duty/plan/document/dutyleave/modify/v1', dto);
        return promiseUtils(promiseData);
    }

    /**
	 * 公文办理-上报编辑下发公文
	 */
    public receipIssueEdit(dto: Object): Promise<any> {
        let promiseData = http.post(baseUrl + '/api/gemp/duty/plan/document/dutydown/modify/v1', dto);
        return promiseUtils(promiseData);
    }

    /**
	 * 公文办理-上报编辑批示下发
	 */
    public receipInstructsIssueEdit(dto: Object): Promise<any> {
        let promiseData = http.post(baseUrl + '/api/gemp/duty/plan/document/dutydownreview/modify/v1', dto);
        return promiseUtils(promiseData);
    }
    /**
    * 公文办理-获取上级组织机构
    *
    * 修改上级接口
    */
    public getdutyInfo(): Promise<any> {
        let promiseData = http.post(orgUrl+'/api/gemp/user/org/info/report/org/v1', {});
        // let promiseData = http.post(orgUrl+'/api/gemp/user/org/getparentorg/v1', {});

        return promiseUtils(promiseData);
    }
    /**
    * 公文办理-获取接收人
    *
    */
    public getdutyPeople(dto:String): Promise<any> {
        let promiseData = http.post(orgUrl+'/api/gemp/user/baseuser/org/v1', dto);
        return promiseUtils(promiseData);
    }
    /**
    * 公文办理-获取领导详细信息
    *
    */
    public getdutyPeopleDetail(personId : string): Promise<any> {
        let promiseData = http.post(orgUrl+'/api/gemp/user/maillist/person/findOne/v1', { personId });
        return promiseUtils(promiseData);
    }

    /**
    * 公文办理-获取该机构下所有用户信息
    *
    */
   public getdutyPeopleList(orgCodes  : string): Promise<any> {
    let promiseData = http.post(orgUrl+'/api/gemp/user/baseuser/org/getusers/v1', { orgCodes });
    return promiseUtils(promiseData);
   }
   /**
    * 公文办理-获取下级阻止机构
    */
   public getsuborg(orgCodes  : string) :Promise<any> {
    let promiseData = http.post(orgUrl+'/api/gemp/user/org/getsuborg/v1', { orgCodes });
    return promiseUtils(promiseData);
   }
   /**
    * 是否最低组织机构
    */
   public getpsbtn(orgCodes  : string) :Promise<any> {
    let promiseData = http.post(orgUrl+'/api/user/lower/v1',  {});
    return promiseUtils(promiseData);
   }

    /**
    * 公文办理-获取公文下发接收单位的机构
    */
   public getGroupOrg(orgCodes  : Object) :Promise<any> {
    let promiseData = http.post(orgUrl+'/api/gemp/user/maillist/group/tree/org/v1', orgCodes);
    return promiseUtils(promiseData);
   }

   /**
    * 公文办理-获取公文列表未读总数
    */
   public getGroupUnread() :Promise<any> {
    let promiseData = http.post(baseUrl+'/api/gemp/duty/plan/document/unread/vl', {});
    return promiseUtils(promiseData);
   }
   /**
    * 公文办理-公文一键已读
    */
   public getSureReport() :Promise<any> {
    let promiseData = http.post(baseUrl+'/api/gemp/duty/plan/document/clean/vl', {});
    return promiseUtils(promiseData);
   }
}
