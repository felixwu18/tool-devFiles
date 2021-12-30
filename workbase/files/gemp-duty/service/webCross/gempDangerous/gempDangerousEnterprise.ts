import { promiseUtils } from '../../utils/promiseUtils'
import Http from '../../service/httpService'
import { dangerousUrl,dataUrl } from '../../config/base'

export class GempDangerousEnterprise {
    // 查询列表
    public gempDangerousEnterpriseList(dto: object): Promise<any> {
        let promiseData = Http.post(dataUrl + '/api/gemp/resource/enterprise/list/v1', dto)
        return promiseUtils(promiseData)
    }
}
