import { ControllerBase, Prop, Watch } from 'prism-web'
import plugins from './plugins'
import toolbar from './toolbar'
import load from './dynamicLoadScript'
const tinymceCDN = process.env.sourceurl + 'libs/tinymce/tinymce.js'

export class IamsEditorController extends ControllerBase {
    constructor() {
        super()
    }

    @Prop({
        type: String,
        default: 'file edit insert view format table'
    }) menubar
    @Prop(
        {
            default: function () {
                return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
            }
        }
    ) id: string
    @Prop(
        {
            default: function () {
                return []
            }
        }
    ) toolbar: Array<any>
    @Prop(
        {
            default: 360
        }
    ) height: string
    @Prop(
        {
            default: 'auto'
        }
    ) width: string
    @Prop({ default: '' }) value: string
    @Watch('value')
    watchValue(val) {
        if (!this.hasChange && this.hasInit) {
            this.$nextTick(() => {
                window['tinymce'].get(this.tinymceId).setContent(val || '')
            })
        }
    }

    get containerWidth() {
        const width = this.width
        if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
            return `${width}px`
        }
        return width
    }

    private hasChange: boolean = false
    private hasInit: boolean = false
    private tinymceId: String = this.id
    private fullscreen: boolean = false
    private languageTypeList = {
        'en': 'en',
        'zh': 'zh_CN',
        'es': 'es_MX',
        'ja': 'ja'
    }

    mounted() {
        this.init()
    }
    activated() {
        if (window['tinymce']) {
            this.initTinymce()
        }
    }
    deactivated() {
        this.destroyTinymce()
    }
    
    destroyed() {
        this.destroyTinymce()
    }

    init() {
        load(tinymceCDN, (err) => {
            if (err) {
                this.$message.error(err.message)
                return
            }
            this.initTinymce()
        })
    }

    initTinymce() {
        const _this = this
        window['tinymce'].init({
            selector: `#${this.tinymceId}`,
            language: this.languageTypeList['zh'],
            height: this.height,
            body_class: 'panel-body ',
            object_resizing: false,
            toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
            menubar: this.menubar,
            plugins: plugins,
            end_container_on_empty_block: true,
            powerpaste_word_import: 'clean',
            code_dialog_height: 450,
            code_dialog_width: 1000,
            advlist_bullet_styles: 'square',
            advlist_number_styles: 'default',
            imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
            default_link_target: '_blank',
            link_title: false,
            nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
            init_instance_callback: editor => {
                if (_this.value) {
                    editor.setContent(_this.value)
                }
                _this.hasInit = true
                editor.on('NodeChange Change KeyUp SetContent', () => {
                    this.hasChange = true
                    this.$emit('input', editor.getContent())
                })
            },
            setup(editor) {
                editor.on('FullscreenStateChanged', (e) => {
                    _this.fullscreen = e.state
                })
            }
        })
    }

    destroyTinymce() {
        const tinymce = window['tinymce'].get(this.tinymceId)
        if (this.fullscreen) {
            tinymce.execCommand('mceFullScreen')
        }

        if (tinymce) {
            tinymce.destroy()
        }
    }

    setContent(value) {
        window['tinymce'].get(this.tinymceId).setContent(value)
    }

    getContent() {
        window['tinymce'].get(this.tinymceId).getContent()
    }

    imageSuccessCBK(arr) {
        const _this = this
        arr.forEach(v => {
            window['tinymce'].get(_this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`)
        })
    }
}