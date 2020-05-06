import { axios } from '@/utils/request'

const VueAxios = {
  vm: {},
  // eslint-disable-next-line no-unused-vars
  install (Vue, instance) {
    if (this.installed) {
      return
    }
    this.installed = true

    if (!instance) {
      // eslint-disable-next-line no-console
      console.error('You have to install axios')
      return
    }

    Vue.axios = instance

    Object.defineProperties(Vue.prototype, {
      axios: {
        get: function get () {
          return instance
        }
      },
      $http: {
        get: function get (url, params) {
          return instance({
            url: url,
            method: 'get',
            params: params
          })
        },
        post: function post (url, data) {
          return instance({
            url: url,
            method: 'post',
            data: data
          })
        },
        put: function put(url, data) {
          return instance({
            url: url,
            method: 'put',
            data: data
          })
        },
        del: function del(url) {
          return instance({
            url: url,
            method: 'delete'
          })
        }
      }
    })
  }
}

export {
  VueAxios
}
