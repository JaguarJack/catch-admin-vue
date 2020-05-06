import { message } from 'ant-design-vue'

export function toast (res) {
    if (res.code === 10000) {
      message.success(res.message)
    } else {
      message.error(res.message)
    }
}
