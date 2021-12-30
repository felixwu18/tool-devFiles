import { promiseUtils } from '../../utils/promiseUtils'
import { orgUrl ,dispatchs} from '../../config/base'
import http from '../../service/httpService'
import loadHttp from '../../service/blobHttpService'

export class AddressBookRequest {
    /**
     *  快速检索通讯录成员
     */
    public maillistPersion(dto) {
        let promiseData = http.post(orgUrl+'/api/gemp/user/maillist/person/findAll/v1', dto)
        return promiseUtils(promiseData)
    }
    /**
     *  申请电话会议的人员
     */ 
    public telrecordPeople(dto:Object) {
        let promiseData = http.post(dispatchs+"/api/gemp/dispatcher/telrecord/add/v1",dto)
        return promiseUtils(promiseData)
    }
    // 挂断电话
    public callOver(dto:Object) {
        let promiseData = http.post(dispatchs+"/api/gemp/dispatcher/telrecord/call/over/v1",dto)
        return promiseUtils(promiseData)
    }
   
    //单人拨号挂断
    public onecallOver(dto:Object) {
        let promiseData = http.post(dispatchs+"/api/gemp/dispatcher/telrecord/call/onedown/v1",dto)
        return promiseUtils(promiseData)
    }

}
