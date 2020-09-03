/**
 * export component map
 */
export default {
  layout: () => import('@/layout'),
  // workplace: () => import('@/views/catchAdmin/dashboard/Workplace'),
  // 权限管理
  users: () => import('@/views/permissions/users'),
  roles: () => import('@/views/permissions/roles'),
  rules: () => import('@/views/permissions/rules'),
  departments: () => import('@/views/permissions/departments'),
  jobs: () => import('@/views/permissions/jobs'),
  // 系统设置
  // database: () => import('@/views/catchAdmin/system/database'),
  // loginLog: () => import('@/views/catchAdmin/system/log/login'),
  // operateLog: () => import('@/views/catchAdmin/system/log/operate'),
  // attachment: () => import('@/views/catchAdmin/system/attachments'),
  // config: () => import('@/views/catchAdmin/system/config'),
  // generate: () => import('@/views/catchAdmin/system/generate'),
  // develop: () => import('@/views/catchAdmin/system/develop'),

  // menus: () => import('@/views/catchAdmin/wechat/menus'),
  // sensitiveWord: () => import('@/views/catchAdmin/system/sensitiveWord'),
  // 微信用户
  // wechatUsers: () => import('@/views/catchAdmin/wechat/users'),
  // 微信用户标签
  // wechatTags: () => import('@/views/catchAdmin/wechat/tags'),
  // wechatGraphic:() => import('@/views/catchAdmin/wechat/graphic'),
  // wechatReply:() => import('@/views/catchAdmin/wechat/reply')
}
