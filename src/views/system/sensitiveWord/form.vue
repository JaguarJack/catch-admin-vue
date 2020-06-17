<template>
    <a-modal
            :title="title"
            :width="800"
            :visible="visible"
            :confirmLoading="confirmLoading"
            @ok="handleSubmit"
            @cancel="handleCancel"
    >
        <a-spin :spinning="confirmLoading">
            <a-form :form="form">
                <a-form-item
                        label="敏感词"
                        type="text"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                >
                    <a-input v-decorator="['word', {rules: [{required: true, min: 2, max: 5, message: '敏感词长度只能是2～5个字符！'}]}]" />
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
  import pick from 'lodash.pick'

  export default {
    data () {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 13 }
        },
        visible: false,
        title: '新建敏感词',
        confirmLoading: false,
        id: null,
        form: this.$form.createForm(this),
      }
    },
    methods: {
      add () {
        this.visible = true
        this.title = '新建敏感词'
      },
      edit (record) {
        this.visible = true
        this.title = '编辑敏感词'
        const { form: { setFieldsValue } } = this
        this.id = record.id
        this.$nextTick(() => {
          setFieldsValue(pick(record, ['word']))
        })
      },
      handleSubmit () {
        const { form: { validateFields } } = this
        if (this.id) {
          validateFields((errors, values) => {
            if (!errors) {
              this.confirmLoading = true
              this.$http.put('sensitive/word/' + this.id, values).then((res) => {
                this.refresh(res)
              })
            }
          })
        } else {
          validateFields((errors, values) => {
            if (!errors) {
              this.confirmLoading = true
              this.$http.post('sensitive/word',values).then((res) => {
                this.refresh(res)
              })
            }
          })
        }
      },
      failed (errors) {
        this.$notification['error']({
          message: errors.message,
          duration: 4
        })
        this.handleCancel()
      },
      handleCancel () {
        this.visible = false
        this.id = null
        this.confirmLoading = false
        this.show = false
        this.form.resetFields()
      },
      refresh (res) {
        this.toast(res)
        this.handleCancel()
        this.$emit('refreshList')
      },
    }
  }
</script>
