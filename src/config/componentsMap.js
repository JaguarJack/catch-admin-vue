/**
 * export component map
 */

// find router.js from views/
const routeFiles = require.context('../views/', true, /router.js$/)

let routers = {
  layout: () => import('@/layout')
}

routeFiles.keys().map(item => {
  // require route.js
  // eslint-disable-next-line no-const-assign
  routers = Object.assign(routers, routeFiles(item).default)
})

export default routers

/**
export default {
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
  // 配置管理
  config: () => import('@/views/system/config'),
  // 模块管理
  module: () => import('@/views/system/module'),
  // 表单构建
  form: () => import('@/views/system/form'),

  // 微信管理
  wechatMenus: () => import('@/views/wechat/menus'),
  //
  // 微信用户
  wechatUsers: () => import('@/views/wechat/users'),
  // 微信用户标签
  wechatTags: () => import('@/views/wechat/tags'),
  // wechatGraphic:() => import('@/views/catchAdmin/wechat/graphic'),
  wechatReply: () => import('@/views/wechat/reply'),

  // 系统监控
  // 定时任务
  crontab: () => import('@/views/monitor/crontab'),
  crontabLog: () => import('@/views/monitor/crontabLog'),
  // 短信平台
  sms: () => import('@/views/sms'),
  // 域名管理
  domain: () => import('@/views/domain'),
  // 域名记录
  domainRecord: () => import('@/views/domain/record')
}*/
