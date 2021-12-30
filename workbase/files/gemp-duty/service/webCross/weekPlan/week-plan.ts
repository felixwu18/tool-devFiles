import { promiseUtils } from '../../utils/promiseUtils'
import Http from '../../service/httpService'
// import * as config from '../../config/base' 
import { orgUrl,baseUrl,generalUrl} from '../../config/base'

export class WeekPlanRequest {
    // 删除
    public deleteContent(dto:object){
        let promiseData = Http.post(generalUrl + '/api/gemp/general/workContent/delete/v1', dto)
        return promiseUtils(promiseData)
    }
    // 保存修改
    public saveContent(dto:object) {
        let promiseData = Http.post(generalUrl + '/api/gemp/general/workContent/save/v1', dto)
        return promiseUtils(promiseData)
    }
    // 周工作安排保存
    public save(dto:object) {
        let promiseData = Http.post(generalUrl + '/api/gemp/general/work/save/v1', dto)
        return promiseUtils(promiseData)
    }
    // 查询当前机构下所有领导
    public searchLeader(dto:object) {
        let promiseData = Http.post(orgUrl + '/api/gemp/user/baseuser/list/leader/v1', dto)
        return promiseUtils(promiseData)
    }
    // 条件搜索周工作安排
    public searchWorkList(dto:object) {
        let promiseData = Http.post(generalUrl + '/api/gemp/general/work/list/v1', dto)
        return promiseUtils(promiseData) 
    }
    // 新增修改工作安排
    private saveWork(dto:object) {
        let promiseData = Http.post(generalUrl + '/api/gemp/general/work/content/save/v1', dto)
        return promiseUtils(promiseData) 
    }
    // 删除工作安排
    private deleteWork(dto:object) {
        let promiseData = Http.post(generalUrl + '/api/gemp/general/work/content/delete/v1', dto)
        return promiseUtils(promiseData) 
    }
    // 查询单条工作安排记录
    private singleCheck(id:string) {
        let promiseData = Http.post(generalUrl + '/api/gemp/general/work/get/v1', {id:id})
        return promiseUtils(promiseData) 
    }
    // 更新单条工作安排记录
    private updateWeekRecord(data:object){
        let promiseData = Http.post(generalUrl + '/api/gemp/general/work/update/v1', data)
        return promiseUtils(promiseData) 
    }
}