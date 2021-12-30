import { ControllerBase, Prop, Inject, Emit, Watch } from 'prism-web';
import { uploadUrl } from '../../../service/config/base';
import searchSession from '../../../assets/libs/searchData';

export class IamsUploadController extends ControllerBase {
    constructor() {
        super()
    }

    role: any;

    // 文件大小
    static FILE_SIZE = 10 * 1024 * 1024;

    @Inject("http") http: any;
    @Inject("downloadFunc") downloadFunc: any;

    @Prop() value: any;
    @Prop({ default: 'picture-card' }) listtype: any;
    @Prop({ default: false }) disabled: any;
    @Watch('value')
    watchValue(val) {
        console.log(val, this.propIndex)
        if (this.propIndex === 0) {
            this.fileArray = val;
        }
    }

    /**
     * 限制上传文件个数，默认5个，超过5个隐藏上传按钮
     * @param val 
     */
    @Watch('fileArray', { deep: true })
    watchfileArray(val){
        let data = this.limit ? this.limit : 5
        if (val && val.length >= data) {
            this.limitFile = true
        }else{
            this.limitFile = false
        }

        const fileList = val.map((item) => {
            if (item.response) { 
                return Object.assign(item.response, {status: 'success'});
            }

            return item;
        });

        if (JSON.stringify(fileList) !== JSON.stringify(this.fileCallback)) {
            this.fileCallback = fileList;
            this.emitInput(fileList);
        }

    }
    // 限制上传数量
    @Prop() limit: number

    private propIndex: number = 0
    private limitFile: boolean = false;
    // 上传文件地址
    private uploadAddress = uploadUrl;
    private dialogVisible: Boolean = false;
    private wavPanelVisible: Boolean = false;
    private dialogImageUrl = '';

    //上传文件正则
    private filesExgep: RegExp = /(jpg|bmp|gif|ico|jpeg|tif|png|docx|doc|xls|xlsx|txt|pdf|mp4|avi|mp3|wav|mov|rmvb|rm|3gp|flv|wmv|ofd)/
    private header = {
        token: ""
    };
    private style = require("../style/iamsUpload.less")
    private fileArray: Array<any> = []; // 展示的附件数组
    private fileCallback: Array<any> = []; // 回传的附件

    created() {
        this.header.token = JSON.parse(sessionStorage.getItem("token"))
        this.fileArray = this.value
        this.role = searchSession.getter({ name: 'role' });
    }

    activated() {
        this.propIndex = 0
    }

    wavSelect() {
        this.wavPanelVisible = true;
    }

    submitSelection(type, selection) {
        console.log(type, selection);
        this.propIndex++;
        if (selection.length) {
            selection.forEach(item => {
                this.addEnclosure(Object.assign(item, { type }));
            })
        }
    }

    /**
     * 添加附件信息
     */
    private addEnclosure(data){
        const enclosure = {
            $type: 'AttachmentOutDTO,http://www.dv.com',
            type: data.type,
            name: data.fileName || data.file,
            url: data.filePath || '',
            attachId: '',
        }
        this.fileArray.push(enclosure);
    }

    /**
     * Author by chenzheyu
     * 点击展示图片弹框
     * @param file 
     */
    handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
    }

    /**
     * Modify by chenzheyu 上传附件名检测大小写兼容
     * @param val
     */
    beforeFileName(val) {
        const size = val.size

        // 附件大小不能为0kb
        if (size === 0) {
            this.$message.error('上传文件大小不能为0kb！')
            return false
        }

        let name = val.name.split(".")[val.name.split(".").length - 1]
        let flag = !this.filesExgep.test(name.toLowerCase())
        if (flag) {
            this.$message({ type: 'error', message: '文件格式错误' })
            return false
        }

        // 判断文件大小是否超过 10m
        if (size > IamsUploadController.FILE_SIZE) {
            this.$message.error('上传文件大小不能超过10M！')
            return false
        }
        
        const fileName = val.name.length
        // 判断文件名长度是否超过100
        if (fileName > 100) {
            this.$message.error('文件名长度不能超过100！')
            return false
        }  
        //Modify by chengyun 过滤上传重复的文件
        let nameflag  = true
        this.fileArray.forEach((it,index)=>{
            if(it.name == val.name) {
                this.$message({
                    message: it.name + '文件已存在',
                    type: 'info'
                  })  
                nameflag = false
            }
        })
        return nameflag
    }

    /**
     * Author by chenzheyu
     * 文件上传失败回调
     * @param err 
     * @param file 
     * @param fileList 
     */
    showError(err, file, fileList) {
        this.$message({
            type: "error",
            message: '文件上传失败'
        })
    }

    /*
    * Author by chenzheyu  
    * 文件上传成功回调
    */
    uploadSuccess(response, file, fileList) {
        if(response.status == 200) {
            this.propIndex++
            // this.fileCallback.push(response)
            this.$set(this, 'fileArray', fileList)
        }else {
            this.$message({
                type: "error",
                message: response.msg
            })
            fileList.pop();
        }

    }

    /**
     * Author by chenzheyu 
     * 文件超出限制回调
     * @param file 
     * @param fileList 
     */
    exceed(file, fileList) {
        this.$message({
            type: "error",
            message: `只能上传${this.limit ? this.limit : 5}个文件`
        })
    }
    /**
     * Author by chenzheyu
     * 组件自带功能文件删除
     * @param file 
     * @param fileList 
     */
    fileRemove(file, fileList) {
        this.fileArray.forEach((item, index) => {
            if (file.uid == item['uid']) {
                // this.fileCallback.splice(index, 1)
            }
        })
        this.$set(this, 'fileArray', fileList)
    }

    /**
     * Author by chenzheyu
     * 自定义删除文件功能
     * @param file 
     */
    handleRemove(file) {
        this.fileArray.forEach((item, index) => {
            if (file.uid == item['uid']) {
                // this.fileCallback.splice(index, 1)
                this.fileArray.splice(index, 1)
            }
        })
    }

    /**
     * author by chenzheyu  
     * 下载文件方法
     * @param url
     */
    download(file) {
        const fileId = file.response ? file.response.attachId : file.attachId;

        if (fileId) {
            const params = { fileId: fileId }
            this.http.GempInfoBaseRequest.Attachmentdownload(params).then(res => {
                this.downloadFunc(res)
            })
        } else {
            if (file.type === 'record') {
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
    }

    /**
     * Author by chenzheyu
     * emit回调方法
     * @param val 
     */
    @Emit("input")
    emitInput(val) {
        return val;
    }
}