import { ControllerBase, Inject } from 'prism-web'

export class BaseViewController extends ControllerBase {

  constructor() {
    super()
  }

  private childrenList: Array<any> = [
    { name: '周工作安排', router: '/weekPlan/list'}
  ]
}