import { promiseUtils } from '../../utils/promiseUtils'
import http from '../../service/httpService'
import { orgUrl,baseUrl,generalUrl} from '../../config/base'

export class briefReportRequest {
    /**
     * 信息简报 - 获取配置简报使用模式
     */
    public systemConfig():Promise<any> {
        let promiseData = http.post(orgUrl + '/api/config/system/key/v1?key=sys_config_online_reading_mode',{})
        return promiseUtils(promiseData)
    }

	/**
	 * 信息简报-专报/快报/报告新增保存
	 */
     public briefAdd(dto:Object):Promise<any> {
        let promiseData = http.post(baseUrl+'/api/gemp/duty/brief/add/v1 ',dto)
        return promiseUtils(promiseData)
    }

	/**
	 * 信息简报-文本/专报/快报/报告内审发送
	 */
     public audit(dto:Object):Promise<any> {
        let promiseData = http.post(baseUrl+'/api/gemp/duty/brief/audit/v1',dto)
        return promiseUtils(promiseData)
    }

    /**
	 * 一键标记已读
	 */
     public clean(dto:Object):Promise<any> {
        let promiseData = http.post(baseUrl+'/api/gemp/duty/brief/clean/v1',dto)
        return promiseUtils(promiseData)
    }

    /**
	 * 根据简报id删除记录
     * modify by 刘文磊
 	 */
    public delete(dto: Object):Promise<any> {
        let promiseData = http.post(baseUrl+'/api/gemp/duty/brief/delete/v1', dto)
        return promiseUtils(promiseData)
    }

    /**
	 * 信息简报信息简报-文本文件新增
	 */
     public documentAdd(dto:Object):Promise<any> {
        let promiseData = http.post(baseUrl+'/api/gemp/duty/brief/document/add/v1',dto)
        return promiseUtils(promiseData)
    }

    /**
	 * 信息简报-文本文件详情
	 */
     public documentById(dto:Object):Promise<any> {
        let promiseData = http.post(baseUrl+'/api/gemp/duty/brief/document/id/v1',dto)
        return promiseUtils(promiseData)
    }

  /**
	 * 信息列表生成文本
	 */
    public documentByInfoId(dto:Object):Promise<any> {
        let promiseData = http.post(baseUrl+'/api/gemp/duty/brief/document/infoId/v1',dto)
        return promiseUtils(promiseData)
    }
    /**
	 * 信息简报-文本文件编辑
	 */
     public documentModify(dto:Object):Promise<any> {
        let promiseData = http.post(baseUrl+'/api/gemp/duty/brief/document/modify/v1',dto)
        return promiseUtils(promiseData)
    }

    /**
	 * 信息简报-专报/快报/报告详情查看
	 */
     public dutyBrief(dto:Object):Promise<any> {
        let promiseData = http.post(baseUrl+'/api/gemp/duty/brief/id/v1',dto)
        // let promiseData = http.get(baseUrl+`/api/gemp/duty/brief/id/v1?briefId=${briefId}`)
        return promiseUtils(promiseData)
    }

    /**
	 * 信息简报-专报/快报/报告修改期号
	 */
     public issue(dto:Object):Promise<any> {
        let promiseData = http.post(baseUrl+'/api/gemp/duty/brief/issue/v1',dto)
        return promiseUtils(promiseData)
    }


    /**
	 * 信息简报-专报/快报/报告/文本文件列表
	 */
     public briefList(dto:Object):Promise<any> {
        let promiseData = http.post(baseUrl+'/api/gemp/duty/brief/list/v1',dto)
        return promiseUtils(promiseData)
    }

    /**
	 * 信息简报-专报/快报/报告编辑保存
	 */
     public briefModify(dto:Object):Promise<any> {
        let promiseData = http.post(baseUrl+'/api/gemp/duty/brief/modify/v1',dto)
        return promiseUtils(promiseData)
    }

    /**
	 * 根据id查询简报处理过程
	 */
     public briefProcess(dto:Object):Promise<any> {
        let promiseData = http.post(baseUrl+'/api/gemp/duty/brief/process/id/v1',dto)
        return promiseUtils(promiseData)
    }


// http://172.18.7.91:8868/gemp-duty-lix/api/gemp/duty/brief/template/type/v1

    /**
	 * 根据简报类型获取模板
	 */
     public templateType(dto:Object):Promise<any> {
        let promiseData = http.post(baseUrl+'/api/gemp/duty/brief/template/type/v1',dto)
        return promiseUtils(promiseData)
    }

    /**
	 * 文本简报转换成其他类型
	 */
     public transferType(dto:Object):Promise<any> {
        let promiseData = http.post(baseUrl+'/api/gemp/duty/brief/transfer/type/v1',dto)
        return promiseUtils(promiseData)
    }
    /**
     * onlyoffice 文本简报转换为其他类型
     */
    public transferOffice(dto:Object):Promise<any> {
        let promiseData = http.post(baseUrl+'/api/gemp/duty/only/office/brief/transfer/type/v1',dto)
        return promiseUtils(promiseData)
    }

    /**
	 * 获取信息简报列表未读总数
	 */
     public briefUnread():Promise<any> {
        let promiseData = http.post(baseUrl+'/api/gemp/duty/brief/unread/v1',{})
        return promiseUtils(promiseData)
    }

    /*
	 * 获取信息简报 查询当前租户下所有同事
	 */
    public baseUser():Promise<any> {
        let promiseData = http.post(baseUrl+'/api/gemp/user/baseuser/all/colleague/v1',{})
        return promiseUtils(promiseData)
    }

    /*
	 * 获取信息简报内审领导 查询当前租户下同机构用户
	 */
    public baseUsers():Promise<any> {
        let promiseData = http.post(orgUrl+'/api/gemp/user/baseuser/list/user/opinion/v1',{})
        return promiseUtils(promiseData)
    }


    /*
	 * 获取信息简报未读
	 */
    public baseUnread():Promise<any> {
        let promiseData = http.post(baseUrl+'/api/gemp/duty/brief/unread/v1',{})
        return promiseUtils(promiseData)
    }


    /**
     * 信息简报 - 根据简报类型获取模板(onlyOffice)
     */
    public onlyOfficeType(dto):Promise<any> {
        let promiseData = http.post(baseUrl+'/api/gemp/duty/only/office/brief/template/onlyOffice/type/v1',dto)
        return promiseUtils(promiseData)
    }
}
