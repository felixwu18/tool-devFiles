import { __Type,TObject } from 'prism-web'
import { classes } from '../config/classes'

@__Type(classes.TreeNode)
export class TreeNode extends TObject {
    constructor(){
        super()
    }
    private  id:String;
    private  parentId:String;
    private  label:String;
    private  disabled:boolean;
    private  isLeaf:boolean;
    private  children:Array<TreeNode>;
}