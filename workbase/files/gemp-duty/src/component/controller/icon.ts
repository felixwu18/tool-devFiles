import { ControllerBase, Prop } from 'prism-web'

export class Icon extends ControllerBase {
    constructor(){
        super()
    }

    @Prop() iconType:string
}