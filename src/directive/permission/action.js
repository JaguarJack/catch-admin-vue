import store from '@/store'

function checkAction(el, action) {
  const { value } = action
  const permissions = store.state && store.state.user.permissions
  if (value && typeof value === 'string') {
    const hasAction = permissions.some(permission => {
      console.log(permission.module)
      // eslint-disable-next-line no-unused-vars
      const action = value.indexOf('.') !== -1 ? value.replace('.', '@') : value
      const actionArr = action.split('@')
      // 如果未设置模块
      if (actionArr.length === 2) {
        return permission.permission_mark === action
      } else {
        // 设置模块 防止模块间的 action 重复
        return permission.module && action === permission.permission_mark
      }
    })
    if (!hasAction) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  } else {
    throw new Error(`need action! Like v-action="controller@action" || v-action="controller.action" `)
  }
}

export default {
  inserted(el, binding) {
    checkAction(el, binding)
  },
  update(el, binding) {
    checkAction(el, binding)
  }
}
