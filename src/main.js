import Vue from 'vue'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import EleForm from 'vue-ele-form'
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
import VueHighlightJS from 'vue-highlightjs'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
// const { mockXHR } = require('../mock')
// mockXHR()
// }

Vue.use(Element, {
  size: 'small'// set element-ui default size
  // locale: enLang // 如果使用中文，无需设置，请删除
})
Vue.use(VueHighlightJS)
Vue.use(EleForm)
// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
Vue.prototype.$http = request

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
