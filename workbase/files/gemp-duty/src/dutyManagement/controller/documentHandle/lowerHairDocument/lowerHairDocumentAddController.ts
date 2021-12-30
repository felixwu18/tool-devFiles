import { ControllerBase, Inject } from 'prism-web'
import searchSession from '../../../../../assets/libs/searchData';

export class LowerHairDocumentAddController extends ControllerBase {
  private temp = {
    style: require('../../../style/documentHandle/lowerHairDocument/lowerHairDocumentAdd.less')
  }
  constructor() {
    super()
  }

  @Inject('http') http: any
  //向弹出框传递参数
  private propsData: Object = {}
  private psbtn = true
  private checkPage:string = '1'
  

  created() {
   this.getLow()
  }
   getLow(){
    this.http.DocumentHandleRequest.getpsbtn().then(res => {
      if(res.data){
        this.psbtn = false
        this.checkPage = '2'
      }else{
        this.psbtn = true
      }
    })
   }



}


