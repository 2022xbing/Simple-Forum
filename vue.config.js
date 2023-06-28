// const { defineConfig } = require('@vue/cli-service')
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  // 输出文件目录
  outputDir:  "dist",
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,

  devServer: {
    open: false, //编译完成是否自动打开网页
    host: "0.0.0.0", //指定使用地址,默认是localhost,0.0.0.0代表可以被外界访问
    port: 8080,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8081/", //(必选)API服务器的地址
        changeOrigin: true, //(必选) 是否允许跨域
        ws: false, //(可选) 是否启用websockets
        secure: false, //(可选) 是否启用https接口
        pathRewrite: {
          "^/api": "", //匹配开头为/api的字符串,并替换成空字符串
        },
      },
    },
  },
  /**
   * 第三方插件配置
   */
  pluginOptions: {},
}
