import { ControllerBase, Inject } from 'prism-web';

export class FaxManageListController extends ControllerBase {
  private temp = {
    style: require('../../style/faxManage/faxManageList.less')
  };
  constructor() {
    super();
  }
  private checkPage: string = '1';
  created() {
    console.log(this.checkPage);
    if (this.$route.query.tab) {
      this.checkPage = this.$route.query.tab.toString();
      console.log(this.checkPage);
    }
  }

}
