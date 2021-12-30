
import { PowerNodeRequest } from './webCross/gemp-duty-info/powerNode'
import { GempInfoBaseRequest } from './webCross/gemp-duty-info/GempInfoChart'
import { DetailOperationsRequest } from './webCross/gemp-duty-info/detailOperations'
import { InfoDutyRequest } from './webCross/gemp-duty-info/infoDuty'
import { MailListRequest } from './webCross/mailList/mailList'
import { TreeNode } from './webCross/gemp-duty-info/treeNode'
import { SelectNode } from './webCross/gemp-duty-info/selectNode'
import { NotkTemplateTypeRequest } from './webCross/gemp-duty-info/ntkoTemplateType'
import { MapMessage } from './webCross/gemp-duty-info/mapMessage'
import { briefReportRequest } from './webCross/briefReport/briefReport'
import { accidentRequest } from './webCross/accident/accident'
import { WeekPlanRequest } from './webCross/weekPlan/week-plan'
import { DutySituationRequest } from './webCross/dutyManagement/dutySituation'
import { TelephoneMessage } from './webCross/addressBook/telephoneMessage'
import { SetondutyRequest } from './webCross/workforceManagement/setonduty'
import { GovermentdutyRequest} from './webCross/workforceManagement/govermentduty'
import { WorkforceManagementRequest } from './webCross/workforceManagement/workforceManagement'
import { DutyStatisticsRequest } from './webCross/dutyManagement/dutyStatistics'
import { StatisticalReportRequest } from './webCross/dutyManagement/statisticalReport'
import { DutyRecordSheet } from './webCross/dutyRecordSheet/dutyRecordSheet'
import { LeaderShiftRequest } from './webCross/workforceManagement/leadershift'
import { DocumentHandleRequest } from './webCross/dutyManagement/documentHandle'
import { MainRequest } from './webCross/main-api/mainRequest'
import { ReceivingStatistic } from './webCross/gemp-duty-info/receivingStatistic'
import { AddressBookRequest } from './webCross/gemp-duty-info/addressBook'
import { ClickReportRequest } from './webCross/gemp-duty-info/clickReport'
import { SpecialCampaignRequest } from './webCross/gemp-duty-info/specialCampaign'
import { ConferenceroomRequest } from './webCross/conferenceroom/conferenceroom'
import { ConferenceroomapplyRequest } from './webCross/conferenceroom/conferenceroomapply'
import { GempDangerousEnterprise } from './webCross/gempDangerous/gempDangerousEnterprise'



const http = {
    AddressBookRequest: new AddressBookRequest(),
    MainRequest: new MainRequest(),
    PowerNodeRequest: new PowerNodeRequest(),
    GempInfoBaseRequest: new GempInfoBaseRequest(),
    DetailOperationsRequest: new DetailOperationsRequest(),
    InfoDutyRequest: new InfoDutyRequest(),
    TreeNode: new TreeNode(),
    SelectNode: new SelectNode(),
    NotkTemplateTypeRequest: new NotkTemplateTypeRequest(),
    MapMessage: new MapMessage(),
    briefReportRequest: new briefReportRequest(),
    accidentRequest: new accidentRequest(),
    DutySituationRequest: new DutySituationRequest,
    MailListRequest: new MailListRequest(),
    WeekPlanRequest: new WeekPlanRequest(),
    TelephoneMessage: new TelephoneMessage(),
    WorkforceManagementRequest: new WorkforceManagementRequest(),
    DutyStatisticsRequest: new DutyStatisticsRequest(),
    StatisticalReportRequest: new StatisticalReportRequest(),
    SetondutyRequest: new SetondutyRequest(),
    GovermentdutyRequest: new GovermentdutyRequest(),
    DutyRecordSheet: new DutyRecordSheet(),
    DocumentHandleRequest: new DocumentHandleRequest(),
    LeaderShiftRequest: new LeaderShiftRequest(),
    mainRequest: new MainRequest(),
    ReceivingStatistic: new ReceivingStatistic(),
    ClickReportRequest: new ClickReportRequest(),
    SpecialCampaignRequest: new SpecialCampaignRequest(),
    ConferenceroomRequest:new ConferenceroomRequest(),
    ConferenceroomapplyRequest:new ConferenceroomapplyRequest(),
    GempDangerousEnterprise: new GempDangerousEnterprise(),
}

export default http