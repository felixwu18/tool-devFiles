import { ControllerBase, Prop, Inject, App, Watch, Emit } from 'prism-web'
import { baseMapSrc, mapSearchUrl, mapSearchParams, egisUrl } from '../../../service/config/base'
const egis = require('egis')
// import * as egis from 'egis'

const gisVector = require('../../../assets/image/gis-vector.png') // 地图矢量
const gisImage = require('../../../assets/image/gis-image.png') // 地图影像
const gisScreenBig = require('../../../assets/image/gis-screen-big.png') // 地图放大
const gisScreenSmall = require('../../../assets/image/gis-screen-small.png') // 地图缩小
const maxScreen = require('../../../assets/image/max-screen.png') // 全屏
const minScreen = require('../../../assets/image/min-screen.png') // 恢复全屏

export class EgisMapController extends ControllerBase {
  @Prop() mapinfo
  // 是否需要向地图发送消息
  @Prop() postflag: boolean
  // 是否需要监听地图的信息
  @Prop() islistener: boolean
  // 判断是否是详情页。详情页面只允许查看
  @Prop() isdetail: boolean

  //private baseMapSrc = 'http://localhost:9080/gis-map2/dist/index.html#'
  private mapSrc: string = ''
  // 地图的window对象
  private mapWindow = null

  constructor() {
    super()
  }

  private gisVector: any = gisVector
  private gisImage: any = gisImage
  private gisScreenBig: any = gisScreenBig
  private gisScreenSmall: any = gisScreenSmall
  private maxScreen: any = maxScreen
  private minScreen: any = minScreen

  private fullScreenStatus: Boolean = false


  private urlWMTS = egisUrl + '/service/api/egis/base/v1/wmts';//天地图wmts服务地址
  private client_id = '28524d8c65844630a3427270c9a16323';//用户id
  private client_secret = '84bc17650bb04491aa8475b9cbe3d1c4';//用户密码
  private urlService = egisUrl + '/service/api/egis/base/v1';//服务地址
  private tokenUrl = egisUrl + '/oauth/token';//授权服务地址
  private authType = 'Token';//授权类型

  private keyIndex = 1
  private egismap: any
  private resthttp: any
  private tiandituvec: any
  private tianditucta: any
  private WRGSService: any
  private elementLayer: any
  // 构造地图搜索服务对象
  private WPSSService: any
  // 当前点元素
  private currentDiotElement: any
  private WFSService: any
  private filterOutput: any

  private tiandituimg: any
  private tianditucia: any

  // 放大 缩小 全屏
  private fullExtentCommand: any
  private zoomInCommand: any
  private zoomOutCommand: any

  private commandNotify: any
  private commandManager: any

  private mapLayerStatus: boolean = true

  @Emit('mapcallback')
  mapEventCallback(msgObj) {
    msgObj.location.x = msgObj.location.x.toFixed(6)
    msgObj.location.y = msgObj.location.y.toFixed(6)
    return msgObj
  }

  // 将坐标点添加到地图上
  private addPointToMap(point) {
    if (this.currentDiotElement) {
      this.elementLayer.remove(this.currentDiotElement);
    }
    // 创建点元素符号，source可以传入图标的base64位编码字符串，也可以传入图标的文件路径
    const pointSymbol = new egis.sfs.PictureMarkerSymbol({
      source: 'data:image/png;base64,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',
      // source: 'IncidentPoint.png',
      width: 32,
      height: 38,
      offsetX: 16,
      offsetY: 38,
      opacity: 1
    });
    // 创建点元素对象
    this.currentDiotElement = new egis.sfs.Element({
      geometry: point,
      symbol: pointSymbol
    });
    // 将点元素对象添加到元素图层上
    this.elementLayer.add(this.currentDiotElement);
  }

