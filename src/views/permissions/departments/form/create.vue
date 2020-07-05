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
          label="部门名称"
          type="text"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input allowClear v-decorator="['title', {rules: [{required: true, min: 2, max: 10, message: '部门名称至少输入2字符，最多支持10个字符'}]}]" />
        </a-form-item>
        <a-form-item
          label="部门负责人"
          type="text"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input allowClear v-decorator="['principal']" />
        </a-form-item>
        <a-form-item
          label="联系方式"
          type="text"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :filterOption="filterOption"
        >
          <a-input allowClear v-decorator="['mobile']" />
        </a-form-item>
        <a-form-item
          label="邮箱"
          type="text"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :filterOption="filterOption"
        >
          <a-input allowClear v-decorator="['email']" />
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
import { store, update } from '@/api/departments'
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
      title: '新建部门',
      confirmLoading: false,
      id: null,
      parent_id: 0,
      status: 1,
      form: this.$form.createForm(this),
      sort: 1
    }
  },
  methods: {
    add () {
      this.visible = true
      this.title = '新增部门'
    },
    edit (record) {
      this.visible = true
      this.title = '编辑部门'
      const { form: { setFieldsValue } } = this
      this.id = record.id
      console.log(record)
      this.$nextTick(() => {
        setFieldsValue(pick(record, ['title', 'principal', 'mobile', 'email', 'status', 'sort']))
      })
    },
    addSon (record) {
      this.visible = true
      this.title = '新增子部门 (' + record.title + ')'
      this.parent_id = record.id
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        values['department_name'] = values['title']
        if (!errors) {
          this.confirmLoading = true
          if (this.id) {
            update(this.id, values).then((res) => {
              this.refresh(res)
            })
          } else {
            if (this.parent_id > 0) {
              values['parent_id'] = this.parent_id
            }
            store(values).then((res) => {
              this.refresh(res)
            })
          }
        }
      })
    },
    handleCancel () {
      this.visible = false
      this.id = null
      this.confirmLoading = false
      this.parent_id = 0
      this.status = 1
      this.sort = 1
      this.form.resetFields()
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    refresh (res) {
      this.toast(res)
      this.handleCancel()
      this.$emit('ok')
    }
  }
}
</script>
