import { axios } from '@/utils/request'

export function loginLogList (parameter) {
  return axios({
    url: '/log/login',
    method: 'get',
    params: parameter
  })
}

export function emptyLoginLog () {
  return axios({
    url: '/loginLog/empty',
    method: 'delete',
  })
}

export function operateLogList (parameter) {
  return axios({
    url: '/log/operate',
    method: 'get',
    params: parameter
  })
}

export function emptyOperateLog () {
  return axios({
    url: '/operateLog/empty',
    method: 'delete',
  })
}
