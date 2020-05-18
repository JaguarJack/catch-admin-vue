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
    // 登录失败
    if (response.data.code === 10001) {
      Vue.ls.remove(ACCESS_TOKEN)
      router.push({ path: '/user/login' })
      // 延迟 1 秒显示错误信息
      setTimeout(() => {
        notification.error({
          message: response.data.message
        })
      }, 1000)
    }
    // 登录过期 刷新 token 重新请求
    if (response.data.code === 10006) {
      return service({
        url: 'refresh/token',
        method: 'post'
      }).then(res => {
        const token = res.data.token
        Vue.ls.set(ACCESS_TOKEN, token, 7 * 24 * 60 * 60 * 1000)
        store.commit('SET_TOKEN', token)
        const config = response.config
        config.headers['authorization'] = 'Bearer ' + token // 让每个请求携带自定义 token 请根据实际情况自行修改
        return service(config)
      })
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
