import { ControllerBase, Prop, Inject, App, Watch, Emit } from 'prism-web'
import { baseMapSrc, mapSearchUrl, mapSearchParams } from '../../../service/config/base'

export class GisMapController extends ControllerBase {
  @Prop() mapinfo
  // 是否需要向地图发送消息
  @Prop() postflag: boolean
  // 是否需要监听地图的信息
  @Prop() islistener: boolean

  //private baseMapSrc = 'http://localhost:9080/gis-map2/dist/index.html#'
  private mapSrc: string = ''
  // 地图的window对象
  private mapWindow = null

  constructor() {
    super()
  }

  created() {
    this.setMapSrcByType(this.mapinfo.type)
    if (this.postflag) {
      this.postMapMessage()
    }
    if (this.islistener) {
      this.addMapEvent()
    }
  }

  @Inject("http") http: any
  postMesgToMap(curMapInfo) {
    let message = { ...this.mapinfo }
    if (curMapInfo) {
      message = { ...curMapInfo }
    }
    message.type = 'singleData'
    console.log('向地图发消息：：' + JSON.stringify(message));
    this.mapWindow.postMessage(JSON.stringify(message), "*");
  }


  setMapSrcByType(type) {
    if (type == 'geometry-location') {
      this.mapSrc = baseMapSrc + '/location'
    } else if (type == 'geocode-success' || type === 'singleData') {
      this.mapSrc = baseMapSrc + '/center'
    } else {
      this.mapSrc = baseMapSrc + '/'
    }
  }

  @Emit('mapcallback')
  mapEventCallback(msgObj) {
    return msgObj
  }



  searchAddrByKey(val) {
    return new Promise(resolve => {
      mapSearchParams['keyword'] = val;
      let stringparams = this.parseGetParams(mapSearchParams);
      this.http.MapMessage.searchAddress(mapSearchUrl + stringparams).then(res => {
        let result = res.datas;
        resolve(result);
      }).catch(error => {

      });
    })
  }
  parseGetParams(mapSearchParams) {
    let parameArr = [];
    for (let [key, value] of Object.entries(mapSearchParams)) {
      if (typeof value == 'object') {
        parameArr.push(key + '=' + JSON.stringify(value));
      } else {
        parameArr.push(key + '=' + value);
      }
    }
    if (parameArr.length > 0) {
      return '?' + parameArr.join('&').replace(/#/g, '%23');
    }
    return '';
  }

  formatMapData(res) {
    if (res.datas && res.datas.length > 0) {
      let result = res.datas.map(item => {
        return {
          value: item.name,
          name: item.location.x + '-' + item.location.y,
          address: item.address.province + '-' + item.address.city + '-' + item.address.district + '-' + item.address.street
        };
      });
      return result;
    }
    return [];
  }

  // 监听地图发送参数方法
  addMapEvent() {
    let eventMethod = window.addEventListener
      ? "addEventListener"
      : "attachEvent";
    let eventer = window[eventMethod];
    let messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
    eventer(
      messageEvent,
      (e) => {
        if (e.data) {
          if (typeof (e.data) == 'string') {
            if (JSON.parse(e.data).type.indexOf('webpack') > 0) {
              return
            } else {
              if (JSON.parse(e.data).type == 'init') {
                if (this.postflag) {
                  this.postMapMessage()
                }
              }
              if (JSON.parse(e.data).type == 'geometry-location') {
                try {
                  let msgObj = JSON.parse(e.data)
                  //处理从地图接收到的消息
                  this.mapEventCallback(msgObj)
                } catch (ex) {
                  // console.log(ex);
                }
              }
            }
          }
        }
      },
      true
    )
  }

  // 向地图发送参数的方法
  postMapMessage() {
    if (!this.mapWindow) {
      let timeout = setInterval(() => {
        try {
          let window = document.getElementById('gisMapId')['contentWindow']
          if (window) {
            this.mapWindow = window
            this.postMesgToMap(false)
            clearInterval(timeout)
          }
        } catch (error) {

        }
      }, 2000)
    } else {
      this.postMesgToMap(false)
    }
  }

}
