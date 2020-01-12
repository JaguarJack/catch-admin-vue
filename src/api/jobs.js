/**
 * 岗位管理模块
 *
 */

import { axios } from '@/utils/request'

export function getJobList (parameter) {
  return axios({
    url: '/jobs',
    method: 'get',
    params: parameter
  })
}

export function store (parameter) {
  return axios({
    url: '/jobs',
    method: 'post',
    data: parameter
  })
}

export function read (id) {
  return axios({
    url: '/jobs/' + id,
    method: 'get'
  })
}

export function update (id, parameter) {
  return axios({
    url: '/jobs/' + id,
    method: 'put',
    data: parameter
  })
}

export function del (id) {
  return axios({
    url: '/jobs/' + id,
    method: 'delete'
  })
}

export function getAllJobs () {
  return axios({
    url: '/jobs/all',
    method: 'get'
  })
}
