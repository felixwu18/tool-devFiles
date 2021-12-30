import {ControllerBase,Prop} from "prism-web";

export class TabController extends ControllerBase{
    
    @Prop() defaulttab
    @Prop() tabdata
   
    private template = {
        style: require('../style/tab.less')
    }

    handleClick(tab, event){
        //this.$emit('showCurYabPage', tab, event);
        //this.$parent.showCurYabPage(tab, event);
    }
    
}