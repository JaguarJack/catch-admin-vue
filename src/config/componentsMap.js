/**
 * export component map
 */
export default {
  layout: () => import('@/layout'),
  routerView: () => import('@/layout/routeView'),
  // 权限管理
  users: () => import('@/views/permission/users'),
  roles: () => import('@/views/permission/roles'),
  rules: () => import('@/views/permission/rules'),
  departments: () => import('@/views/permission/departments'),
  jobs: () => import('@/views/permission/jobs'),
  // 系统设置
  database: () => import('@/views/system/database'),
  attachment: () => import('@/views/system/attachments'),
  loginLog: () => import('@/views/system/log/login'),
  operateLog: () => import('@/views/system/log/operate'),
  sensitiveWord: () => import('@/views/system/sensitiveWord'),
  develop: () => import('@/views/system/develop'),
  generate: () => import('@/views/system/generate'),
  config: () => import('@/views/system/config'),
  // 模块管理
  module: () => import('@/views/system/module'),
  // 微信管理
  wechatMenus: () => import('@/views/wechat/menus'),
  //
  // 微信用户
  wechatUsers: () => import('@/views/wechat/users'),
  // 微信用户标签
  wechatTags: () => import('@/views/wechat/tags'),
  // wechatGraphic:() => import('@/views/catchAdmin/wechat/graphic'),
  wechatReply: () => import('@/views/wechat/reply')
}
