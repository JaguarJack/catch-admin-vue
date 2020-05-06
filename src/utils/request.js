import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import router from '@/router'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  timeout: 6000, // 请求超时时间
  headers: {
    'X-Requested-with': 'XMLHttpRequest'
  }
})

// token 不存在 直接返回到登陆页面
const err = (error) => {
  if (error.response) {
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (! token) {
      notification.error({
        message: '登陆失效，请重新登陆',
      })

      setTimeout(() => {
        router.push({ path: '/user/login' })
        window.location.reload()
      }, 1500)
    }
  }
  return Promise.resolve(error)
}

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers['authorization'] = 'Bearer ' + token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  if (response.data.code !== 10000) {
    // 登录失效
    if (response.data.code === 10001) {
      router.push({ path: '/user/login' })
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        notification.error({
          message: response.data.message
        })
      }, 1000)
    }
    return Promise.resolve(response.data)
  } else {
    return response.data
  }
}, err)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
