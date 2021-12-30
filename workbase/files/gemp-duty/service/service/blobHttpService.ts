import { TAxiosHttp } from 'prism-web'
import { baseUrl, orgUrl, uploadUrlFlie } from '../config/base'
import { showLoading, hideLoading } from '../Loading/loading'
import searchData from '../../assets/libs/searchData'

class BlobHttp {
  static http: BlobHttp

  private httpService: TAxiosHttp

  static instance() {
    if (!this.http) {
      this.http = new BlobHttp()
      this.http.httpService = new TAxiosHttp()
      let token = searchData.getter({ name: "token" }) ? searchData.getter({ name: "token" }) : ""
      this.http.httpService.setRequestHeader('token', token)
      this.http.httpService.interceptors.request.use(
        (config) => {
          let token = searchData.getter({ name: "token" }) ? searchData.getter({ name: "token" }) : ""
          config.headers['token'] = token
          config.headers['Content-Type'] = 'application/json'
          if (config.url.indexOf("wgcs") == -1 && config.data !== "" ? !JSON.parse(config.data).mask : true) {
            showLoading()
          }
          if (config.data !== "" ? !!JSON.parse(config.data).mask : false) {
            let newParam = JSON.parse(config.data)
            delete newParam.mask
            config.data = JSON.stringify(newParam)
          }
          return config
        },
        (error) => {
          console.log(error)
        }
      )

      this.http.httpService.interceptors.response.use(res => {
        hideLoading()
        if (res.headers.filename) {
          let filename = decodeURI(res.headers.filename)
          let fileType = filename.split('.')[1]
          let type // 产生二进制blob的MIME类型
          switch (fileType) {
            case 'xls' || 'xlsx':
              // 为excel文件
              type = 'application/vnd.ms-excel'
              break
            case 'doc':
              type = 'application/msword'
              break
            case 'docx':
              type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              break
            case 'pdf':
              type = 'application/pdf'
              break
            case 'bmp':
              type = 'image/bmp'
              break
            case 'png':
              type = 'image/png'
              break
            case 'gif':
              type = 'image/gif'
              break
            case 'jpe' || 'jpeg' || 'jpg':
              type = 'image/jpeg'
              break
          }
          let blobStream = new Blob([res.data], { type: type })
          let url = window.URL.createObjectURL(blobStream)
          // hideLoading()
          return { filename, url, blobStream }
        } else {
          return JSON.parse(res)
        }
      }, error => {
        if (error.response.status === 401) {
          let url: string = top.location.href.split('#/')[0] + '#/login?error=401'
          top.location.replace(url)
        }
      })
    }
    return this.http
  }

  public get(url, responseType = 'blob'): Promise<any> {
    // if (url.indexOf("http") == -1) {
    //   url = uploadUrlFlie + url
    // }
    return this.httpService.get(url, '', responseType)
  }

  public post(url, params: object, responseType = 'blob'): Promise<any> {
    // return this.httpService.post(baseUrl + url, JSON.stringify(params), responseType)
    return this.httpService.post(url, JSON.stringify(params), responseType)
  }
}

export default BlobHttp.instance()
