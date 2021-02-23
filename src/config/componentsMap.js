/**
 * export component map
 */

// find router.js from views/
const routeFiles = require.context('../views/', true, /router.js$/)

let routers = {
  layout: () => import('@/layout'),
  routeView: () => import('@/layout/routeView')
}

routeFiles.keys().map(item => {
  // require route.js
  // eslint-disable-next-line no-const-assign
  routers = Object.assign(routers, routeFiles(item).default)
})

export default routers
