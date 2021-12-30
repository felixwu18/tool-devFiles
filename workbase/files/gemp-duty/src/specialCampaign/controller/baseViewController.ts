import { ControllerBase, Inject } from 'prism-web'
import {orgUrl} from '../../../service/config/base'
import searchSession from '../../../assets/libs/searchData'

const $ = require('jquery')

export class baseViewController extends ControllerBase {

  constructor() {
    super()
  }
  @Inject('http') http:any
  @Inject('store') store: any

  private selectobj = {
      show: true,
      operationType: '',
      accidentType: []
  }
  // private navselectcode: string = ''

  created(){
    // this.getSelectObj()
    
  }
  /**
     * 获取登陆人机构信息
     */
    // getSelectObj() {
      // let params = {
      //     tenantId: JSON.parse(window.sessionStorage.getItem('role')).tenantId
      // }
      // if (params.tenantId) {
      //     const vm = this;
      //     $.ajax({
      //         type: "POST", 
      //         headers: {
      //         "Access-Control-Allow-Origin": "*",
      //         "Access-Control-Allow-Methods": "POST",
      //         'token': searchSession.getter({ name: 'token' })
      //         },
      //         url: orgUrl + '/api/gemp/user/org/org/byTenantId/v1',
      //         data: JSON.stringify(params),
      //         async : false,
      //         dataType: "JSON",
      //         contentType: "application/json",
      //         success: function(res){
      //                     if (res.status == 200) {
      //                         if(res.data.length==0){
      //                             return vm.$message('请系统管理员设置编制值班表机构')
      //                         }
      //                         vm.$set(vm.selectobj, 'accidentType', res.data)
      //                         vm.store.dispatch('setWatchCodeWork',res.data[0].orgCode)
      //                         vm.selectobj.operationType = res.data[0].orgCode
      //                         window.sessionStorage.setItem('defaultOrg',JSON.stringify(res.data[0]))
      //                         window.sessionStorage.setItem('currentCode',JSON.stringify(res.data[0]))
      //                     }else{
      //                         vm.$message('请系统管理员设置编制值班表机构')
      //                     }
      //                 }
      //     });
      // }
  // }
  private childrenList: Array<any> = [
    { name: '专项活动', router: '/specialCampaign/specialCampaignList',unread:0, children: ['specialcampaign-list']}
  ]

//   selectchange(val) {
//     this.navselectcode = val
//     this.store.dispatch('setWatchCodeWork',val)
//  }
}