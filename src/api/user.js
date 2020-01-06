/**
 * 用户管理模块
 *
 */

import { axios } from '@/utils/request'

export function getUserList (parameter) {
  return axios({
    url: '/users',
    method: 'get',
    params: parameter
  })
}

export function store (parameter) {
  return axios({
    url: '/users',
    method: 'post',
    data: parameter
  })
}

export function read (id) {
  return axios({
    url: '/users/' + id,
    method: 'get'
  })
}

export function update (id, parameter) {
  return axios({
    url: '/users/' + id,
    method: 'put',
    data: parameter
  })
}

export function del (id) {
  return axios({
    url: '/users/' + id,
    method: 'delete'
  })
}

export function swtichStatus (id) {
  return axios({
    url: '/users/switch/status/' + id,
    method: 'put'
  })
}
