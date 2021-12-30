import { ControllerBase ,Prop} from 'prism-web'

export class TagController extends ControllerBase {
    constructor(){
        super()
    }

    private temp = {
        style: require("../style/tag.less")
    }

    private roleLevelList = ['best','better','good','normal','other']
    // tag类型 best | better | good | normal | other 
    @Prop() type:string

    get classType(){
       if(this.type) {
        return this.temp.style[this.roleLevelList[Number(this.type) - 1 ]]
       } else {
           return ''
       }
    }
}

