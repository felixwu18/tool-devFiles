import {__Type} from 'prism-web';

@__Type({name: "GempInfoEventTypeDTO", namespace: "http://www.dv.com"})
export class GempInfoEventTypeDTO {
    // @ApiModelProperty("信息类型id")
    private eventTypeCode:String ;

    // @ApiModelProperty("信息类型名称")
    private eventTypeName:String ;

    // @ApiModelProperty("父节点信息类型id")
    private parentCode:String ;

    // @ApiModelProperty("备注")
    private notes:String ;


}