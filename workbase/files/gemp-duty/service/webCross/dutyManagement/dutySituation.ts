import { promiseUtils } from '../../utils/promiseUtils';
import http from '../../service/httpService';
import { orgUrl,baseUrl,generalUrl} from '../../config/base'


export class DutySituationRequest {
	/**
	 * 值班要情-添加值班要情内容
	 *
	 */
	public dutySituationAdd(dto: Object): Promise<any> {
		let promiseData = http.post(baseUrl + '/api/gemp/duty/plan/importanting/add/v1', dto);
		return promiseUtils(promiseData);
	}

	/**
	 * dutySituationQuery
	 * 值班要情-查询值班要情内容
	 */
	public dutySituationQuery(dto: Object): Promise<any> {
		let promiseData = http.post(baseUrl + '/api/gemp/duty/plan/importanting/list/v1', dto);
		return promiseUtils(promiseData);
	}

	/**
	 * dutySituationDel
	 * 值班要情-删除
	 */
	public dutySituationDel(dto: Object): Promise<any> {
		let promiseData = http.post(baseUrl + '/api/gemp/duty/plan/importanting/delete/v1', dto);
		return promiseUtils(promiseData);
	}

	/**
	 * dutySituationEdit
	 * 值班要情-编辑
	 */
	public dutySituationEdit(dto: Object): Promise<any> {
		let promiseData = http.post(baseUrl + '/api/gemp/duty/plan/importanting/modify/v1', dto);
		return promiseUtils(promiseData);
	}
}
