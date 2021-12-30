import {__Type} from 'prism-web';

@__Type({name: "GempInfoProgressDTO", namespace: "http://www.dv.com"})
export class GempInfoProgressDTO{
    /**
     * 处理进度主键id
     */
    private progressId;String ;

    /**
     * 事件id
     */
    private infoId:String ;

    /**
     * 操作记录的id
     */
    private infoDisposeId:String ;

    /**
     * 操作人id
     */
    private operId:String ;

    /**
     * 操作人单位id
     */
    private operOrgCode:String ;

    /**
     * 操作类型
     */
    private disposeType:String ;

    /**
     * 操作说明
     */
    private operDescription:String ;

    /**
     * 操作人名称
     */
    private operPersonName:String ;

    /**
     * 是否删除(0 否，1-是)
     */
    private deleteFlag:Number ;

    /**
     * 更新人id
     */
    private updatePerson:String ;

    /**
     * 操作时间
     */
    private operTime:String ;

    /**
     * 更新时间
     */
    private updateTime:String ;

    /**
     * 备注
     */
    private remark:String ;

    /**
     * tenentId
     */
    private tenentId:String ;
}
