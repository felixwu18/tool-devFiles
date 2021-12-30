import {AttachmentOutDTO} from "./AttachmentOutDTO";
import {GempInfoDisposeDTO} from "./GempInfoDisposeDTO";


import {__Type} from 'prism-web';

@__Type({name: "GempInfoDTO", namespace: "http://www.dv.com"})
export class GempInfoDTO {
    /**
     * 信息id
     **/
    private infoId:String ;

    /**
     * 链id
     */
    private chainId:String ;

    /**
     * 信息标题
     */
    private infoTitle:String ;

    /**
     * 信息类型(emergency:突发事件，warning:预警信息，other:其他类型)
     */
    private infoType:String ;

    /**
     * 事发时间
     */
    private incidentDate:String ;

    /**
     * 时间标记字段，A-上午；P-下午；H-时；M-分
     */
    private gmtMarker:String ;

    /**
     * 报送时间
     */
    private reportDate:String ;

    /**
     * 上报状态(未上报（草稿）:0,已上报:1)
     */
    private infoStatus:String ;

    /**
     * 报送方式 (1电话，2传值,3系统、4：市长热线)
     */
    private reportWay:String ;

    /**
     * 事发地点
     */
    private infoAddress:String ;

    /**
     * 报送人
     */
    private reportPerson:String ;

    /**
     * 报送单位
     */
    private orgCode:String ;

    /**
     * 报送人电话
     */
    private reportPersonPhone:String ;

    /**
     * 事件描述
     */
    private infoDescription:String ;

    /**
     * 报送类型（0：省政府OA报送、1：电话报送、2：传真报送、3：平台报送、4：市长热线）
     */
    private reportType:String ;

    /**
     * 事发地区
     */
    private distCode:String ;

    /**
     * 信息报送状态（0：首报、1：续报、2：退报、3：重报、4：被关联）
     */
    private infoReportStatus:Number ;

    /**
     * 事件等级
     */
    private eventLevelCode:String ;

    /**
     * 受伤人数
     */
    private woundNum:Number ;

    /**
     * 死亡人数
     */
    private deathNum:Number ;

    /**
     * 经度
     */
    private longitude:Number ;

    /**
     * 纬度
     */
    private latitude:Number ;

    /**
     * 是否敏感事件(1有 0无)
     */
    private sensitiveEvent:String ;

    /**
     * 是否呈报（0：未呈报，1：报省）
     */
    private submitFlag:Number ;

    /**
     * 是否公开
     */
    private isOpen:Number ;

    /**
     * 是否置顶
     */
    private isTop:Number ;

    /**
     * 创建人
     */
    private createPerson:String ;

    /**
     * 创建时间
     */
    private createTime:String ;

    /**
     * 更新时间
     */
    private updateTime:String ;

    /**
     * 是否产生衍生事件
     */
    private isChain:Number ;

    /**
     * 备注
     */
    private remark:String ;

    /**
     * source_id
     */
    private sourceId:String ;

    /**
     * tenant_id
     */
    private tenentId:String ;

    /**
     * '事件类型'
     */
    private eventType:String ;

    /**
     * 消息是否撤回（1-撤回，0-无操作，默认为无操作）
     */
    private isBack:String ;



    //字典值
    private orgName:String ;
    // ("事件等级名称")
    private eventLevelName:String ;
    // @ApiModelProperty("信息类型名称")
    private infoTypeName:String ;

    // @ApiModelProperty(value = "当前信息已读状态(0:已读、1:未读)", name = "unReadStatus")
    private unReadStatus:String ;

    // @ApiModelProperty(value = "当前信息未读数", name = "unReadCount")
    private unReadCount:Number ;

    //附件相关
    private attachmentList:Array<AttachmentOutDTO> ;

    private disposeList:Array<GempInfoDisposeDTO> ;
}