  // 鼠标单击事件回调函数
  private mouseClickFunc(button: any, shift: any, screenx: any, screeny: any, mapx: any, mapy: any, handled: any): void {
    // 如果是详情页，不响应鼠标的点击事件
    if (this.isdetail) {
      return
    }
    // 根据屏幕的像素坐标获取经纬度坐标
    // 获取屏幕上指定像素位置对应地图上的地理坐标
    const coorArr = this.egismap.getCoordinateFromPixel([screenx, screeny]);
    if (Number(coorArr[1]) < 3.86 || Number(coorArr[1]) > 53.55 || Number(coorArr[0]) < 73.66 || Number(coorArr[0]) > 135.05) {
      this.$emit('mapstatustips', '目前的选择不在中国境内,请重新在地图上选择！')
      return
    }
    const point = new egis.sfs.Point({
      x: coorArr[0],
      y: coorArr[1],
      spatialReference: 4490
    })
    // // 将点添加到地图上
    // this.addPointToMap(point);
    // 构造逆向地理编码输入参数对象
    const WRGSInput = new egis.ews.WRGSInput({
      location: point,
      ext_poi: true,  // 是否搜索返回附近poi数据，为true则返回
      ext_road: true  //是否返回附近道路数据，为true则返回
    });
    // 调用逆向地理编码服务的regeocode接口
    let promise = this.WRGSService.regeocode(WRGSInput);
    promise.then((result) => {
      // result为服务返回结果数据
      if (result.address_component.country !== "中国") {
        this.$emit("mapstatustips", '目前的选择不在中国境内,请重新在地图上选择！');
        return
      }
      // 将点添加到地图上
      this.addPointToMap(point);
      this.mapEventCallback(result)
      console.log(result);
    }, (err) => {
      this.$emit("mapstatustips", '目前的选择不在中国境内,请重新在地图上选择！')
      return
      // console.log(err)
    })
  }

