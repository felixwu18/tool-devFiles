/**
 * session缓存处理服务
 */
const searchSession = {
  getter: function(obj) {
    return JSON.parse(sessionStorage.getItem(obj.name))
  },
  setter: function(obj) {
    return sessionStorage.setItem(obj.name, JSON.stringify(obj.data))
  },
  // 清除所有缓存的方法
  clear: function() {
    sessionStorage.clear()
  }
}

export default searchSession