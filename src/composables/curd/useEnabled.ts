import http from '@/support/http'
import { Code } from '@/enum/app'
import Message from '@/support/message'
import { ref, watch } from 'vue'
import { isFunction } from '@/support/helper'

export function useEnabled() {
  const isSuccess = ref(false)
  const loading = ref<boolean>(false)
  const afterEnabled = ref()
  function enabled(path: string, id: string | number, data: object = {}) {
    loading.value = true
    if (!id) {
       return false
    }
    http
      .put(path + '/enable/' + id, data)
      .then(r => {
        if (r.data.code === Code.SUCCESS) {
          isSuccess.value = true
          Message.success(r.data.message)
          if (isFunction(afterEnabled.value)) {
            afterEnabled.value()
          }
        } else {
          Message.error(r.data.message)
        }
      })
      .finally(() => {
        loading.value = false
      })
  }

  const success = (func: Function) => {
    watch(isSuccess, function () {
      isSuccess.value = false
      func()
    })
  }

  return { enabled, success, loading, afterEnabled }
}
