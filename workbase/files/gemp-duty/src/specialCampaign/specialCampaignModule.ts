import { SimpleModule } from 'prism-web'

class SpecialCampaignModule extends SimpleModule {

  constructor() {
    super()
  }

  configureRouter() {
    this.addRouter('/specialCampaign', process.env.baseurl + 'specialCampaign/template/baseView.html', resolve => require(['./controller/baseViewController'], resolve), true, 'specialcampaign')
    this.addRouter('/specialCampaign/specialCampaignList', process.env.baseurl + 'specialCampaign/template/specialCampaignList.html', resolve => require(['./controller/specialCampaignListController'], resolve), false, 'specialcampaign-list')
    this.addRouter('/specialCampaign/addSpecialCampaign', process.env.baseurl + 'specialCampaign/template/addSpecialCampaign.html', resolve => require(['./controller/addSpecialCampaignController'], resolve), false, 'add-specialcampaign')
  }

  configureView() {
    
  }

}

module.exports = new SpecialCampaignModule()