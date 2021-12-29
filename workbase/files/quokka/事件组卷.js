/**
 * 产品: 汪欣桐 ui: 张静 后端: 郑雯雯,
 * 事件组卷 事件信息
 * 1 静态布局
 *   1)时间轴组件-时间进度跟踪 参考gemp-watch 短信记录
 *   2)content涉及视频, 报的时间需要转化
 *   3) color：
 *         事件初报 #EEA441 背景 #5B4235  normal color参照table-title color normal背景 #105069
 *         成都市指挥部-杨阳 #7F949B
 */
/**
 * 事件组卷 力量调度
 * 1 静态布局
 *   1) -- 救援队伍 ui需要将选中背景效果的三角图标带上
 *   2) row-col布局 内容区 blockcout 左-2 中-1 右-1(inner-4)
 *      左-2:切换表格数据 echarts饼图-需单独测试
 *   3) color：
 *         title-增援梯队(rescue-team)，力量分析(strenth-analysis)，进展情况(progress)，信息回传(info-back) #F3FFC1 -> #2FE7FE
 *         救援队伍 #FFD836 - active table-title 背景#1B3D60 color #23C6DD table-cell #0A1531 #112444
 *         救援进展 #F9EC7C - active #65D4F6 - normal 公安局
 *         视频 #FFFFB0
 *  2 集中处理 echarts 视频交互, 图片， 音频 文本四项 询问产品现有实现演示
 *  3 资源获取 获取后台样例数据（了解后台 表结构形成后 应该可以拿到样例数据 -> 及时了解数据结构，看是否有问题）
 */
