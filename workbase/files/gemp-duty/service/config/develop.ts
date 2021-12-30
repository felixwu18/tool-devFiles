
(() => {
  //process.env.develop 为true 本地开发环境  为false 打包线上环境
  if (process.env.develop) {
    console.log('本地')
  }else {
    console.log('线上')
  }
})()
