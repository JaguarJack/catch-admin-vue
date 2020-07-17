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
      selectedRowKeys: []
    };
  },
  methods: {
    handleUpdate(record, col, idx) {
      curd.update.apply(this, record);
    },
    handleSave() {
      curd.create.apply(this)
    },
    handleDelete(record) {
      curd.del.apply(this, this.url.delete)
    },
    handleMultiDelete() {
      curd.multiDel.apply(this, this.url.delete)
    },
    handleSubmit() {
      curd.submit.apply(this, this.url.delete)
    }
  }
}
