// 获取初用户和开发模块的 view component
export function getModuleViewComponents() {
  const components = new Map()

  const importComponents: any = import.meta.glob(['../views/**/*.vue'])

  for (const k in importComponents) {
    components.set(k.replace('../views', ''), importComponents[k])
  }

  return components
}
