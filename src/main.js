import Vue from 'vue'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/element-variables.scss'

// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import request from '@/utils/request'
import * as filters from './filters' // global filters
import VueHighlightJS from 'vue-highlight.js'

Vue.use(Element, {
  size: 'small'// set element-ui default size
  // locale: enLang // 如果使用中文，无需设置，请删除
})

Vue.use(VueHighlightJS)
// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 全局注册 CatchTable 组件
// import CatchTable from '@/components/Catch/Table'
// Vue.component('CatchTable', CatchTable)

Vue.config.productionTip = false
Vue.prototype.$http = request

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
