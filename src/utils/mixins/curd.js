/**
 * 创建
 */
export function create () {
  this.form && this.form.resetFields();
  this.visible = true
  this.title = '新增'
}

/**
 * 更新
 *
 * @param record
 */
export function update (record) {
  const { form: { getFieldsValue, setFieldsValue } } = this
  this.$nextTick(() => {
    const values = getFieldsValue()
    console.log(values)
    Object.keys(values).forEach((k) => {
      values[k] = record[k]
    })
    setFieldsValue(values)
  })
  this.visible = true
  this.title = '更新'
}

/**
 * 删除
 *
 * @param url
 * @param title
 */
export function del (url, title) {
  this.$confirm({
    title: title,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      this.$http.delete(url).then((res) => {
        this.toast(res)
        this.$refs.table.refresh(true)
      })
    },
  })
}

/**
 * 批量删除
 *
 * @param url
 * @param title
 */
export function multiDel (url, title = '确定批量删除吗') {
  this.$confirm({
    title: title,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      this.$http.delete(url + this.selectedRowKeys.join(',')).then((res) => {
        this.toast(res)
        this.selectedRowKeys = []
        this.$refs.table.refresh(true)
      })
    },
    onCancel () {}
  })
}

/**
 * 提交
 */
export function submitForm (url) {
  const { form: { validateFields } } = this
  validateFields((errors, values) => {
    if (!errors) {
      if (!this.id) {
        this.$http.post(url, values).then((res) => {
            this.toast(res)
            this.visible = false
            this.$refs.table.refresh(true)
            this.id = null
            this.form.resetFields()
          })
      } else {
        this.$http.put(url + '/' + this.id, values).then((res) => {
            this.toast(res)
            this.visible = false
            this.$refs.table.refresh(true)
            this.form.resetFields()
          })
      }
    }
  })
}
