import { promiseUtils } from '../../utils/promiseUtils'
import { orgUrl, dispatchs, baseUrl } from '../../config/base'
import http from '../../service/httpService'
import loadHttp from '../../service/blobHttpService'

export class SpecialCampaignRequest {
    /**
     *  专项活动列表
     */
    public getSpecialCampaignList(dto: Object) {
        let promiseData = http.post(baseUrl + "/api/gemp/duty/plan/specialCampaign/list/page/v1", dto)
        return promiseUtils(promiseData)
    }
    /**
     *  专项活动列表不分页
     */
    public allSpecialCampaignList() {
        let promiseData = http.post(baseUrl + "/api/gemp/duty/plan/specialCampaign/list/v1", {})
        return promiseUtils(promiseData)
    }
    /**
     *  新增专项活动
     */
    public addSpecialCampaign(dto: Object) {
        let promiseData = http.post(baseUrl + "/api/gemp/duty/plan/specialCampaign/saveCampaign/v1", dto)
        return promiseUtils(promiseData)
    }
    /**
     *  修改专项活动
     */
    public modifySpecialCampaign(dto: Object) {
        let promiseData = http.post(baseUrl + "/api/gemp/duty/plan/specialCampaign/updateCampaign/v1", dto)
        return promiseUtils(promiseData)
    }
    /**
     *  获取最新专项
     */
    public getNewSpecialCampaign() {
        let promiseData = http.post(baseUrl + "/api/gemp/duty/plan/specialCampaign/firstByUpdateTime/v1", {})
        return promiseUtils(promiseData)
    }
    /**
     *  活动日程列表
     */
    public getCampaignList(dto: Object) {
        let promiseData = http.post(baseUrl + "/api/gemp/duty/plan/special/campaign/calendar/search/list/v1", dto)
        return promiseUtils(promiseData)
    }
    /**
     *  活动日程详情
     */
    public getCampaignDetail(dto: Object) {
        let promiseData = http.post(baseUrl + "/api/gemp/duty/plan/special/campaign/calendar/search/detail/v1", dto)
        return promiseUtils(promiseData)
    }
    /**
     *  添加活动日程
     */
    public addCampaignData(dto: Object) {
        let promiseData = http.post(baseUrl + "/api/gemp/duty/plan/special/campaign/calendar/add/v1", dto)
        return promiseUtils(promiseData)
    }
    /**
     *  修改活动日程
     */
    public modifyCampaignData(dto: Object) {
        let promiseData = http.post(baseUrl + "/api/gemp/duty/plan/special/campaign/calendar/modify/v1", dto)
        return promiseUtils(promiseData)
    }
    /**
     *  组织机构树
     */
    public getOrgTrees() {
        let promiseData = http.post(orgUrl + "/api/gemp/user/org/trees/v1", {})
        return promiseUtils(promiseData)
    }
    /**
     *  行政区划
     */
    public getDistrictTrees() {
        let promiseData = http.post(baseUrl + "/api/gemp/duty/info/month/district/tree/v1", {})
        return promiseUtils(promiseData)
    }
    /**
     *  行政区划
     */
    public getAutoComplete(dto: Object) {
        let promiseData = http.post(baseUrl + "/api/gemp/duty/plan/special/campaign/calendar/search/autoComplete/v1", dto)
        return promiseUtils(promiseData)
    }
    /**
     * 人员分组和机构分组列表展示
     * @param dto
     */
    private maillistPersonList(dto: object): Promise<any> {
        let promiseData = http.post(orgUrl + '/api/gemp/user/maillist/person/list/v1', dto)
        return promiseUtils(promiseData)
    }
    // 预览已报信息呈报上报值班信息文档
    public getReViewDoc(dto: Object) {
        let promiseData = http.post(baseUrl + '/api/gemp/duty/plan/special/campaign/calendar/view/template/v1', dto);
        return promiseUtils(promiseData);
    }
}
