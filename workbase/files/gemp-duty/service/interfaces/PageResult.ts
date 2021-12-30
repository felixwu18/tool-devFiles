import {__Type} from 'prism-web';

@__Type({name: "PageResult", namespace: "http://www.dv.com"})
export class PageResult {
    private nowPage:Number;
    private pageSize:Number;
    private total:Number;
    private pages:Number;
    private unReadTotalCount:Number;
    private list:Array<any>;
}