  // 通过地址搜索
  public searchKeyWord(val, data?) {
    return new Promise((resolve, reject) => {
      let keyword = decodeURI(val) || '武汉';
      //构造地图搜索服务的关键字搜索输入参数对象
      var keywordInput
      //因egis的缺陷，是单独的行政区划名称时，没有查询出数据，type == 4，重新查询一次，加人民方便数据能百分比查询出来

      if (this.keyIndex > 5) { return }
      if (data && data.type == 4) {
        keywordInput = new egis.ews.KeywordInput({
          keyword: data.admin.name + '人民',
          bounds: "-180,-90,180,90", // 检索矩形区域
          //  bounds: "87.18198,23.84396,116.5799,40.00327", // 检索矩形区域
          query_type: 2, // 搜索类型：1建议词查询；2 POI搜索；
          source: "all", //搜索来源：baidu 百度；tianditu 天地图；all 所有；
          region: data.admin.name + '人民',
          scope: 2, //详细程度，取值为1 或空，则返回基本信息；取值为2，返回检索POI详细信息
          level: 4,//融合等级（1-10）。融合策略以10为基数，融合等级即为首页百度数据量，1-4百度融合数据量递增，6-10百度融合数据量递减，达到5条后进行同比例融合。
        });
      } else {
        keywordInput = new egis.ews.KeywordInput({
          keyword: keyword,
          bounds: "-180,-90,180,90", // 检索矩形区域
          //  bounds: "87.18198,23.84396,116.5799,40.00327", // 检索矩形区域
          query_type: 2, // 搜索类型：1建议词查询；2 POI搜索；
          source: "all", //搜索来源：baidu 百度；tianditu 天地图；all 所有；
          region: "all", // keyword
          scope: 2, //详细程度，取值为1 或空，则返回基本信息；取值为2，返回检索POI详细信息
          level: 4,//融合等级（1-10）。融合策略以10为基数，融合等级即为首页百度数据量，1-4百度融合数据量递增，6-10百度融合数据量递减，达到5条后进行同比例融合。
        })
      }

      //2020-7-13,升级egis的版本，使用 egis.ews.KeywordInput 实例对象，作为关键字查询，egis.ews.SearchKeywordInput 暂时弃用
      // let keywordInput = new egis.ews.SearchKeywordInput({
      //   keyword: keyword,
      //   bounds: "-180,-90,180,90", // 检索矩形区域
      //   //  bounds: "87.18198,23.84396,116.5799,40.00327", // 检索矩形区域
      //   query_type: 1, // 搜索类型：1建议词查询；2 POI搜索；
      //   scope: 2, //结果详细程度,取值为1 或空，则返回基本信息；取值为2，返回检索POI详细信息
      //   level: 4,//融合等级（1-10）。融合策略以10为基数，融合等级即为首页百度数据量，1-4百度融合数据量递增，6-10百度融合数据量递减，达到5条后进行同比例融合。
      //   source: "all" //搜索来源：baidu 百度；tianditu 天地图；all 所有；
      // });

      let promise: any = this.WPSSService.keyWord(keywordInput);
      promise.then((result) => {
        console.log(result);
        var type
        if (result.baidu.type == 3 && result.tianditu.type == 3) {
          type = result.baidu.type
        } else if ((result.baidu.type == 3 && result.baidu.pois.length > 0) || (result.tianditu.type == 3 && result.tianditu.pois.length > 0)) {
          type = 3
        } else {
          type = 4
        }
        //清空元素图层
        this.elementLayer.clear();
        // pan()和setCenter()接口的区别是：pan()接口定位会改变地图层级，setCenter()接口不会改变地图层级
        // pan()接口的参数类型可以为egis.sfs.Point、egis.sfs.Polygon等
        // setCenter()接口的参数类型只能是: egis.sfs.Point
        switch (type) {
          case 3:
            this.keyIndex = 1
            // 关键词搜索地名
            let pois = result.baidu.pois && result.baidu.pois.length > 0 ? result.baidu.pois : result.tianditu.pois
            resolve(pois);
            if (!!pois && pois.length > 0) {
              // 展示pois数组中的第一条数据的点坐标添加到地图上
              let point = pois[0].location;
              this.addPointToMap(point);
              // 将地图定位到坐标点位置
              this.egismap.setCenter(point);
            }
            break;
          case 4:
            this.keyIndex++
            let data = result.tianditu || result.baidu;
            resolve(this.searchKeyWord(val, data))
            //2020-7-13,升级egis的版本，暂不使用以下方法
            // 关键词搜索行政区划
            // let admin = result.admin;
            // let admin = result.baidu.admin || result.tianditu.admin;
            // // 获取区域矩形范围
            // let bound = result.baidu.admin.bound || result.tianditu.admin.bound
            // if (!!bound) {
            //   let bboxArr = bound.split(',');
            //   let envelope = new egis.sfs.Envelope({
            //     minx: parseFloat(bboxArr[0]),
            //     miny: parseFloat(bboxArr[1]),
            //     maxx: parseFloat(bboxArr[2]),
            //     maxy: parseFloat(bboxArr[3])
            //   });
            //   // 根据矩形范围区域获取中心点，将中心点添加到地图上
            //   let point = envelope.center();
            //   this.addPointToMap(point);
            //   // 将地图定位到矩形范围区域
            //   this.egismap.pan(envelope);
            //   // 控制地图显示的级别，设置显示地图级别为10级，该方法可用可不用，根据项目上的需求进行选择
            //   this.egismap.zoomTo(10);
            // }
            break;
        }
      })
    })
  }

  // 设置地图点
  public setMapDiot(pois) {
    // 构建egis点
    const point = new egis.sfs.Point({
      x: pois.data.location.x,
      y: pois.data.location.y,
      spatialReference: 4490
    })
    // 在地图上加点
    this.addPointToMap(point);
    // 将地图定位到坐标点位置
    this.egismap.setCenter(point);
  }

  // 通过点获取地址
  public getAddressToDiot(pois) {
    // 构建egis点
    const point = new egis.sfs.Point({
      x: pois.data.location.x,
      y: pois.data.location.y,
      spatialReference: 4490
    })
    const WRGSInput = new egis.ews.WRGSInput({
      location: point,
      ext_poi: true,  // 是否搜索返回附近poi数据，为true则返回
      ext_road: true  //是否返回附近道路数据，为true则返回
    });
    // 调用逆向地理编码服务的regeocode接口
    let promise = this.WRGSService.regeocode(WRGSInput);
    promise.then((result) => {
      // result为服务返回结果数据
      // if (result.address_component.country !== "中国") {
      //   this.$emit("mapstatustips", '目前的选择不在中国境内,请重新在地图上选择！'); 
      //   return
      // }
      // 将点添加到地图上
      this.addPointToMap(point);
      // 将地图定位到坐标点位置
      // this.egismap.setCenter(point);
      this.mapEventCallback(result)
      console.log(result);
    }, (err) => {
      // this.$emit("mapstatustips", '目前的选择不在中国境内,请重新在地图上选择！') 
      return
      // console.log(err)
    })
  }