var classType = {
    a: 9,
    data: [
        {
            "eventId": null,
            "groupName": "地震救援队",
            "eventCallLogDTOList": [
                {
                    "personName": "王苒站",
                    "thingAddress": null,
                    "orgCodeName": null,
                    "callTime": null,
                    "teamName": "四川省地震救援队（武警）",
                    "nums": "46",
                    "onlineNum": null,
                    "ofward": null,
                    "groupName": "地震救援队",
                    "eventId": "ff8080817a757b2a017a75b1d3a20000"
                },
                {
                    "personName": "陈欣",
                    "thingAddress": null,
                    "orgCodeName": null,
                    "callTime": null,
                    "teamName": "成都市科信处救援二队",
                    "nums": "50",
                    "onlineNum": null,
                    "ofward": null,
                    "groupName": "地震救援队",
                    "eventId": "ff8080817a757b2a017a75b1d3a20000"
                }
            ]
        },
        {
            "eventId": null,
            "groupName": "铁路公安",
            "eventCallLogDTOList": [
                {
                    "personName": "彭宏印",
                    "thingAddress": null,
                    "orgCodeName": null,
                    "callTime": null,
                    "teamName": "成都局集团公司成都救援列车",
                    "nums": "19",
                    "onlineNum": null,
                    "ofward": null,
                    "groupName": "铁路公安",
                    "eventId": "ff8080817a757b2a017a75b1d3a20000"
                }
            ]
        }
    ],
    "data2": [{"eventId":null,"groupName":"地震救援队","eventCallLogDTOList":[{"personName":"王苒站","thingAddress":null,"orgCodeName":null,"callTime":null,"teamName":"四川省地震救援队（武警）","nums":"46","onlineNum":null,"ofward":null,"groupName":"地震救援队","eventId":"ff8080817d3b3480017d4ae21adf18af"},{"personName":"陈欣","thingAddress":null,"orgCodeName":null,"callTime":null,"teamName":"成都市科信处救援二队","nums":"50","onlineNum":null,"ofward":null,"groupName":"地震救援队","eventId":"ff8080817d3b3480017d4ae21adf18af"}]},{"eventId":null,"groupName":"铁路公安","eventCallLogDTOList":[{"personName":"彭宏印","thingAddress":null,"orgCodeName":null,"callTime":null,"teamName":"成都局集团公司成都救援列车","nums":"19","onlineNum":null,"ofward":null,"groupName":"铁路公安","eventId":"ff8080817d3b3480017d4ae21adf18af"}]},{"eventId":null,"groupName":"矿山应急救援队","eventCallLogDTOList":[{"personName":"彭宏印","thingAddress":null,"orgCodeName":null,"callTime":null,"teamName":"成都市安全生产应急救援彭州中队","nums":"12","onlineNum":null,"ofward":null,"groupName":"矿山应急救援队","eventId":"ff8080817d3b3480017d4ae21adf18af"},{"personName":"周志俊","thingAddress":null,"orgCodeName":null,"callTime":null,"teamName":"成都市安全生产应急救援出江中队","nums":"13","onlineNum":null,"ofward":null,"groupName":"矿山应急救援队","eventId":"ff8080817d3b3480017d4ae21adf18af"}]},{"eventId":null,"groupName":"通信保障队","eventCallLogDTOList":[{"personName":"郑立","thingAddress":null,"orgCodeName":null,"callTime":null,"teamName":"四川移动应急通信局抢险大队","nums":"58","onlineNum":null,"ofward":null,"groupName":"通信保障队","eventId":"ff8080817d3b3480017d4ae21adf18af"},{"personName":"顾国平","thingAddress":null,"orgCodeName":null,"callTime":null,"teamName":"四川机动通信局","nums":"17","onlineNum":null,"ofward":null,"groupName":"通信保障队","eventId":"ff8080817d3b3480017d4ae21adf18af"}]},{"eventId":null,"groupName":"消防救援队","eventCallLogDTOList":[{"personName":"胡源玉","thingAddress":null,"orgCodeName":null,"callTime":null,"teamName":"高新区中和政府专职队","nums":"18","onlineNum":null,"ofward":null,"groupName":"消防救援队","eventId":"ff8080817d3b3480017d4ae21adf18af"},{"personName":"程国","thingAddress":null,"orgCodeName":null,"callTime":null,"teamName":"高新大队","nums":"1","onlineNum":null,"ofward":null,"groupName":"消防救援队","eventId":"ff8080817d3b3480017d4ae21adf18af"},{"personName":"夏杨生","thingAddress":null,"orgCodeName":null,"callTime":null,"teamName":"特勤二中队","nums":"24","onlineNum":null,"ofward":null,"groupName":"消防救援队","eventId":"ff8080817d3b3480017d4ae21adf18af"},{"personName":"王厉","thingAddress":null,"orgCodeName":null,"callTime":null,"teamName":"双流区大队","nums":"500","onlineNum":null,"ofward":null,"groupName":"消防救援队","eventId":"ff8080817d3b3480017d4ae21adf18af"},{"personName":"王佳东","thingAddress":null,"orgCodeName":null,"callTime":null,"teamName":"天府新区大队","nums":"3","onlineNum":null,"ofward":null,"groupName":"消防救援队","eventId":"ff8080817d3b3480017d4ae21adf18af"},{"personName":"秦洋龙","thingAddress":null,"orgCodeName":null,"callTime":null,"teamName":"武侯祠中队","nums":"15","onlineNum":null,"ofward":null,"groupName":"消防救援队","eventId":"ff8080817d3b3480017d4ae21adf18af"},{"personName":"冯娟明","thingAddress":null,"orgCodeName":null,"callTime":null,"teamName":"武侯大队","nums":"500","onlineNum":null,"ofward":null,"groupName":"消防救援队","eventId":"ff8080817d3b3480017d4ae21adf18af"},{"personName":"雷宇庆","thingAddress":null,"orgCodeName":null,"callTime":null,"teamName":"电子路中队","nums":"500","onlineNum":null,"ofward":null,"groupName":"消防救援队","eventId":"ff8080817d3b3480017d4ae21adf18af"},{"personName":"代金","thingAddress":null,"orgCodeName":null,"callTime":null,"teamName":"大邑大队","nums":"3","onlineNum":null,"ofward":null,"groupName":"消防救援队","eventId":"ff8080817d3b3480017d4ae21adf18af"},{"personName":"周兆","thingAddress":null,"orgCodeName":null,"callTime":null,"teamName":"南方航空护林总站成都站","nums":"11","onlineNum":null,"ofward":null,"groupName":"消防救援队","eventId":"ff8080817d3b3480017d4ae21adf18af"},{"personName":"文清","thingAddress":null,"orgCodeName":null,"callTime":null,"teamName":"消防队伍西南地区（成都）进口消防车辆装备维修中心","nums":"7","onlineNum":null,"ofward":null,"groupName":"消防救援队","eventId":"ff8080817d3b3480017d4ae21adf18af"},{"personName":"贾海峰","thingAddress":null,"orgCodeName":null,"callTime":null,"teamName":"金堂大队","nums":"3","onlineNum":null,"ofward":null,"groupName":"消防救援队","eventId":"ff8080817d3b3480017d4ae21adf18af"},{"personName":null,"thingAddress":null,"orgCodeName":null,"callTime":null,"teamName":"消防救援队伍","nums":"100","onlineNum":null,"ofward":null,"groupName":"消防救援队","eventId":"ff8080817d3b3480017d4ae21adf18af"},{"personName":"刘波","thingAddress":null,"orgCodeName":null,"callTime":null,"teamName":"简阳市消防救援队","nums":"50","onlineNum":null,"ofward":null,"groupName":"消防救援队","eventId":"ff8080817d3b3480017d4ae21adf18af"},{"personName":null,"thingAddress":null,"orgCodeName":null,"callTime":null,"teamName":"武警救援队伍","nums":"100","onlineNum":null,"ofward":null,"groupName":"消防救援队","eventId":"ff8080817d3b3480017d4ae21adf18af"},{"personName":"刘波","thingAddress":null,"orgCodeName":null,"callTime":null,"teamName":"成都市科信处救援队","nums":"0","onlineNum":null,"ofward":null,"groupName":"消防救援队","eventId":"ff8080817d3b3480017d4ae21adf18af"},{"personName":"刘波","thingAddress":null,"orgCodeName":null,"callTime":null,"teamName":"成都市应急管理局救援队","nums":"50","onlineNum":null,"ofward":null,"groupName":"消防救援队","eventId":"ff8080817d3b3480017d4ae21adf18af"},{"personName":null,"thingAddress":null,"orgCodeName":null,"callTime":null,"teamName":"应急救援队伍","nums":"100","onlineNum":null,"ofward":null,"groupName":"消防救援队","eventId":"ff8080817d3b3480017d4ae21adf18af"}]}],
    treeData: [{a: 1, children: [{a: 22, b: 222}]}, { a: 11, children: [{a: 2222}] }, {a: 111}]
}
console.log(classType.a);

console.log(Number('0'));
console.log(classType.data.reduce((acc, cur) => acc.concat(cur.eventCallLogDTOList), []));
console.log(classType.data2.filter((item) => item.groupName === '消防救援队'));
console.log('sdss.gpeg'.split('.').slice(-1)[0].toUpperCase());
console.log('    JP'.toLowerCase());
console.log(classType.treeData.map(ele => {
    if (ele.hasOwnProperty('children')) {
        return ele.children
    } else {
        return ele
    }
}).flat());
