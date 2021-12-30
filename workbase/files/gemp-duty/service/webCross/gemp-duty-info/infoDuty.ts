import { promiseUtils } from '../../utils/promiseUtils'
import Http from '../../service/httpService'
import {baseUrl, orgUrl} from '../../config/base'
 
export class InfoDutyRequest  {
    public transactAdd(dto:Object):Promise<any> {
        let promiseData = Http.post(baseUrl+'/api/gemp/duty/info/baseinfo/transact/add/v1',dto)
        return promiseUtils(promiseData)
    }
    public transactAddlist(dto:Object):Promise<any> {
        let promiseData = Http.post(baseUrl+'/api/gemp/duty/info/baseinfo/transact/list/v1',dto)
        return promiseUtils(promiseData)
    }
    public findList(dto:Object):Promise<any> {
        let promiseData = Http.post(baseUrl+'/api/gemp/duty/info/transact/list/v1',dto)
        return promiseUtils(promiseData)
    }
    public findReviceOrg():Promise<any> {
        let promiseData = Http.post(baseUrl+'/api/gemp/duty/info/transact/org/list/v1',{})
        return promiseUtils(promiseData)
    }
    //获取所有用户
    public findReviceUser():Promise<any> {
        let promiseData = Http.post(baseUrl+'/api/gemp/duty/info/transact/user/list/v1',{})
        return promiseUtils(promiseData)
    }
    //获取当前租户ID下所有用户
    public findReviceUserByOrg():Promise<any> {
        let promiseData = Http.post(baseUrl+'/api/gemp/duty/info/transact/user/org/list/v1',{})
        return promiseUtils(promiseData)
    }

    public findHaveRed():Promise<any> {
        let promiseData = Http.post(baseUrl+'/api/gemp/duty/info/transact/clean/vl',{})
        return promiseUtils(promiseData)
    }

    public transactProgressList(dto:Object):Promise<any> {
        let promiseData = Http.post(baseUrl+'/api/gemp/duty/info/transact/progress/list/v1',dto)
        return promiseUtils(promiseData)
    }
    //查询转办督办签收记录
    public transactDetailReceipt(disposeId:string):Promise<any> {
        // let promiseData = Http.post(baseUrl+`/api/gemp/duty/info/transact/${disposeId}/receipt/list/v1`,{disposeId: disposeId})
        let promiseData = Http.post(baseUrl+`/api/gemp/duty/info/transact/receipt/list/v1`,{disposeId: disposeId})
        return promiseUtils(promiseData)
    }
    //根据事件处置id获取处置详情,其中extendedData记录信息基础情况,remark记录批示信息
    public transactDetail(dto:Object):Promise<any> {
        let promiseData = Http.post(baseUrl+'/api/gemp/duty/info/transact/id/v1',dto)
        return promiseUtils(promiseData)
    }

    //查询转办督办回复情况
    // public transactDetailReply(disposeId:string):Promise<any> {
    //     let promiseData = Http.post(baseUrl+`/api/gemp/duty/info/transact/${disposeId}/reply/list/v1`,{disposeId: disposeId})
    //     return promiseUtils(promiseData)
    // }

    public transactDetailReply(disposeId:string):Promise<any> {
        let promiseData = Http.post(baseUrl+`/api/gemp/duty/info/transact/reply/list/v1`,{disposeId: disposeId})
        return promiseUtils(promiseData)
    }
   
    // by 刘文磊紧急程度
  public urgencyLevel(): Promise<any> {
    let promiseData = Http.post(baseUrl+"/api/gemp/duty/info/transact/urgency/level/v1", {})
    return promiseUtils(promiseData)
  }

  // by 刘文磊 根据事件类型获取动态模板
  public getDynamicTemp(id: string): Promise<any> {
    let promiseData = Http.post(baseUrl+'/api/gemp/duty/info/analysis/get/dynamic/template/v1', { eventType: id })
    return promiseUtils(promiseData)
  }
  
    // 获取所属机构对应用户
    public getTransactGetusers(orgCodes: string) {
        let promiseData = Http.post(orgUrl+'/api/gemp/user/baseuser/transact/org/getusers/v1', { orgCodes })
        return promiseUtils(promiseData)
    }

    // 领导批阅--抄清
    public getCleanUpData(dto:Object) {
        let promiseData = Http.post(baseUrl+'/api/gemp/duty/info/baseinfo/instructions/clean/v1', dto)
        return promiseUtils(promiseData)
    }
}