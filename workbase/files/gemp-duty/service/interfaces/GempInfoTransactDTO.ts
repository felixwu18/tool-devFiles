import {__Type} from 'prism-web';

@__Type({name: "GempInfoTransactDTO", namespace: "http://www.dv.com"})
export class GempInfoTransactDTO {

    // @ApiModelProperty(value = "事件处理主键id", name = "infoDisposeId")
    private infoDisposeId:String ;

    // @ApiModelProperty(value = "转办督办标题", name = "infoTitle")
    private infoTitle:String ;

    // @ApiModelProperty(value = "接收单位", name = "recvOrgNames")
    private recvOrgNames:String ;

    // @ApiModelProperty(value = "接收人", name = "recvPersonNames")
    private recvPersonNames:String ;

    // @ApiModelProperty(value = "单位签收总数", name = "deptTotal")
    private deptTotal:String ;

    // @ApiModelProperty(value = "单位已签收数", name = "deptSign")
    private deptSign:String ;

    // @ApiModelProperty(value = "个人签收总数", name = "personTotal")
    private personTotal:String ;

    // @ApiModelProperty(value = "个人已签收数", name = "personSign")
    private personSign:String ;

    // @ApiModelProperty(value = "转办时间", name = "createTimeStr")
    private createTimeStr:String ;

    // @ApiModelProperty(value = "信息状态类型(预留)", name = "type")
    private type:String ;
	
	private createTime:String ;
	
	// @ApiModelProperty(value = "当前信息已读状态(0:已读、1:未读)", name = "unReadStatus")
    private unReadStatus:String ;

    // @ApiModelProperty(value = "当前信息未读数", name = "unReadCount")
    private unReadCount:Number ;
	
	//@ApiModelProperty(value = "当前转办督办记录待办状态:待签-0,已签收-1,迟签-2", name = "handleStatus")
	private handleStatus:String ;
	
	//@ApiModelProperty(value = "是否删除(0-未删除；1-已删除)", name = "deleteFlag")
	private deleteFlag:Number ;
}
