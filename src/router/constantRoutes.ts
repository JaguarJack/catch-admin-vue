import { RouteRecordRaw } from 'vue-router'
import { isUndefined } from '@/support/helper'
// @ts-ignore
export function getModuleRoutes() {
  const modules = import.meta.glob('@/module/**/views/router.ts', { eager: true })
  let moduleRoutes: RouteRecordRaw[] = []

  Object.keys(modules).forEach(routePath => {
    // @ts-ignore
    if (!isUndefined(modules[routePath].default)) {
      // @ts-ignore
      moduleRoutes = moduleRoutes.concat(modules[routePath].default)
    }
  })

  return moduleRoutes
}

// 获取初用户和开发模块的 view component
export function getModuleViewComponents() {
  const components = new Map()

  const importComponents: any = import.meta.glob(['../views/**/*.vue'])

  for (const k in importComponents) {
    components.set(k.replace('../views', ''), importComponents[k])
  }

  return components
}
