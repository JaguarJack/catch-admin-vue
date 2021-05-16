export default {
  mounted() {
    this.getList()
  },
  methods: {
    // 列表
    getList() {
      // 这里的判断防止 table 的 api route 是异步获取，在页面渲染的时候没有获取到，导致列表数据无法获取
      if (this.apiRoute) {
        this.$http.get(this.apiRoute, { params: this.queryParams }).then(response => {
          this.source = response.data
          this.handlePaginateResponse(response)
        })
      }
    },
    // 创建
    create(formData) {
      this.$http.post(this.apiRoute, formData.form).then(response => {
        this.handleResponse(response)
        if (this.getParent.afterSubmit !== undefined) {
          this.getParent.afterSubmit(formData);
        }
      }).catch(e => {
         //
        if (this.getParent.afterSubmit !== undefined) {
          this.getParent.afterSubmit(formData);
        }
      })
    },
    // 更新
    update(formData) {
      this.$http.put(this.apiRoute + '/' + formData.form.id, formData.form).then(response => {
        this.handleResponse(response)
        if (this.getParent.afterSubmit !== undefined) {
          this.getParent.afterSubmit(formData);
        }
      }).catch(e => {
          //
        if (this.getParent.afterSubmit !== undefined) {
          this.getParent.afterSubmit(formData);
        }
      })
    },
    // 删除
    delete(id, isMulti = false) {
      let title = isMulti ? '确定批量删除吗' : '确定删除吗';
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(this.apiRoute + '/' + id).then(response => {
          this.handleResponse(response)
        })
      }).catch(e => {
        //
      })
    },
    // 表单提交
    handleFormSubmit(formData) {
      if (this.getParent.beforeSubmit !== undefined) {
        formData = this.getParent.beforeSubmit(formData);
      }
      formData.validate((valid, fail) => {
        if(valid){
          if (formData.form.id !== undefined && formData.form.id) {
            this.update(formData)
          } else {
            this.create(formData)
          }
        }else{
          //todo 表单验证未通过
          return false
        }
      })
    },
    // 删除
    handleDelete(id) {
       if (id instanceof Array && id.length > 0) {
         this.delete(id.join(','), true)
       } else {
         this.delete(id)
       }
    },
    // 查看
    handleView(id) {

    },
    // 表单取消
    handleCancel(formData) {
      formData.resetFields()
      formData.clearValidateState()
      this.handleHiddenDialog()
    },
    // 展示弹窗
    // 如果 data 不是 null，说明是 update
    handleShowDialog(data = null, create = false) {
      this.dialog.visible = true
      this.getForm.clearValidateState()
      // 注意 form 对象必须要有
      if (data !== null && create === false) {
        this.dialog.title = '更新'
        this.form.data = data
      } else {
        this.dialog.title = '创建'
      }
    },
    // 隐藏弹窗
    handleHiddenDialog() {
      this.dialog.visible = false
      this.getForm.resetFields()
      this.getForm.clearValidateState()
      this.form.data = null
    },
    // 表格搜索
    handleSearch() {
      this.$http.get(this.apiRoute, { params: this.queryParams }).then(response => {
        this.source = response.data
        this.handlePaginateResponse(response)
      })
    },
    // 重置
    handleReset() {
      Object.keys(this.queryParams).forEach((k) => {
        // 如果未设置默认搜索参数，刷新将会清空搜索
        if (this.defaultQueryParams.length === 0) {
          this.queryParams[k] = ''
        } else {
          // 清空不包含默认搜索参数
          if (this.defaultQueryParams.indexOf(k) === -1) {
            this.queryParams[k] = ''
          }
        }
      })
      // 分页
      if (this.pagination.total) {
        this.queryParams.limit = this.pagination.limit
        this.queryParams.page = 1
      }
      this.getList()
    },

    handlePageChange(val) {
      this.queryParams.page = val
      this.queryParams.limit = this.pagination.limit
      this.getList()
    },
    handleSizeChange(val) {
      Object.assign(this.queryParams, { limit: val })
      this.getList()
    },

    /**
     * 处理响应
     *
     * @param response
     */
    handleResponse(response) {
      if (response.code === 10000) {
        this.$message.success(response.message)
        this.handleHiddenDialog()
        this.handleReset()
        // handleResponse 之后的处理
        if (this.getParent.afterHandleResponse !== undefined) {
          this.getParent.afterHandleResponse();
        }
      } else {
        this.$message.error(response.message)
      }
    },

    /**
     * 处理分页响应
     *
     * @param response
     */
    handlePaginateResponse(response) {
      if (response.limit !== undefined) {
        this.pagination.total = response.count
        this.pagination.currentPage = response.current
        this.pagination.limit = response.limit
      }
    },
    // 选择全部
    handleSelectMulti(rows) {
      this.selectedIds = []
      if (rows.length > 0) {
        rows.forEach(item => {
          this.selectedIds.push(item.id)
        })
      }
    }
  }
}



