import { promiseUtils } from '../../utils/promiseUtils'
import http from '../../service/httpService'
import loadHttp from '../../service/blobHttpService'
import { accidentUrl} from '../../config/base'
export class accidentRequest {
	/**
	 * 事故调查-获取事件级别
	 */
    public getEventLevel(): Promise<any> {
        let promiseData = http.post(accidentUrl+'/api/gemp/event/survey/eventsurvey/acclevel/list/v1', {})
        return promiseUtils(promiseData)
    }

    /*
	 * 获取事件类型
	 */
    public getEventType(): Promise<any> {
        let promiseData = http.post(accidentUrl + '/api/gemp/event/survey/eventsurvey/acctype/list/v1', {})
        return promiseUtils(promiseData)
    }
    /*
	 * 获取事故列表
	 */
    public getList(dto: Object): Promise<any> {
        let promiseData = http.post(accidentUrl+'/api/gemp/event/survey/eventsurvey/list/v1', dto)
        return promiseUtils(promiseData)
    }
    /*
	 * 新增事故调查信息
	 */
    public accidentAdd(dto: Object): Promise<any> {
        let promiseData = http.post(accidentUrl+'/api/gemp/event/survey/eventsurvey/add/v1', dto)
        return promiseUtils(promiseData)
    }
    /*
     * 编辑事故调查信息
     */
    public accidentEdit(dto: Object): Promise<any> {
        let promiseData = http.post(accidentUrl+'/api/gemp/event/survey/eventsurvey/modify/v1', dto)
        return promiseUtils(promiseData)
    }
    /*
	 * 删除事故调查信息
	 */
    public delete(dto: Object): Promise<any> {
        let promiseData = http.post(accidentUrl+'/api/gemp/event/survey/eventsurvey/delete/v1', dto)
        return promiseUtils(promiseData)
    }
    /*
	 * 导出事故调查信息
	 */
    public exportAccident(dto: Object): Promise<any> {
        let promiseData = loadHttp.post(accidentUrl+'/api/gemp/event/survey/eventsurvey/export/v1', {})
        return promiseData
    }
    /*
	 * 根据Id获取事故调查信息
	 */
    public getDetailById(accSurveyId:string): Promise<any> {
        let promiseData = http.post(accidentUrl+'/api/gemp/event/survey/eventsurvey/findOne/v1', {accSurveyId:accSurveyId})
        return promiseUtils(promiseData)
    }
}
