/**
 * 部门管理模块
 *
 */

import { axios } from '@/utils/request'

export function getDepartmentList (parameter) {
  return axios({
    url: '/departments',
    method: 'get',
    params: parameter
  })
}

export function store (parameter) {
  return axios({
    url: '/departments',
    method: 'post',
    data: parameter
  })
}

export function read (id) {
  return axios({
    url: '/departments/' + id,
    method: 'get'
  })
}

export function update (id, parameter) {
  return axios({
    url: '/departments/' + id,
    method: 'put',
    data: parameter
  })
}

export function del (id) {
  return axios({
    url: '/departments/' + id,
    method: 'delete'
  })
}
