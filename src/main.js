// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'

// 引用axios，并设置基础URL为后端服务api地址
var axios = require('axios')
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.baseURL = 'http://127.0.0.1:8888/portal'
// axios.defaults.baseURL = 'http://134.175.1.174:8888/portal'
// 将API方法绑定到全局
Vue.prototype.$axios = axios
Vue.config.productionTip = false

// Vue.prototype.customConfig = {
//   // 正式服务器
//   // baseUrl: 'http://www.gd12316.com.cn'
//   // 测试服务器
//   baseUrl: 'http://127.0.0.1:8080'
// }
//配置视频上传地址
Vue.prototype.uploadVideoUrl="https://construct-party-1256364044.cos.ap-guangzhou.myqcloud.com"


Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
