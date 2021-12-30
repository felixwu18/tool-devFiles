import { ControllerBase, Inject } from 'prism-web'
import searchSession from '../../../assets/libs/searchData'
const Px2rem = require('px2rem');

export class ContainerBaseController extends ControllerBase {
    constructor() {
        super()
    }

    private temp = {
        style: require("../style/containerBase.css")
    }

    @Inject("store") store: any
    @Inject("http") http: any
    created() {
        this.getCurrentTheme()
        this.getSystemConfig()
    }

    /**
    * Author by chenzheyu  获取当前用户主题
    */
    getCurrentTheme() {
        let newCss: any;
        newCss = document.createElement('style')
        if (!newCss.innerText && !sessionStorage.getItem('currentTheme')) {
            let userId = searchSession.getter({ name: 'role' }).userId
            this.http.mainRequest.themePicker(userId).then(res => {
                if (res.status == 200) {
                    let subStr = process.env.NODE_ENV === 'development' ? '/file' : window.location.protocol + '//' + window.location.host
                    newCss.innerText = res.data.replace(/{cssurl}/g, subStr)
                    sessionStorage.setItem('currentTheme', JSON.stringify(newCss.innerText))
                    document.getElementsByTagName("head")[0].appendChild(newCss)
                } else {
                    this.$message.info("未定义主题,使用默认主题")
                }
            })
        } else {
            newCss.innerText = JSON.parse(sessionStorage.getItem('currentTheme'));
            document.getElementsByTagName("head")[0].appendChild(newCss)
        }
    }

    /**
 * 获取系统配置信息
 * Author by chenzheyu
 */
    getSystemConfig() {
        this.http.briefReportRequest.systemConfig().then(res => {
            if (res.status === 200) {
                this.store.dispatch('setSystemOffice', res.data.configValue)
            }
        })
    }

}