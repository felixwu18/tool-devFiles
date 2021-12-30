
let isProd = process.env.NODE_ENV !== 'development'
let resultObj = {}
let xmlHttp = new XMLHttpRequest()
xmlHttp.onreadystatechange = function () {
  if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
    resultObj = JSON.parse(xmlHttp.responseText)
  }
}
xmlHttp.open('get', isProd ? `../config/config.json?_=${Date.now()}` : process.env.baseurl + 'assets/json/config.json', false)
xmlHttp.send()
// 通讯调度业务
export const dispatchs = resultObj['dispatchs']
// 接报信息业务
export const baseUrl = resultObj['baseUrl']
// export const baseUrl="http://172.18.7.34:8096"
// 事故业务
export const accidentUrl = resultObj['accidentUrl']

// egis地图服务地址
export const egisUrl = resultObj['egisUrl'] || ''
// 事件信息业务
export const eventUrl = resultObj['eventUrl']

// 资源信息业务
export const dataUrl = resultObj['dataUrl']

// 预案信息业务
export const planUrl = resultObj['planUrl']

// 知识信息业务
export const knowledgeUrl = resultObj['knowledgeUrl']

// 标准信息服务
export const standardUrl = resultObj['standardUrl']

// 综合信息业务
export const generalUrl = resultObj['generalUrl']

// 用户信息业务
export const orgUrl = resultObj['orgUrl']

// gis服务根路径
export const baseMapSrc = resultObj['baseMapSrc']

// 文件下载服务根路径
export const uploadUrlFlie = resultObj['uploadUrlFlie']

// 下载文件组件地址
export const downloadUrl = resultObj['downloadUrl']

// 上传文件组件地址
export const uploadUrl = resultObj['uploadUrl']

// 传真服务地址
export const faxUrl = resultObj['faxUrl']

//简报ntko控件保持地址
export const reportUrl = resultObj['reportUrl']

//文件资源到导入地址
export const importUploadUrl = resultObj['importUploadUrl']
// 系统管理服务地址
export const adminUrl = resultObj['adminUrl']

export const dicUrl = resultObj['dicUrl']

// 危化专题企业信息服务地址
export const dangerousUrl = resultObj['dangerousUrl']


// 地址模糊查询服
export const mapSearchUrl = resultObj['mapSearchUrl']

// gis服务查询参数配置
export const mapSearchParams = resultObj['mapSearchParams']

// 进入一张图
export const jumpLink = resultObj['jumpLink']
