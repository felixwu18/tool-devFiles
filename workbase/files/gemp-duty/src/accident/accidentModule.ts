import { SimpleModule } from 'prism-web'

// 引入数据序列化DTO
const GempInfoDTO = require('../../service/interfaces/GempInfoDTO')
const GempInfoDisposeDTO = require('../../service/interfaces/GempInfoDisposeDTO')
const GempInfoEventLevelDTO = require('../../service/interfaces/GempInfoEventLevelDTO')
const GempInfoEventTypeDTO = require('../../service/interfaces/GempInfoEventTypeDTO')
const GempInfoProgressDTO = require('../../service/interfaces/GempInfoProgressDTO')
const GempInfoReceiptDTO = require('../../service/interfaces/GempInfoReceiptDTO')
const GempInfoTransactDTO = require('../../service/interfaces/GempInfoTransactDTO')
const GempInfoUserDTO = require('../../service/interfaces/GempInfoUserDTO')
const Result = require('../../service/interfaces/Result') // 返回数据DTO(公共)
const PageResult = require('../../service/interfaces/PageResult') // 返回列表数据DTO(公共)
const TreeNode = require('../../service/interfaces/TreeNode') // 返回列表数据DTO(公共)

export class AccidentModule extends SimpleModule {
    constructor() {
        super()
    }

    configureRouter() {
        this.addRouter('/accident', process.env.baseurl + 'accident/template/baseView.html', resolve => require(['./controller/baseViewController'], resolve), true, 'accident') // 根页面模块
        this.addRouter('/accident/accidentList', process.env.baseurl + 'accident/template/accidentList.html', resolve => require(['./controller/accidentListController'], resolve), false, 'accident-list') // 事故调查列表页模块
        this.addRouter('/accident/accidentDetail', process.env.baseurl + 'accident/template/accidentDetail.html', resolve => require(['./controller/accidentDetailController'], resolve), false, 'accident-detail') // 事故调查详情页
        this.addRouter('/accident/accidentEdit', process.env.baseurl + 'accident/template/accidentEdit.html', resolve => require(['./controller/accidentEditController'], resolve), false, 'accident-edit') // 事故调查详情页
    }

    configureView() { }
}
module.exports = new AccidentModule()