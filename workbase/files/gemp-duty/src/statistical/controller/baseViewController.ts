import { ControllerBase, Inject, Emit, Prop, Watch } from 'prism-web'

export class BaseViewController extends ControllerBase {

    constructor() {
        super()
    }
    private mounthcode: string = ''
    private childrenList: Array<any> = [
        { name: '统计报表', router: '/statistical/statisticalReport', unread: 0, label: '1', children: [] },
        { name: '统计综述', router: '/statistical/statisticalSummaryList', unread: 0, children: [] },
        { name: '业务量统计', router: '/statistical/businessStatistic', unread: 0, children: [] },
    ]
    handlechange(data) {
        this.mounthchange(data)
    }
    @Emit('mounthchange')
    mounthchange(data) {
        this.mounthcode = data;
    }
}