const path = require('path')
const webpack = require('webpack')
module.exports = {
  
  publicPath: '/', // vueConf.baseUrl, // 根域上下文目录
  // outputDir: 'dist', // 构建输出目录
  // assetsDir: 'assets', // 静态资源目录 (js, css, img, fonts)
  lintOnSave: false, // 是否开启eslint保存检测，有效值：ture | false | 'error'
  devServer: {

    overlay: {

        warning: false,

        errors: false

    }

},
  // runtimeCompiler: true, // 运行时版本是否需要编译
  transpileDependencies: [], // 默认babel-loader忽略mode_modules，这里可增加例外的依赖包名
  productionSourceMap: false, // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度
  css: {
    // 配置高于chainWebpack中关于css loader的配置
    // modules: true, // 是否开启支持‘foo.module.css’样式
    // extract: true, // 是否使用css分离插件 ExtractTextPlugin，采用独立样式文件载入，不采用<style>方式内联至html文件中
    // sourceMap: false, // 是否在构建样式地图，false将提高构建速度
           
  },

  chainWebpack: config => {
    config.plugin('provide').use(webpack.ProvidePlugin, [{
      $: 'jquery',
      jquery: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }])
  },

  parallel: require('os').cpus().length > 1, // 构建时开启多进程处理babel编译
  
  pwa: {
    // 单页插件相关配置 https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  },
  devServer: {
    open: true,
    host: 'localhost',
    port: 8080,
    //这里的ip和端口是前端项目的;下面为需要跨域访问后端项目
    proxy: {
      '/api': {
        target: 'http://39.105.100.169:8080/',//这里填入你要请求的接口的前缀
        ws:true,//代理websocked
        changeOrigin:true,//虚拟的站点需要更管origin
        // secure: true,                   //是否https接口
        pathRewrite:{
          '^/api':''//重写路径
        },
        headers: {
          // referer: 'http://localhost:8081/ResourcesCenter/', //这里后端做了拒绝策略限制，请求头必须携带referer，否则无法访问后台
        }
      }
    }
  }
 } 
