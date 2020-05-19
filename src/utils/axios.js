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

    Object.defineProperty(Vue.prototype, '$http', {
      value: {
        get: function (url, params) {
          return instance({
            url: url,
            method: 'get',
            params: params
          })
        },
        post: function (url, data) {
          return instance({
            url: url,
            method: 'post',
            data: data
          })
        },
        put: function (url, data) {
          return instance({
            url: url,
            method: 'put',
            data: data
          })
        },
        delete: function (url) {
          return instance({
            url: url,
            method: 'delete'
          })
        }
      }
    })

    Object.defineProperties(Vue.prototype, {
      axios: {
        get: function get () {
          return instance
        }
      }
    })
  }
}

export {
  VueAxios
}
