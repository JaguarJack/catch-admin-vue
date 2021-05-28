import * as curd from './curd'

export default {
  data() {
    return {
      formVisible: false,
      data: [],
      id: null,
      selectedIds: [],
      title: '新增',
      paginate: {
        sizes: [10, 15, 20, 30, 50],
        limit: 10,
        layout: 'prev, pager, next, sizes',
        current: 0,
        total: 0
      },
      queryParam: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    hiddenDialog() {
      this.formVisible = false
    },
    handleResponse(response) {
      if (response.code === 10000) {
        this.$message.success(response.message)
        this.resetFormFields()
        this.handleRefresh()
        this.hiddenDialog()
        // 刷新路由
        if (this.refreshRoute !== undefined && this.refreshRoute === true) {
          this.handleUpdateUserInfo()
        }
        // 成功后
        this.id = null
      } else {
        this.$message.error(response.message)
      }
    },
    // 列表请求
    getList(params = null) {
      const query = params ? params : this.queryParam
      this.$http.get(this.url, { params: query }).then(response => {
        this.data = response.data
        this.handlePaginateResponse(response)
      })
    },
    // 弹出层
    handleCreate() {
      this.title = '新增'
      this.id = null
      // 创建前
      if (this.beforeCreate !== undefined) {
        this.beforeCreate()
      }
      this.formVisible = true
    },
    // 提交
    handleSubmit() {
      if (this.beforeSubmit !== undefined) {
        this.beforeSubmit()
      }
      curd.submitForm.apply(this, [this.url])
      this.handleRefresh()
    },
    // 更新
    handleUpdate(record, col, idx) {
      this.title = '更新'
      this.id = record[this.pk !== undefined ? this.pk : 'id']
      // 更新前
      if (this.beforeUpdate !== undefined) {
        this.beforeUpdate(record)
      }
      curd.update.apply(this, [record])
    },
    // 删除
    handleDelete(id) {
      // 更新前
      if (this.beforeDelete !== undefined) {
        this.beforeDelete()
      }
      curd.del.apply(this, [this.url + '/' + id, '确定删除吗?'])
    },
    // 关闭
    handleCancel() {
      this.formVisible = false
      // 防止提交关闭的时候 导致数据清空 所以延迟 300ms 清空数据
      setTimeout(this.resetFormFields, 300)
      this.$refs[this.formName].clearValidate()
      if (this.afterCancel !== undefined) {
        this.afterCancel()
      }
    },
    // 批量删除
    handleMultiDelete() {
      // 批量删除前
      if (this.beforeMultiDelete !== undefined) {
        this.beforeMultiDelete()
      }
      curd.multiDel.apply(this, [this.url, '确定批量删除吗？'])
    },
    // 搜索
    handleSearch() {
      this.queryParam.page = 1
      this.getList()
    },
    // 刷新
    handleRefresh() {
      Object.keys(this.queryParam).forEach((k) => {
        // 如果未设置默认搜索参数，刷新将会清空搜索
        if (this.defaultQueryParam === undefined) {
          this.queryParam[k] = ''
        } else {
          // 清空不包含默认搜索参数
          if (this.defaultQueryParam.indexOf(k) === -1) {
            this.queryParam[k] = ''
          }
        }
      })
      // 分页
      if (this.paginate.total) {
        this.queryParam.limit = this.paginate.limit
        this.queryParam.page = 1
      }
      this.getList()
    },
    // 选择全部
    handleSelectMulti(data) {
      this.selectedIds = []
      data.forEach(item => {
        this.selectedIds.push(item.id)
      })
    },
    resetFormFields() {
      Object.keys(this.formFieldsData).forEach((k) => {
        switch (typeof this.formFieldsData[k]) {
          case 'object':
            this.formFieldsData[k] = []
            break
          case 'bigint':
            this.formFieldsData[k] = 1
            break
          case 'number':
            if (k === 'parent_id' || k === 'pid') {
              this.formFieldsData[k] = 0
            } else {
              this.formFieldsData[k] = 1
            }
            break
          case 'string':
            this.formFieldsData[k] = ''
            break
          default:
            break

            // eslint-disable-next-line no-unreachable
            if (this.formFieldsDefaultValues !== undefined && this.formFieldsDefaultValues.indexOf(k)) {
              this.formFieldsData[k] = this.formFieldsDefaultValues[k]
            }
        }
      })
    },
    // 更新用户信息
    handleUpdateUserInfo() {
      this.admin.updateRouters()
    },
    handleSizeChange(val) {
      this.handlePaginateParams(val)
    },
    handleCurrentChange(val) {
      this.handlePaginateParams(0, val)
    },
    // 处理分页参数
    handlePaginateParams(limit = 0, page = 0) {
      if (limit) {
        this.queryParam.limit = limit
        this.paginate.limit = limit
      }
      if (page) {
        this.queryParam.page = page
        this.paginate.current = page
      }
      this.getList()
    },
    handlePaginateResponse(response) {
      if (response.limit !== undefined) {
        this.paginate.total = response.count
        this.paginate.limit = response.limit
        this.paginate.current = response.current
      }
    }
  }
}
