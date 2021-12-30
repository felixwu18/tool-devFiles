import { promiseUtils } from '../../utils/promiseUtils'
import Http from '../../service/httpService'
import { orgUrl,baseUrl} from '../../config/base'

export class PowerNodeRequest {

  //菜单权限管理-获取登陆用户下的菜单列表
  public menuPowerManagement(dto:Object): Promise<any> {
    let promiseData = Http.post(orgUrl+'/api/gemp/user/menu/user/menu/list/v1', dto)
    return promiseUtils(promiseData)
  }

  //操作按钮权限管理-根据用户Id获取的所拥有权限
  public btnPowerManagement(dto:Object): Promise<any> {
    let promiseData = Http.post(orgUrl+'/api/gemp/user/priv/search/userid/v1', dto)
    return promiseUtils(promiseData)
  }

}