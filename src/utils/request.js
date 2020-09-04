import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken, setToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 是否再刷新
let refreshing = false
// 请求队列
let requests = []

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 10000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 10001 || res.code === 10004 || res.code === 10006) {
        // to re-login
        /** MessageBox.confirm(res.message + '，需要重新登陆', '退出', {
          confirmButtonText: '重新登陆',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })*/
        const config = response.config
        if (!refreshing) {
          refreshing = true
          return service({
            url: 'refresh/token',
            method: 'post'
          }).then(res => {
            const token = res.data.token
            setToken(token)
            config.headers['authorization'] = 'Bearer ' + token // 让每个请求携带自定义 token 请根据实际情况自行修改
            // 请求出队列
            requests.forEach(cb => cb(token))
            requests = []
            return service(config)
          }).catch(res => {}).finally(() => {
            refreshing = false
          })
        } else {
          return new Promise((resolve) => {
            // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
            requests.push((token) => {
              config.headers['authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义 token 请根据实际情况自行修改
              resolve(service(config))
            })
          })
        }
      }
      // 用户被禁止
      /** if (res.code === 10008) {
        MessageBox.confirm(res.message, '退出', {
          confirmButtonText: '退出',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/logout').then(() => {})
        })
      }*/

      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
