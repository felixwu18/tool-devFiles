import { ControllerBase, Prop, Emit,Watch } from 'prism-web'

export class ViewDialogController extends ControllerBase {
    constructor() {
        super()
    }
    
    private temp = {
        //style:require("../style/listTable.less")
    }
    @Prop() viewdata;
    @Watch('viewdata')
    getviewdata(val) {
        if (val) {
            this.viewDialogdata = val
        }
    }
    private dialogVisible: Boolean = false
    private viewDialogdata = null
    create() {

    }
    mounted() {
        let dialog = document.querySelector(".overflowAuto").parentNode.parentNode
        dialog['style'].width = '60%'
    }
}