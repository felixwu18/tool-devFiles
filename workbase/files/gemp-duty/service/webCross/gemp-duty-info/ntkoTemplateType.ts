import { promiseUtils } from '../../utils/promiseUtils'
import http from '../../service/httpService'
import { orgUrl,baseUrl,generalUrl} from '../../config/base'

// 存放获取ntko模板接口地址，方便配合组件iams-ntkotool，获取新增对应类型模板地址
export class NotkTemplateTypeRequest {
  // http://172.18.7.91:8868/gemp-duty-lix/api/gemp/duty/brief/template/type/v1
  /**
	 * 信息简报-专报/快报/报告简报类型获取模板
	 */
     public templateType(dto:Object):Promise<any> {
      //  debugger
        let promiseData = http.post(baseUrl+'/api/gemp/duty/brief/template/type/v1',dto)
        return promiseUtils(promiseData)
    }

}
