export const timeFormat = (timestamp, state = true) => {
  let date = new Date(timestamp)
  let Y = date.getFullYear() + '-'
  let M = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 + '-' : '0' + (date.getMonth() + 1) + '-'
  let D = date.getDate() >= 10 ? date.getDate() + ' ' : '0' + date.getDate() + ' '
  let h = date.getHours() >= 10 ? date.getHours() + ':' : '0' + date.getHours() + ':'
  let m = date.getMinutes() >= 10 ? date.getMinutes() + ':' : '0' + date.getMinutes() + ':'
  let s = date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds()
  return state ? Y + M + D + h + m + s : Y + M + D
}

// export const downloadFunc = (file) => {
//   console.log(file);
  
//   let blob = new Blob([JSON.stringify(this.file, null, 2)], { type: 'application/json' })
//   let href = window.URL.createObjectURL(blob)
//   // 兼容ie的文件下载方法
//   if (window.navigator.msSaveBlob) {
//     try {
//       window.navigator.msSaveBlob(blob, file['name'])
//     } catch (e) {
//       console.log(e)
//     }
//   } else {
//     // 谷歌的下载方法
//     let downloadElement = document.createElement('a')
//     downloadElement.href = href
//     downloadElement.target = '_blank'
//     downloadElement.download = file['name']
//     document.body.appendChild(downloadElement)
//     downloadElement.click()
//     document.body.removeChild(downloadElement)
//     window.URL.revokeObjectURL(href) // 释放掉blob对象
//   }
// }

//同步资源导出的方法
export const downloadFuncs = (obj) => {
  // 兼容ie的文件下载方法
  let flag = window.navigator.userAgent.indexOf('Trident') > -1 && window.navigator.userAgent.indexOf('rv:11.0') > -1
  if (flag) {
    window.navigator.msSaveBlob(obj.blobStream, obj.filename)
    try {
    } catch (e) {
      console.log(e)
    }
  } else {
    // 谷歌的下载方法
    let downloadElement = document.createElement('a')
    downloadElement.href = obj.url
    downloadElement.target = '_blank'
    downloadElement.download = obj.filename
    document.body.appendChild(downloadElement)
    downloadElement.click()
    document.body.removeChild(downloadElement)
    window.URL.revokeObjectURL(obj.url) // 释放掉blob对象
  }
}


  // 获取url的值
  export const getRequestUrl = (url) => {
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
      var str: any = url.split('?')[1];
      let strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
      }
    }
    return theRequest;
  }
//将时间转化为世界标准时间 fmt判断是开始结束时间
export function dateStandard(date: string, fmt: string) {
  let newTime = '';
  if (fmt == 'start') {
    newTime = this.dateFormat(
        new Date(new Date(date + ' ' + '00:00').getTime() - 8 * 60 * 60 * 1000),
        'YYYY-mm-dd HH:MM:SS',
    );
  } else {
    newTime = this.dateFormat(
        new Date(new Date(date + ' ' + '00:00').getTime() + 16 * 60 * 60 * 1000),
        'YYYY-mm-dd HH:MM:SS',
    );
  }
  return newTime.split(' ')[0] + 'T' + newTime.split(' ')[1] + 'Z';
}

