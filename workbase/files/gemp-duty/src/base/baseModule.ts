import { SimpleModule } from 'prism-web'
import { ContainerBaseController } from './controllers/containerBaseController'

class BaseModule extends SimpleModule {
    constructor(){
        super()
    }

    configureView(){
        this.addView(process.env.baseurl+'base/template/containerBase.html',ContainerBaseController,'duty-handle-contain')
    }

    configureRouter(){

    }
}

module.exports = new BaseModule()