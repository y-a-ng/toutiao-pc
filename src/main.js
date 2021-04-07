/* 项目的启动入口 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 加载element组件库
import ElementUI from 'element-ui'
// 加载element组件库的样式
import 'element-ui/lib/theme-chalk/index.css'

// 加载全局样式文件
import './styles/index.less'

// 全局注册组件库
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.config.devtools = true
// 创建Vue根实例
// 把 router配置到根实例中
// 通过 render 方法把 App 根组件渲染到 #app 入口节点
new Vue({
  router,
  render: h => h(App)
  // el: "#app" 等价于 $mount("#app")
}).$mount('#app')
