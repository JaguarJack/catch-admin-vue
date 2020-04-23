import {getInfo } from '@/api/login'
import store from '@/store'

export function timeFix () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome () {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent () {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader (callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () {}
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

export function isIE () {
  const bw = window.navigator.userAgent
  const compare = (s) => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate (id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

export function expandKeys (data, keys = []) {
  data.map(item => {
    keys.push(item.id)
    if (item.children !== undefined) {
      expandKeys(item.children, keys)
    }
  })
}

/**
 * 重组配置数据
 *
 * @param basic
 * @returns {{}}
 */
export function resetConfig (basic) {
  let initialData = {}
  for (const key in basic) {
    if (basic[key] instanceof Object) {
      for (const k in  basic[key]) {
        initialData[key + '.' + k] = basic[key][k]
      }
    } else {
      initialData[key] = basic[key]
    }
  }

  return initialData
}

/**
 * 刷新菜单
 */
export function refreshMenus () {
  getInfo().then(res => {
    const permissions = res.data && res.data.permissions
    store.dispatch('GetLatestRoutes', { permissions }).then(r => {})
  })
}
