import Vue from 'vue'

import { action } from '@/directive/permission'

import CatchTable from '@/components/Catch/Table'
import switch_ from '@/components/Catch/Table/columns/switch'
import editNumber from '@/components/Catch/Table/columns/editNumber'
import edit from '@/components/Catch/Table/columns/edit'
import select_ from '@/components/Catch/Table/columns/select'
import tinymce from '@/components/Tinymce'
import preview from '@/components/Catch/Table/columns/preview'
import download from '@/components/Catch/Table/columns/download'
import url from '@/components/Catch/Table/columns/url'
import copy from '@/components/Catch/Table/columns/copy'

import formCreate from '@form-create/element-ui'
import VueHighlightJS from 'vue-highlight.js'
import store from '@/store'
import router from '@/router'

import request from '@/utils/request'

/**
 * catchAdmin 包装类
 */
class CatchAdmin
{

  /**
   * admin 启动
   */
  boot()
  {
    this.registerCatchTableComponents()
    this.registerAdminDirectives()
    this.registerUsedPlugins()
  }

  /**
   * 注册 catchadmin 组件
   */
  registerCatchTableComponents()
  {
    this.installComponent('CatchTable', CatchTable)
    this.installComponent('switch_', switch_)
    this.installComponent('editNumber', editNumber)
    this.installComponent('edit', edit)
    this.installComponent('select_', select_)
    this.installComponent('preview', preview)
    this.installComponent('download', download)
    this.installComponent('url', url)
    this.installComponent('copy', copy)
    this.installComponent('editor', tinymce)
  }

  /**
   * 注册使用的插件
   */
  registerUsedPlugins()
  {
     Vue.use(formCreate)
     Vue.use(VueHighlightJS)
  }

  /**
   * 注册 admin 的指令
   */
  registerAdminDirectives()
  {
     this.installDirective('action', action)
  }

  /**
   * 安装全局组件
   *
   * @param name
   * @param component
   */
  installComponent(name, component)
  {
     Vue.component(name, component)
  }

  /**
   * 加载全局指令
   *
   * @param name
   * @param directive
   */
  installDirective(name, directive)
  {
    Vue.directive(name, directive)
  }

  /**
   * 加载页面组件
   *
   * @returns {{layout: (function(): Promise<*>), routeView: (function(): Promise<*>)}}
   */
  loadViewComponents()
  {
     // find router.js from views/
    const routeFiles = require.context('@/views/', true, /router.js$/)

    let routers = {
      layout: () => import('@/layout'),
      routeView: () => import('@/layout/routeView')
    }

    routeFiles.keys().map(item => {
      // require route.js
      // eslint-disable-next-line no-const-assign
      routers = Object.assign(routers, routeFiles(item).default)
    })

    return routers
  }

  /**
   *
   * @returns {{base: {layout: (function(): Promise<*>), routeView: (function(): Promise<*>)}}}
   */
  loadComponentsSelect()
  {
    const routeFiles = require.context('@/views/', true, /router.js$/)

    let routers = {
      base: {
        layout: () => import('@/layout'),
        routeView: () => import('@/layout/routeView')
      }
    }

    routeFiles.keys().map(item => {
      // require route.js
      // eslint-disable-next-line no-const-assign
      let router = {}
      router[item.split('/')[1]] = routeFiles(item).default

      routers = Object.assign(routers, router)
    })

    return routers
  }

  /**
   * 更新路由
   */
  updateRouters() {
    store.dispatch('user/getInfo').then(response => {
      const { roles, permissions } = response
      store.dispatch('permission/generateRoutes', [roles, permissions]).then(routes => {
        if (!routes) new Error('accessRoutes error!')
        // 动态加入路由
        router.addRoutes(routes)
      })
    })
  }

  /**
   * get 请求
   *
   * @param url
   * @param params
   * @returns {AxiosPromise}
   */
  get(url, params = {}) {
    return request({
      url: url,
      method: 'get',
      params: params
    })
  }

  /**
   * post 请求
   *
   * @param url
   * @param data
   * @param callback
   * @returns {AxiosPromise}
   */
  post(url, data = {}, callback = null) {
    return request({
      url: url,
      method: 'post',
      data
    })
  }

  /**
   * put 请求
   *
   * @param url
   * @param data
   * @returns {AxiosPromise}
   */
  put(url, data = {}) {
    return request({
      url: url,
      method: 'put',
      data
    })
  }

  /**
   * delete 请求
   *
   * @param url
   * @returns {AxiosPromise}
   */
  delete(url) {
    return request({
      url: url,
      method: 'delete'
    })
  }
  closeTagView(route, to) {
    store.dispatch('tagsView/delView', route).then(() => {
      router.push({
        path: to
      })
    })
  }
}

export default new CatchAdmin
