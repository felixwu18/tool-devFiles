import { TAxiosHttp } from 'prism-web'
import { showLoading, hideLoading} from '../Loading/loading'
import { Message } from 'element-ui'
import searchData from '../../assets/libs/searchData'

class Http {
    static http: Http

    private httpService: TAxiosHttp

    static instance() {
        if (!this.http) {
            this.http = new Http()
            this.http.httpService = new TAxiosHttp()
            let token = searchData.getter({ name: "token" }) ? searchData.getter({ name: "token" }) : ""
            this.http.httpService.setRequestHeader('token', token)
            this.http.httpService.interceptors.request.use(config => {
                // 线上部署放开这段代码
                let token = searchData.getter({ name: "token" }) ? searchData.getter({ name: "token" }) : ""
                config.headers['token'] = token
                config.headers['Content-Type'] = 'application/json'
                if(config.method === 'post') {
                    if (config.url.indexOf("wgcs") == -1 && config.data !== "" ? !JSON.parse(config.data).mask : true) {
                        showLoading()
                    }
                    if (config.data !== "" ? !!JSON.parse(config.data).mask : false) {
                        let newParam = JSON.parse(config.data)
                        delete newParam.mask
                        config.data = JSON.stringify(newParam)
                    }
                } else {
                    showLoading()
                }
                return config
            }, error => {
                console.log(error)
            })

            // 响应错误拦截
            this.http.httpService.interceptors.response.use(res => {
                return res
            }, error => {
                if (error.response.status === 401) {
                    hideLoading()
                    let url: string = top.location.href.split('#/')[0] + '#/login?error=401'
                    top.location.replace(url)
                }
            })
        }
        return this.http
    }

    public get(url): Promise<any> {
        return this.httpService.get(url)
    }

    public post(url, params: object, responseType = "json"): Promise<any> {
        let arr = Object.getOwnPropertyNames(params)
        if (arr.length == 0) {
            return this.httpService.post(url, '', responseType)
        } else {
            return this.httpService.post(url, JSON.stringify(params), responseType)
        }
    }
}

export default Http.instance()
