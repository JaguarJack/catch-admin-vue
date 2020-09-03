import * as curd from './curd'

export default {
  data() {
    return {
      formVisible: false,
      data: [],
      id: null,
      selectedIds: [],
      title: '新增'
    }
  },
  created() {
    this.$http.get(this.url, { params: this.queryParam }).then(response => {
      this.data = response.data
    })
  },
  methods: {
    // 弹出层
    handleCreate() {
      curd.create.apply(this)
    },
    // 新增
    handleSubmit() {
      curd.submitForm.apply(this, [this.url])
      this.formVisible = false
      this.id = null
      this.handleRefresh()
    },
    // 更新
    handleUpdate(record, col, idx) {
      this.id = record[this.pk !== undefined ? this.pk : 'id']
      curd.update.apply(this, [record])
    },
    // 删除
    handleDelete(id) {
      curd.del.apply(this, [this.url + '/' + id, '确定删除吗?'])
    },
    // 关闭
    handleCancel() {
      this.formVisible = false
      // 防止提交关闭的时候 导致数据清空 所以延迟 300ms 清空数据
      setTimeout(this.resetFormFields, 300)
      this.$refs[this.formName].clearValidate()
    },
    // 批量删除
    handleMultiDelete() {
      curd.multiDel.apply(this, [this.url, '确定批量删除吗？'])
    },
    // 重置表单
    resetSearchForm() {
      this.queryParam = {}
      this.handleRefresh()
    },
    // 搜索
    handleSearch() {
      this.$http.get(this.url, { params: this.queryParam }).then(response => {
        this.data = response.data
      })
    },
    // 刷新
    handleRefresh() {
      Object.keys(this.queryParam).forEach((k) => {
        if (this.defaultQueryParam !== undefined && this.defaultQueryParam.indexOf(k) === -1) {
          this.queryParam[k] = ''
        }
      })
      this.handleSearch()
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
            this.formFieldsData[k] = 1
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
    }
  }
}
