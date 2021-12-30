import { ControllerBase, Prop, Inject } from 'prism-web'

export class FileCellController extends ControllerBase {
    constructor() {
        super()
    }

    @Prop() filelist: Array<any>

    // 是否展示图片
    private showImage: boolean = false
    // 展示资源
    private checkSource: string = '#'
    private temp = {
        style: require("../style/fileCell.less")
    }

    // 判断弹框是否展示的为图片   true:图片   false:视频
    private isImage: boolean = true

    @Inject("http") http: any
    @Inject("downloadFunc") downloadFunc: any

    /**
     * Author by chenzheyu 附件下载方法
     * @param file 
     */
    download(file) {
        console.log(file);

        if (file.attachId) {
            const params = { fileId: file.attachId }
            this.http.GempInfoBaseRequest.Attachmentdownload(params).then(res => {
                this.downloadFunc(res)
            })
        } else if (file.type === 'record') {
            this.downloadFunc({
                filename: file.name,
                url: file.url,
            });
        } else if (file.type === 'fax') {
            this.http.MailListRequest.recvFaxAttachmentdownload(file.name, file.name).then(res => {
                this.downloadFunc(res);
            });
        }
    }

    /**
     * Author by chenzheyu 图片查看方法
     * Modify by chenzheyu 添加视频查看方法
     * @param url 
     */
    viewImageCheck(url) {
        debugger;
        this.showImage = true
        this.isImage = true
        this.checkSource = url
    }

    /**
     * 视频查看方法
     * Author by chenzheyu
     * @param url 
     */
    viewVideoCheck(item) {
        this.showImage = true;
        this.isImage = false;
        if (item.attachId) {
            let params = { fileId: item.attachId};
            this.http.GempInfoBaseRequest.Attachmentdownload(params).then(res => {
                this.checkSource = res.url;
            });
        } else {
            this.checkSource = item.url;
        }

    }

    /**
     * 弹框关闭方法
     * Author by chenzheyu
     */
    closeDialog() {
        if (!this.isImage) {
            this.checkSource = ""
        }
        this.showImage = false
    }
}