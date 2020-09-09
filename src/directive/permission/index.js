import permission from './permission'
import action from './action'

const install = function(Vue) {
  Vue.directive('permission', permission)
  Vue.directive('action', action)
}

if (window.Vue) {
  window['permission'] = permission
  window['action'] = action
  Vue.use(install); // eslint-disable-line
}

permission.install = install
action.install = install
export { permission, action }
