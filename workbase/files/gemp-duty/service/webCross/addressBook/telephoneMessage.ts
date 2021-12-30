import { promiseUtils } from '../../utils/promiseUtils'
import http from '../../service/httpService'
import loadHttp from '../../service/blobHttpService'
import { orgUrl,baseUrl,generalUrl} from '../../config/base'
export class TelephoneMessage {
	/**
	 * 电话记录列表
	 */

    public telephoneMessageInfo(dto:Object):Promise<any> {
        let promiseData = http.post(orgUrl+'/api/gemp/user/maillist/telrecord/list/v1',dto)
        return promiseUtils(promiseData)
    }


    /**
	 * 删除电话记录列表
	 */
    public telephoneMessageDelete(telRecordId:Object):Promise<any> {
        let promiseData = http.post(orgUrl+'/api/gemp/user/maillist/telrecord/delete/v1',{telRecordId:telRecordId})
        return promiseUtils(promiseData)
    }

    /**
	 * 获取录音文件列表
	 */
     public getWavList(dto: any):Promise<any> {
        let promiseData = http.get(`/gapi/gemp-telephone/api/gemp/telephone/fileController/getLocalServerLyFileList?districtCode=510100&fileName=${dto.keyWord}&nowPage=${dto.nowPage}&pageSize=${dto.pageSize}`)
        return promiseUtils(promiseData)
    }
}
