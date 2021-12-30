import { ControllerBase, Prop, Emit,Watch, Inject } from 'prism-web'

export class WavPanelController extends ControllerBase {
    constructor() {
        super()
    }

    @Inject("http") http: any
    @Inject("downloadFunc") downloadFunc: any;

    private style = require("../style/wavPanel.less");

    private selectType: 'record' | 'fax' = 'record';

    private params = { 
        keyWord: '',
        nowPage: 1,
        pageSize: 5,
    }

    private propRecordData={
        isCheck: true,
        isSingleSelect: true,
        pageSize: this.params.pageSize,
        nowPage: 0,
        total: 0,
        config: [
            {
                type: 'string',
                label: '文件名称',
                width: '600',
                prop: 'fileName',
            },
            {
                type: 'button',
                label: '操作',
                width: '/',
                prop: 'operate'
            }
        ],
        data: [],
    };

    private propFaxData={
        isCheck: true,
        isSingleSelect: true,
        pageSize: this.params.pageSize,
        nowPage: 0,
        total: 0,
        config: [
            {
                type: 'string',
                label: '传真号码',
                width: '200',
                prop: 'cid',
            },
            {
                type: 'string',
                label: '文件名称',
                width: '400',
                prop: 'file',
            },
            {
                type: 'button',
                label: '操作',
                width: '/',
                prop: 'operate'
            }
        ],
        data: [],
    };

    private recordBtnGroup = {
        audition: { name: '试听', type: 'primary', emit: 'audition', expression: true },
    }

    private faxBtnGroup = {
        download: { name: '下载', type: 'primary', emit: 'download', expression: true },
    }

    private isPlaying: boolean = false; // 是否在播放
    private playingPath: string = ''; // 播放文件的路径

    @Watch('selectType')
    watchSelectType() {
        this.params = {
            keyWord: '',
            nowPage: 1,
            pageSize: 5,
        };
        this.getTableData();
    }
    
    mounted() {
        this.getTableData();
    }

    getTableData() {
        if (this.selectType === 'record') {
            this.http.TelephoneMessage.getWavList(this.params).then(res => {
                if (res.code == 200) {
                    res.data.list.forEach(item => {
                        item.operate = this.recordBtnGroup;
                    });

                    this.propRecordData.nowPage = this.params.nowPage - 1;
                    this.propRecordData.data = res.data.list;
                    this.propRecordData.total = res.data.total;
                }
            });
        } else {
        this.http.MailListRequest.recvFaxList(Object.assign(this.params, { startDate: '',endDate: '' })).then(res => {
                console.log(res);
                if (res.status == 200) {
                    res.data.list.forEach(item => {
                        item.operate = this.faxBtnGroup;
                    });

                    this.propFaxData.nowPage = this.params.nowPage - 1;
                    this.propFaxData.data = res.data.list;
                    this.propFaxData.total = res.data.total;
                }
            });
        }
    }

    search() {
        this.params['nowPage'] = 1;
        this.getTableData();
    }

    // 列表按钮点击响应
    tablecallback(data) {
        if (this[data.type]) {
            this[data.type](data);
        }
    }

    // 翻页功能
    handlePageChange(data) {
        this.params['nowPage'] = data.rowVal;
        this.getTableData();
    }

    submit() {
        const listTable: any = this.$refs.listTable;
        const table = listTable.$refs.table;
        const selection = table.selection;
        if (!selection.length) {
            (this.$message as any).closeAll();
            this.$message.warning('请先选择一个录音或传真文件');
            return;
        }

        this.$emit('submit-selection', this.selectType, selection);
        this.$emit('close');
    }

    // 试听
    audition({rowVal}) {
        this.playingPath = rowVal.filePath;

        this.isPlaying = false;
        this.$nextTick(() => {
            this.isPlaying = true;
        });
    }

    // 下载
    download({rowVal}) {
        this.http.MailListRequest.recvFaxAttachmentdownload(rowVal.file, rowVal.file).then(res => {
            this.downloadFunc(res);
        });
    }
}