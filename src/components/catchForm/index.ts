import type { App } from 'vue'
import CatchForm from './CatchForm.vue'
import { $global } from '@/components/catchForm/config/symbol'
import * as Directives from '@/components/catchForm/directive'

import type {
  anyObject,
  schemaType,
  formValuesType,
  contextType,
  formItemType,
  formItemsType,
  formElement,
  changeItemType,
  $globalType
} from '@/components/catchForm/config/commonType'
import components from '@/components/catchForm/components'

/**
 * 合并 custom elements
 * @param customElements
 * @returns
 */
const handleMergeElements = (customElements: { [key: string]: formElement }) => {
  const mergeElements: { [key: string]: formElement } = {}

  Object.entries(components).forEach(([key, value]) => {
    const customData = customElements[key]
    if (customData) {
      return (mergeElements[key] = {
        ...value,
        component: customData.component,
        modelName: customData.modelName || 'modelValue',
        attr: customData.attr || value.attr
      })
    }

    return (mergeElements[key] = { ...value, modelName: 'modelValue' })
  })

  return mergeElements
}

type $optionsType = {
  http?: any
  // elements?: { [key: string]: formElement }
  // iconSelectConfig?: iconSelectConfigType
  customElements?: { [key: string]: formElement }
}

const install = function (app: App<Element>, options: $optionsType = {}) {
  const { http, customElements = {} } = options

  app.provide($global, {
    http: http,
    elements: handleMergeElements(customElements)
  })
  // 注册指令
  Object.values(Directives).forEach(fn => fn(app))
}

export { CatchForm }

export type { anyObject, schemaType, formValuesType, contextType, formItemType, formItemsType, formElement, changeItemType, $globalType }

export function bootstrapCatchForm(app: App, options:Object = {}) {
  install(app, options)
  app.component('CatchForm', CatchForm)
}
