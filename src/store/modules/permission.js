import { constantRoutes } from '@/router'
// import role from '@/views/permission/role'
import components from '@/config/componentsMap'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

// eslint-disable-next-line no-unused-vars
function isAlwaysShow(routes) {
  routes.forEach(route => {
    if (route.children !== undefined && route.children.length === 1) {
      route.alwaysShow = true
    }
  })
  return routes
}

function notHiddenMenusNumber(menus) {
  return menus.filter(menu => {
    return menu.hidden === false
  }).length
}

function getAsyncRoutesFromPermissions(permissions, $pid = 0, roles) {
  const routes = []
  for (const permission of permissions) {
    if (permission.type === 1 && $pid === permission.parent_id) {
      const p = {}
      p.path = permission.route
      p.name = permission.module + '_' + permission.permission_mark
      if (permission.redirect) {
        p.redirect = permission.redirect
      }
      p.component = components[permission.component]
      p.meta = {}
      p.meta.title = permission.title
      p.meta.icon = permission.icon
      p.meta.roles = roles
      if (permission.keepalive === 2) {
        p.meta.noCache = true
      }
      // 隐藏OR显示
      p.hidden = permission.hidden === 2
      const children = getAsyncRoutesFromPermissions(permissions, permission.id)
      const childrenNum = notHiddenMenusNumber(children)
      if (childrenNum) {
        p.children = children
        if (childrenNum >= 1) {
          p.alwaysShow = true
        }
      }
      routes.push(p)
    }
  }
  return routes
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, params) {
    return new Promise(resolve => {
      let accessedRoutes
      const roles = params[0]
      const permissions = params[1]
      const asyncRoutes = isAlwaysShow(getAsyncRoutesFromPermissions(permissions, 0, roles))
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
