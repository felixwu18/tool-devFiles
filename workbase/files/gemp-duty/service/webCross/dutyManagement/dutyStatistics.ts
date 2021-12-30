import { promiseUtils } from '../../utils/promiseUtils';
import http from '../../service/httpService';
import loadHttp from '../../service/blobHttpService';
import { orgUrl,baseUrl,generalUrl} from '../../config/base'


export class DutyStatisticsRequest {
	/**
	 * 值班要情-添加值班要情内容
	 *
	 */
    /**
	 * 值班要情-导出值班统计
	 *
	 */
	public dutyStatisticExport(dto: Object): Promise<any> {
		let promiseData = loadHttp.post(baseUrl + '/api/gemp/duty/plan/statistics/export/v1', dto);
		return promiseData;
    }
    /**
	 * 值班要情-获取值班统计列表
	 *
	 */
    public dutyStatisticList(dto: Object): Promise<any> {
		let promiseData = http.post(baseUrl + '/api/gemp/duty/plan/statistics/list/v1', dto);
		return promiseUtils(promiseData);
    }
}