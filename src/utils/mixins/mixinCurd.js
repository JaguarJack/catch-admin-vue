import * as curd from './curd'

export default {
  data() {
    return {
      queryParam: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      confirmLoading: false,
      visible: false,
      form: this.$form.createForm(this),
      id: null,
      selectedRowKeys: [],
      title: '新增',
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return this.$http.get(this.url, Object.assign(parameter, this.queryParam) ).then(res => {
          return res
        })
      },
    };
  },
  methods: {
    handleUpdate(record, col, idx) {
      this.id = record[this.pk ? this.pk : 'id']
      curd.update.apply(this, [record]);
    },
    handleSave() {
      curd.create.apply(this)
    },
    handleDelete(record) {
      curd.del.apply(this, [this.url + '/' + record[this.pk ? this.pk : 'id'], '确定删除吗?'])
    },
    handleMultiDelete() {
      curd.multiDel.apply(this, [this.url])
    },
    handleSubmit() {
      curd.submitForm.apply(this, [this.url])
    },
    handleHidden() {
      this.visible = false
      this.form.resetFields()
    },
    resetSearchForm() {
      this.queryParam = {}
      this.handleRefresh()
    },
    handleRefresh() {
      this.$refs.table.refresh(true)
    }
  }
}
