import {__Type} from 'prism-web';
import {GempInfoDTO} from "./GempInfoDTO";

@__Type({name: "GempInfoDisposeDTO", namespace: "http://www.dv.com"})
export class GempInfoDisposeDTO  {
    private infoDisposeId:String ;
    private infoId:String ;
    private disposePersonId:String ;
    private disposeOrgCode:String ;
    private disposeType:String ;
    private disposePersonName:String ;
    private disposeTime:Date ;
    private isSubject:Number ;
    private subjectId:String ;
    private disposePriority:Number ;
    private recvOrgNames:String ;
    private recvPersonNames:String ;
    private deleteFlag:Number ;
    private disposeDescription:String ;
    private extendedData:String ;
    private remark:String ;
    private indirectPerson:String ;
    private disposeOrder:Number ;
    private createTime:String ;
    private createTimeStr:String ;
    private updateTime:String ;
    private updateTimeStr:String ;
    private tenentId:String ;
    private infoDTO:GempInfoDTO ;
    private recvUserId:Array<String> ;
    private recvOrgId:Array<String> ;
}
