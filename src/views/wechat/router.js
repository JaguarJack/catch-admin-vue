export default {
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
