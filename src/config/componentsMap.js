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
  users: () => import('@/views/permissions/users/users'),
  roles: () => import('@/views/permissions/roles/roles'),
  rules: () => import('@/views/permissions/rules/rules'),
  database: () => import('@/views/system/database/index'),
  loginLog: () => import('@/views/system/log/login'),
  operateLog: () => import('@/views/system/log/operate'),
  attachment: () => import('@/views/system/attachments/index'),
  departments: () => import('@/views/permissions/departments/departments'),
  jobs: () => import('@/views/permissions/jobs/jobs'),
  config: () => import('@/views/system/config'),
  generate: () => import('@/views/system/generate'),
  test: () => import('@/views/cms/test'),
  // cms 配置
  // 分类
  category: () => import('@/views/cms/category'),
  // 文章
  article: () => import('@/views/cms/article'),
  menus: () => import('@/views/wechat/menus'),
  sensitiveWord: () => import('@/views/system/sensitiveWord'),

  // 微信用户
  wechatUsers: () => import('@/views/wechat/users'),
  // 微信用户标签
  wechatTags: () => import('@/views/wechat/tags'),
  wechatGraphic:() => import('@/views/wechat/graphic'),
  // 友情链接
 // friendLink: () => import('@/views/cms/friendLink')
}
