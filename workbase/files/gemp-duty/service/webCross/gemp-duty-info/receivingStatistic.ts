import { promiseUtils } from '../../utils/promiseUtils'
import Http from '../../service/httpService'
import {baseUrl} from '../../config/base'

export class ReceivingStatistic  {
    public getArea(dto:Object):Promise<any> {
        let promiseData = Http.post(baseUrl+'/api/gemp/duty/info/statistic/district/list/v1',dto)
        return promiseUtils(promiseData)
    }

    public getEventLevel(dto:Object):Promise<any> {
        let promiseData = Http.post(baseUrl+'/api/gemp/duty/info/event/level/list/v1',dto)
        return promiseUtils(promiseData)
    }

    public getEchartsData(dto:Object):Promise<any> {
        let promiseData = Http.post(baseUrl+'/api/gemp/duty/info/statistic/report/num/v1',dto)
        return promiseUtils(promiseData)

    }


}