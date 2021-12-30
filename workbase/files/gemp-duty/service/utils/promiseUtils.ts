import {TObject} from 'prism-web'
import { hideLoading } from '../Loading/loading'

export function promiseUtils (data:Promise<any>) {
    return new Promise( (resolve,reject) => {
        data.then(result => {
            let parseJson = TObject.create(JSON.stringify(result.data));
            hideLoading()
            resolve(parseJson)
        }).catch(error=>{
            reject(error)
        })
    })
}