import { axios } from '@/utils/request'

/**
 * 生成代码
 *
 * @param parameter
 * @returns {*}
 */
export function generate (parameter) {
  return axios({
    url: '/generate',
    method: 'post',
    data: parameter
  })
}

/**
 * 预览代码块
 *
 * @param parameter
 * @returns {AxiosPromise}
 */
export function preview (parameter) {
  return axios({
    url: '/generate/preview',
    method: 'post',
    data: parameter
  })
}
