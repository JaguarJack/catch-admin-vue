<template>
  <a-modal
    :title="title"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          label="岗位名称"
          type="text"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input allowClear v-decorator="['job_name', {rules: [{required: true, min: 2, message: '请输入至少2个字符！'}]}]" />
        </a-form-item>
        <a-form-item
          label="编码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input allowClear v-decorator="['coding']" />
        </a-form-item>
        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="状态"
        >
          <a-radio-group v-decorator="['status',{initialValue: status},{rules: [{required: true}]}]">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="2">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="排序"
        >
          <a-input-number :min="1" v-decorator="['sort', {initialValue: sort}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { store, update } from '@/api/jobs'
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
      confirmLoading: false,
      id: null,
      form: this.$form.createForm(this),
      roles: [],
      defaultRoles: [],
      required: true,
      title: '新建岗位',
      sort: 1,
      status: 1
    }
  },
  methods: {
    add () {
      this.visible = true
    },
    edit (record) {
      this.visible = true
      this.required = false
      this.id = record.id
      this.title = '编辑岗位'
      this.sort = record.sort
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue(pick(record, ['job_name', 'coding', 'sort', 'status']))
      })
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        if (!errors) {
          this.confirmLoading = true
          if (this.id) {
            update(this.id, values).then((res) => {
              this.refresh(res)
            })
          } else {
            store(values).then((res) => {
              this.refresh(res)
            })
          }
        }
      })
    },
    failed (errors) {
      this.$notification['error']({
        message: errors.message,
        duration: 4
      })
      this.handleCancel()
    },
    handleCancel () {
      this.id = null
      this.visible = false
      this.required = true
      this.confirmLoading = false
      this.form.resetFields()
      this.sort = 1
      this.status = 1
    },
    refresh (res) {
      this.toast(res)
      this.handleCancel()
      this.$parent.$parent.handleOk()
    },
    onChange (value, node, extra) {
      this.roleids = value
    }
  }
}
</script>
