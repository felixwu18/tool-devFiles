import { promiseUtils } from '../../utils/promiseUtils'
import { orgUrl, dispatchs, baseUrl } from '../../config/base'
import http from '../../service/httpService'
import loadHttp from '../../service/blobHttpService'

export class ClickReportRequest {
    /**
     *  一键上报-获得登录用户行政区划树
     */
    public districtTree() {
        let promiseData = http.post(baseUrl + '/api/gemp/duty/info/daily/district/tree/v1', {})
        return promiseUtils(promiseData)
    }
    /**
     *  一键上报-获得登录用户权限
     */
    public getReportPromiss() {
        let promiseData = http.post(baseUrl + '/api/gemp/duty/info/quick/report/role/v1', {})
        return promiseUtils(promiseData)
    }
    /**
     *  一键上报-获得列表未读总数
     */
    public getAllUnread() {
        let promiseData = http.post(baseUrl + '/api/gemp/duty/info/quick/unread/vl', {})
        return promiseUtils(promiseData)
    }
    /**
     *  报平安-获得列表未读总素
     */
    public getUnread() {
        let promiseData = http.post(baseUrl + '/api/gemp/duty/info/daily/unread/vl', {})
        return promiseUtils(promiseData)
    }
    /**
     *  一键上报-list分页查询
     */
    public quickList(dto: Object) {
        let promiseData = http.post(baseUrl + "/api/gemp/duty/info/quick/list/v1", dto)
        return promiseUtils(promiseData)
    }
    /**
     *  一键上报-一键上报
     */
    public addQuickQuick(dto: Object) {
        let promiseData = http.post(baseUrl + "/api/gemp/duty/info/quick/report/v1", dto)
        return promiseUtils(promiseData)
    }
    /**
     *  一键上报-重报
     */
    public addReport(dto: Object) {
        let promiseData = http.post(baseUrl + "/api/gemp/duty/info/quick/restatement/v1", dto)
        return promiseUtils(promiseData)
    }

    /**
     *  一键上报-查看
     */
    public oneQuickOver(dto: Object) {
        let promiseData = http.post(baseUrl + "/api/gemp/duty/info/quick/show/v1", dto)
        return promiseUtils(promiseData)
    }
    /**
     *  一键上报-签收记录
     */
    // public oneQuickReceipte(dto: Object) {
    //     let promiseData = http.post(baseUrl + "/api/gemp/duty/info/quick/receipt/list/v1", dto)
    //     return promiseUtils(promiseData)
    // }
    /**
     *  一键上报-标记已读
     */
    public readInfoClean() {
        let promiseData = http.post(baseUrl + "/api/gemp/duty/info/quick/clean/vl", {})
        return promiseUtils(promiseData)
    }
    /**
     *  一键上报-签收记录
     */
    public getReBack(dto: Object) {
        let promiseData = http.post(baseUrl + "/api/gemp/duty/info/quick/back/v1", dto)
        return promiseUtils(promiseData)
    }
    /**
     *  一键上报-签收
     */
    public getSign(dto: Object) {
        let promiseData = http.post(baseUrl + "/api/gemp/duty/info/quick/in/v1", dto)
        return promiseUtils(promiseData)
    }
    /**
     *  一键上报-导出模板
     */
    public quickExport() {
        let promiseData = loadHttp.post(baseUrl + "/api/gemp/duty/info/quick/export/v1", {})
        return promiseData
    }

}
