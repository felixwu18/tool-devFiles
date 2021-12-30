import { ControllerBase, Prop ,Inject, Watch} from 'prism-web'
import { getRequestUrl } from '../../../assets/libs/commonUtils'

export class PdfPage extends ControllerBase {
    constructor(){
        super()
    }
    private pdfUrl:string = ''
    // 请求pdf的类型
    @Prop() posttype:string

    created(){
        let id = this.$route.query.id

        // 从提醒信息跳转的时候
        var url = window.location.href;
        let urlCode = getRequestUrl(url)
        if(urlCode && urlCode['detailUrlId']){
           id = urlCode['detailUrlId']
        }

        let obj = {type:this.posttype,id:id}
        this.getPDFurl(obj)
    }
    @Inject('sourceurl')sourceurl:any
    @Inject("http") http:any
    
    // 获取pdf文件url
    getPDFurl(obj) {
        this.http.GempInfoBaseRequest.getPDF(obj).then(res => {
            this.pdfUrl = res.data
        })
    }
}