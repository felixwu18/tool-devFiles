import { promiseUtils } from '../../utils/promiseUtils';
import http from '../../service/httpService';
import loadHttp from '../../service/blobHttpService';
import { orgUrl, baseUrl, generalUrl } from '../../config/base'


export class StatisticalReportRequest {
	/**
	 *  获得表格数据
	 *
	 */
	public getStatic(dto: Object): Promise<any> {
		let promiseData = http.post(baseUrl + '/api/gemp/duty/info/statement/static/table/v1', dto);
		return promiseUtils(promiseData);
	}
	public statisticExport(dto: Object): Promise<any> {
		let promiseData = loadHttp.post(baseUrl + '/api/gemp/duty/info/month/static/export/v1', dto);
		return promiseData
	}
	public statisticExportReport(dto: Object): Promise<any> {
		let promiseData = loadHttp.post(baseUrl + '/api/gemp/duty/info/statement/static/export/v1', dto);
		return promiseData
	}
	public getRenovate(dto: Object): Promise<any> {
		let promiseData = http.post(baseUrl + '/api/gemp/duty/info/month/static/list/v1', dto);
		return promiseUtils(promiseData)
	}

	// 获取统计综述数据
	public getStaticData(dto: Object): Promise<any> {
		let promiseData = http.post(baseUrl + '/api/gemp/duty/summary/month/list/v1', dto);
		return promiseUtils(promiseData);
	}
	// 获取月报详情数据
	public getCreate(dto: Object): Promise<any> {
		let promiseData = http.post(baseUrl + '/api/gemp/duty/summary/month/info/list/v1', dto);
		return promiseUtils(promiseData);
	}
	// 获取月报详情数据
	public getDetail(dto: Object): Promise<any> {
		let promiseData = http.post(baseUrl + '/api/gemp/duty/summary/month/month/info/v1', dto);
		return promiseUtils(promiseData);
	}
	// 获取业务量统计组织机构数
	public getDistrictTree(dto: Object): Promise<any> {
		let promiseData = http.post(baseUrl + '/api/gemp/duty/info/traffic/statistics/district/tree/v1', dto);
		return promiseUtils(promiseData);
	}
	// 获取业务量统计列表
	public getBussinessList(dto: Object): Promise<any> {
		let promiseData = http.post(baseUrl + '/api/gemp/duty/info/traffic/statistics/list/v1', dto);
		return promiseUtils(promiseData);
	}
	// 导出业务量统计列表
	public bussinessListExport(dto: Object): Promise<any> {
		let promiseData = loadHttp.post(baseUrl + '/api/gemp/duty/info/traffic/statistics/export/v1', dto);
		return promiseData
	}
	// 刷新业务量统计列表
	public getBussinessRenovate(): Promise<any> {
		let promiseData = http.post(baseUrl + '/api/gemp/duty/info/traffic/statistics/refresh/v1', {});
		return promiseUtils(promiseData);
	}

	// 获取统计综述详情拼接数据
	public getStatisticaReviewInfo(dto: Object): Promise<any> {
		let promiseData = http.post(baseUrl + '/api/gemp/duty/statistical/review/info/v1', dto);
		return promiseUtils(promiseData);
	}

}
