import {__Type} from 'prism-web';

@__Type({name: "GempInfoReceiptDTO", namespace: "http://www.dv.com"})
export class GempInfoReceiptDTO  {
    /**
     * 主键
     */
    private receiptId:String ;

    /**
     * 参与者id
     */
    private participatorId:String ;

    /**
     * DISPOSE外键
     */
    private infoDisposeId:String ;

    /**
     * 签收状态：是否签收，WAIT-未签收 OK-已签收
     */
    private receiptStatus:String ;

    /**
     * 创建时间
     */
    private createTime:Date ;

    /**
     * 签收时间
     */
    private receiptTime:String ;

    /**
     * 签收类型，人员0,机构-1
     */
    private receiptType:Number ;

    /**
     * 签收人或者签收单位名称
     */
    private receiptOper:String ;

    /**
     * 签收结果 0-默认 1-及时 2-不及时 3-不允许签收
     */
    private signResult:Number ;

    /**
     * tenentId
     */
    private tenentId:String ;
}
