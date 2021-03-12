/**
 * export component map
 */

// find router.js from views/
const routeFiles = require.context('../views/', true, /router.js$/)

let routers = {
  base: {
    layout: () => import('@/layout'),
    routeView: () => import('@/layout/routeView')
  }
}

routeFiles.keys().map(item => {
  // require route.js
  // eslint-disable-next-line no-const-assign
  let router = {}
  router[item.split('/')[1]] = routeFiles(item).default

  routers = Object.assign(routers, router)
})

export default routers
