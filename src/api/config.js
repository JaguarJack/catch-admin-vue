import {axios} from '@/utils/request'

export function getParent () {
  return axios.get('/config/parent')
}

export function store (params) {
  return axios.post('config', params)
}

export function show (id) {
  return axios.get('/config/' + id)
}
