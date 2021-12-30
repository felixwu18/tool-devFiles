import { promiseUtils } from '../../utils/promiseUtils'
import Http from '../../service/httpService'
import {baseUrl,orgUrl} from '../../config/base'

export class SelectNode {
    /**
     * 下发公文-- 获取批示事件列表
     */
    public getUptypeList(){
        let receiveUnitCode = JSON.parse(sessionStorage.getItem("role")).orgCode
        let promiseData = Http.post(baseUrl+'/api/gemp/duty/plan/document/doucment/uptype/list/v1',{receiveUnitCode:receiveUnitCode})
        return promiseUtils(promiseData)
    }
    /**
     * 通过orgCode获取当前机构人员
     */
    public getOrgPersion() {
        let receiveUnitCode = JSON.parse(sessionStorage.getItem("role")).orgCode
        let data = {
            keyWord: "",
            nowPage: 1,
            orgCode: receiveUnitCode,
            pageSize: 10
          }
        let promiseData = Http.post(orgUrl+'/api/gemp/user/maillist/person/findAll/v1',data)
        return promiseUtils(promiseData)
    }
}