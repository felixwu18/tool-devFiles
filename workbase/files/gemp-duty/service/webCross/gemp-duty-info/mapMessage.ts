import { promiseUtils } from '../../utils/promiseUtils'
import Http from '../../service/httpService'

export class MapMessage{
    public searchAddress(url:string):Promise<any> {
        let promiseData = Http.get(url)
        return promiseUtils(promiseData)
    }
}