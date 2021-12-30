import { promiseUtils } from '../../utils/promiseUtils'
import Http from '../../service/httpService'
import { orgUrl, baseUrl, faxUrl} from '../../config/base'
import loadHttp from '../../service/blobHttpService'

export class MailListRequest {
  // 已发传真列表
  public faxList(dto: Object) {
    let promiseData = Http.post(orgUrl+'/api/gemp/user/maillist/faxsend/list/v1', dto)
    return promiseUtils(promiseData)
  }
  // 已发传真删除
  public faxDelect(id: String) {
    let promiseData = Http.post(orgUrl+'/api/gemp/user/maillist/faxsend/delete/v1', { faxSendId: id })
    return promiseUtils(promiseData)
  }
  // 已收传真列表
  public faxReceviedList(dto: Object) {
    let promiseData = Http.post(orgUrl+'/api/gemp/user/maillist/faxreceipt/list/v1', dto)
    return promiseUtils(promiseData)
  }
  // 已收传真删除
  public faxReceviedDelect(id: String) {
    let promiseData = Http.post(orgUrl+'/api/gemp/user/maillist/faxreceipt/delete/v1', { faxSendId: id })
    return promiseUtils(promiseData)
  }


  // 收到的传真附件下载
  public recvFaxAttachmentdownload(fileName: string, attachName: string): Promise<any> {
    const promiseData = loadHttp.post(`${faxUrl}/fax/recvDownload?fileName=${fileName}&attachName=${attachName}`, {})
    return promiseData;
  }
  
  // 已接收传真
  public recvFaxList(dto: Object): Promise<any> {
    const promiseData = Http.post( `${faxUrl}/fax/recvFileShow`, dto);
    return promiseUtils(promiseData);
  }
}