import { ControllerBase, Inject } from 'prism-web'

export class BaseViewController extends ControllerBase {

  constructor() {
    super()
  }

  private childrenList: Array<any> = [
    { name: '接报统计', router: '/InformationStatistic/list'}
  ]
}