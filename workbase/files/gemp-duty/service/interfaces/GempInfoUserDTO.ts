import {__Type} from 'prism-web';

@__Type({name: "GempInfoUserDTO", namespace: "http://www.dv.com"})
export class GempInfoUserDTO{

    // @ApiModelProperty("人员或机构信息")
    private reportId:String ;

    // @ApiModelProperty("人员或机构名称")
    private reportName:String ;

    // @ApiModelProperty("类型: 1:单位 2:人员")
    private reportType:String ;

}