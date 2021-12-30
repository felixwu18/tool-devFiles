import { promiseUtils } from '../../utils/promiseUtils'
import Http from '../../service/httpService'
import loadHttp from '../../service/blobHttpService'
import { orgUrl, dicUrl, downloadUrl ,adminUrl, uploadUrlFlie} from '../../config/base'

export class MainRequest {
    /**
     * 用户登录接口
     * @param dto
     */
    public login(dto: Object): Promise<any> {
        let promiseData = Http.post(orgUrl + '/api/gemp/duty/info/user/login', dto)
        return promiseUtils(promiseData)
    }

    /**
     * 基本信息编辑接口
     * @param dto
     */
    public editBaseInfo(dto: Object): Promise<any> {
        let promiseData = Http.post(orgUrl + '/api/user/manage/modify/v1', dto)
        return promiseUtils(promiseData)
    }

    /**
     * 获取用户基本信息
     * @param dto
     */
    public getBaseInfo(dto: Object): Promise<any> {
        let promiseData = Http.post(orgUrl + '/api/gemp/user/baseuser/id/v1', dto)
        return promiseUtils(promiseData)
    }

    /**
     * 修改用户信息
     * @param dto
     */
    public saveBaseInfo(dto: Object): Promise<any> {
        let promiseData = Http.post(orgUrl + '/api/user/manage/modify/v1', dto)
        return promiseUtils(promiseData)
    }

    /**
     * 根据id查询菜单url
     * @param dto
     */
    public menuSearch(dto: Object): Promise<any> {
        let promiseData = Http.post(orgUrl + '/api/gemp/user/menu/search/v1', dto)
        return promiseUtils(promiseData)
    }

    /**
     * 根据当前登录用户查询菜单树
     * @param userId
     */
    public menuTree(userId: String): Promise<any> {
        let promiseData = Http.post(orgUrl + '/api/gemp/user/menu/user/menu/list/v1', { userId: userId })
        return promiseUtils(promiseData)
    }


    /**
     * 获取密钥方法
     * @param param
     */
    public jumpSystem(param: Object): Promise<any> {
        let promiseData = Http.post(orgUrl + '/api/gemp/duty/info/user/encryptdate', param)
        return promiseUtils(promiseData)
    }
    /**
     * 通过id获取信息详情
     *  @param param
     */
    public getInfoDetailById(param: Object): Promise<any> {
        let promiseData = Http.post(dicUrl + '/api/dic/code/v1', param)
        return promiseUtils(promiseData)
    }
    /**
     * 下载专用浏览器
     */
    public filedownload(param: Object): Promise<any> {
        let promiseData = loadHttp.post(downloadUrl,param)
        return promiseData
    }
    /**
     * 发送短信接口
     */
    public sendmessage(param: Object): Promise<any> {
        let promiseData = Http.post(orgUrl + '/api/gemp/duty/info/user/sms/send/v1', param)
        return promiseUtils(promiseData)
    }
    /**
     * 验证验证码接口
     */
    public codeMatching(param: Object): Promise<any> {
        let promiseData = Http.post(orgUrl + '/api/gemp/duty/info/user/sms/login', param)
        return promiseUtils(promiseData)
    }
    /**
     * 修改密码
     */
    public editPassword(param: Object): Promise<any> {
      let promiseData = Http.post(orgUrl + '/api/gemp/duty/info/user/password/update', param)
        return promiseUtils(promiseData)
    }
    /**
     * 获取登录用户的机构数
     */
    public orgTree():Promise<any> {
        let promiseData = Http.post(orgUrl + '/api/gemp/user/org/trees/v1',{mask:true})
        return promiseUtils(promiseData)
    }

    /**
     * 获取用户主题
     * @param userId
     */
    public themePicker(userId:string):Promise<any> {
        let promiseData = Http.post(`${adminUrl}/api/gemp/admin/theme/user/search/v1`,{userId:userId,mask:true})
        return promiseUtils(promiseData)
    }

    /**
     * 获取默认主题
     * @param userId
     */
    public defaultTheme():Promise<any> {
        let promiseData = Http.post(`${adminUrl}/api/gemp/admin/theme/user/default/v1`,{})
        return promiseUtils(promiseData)
    }

    /**
     * 信息简报下载文件功能
     * @param param
     */
    public breifDownload(param):Promise<any> {
        let promiseData = loadHttp.post(`${uploadUrlFlie}/api/attachment/download/info/v1`,param)
        return promiseData
    }
}