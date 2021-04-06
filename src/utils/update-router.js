import store from '@/store'
import router from '@/router'

export function updateRouters() {
  store.dispatch('user/getInfo').then(response => {
    const { roles, permissions } = response
    store.dispatch('permission/generateRoutes', [roles, permissions]).then(routes => {
      if (!routes) new Error('accessRoutes error!')
      // 动态加入路由
      router.addRoutes(routes)
    })
  })
}
