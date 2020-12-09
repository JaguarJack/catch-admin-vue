export default {
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
  form: () => import('@/views/system/form')
}
