import { promiseUtils } from '../../utils/promiseUtils'
import Http from '../../service/httpService'
import { orgUrl, baseUrl } from '../../config/base'
import searchData from '../../../assets/libs/searchData'

export class TreeNode {
    public getOrgTree() {
        let promiseData = Http.post(orgUrl + '/api/gemp/user/org/trees/v1', {})
        return promiseUtils(promiseData)
    }
    public getFordutyTree() {
        let promiseData = Http.post(orgUrl + '/api/gemp/user/org/trees/tenantId/forduty/v1', {mask:true})
        return promiseUtils(promiseData)
    }
    public getInfoTypeTree(): Promise<any> {
        let promiseData = Http.post(baseUrl + '/api/gemp/duty/info/event/type/tree/v1', {})
        return promiseUtils(promiseData)
    }
    public getOrgCurrentTree() {
        let promiseData = Http.post(orgUrl + '/api/gemp/user/org/current/user/tree/v1', {})
        return promiseUtils(promiseData)
    }

    public getDistrictTree() {
        let promiseData = Http.post(baseUrl + '/api/gemp/duty/info/month/district/tree/v1', {})
        return promiseUtils(promiseData)
    }
    public getTreeByTenantId() {
        let promiseData = Http.post(orgUrl + '/api/gemp/user/org/trees/tenantId/v1', {})
        return promiseUtils(promiseData)
    }
    public getAllTreeByTenantId() {
        let promiseData = Http.post(orgUrl + '/api/gemp/user/org/trees/tenantId/forduty/v1', {mask:true})
        return promiseUtils(promiseData)
    }

    //危险等级
    public ResourcelevelTree(): Promise<any> {
        let promiseData = Http.post(orgUrl + '/api/gemp/resource/dict/danger/level/v1', {})
        return promiseUtils(promiseData)
    }
    /**
   * 获取省级到本机构之间的数据
   * @param dto
   */
    public provincetoorg(code: String) {
        let promiseData = Http.post(orgUrl + '/api/gemp/user/org/provincetoorg/v1', { code: code })
        return promiseUtils(promiseData)
    }

    /**
     * 根据组织机构编码查询当前组织机构的子节点
     */
    public quickSearch(dto) {
        let promiseData = Http.post(orgUrl + '/api/gemp/user/org/quicksearch/byorgname/v1', dto)
        return promiseUtils(promiseData)
    }

    /**
    * 根据组织机构编码查询当前组织机构的子节点
    */
    public treeByCode(code?) {
        let orgCode = !!code ? code : searchData.getter({ name: 'role' }).orgCode
        let promiseData = Http.post(orgUrl + '/api/gemp/user/org/treelist/byorgcode/v1', { orgCode: orgCode })
        return promiseUtils(promiseData)
    }

    // 得到应急体系的组织机构
    public getMultipleOrgTree() {
        let promiseData = Http.post(orgUrl + '/api/gemp/user/org/trees/tenantId/forduty/v1', {mask:true})
        return promiseUtils(promiseData)
    }

    public getDailyOrgTree() {
        let promiseData = Http.post(baseUrl + '/api/gemp/duty/info/daily/district/tree/v1', {})
        return promiseUtils(promiseData)
    }

    // 获取业务量统计组织机构数
    public getBussinessTree(dto: Object): Promise<any> {
        let promiseData = Http.post(baseUrl + '/api/gemp/duty/info/traffic/statistics/district/tree/v1', dto);
        return promiseUtils(promiseData);
    }

    // 获取统计报表组织机构数
    public getStatementTree(dto: Object): Promise<any> {
        let promiseData = Http.post(baseUrl + '/api/gemp/duty/info/traffic/statistics/district/tree/v1', dto);
        return promiseUtils(promiseData);
    }


    // 统计综述  - 获得某个省行政区划 入参格式:tenantId
    public getStatisticalDistrictTree(dto: Object): Promise<any> {
        let promiseData = Http.post(baseUrl + '/api/gemp/duty/statistical/review/district/tree/v1', dto);
        return promiseUtils(promiseData);
    }

}