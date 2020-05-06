import { message } from 'ant-design-vue'

export function toast (res, duration = 2) {
    if (res.code === 10000) {
      message.success(res.message, duration)
    } else {
      message.error(res.message, duration)
    }
}