  /*
    * 获取行政区划信息 启用 不好用
    * dlg_boua_sheng_gn：省行政区划服务名称
    * dlg_boua_shi_gn: 市行政区划服务名称
    * */
  // public getDistrictCode(value) {
  //   return new Promise(resolve => {
  //     let filterLike = this.filterOutput.equalTo('name', '武汉市'); //模糊查询
  //     debugger
  //     // 创建要素查询对象，根据属性过滤条件查询
  //     let wfsInput = new egis.ews.FeatureInput({
  //         typenames: 'dlg_boua_sheng_gn',
  //       // typenames: 'dlg_boua_shi_gn',//查询要素的类型或类别（图层名称），多个名称以逗号分隔
  //         filter: filterLike
  //     });
  //     let result = this.WFSService.getFeature(wfsInput);//获取要素信息
  //     debugger
  //     result.then((data) => {
  //         console.log(data);
  //         for(var i = 0, len = data.size(); i< len; ++i) {
  //             var GFeature = data.get(i);
  //             // 获取行政区划编码信息， "pac":行政区别编码的属性名称
  //             // 根据行政区别编码属性名称获取行政区划编码值
  //             debugger
  //             var districCode = GFeature.getValue("pac");
  //             resolve(districCode);
  //         }
  //     })
  //   })
  // }

  /* 通过回传点获取行政区划信息 */
  public getDistrictCode(point) {
    return new Promise(resolve => {
      // 构造逆向地理编码输入参数对象
      const WRGSInput = new egis.ews.WRGSInput({
        location: point,
        ext_poi: true,  // 是否搜索返回附近poi数据，为true则返回
        ext_road: true  //是否返回附近道路数据，为true则返回
      });
      // 调用逆向地理编码服务的regeocode接口
      let promise = this.WRGSService.regeocode(WRGSInput);
      promise.then((result) => {
        // result为服务返回结果数据
        resolve(result)
        // console.log(result);
      })
    })
  }

  // 地图加载的监听事件
  public mapRenderFinish() {
    this.$emit("maprenderfinish") // 发送地图渲染完成状态 
    this.egismap.un("postrender", this.mapRenderFinish); // 解除监听
  }

  // 重新绘制地图高宽
  public updateMapSize() {
    this.egismap.map.updateSize();
  }

  // 切换矢量地图和影像地图
  public toogleMapLayer() {
    this.mapLayerStatus = !this.mapLayerStatus
    const layer = this.egismap.findLayer("天地图矢量");
    layer.setVisible(this.mapLayerStatus)
  }

  // 判断浏览器是否处于全屏状态 （需要考虑兼容问题）
  checkFull() {
    //火狐浏览器
    let isFull = (document as any).mozFullScreen ||
      (document as any).fullScreen ||
      //谷歌浏览器及Webkit内核浏览器
      (document as any).webkitIsFullScreen ||
      (document as any).webkitRequestFullScreen ||
      (document as any).mozRequestFullScreen ||
      (document as any).msFullscreenEnabled
    if (isFull === undefined) {
      isFull = false
    }
    return isFull;
  }

  // 全屏状态的回调
  public exitHandler(e) {
    if (!this.checkFull()) {
      this.fullScreenStatus = false;
    }
  }

  // 处理放大, 缩小, 全图
  public handleScreenEvent(name) {
    switch (name) {
      case 'fullExtent':
        // this.commandNotify.activeCommand('fullExtent');// 激活地图全图命令
        (document as any).getElementById("egisMapId").webkitRequestFullScreen();
        break;
      case 'zoomOut':
        this.commandNotify.activeCommand('zoomOut');// 激活地图缩小命令
        break;
      case 'zoomIn':
        this.commandNotify.activeCommand('zoomIn');// 激活地图放大命令
        break;
      default: break;
    }
  }

