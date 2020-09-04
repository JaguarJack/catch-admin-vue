/**
 * export component map
 */
export default {
  layout: () => import('@/layout'),
  // workplace: () => import('@/views/catchAdmin/dashboard/Workplace'),
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
  // menus: () => import('@/views/catchAdmin/wechat/menus'),
  //
  // 微信用户
  // wechatUsers: () => import('@/views/catchAdmin/wechat/users'),
  // 微信用户标签
  // wechatTags: () => import('@/views/catchAdmin/wechat/tags'),
  // wechatGraphic:() => import('@/views/catchAdmin/wechat/graphic'),
  // wechatReply:() => import('@/views/catchAdmin/wechat/reply')
}
