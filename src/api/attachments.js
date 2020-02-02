/**
 * 用户管理模块
 *
 */

import { axios } from '@/utils/request'

export function getAttachments (parameter) {
  return axios({
    url: '/attachments',
    method: 'get',
    params: parameter
  })
}

export function del (id) {
  return axios({
    url: '/attachments/' + id,
    method: 'delete'
  })
}
