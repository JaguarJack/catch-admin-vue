import { asyncRouterMap, constantRouterMap } from '@/config/router.config'
import components from '@/config/componentsMap'

/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 *
 * @param permission
 * @param route
 * @returns {boolean}
 */
function hasPermission (permission, route) {
  if (route.meta && route.meta.permission) {
    // let a = components
    // console.log(a)
    for (let i = 0, len = permission.length; i < len; i++) {
    }
    return true
  }
  return true
}

/**
 * 单账户多角色时，使用该方法可过滤角色不存在的菜单
 *
 * @param roles
 * @param route
 * @returns {*}
 */
// eslint-disable-next-line
function hasRole(roles, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(roles.id)
  } else {
    return true
  }
}

/**
 *
 * @param routerMap
 * @param permissions
 * @returns {Int32Array | * | Uint32Array | any[] | Int8Array | Float64Array | BigUint64Array | Uint8Array | Int16Array | BigInt64Array | Float32Array | Uint8ClampedArray | Uint16Array}
 */
function filterAsyncRouter (routerMap, permissions) {
  const accessedRouters = routerMap.filter(route => {
    if (hasPermission(permissions, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, permissions)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

function treePermissions (permissions, $pid = 0) {
  let routes = []
  for (const permission of permissions) {
    if ($pid === permission.parent_id) {
        let p = {};
        p.path = permission.route
        p.name = permission.title
        if (permission.redirect) {
          p.redirect = permission.redirect
        }
        p.component = components[permission.component]
        p.meta = {}
        p.meta.title = permission.title
        p.meta.icon = permission.icon
        if (permission.keepalive === 1) {
          p.meta.keepAlive = true
        }
       const children = treePermissions(permissions, permission.id)
       if (children.length) {
        p.children = children
       }
       routes.push(p)
    }
  }
  return routes
}

function filterThenGetMenus (permissions) {
   const menus = [];
   for (const permission of permissions) {
     if (permission.type === 1) {
       menus.push(permission)
     }
   }
   return menus
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes ({ commit }, data) {
      return new Promise(resolve => {
        const { permissions } = data
        // let permissions = []
        asyncRouterMap[0].children = treePermissions(filterThenGetMenus(permissions))
        console.log(asyncRouterMap)
        commit('SET_ROUTERS', asyncRouterMap)
        resolve()
      })
    }
  }
}

export default permission