  public handleFullScreen() {
    const el: any = document.getElementById("egisMapId")
    // 判断是否已经是全屏
    // 如果是全屏，退出
    if (this.fullScreenStatus) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitCancelFullScreen) {
        (document as any).webkitCancelFullScreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
      console.log('已还原！');
    } else {    // 否则，进入全屏
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.webkitRequestFullScreen) {
        el.webkitRequestFullScreen();
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
      } else if (el.msRequestFullscreen) {
        // IE11
        el.msRequestFullscreen();
      }
      console.log('已全屏！');
    }
    // 改变当前全屏状态
    this.fullScreenStatus = !this.fullScreenStatus;
  }

  mounted() {
    // 创建地图
    this.egismap = new egis.carto.Map({
      "defaultExtent": {
        "center": [104.08170, 30.66100],
        "maxZoom": 22,
        "minZoom": 1,
        "level": 8,
        "projection": "EPSG:4490"
      }
    });

    // // 创建缩放控件对象
    // const zoomControl = new egis.control.ZoomControl();
    // // 将缩放控件添加到地图
    // this.egismap.addControl(zoomControl);

    // //创建全屏控件对象
    // const fullScreenControl = new egis.control.FullScreenControl();
    // //将全屏控件对象添加到地图
    // this.egismap.addControl(fullScreenControl);

    // 根据该对象获取Token验证
    this.resthttp = new egis.core.RestHttp({
      client_id: this.client_id,
      client_secret: this.client_secret
    });
    // 创建 天地图矢量 瓦片图层
    this.tiandituvec = new egis.carto.TileLayer({
      restHttp: this.resthttp, // 添加Token验证
      name: "天地图矢量",
      layers: "vec", // 图层名称,
      matrix: 21, // 切图级别小于等于切图级别,
      matrixSet: "c", // 切图策略,
      matrixPrefix: "", // 切图策略加冒号,
      format: "tiles", // 图层格式,
      projection: "EPSG:4490", // 投影参考,
      layerType: 1, // 图层类型,
      tileType: 102, // 瓦片类型,
      opacity: 1.0, // 透明度,
      visible: true, // 是否显示
      crossOrigin: "anonymous",
      style: "default",
      extent: { minx: -180, miny: -90, maxx: 180, maxy: 90 },
      wrapX: true, //是否展示循环图,
      url: this.urlWMTS
    });

    // 创建 天地图中文标注 瓦片图层
    this.tianditucta = new egis.carto.TileLayer({
      restHttp: this.resthttp,  // 添加Token验证
      name: "天地图中文标注",
      layers: "cva",  // 图层名称
      matrixSet: "c",  // 切图策略
      format: "tiles",  // 图层格式
      projection: "EPSG:4490",
      extent: { minx: -180, miny: -90, maxx: 180, maxy: 90 },
      matrixPrefix: "",
      matrix: 21,
      tileType: 102,  // 瓦片类型
      opacity: 1.0,
      visible: true,
      wrapX: true, "//": "是否展示循环图",
      url: this.urlWMTS  // 图层服务 url
    });

    // 创建 天地图影像图 瓦片图层
    this.tiandituimg = new egis.carto.TileLayer({
      restHttp: this.resthttp, // 添加Token验证
      name: "天地图影像图",
      layers: "img", // 图层名称,
      matrix: 21, // 切图级别小于等于切图级别,
      matrixSet: "c", // 切图策略,
      matrixPrefix: "", // 切图策略加冒号,
      format: "tiles", // 图层格式,
      projection: "EPSG:4490", // 投影参考,
      layerType: 1, // 图层类型,
      tileType: 102, // 瓦片类型,
      opacity: 1.0, // 透明度,
      visible: true, // 是否显示
      crossOrigin: "anonymous",
      style: "default",
      extent: { minx: -180, miny: -90, maxx: 180, maxy: 90 },
      wrapX: true, //是否展示循环图,
      url: this.urlWMTS
    });

    // 创建 天地图影像图中文标注 瓦片图层
    this.tianditucia = new egis.carto.TileLayer({
      restHttp: this.resthttp,  // 添加Token验证
      name: "天地图中文标注",
      layers: "cia",  // 图层名称
      matrixSet: "c",  // 切图策略
      format: "tiles",  // 图层格式
      projection: "EPSG:4490",
      extent: { minx: -180, miny: -90, maxx: 180, maxy: 90 },
      matrixPrefix: "",
      matrix: 21,
      tileType: 102,  // 瓦片类型
      opacity: 1.0,
      visible: true,
      wrapX: true, "//": "是否展示循环图",
      url: this.urlWMTS  // 图层服务 url
    });

    // 构造逆向地理编码服务对象
    this.WRGSService = new egis.ews.RestWRGSService({
      url: this.urlService,
      clientId: this.client_id,
      clientSecret: this.client_secret,
      authType: this.authType,
      tokenUrl: this.tokenUrl
    });
    // 创建一个元素图层
    this.elementLayer = new egis.carto.ElementLayer({
      id: 'elementLayer',
      name: '元素图层'
    });

    // 构造地图搜索服务对象
    this.WPSSService = new egis.ews.RestWPSSService({
      url: this.urlService,
      clientId: this.client_id,
      clientSecret: this.client_secret,
      authType: this.authType,
      tokenUrl: this.tokenUrl
    });

    // 构造WFS服务对象
    this.WFSService = new egis.ews.RestWFSService({
      url: this.urlService, //服务
      clientId: this.client_id,
      clientSecret: this.client_secret,
      authType: this.authType,
      tokenUrl: this.tokenUrl
    });

    // 创建FilterOutput对象
    this.filterOutput = new egis.ews.FilterOutput();

    // 初始化地图，传入要初始化的DOM对象的id
    this.egismap.init({ targetId: 'egisMapId' });

    //添加天地图影像图层
    this.egismap.addLayer(this.tiandituimg);
    //添加天地图影像图中文标注图层
    this.egismap.addLayer(this.tianditucia);

    //添加天地图矢量图层
    this.egismap.addLayer(this.tiandituvec);
    //添加天地图中文标注图层
    this.egismap.addLayer(this.tianditucta);

    //解绑地图egismap的鼠标单击事件
    // egismap.un('click',mouseClickFunc);

    // 监听地图egismap的鼠标单击事件
    this.egismap.on('click', this.mouseClickFunc);

    // 将元素图层添加到egismap地图上
    this.egismap.addLayer(this.elementLayer);

    // 监听渲染完成事件
    this.egismap.on("postrender", this.mapRenderFinish)

    // 创建地图全图命令
    this.fullExtentCommand = new egis.interact.FullExtentCommand({
      id: 'fullExtent',//地图全图的id
    });

    // 创建地图放大命令
    this.zoomInCommand = new egis.interact.ZoomInCommand({
      id: 'zoomIn'
    });

    // 创建地图缩小命令
    this.zoomOutCommand = new egis.interact.ZoomOutCommand({
      id: 'zoomOut'
    });

    this.commandManager = new egis.gdm.CommandManager();
    //创建命令通知实例，用来命令之间的相互通知，传入命令管理对象
    this.commandNotify = new egis.gdm.CommandNotify({
      manager: this.commandManager
    });
    //将命令放到命令管理中统一管理
    this.commandManager.add(this.fullExtentCommand);
    this.commandManager.add(this.zoomOutCommand);
    this.commandManager.add(this.zoomInCommand);
    //命令初始化
    this.commandManager.onCreate({
      map: this.egismap,
      commandNotify: this.commandNotify
    });

    // 监听全屏状态改变时的事件
    (document as any).addEventListener('fullscreenchange', this.exitHandler);
    (document as any).addEventListener('webkitfullscreenchange', this.exitHandler);
    (document as any).addEventListener('mozfullscreenchange', this.exitHandler);
    (document as any).addEventListener('MSFullscreenChange', this.exitHandler);

  }

}