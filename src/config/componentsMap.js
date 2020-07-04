/**
 * export component map
 */
export default {
  userLayout: () => import('@/layouts/UserLayout'),
  basicLayout: () => import('@/layouts/BasicLayout'),
  routeView: () => import('@/layouts/RouteView'),
  blankLayout: () => import('@/layouts/BlankLayout'),
  pageView: () => import('@/layouts/PageView'),
  workplace: () => import('@/views/dashboard/Workplace'),
  users: () => import('@/views/permissions/users'),
  roles: () => import('@/views/permissions/roles'),
  rules: () => import('@/views/permissions/rules'),
  database: () => import('@/views/system/database'),
  loginLog: () => import('@/views/system/log/login'),
  operateLog: () => import('@/views/system/log/operate'),
  attachment: () => import('@/views/system/attachments'),
  departments: () => import('@/views/permissions/departments'),
  jobs: () => import('@/views/permissions/jobs'),
  config: () => import('@/views/system/config'),
  generate: () => import('@/views/system/generate'),
  test: () => import('@/views/cms/test'),
  article: () => import('@/views/cms/article'),
  menus: () => import('@/views/wechat/menus'),
  sensitiveWord: () => import('@/views/system/sensitiveWord'),
  // 微信用户
  wechatUsers: () => import('@/views/wechat/users'),
  // 微信用户标签
  wechatTags: () => import('@/views/wechat/tags'),
  wechatGraphic:() => import('@/views/wechat/graphic'),
  wechatReply:() => import('@/views/wechat/reply')
}
