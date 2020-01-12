<template>
  <a-modal
    title="新建用户"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          label="用户名"
          type="text"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input allowClear v-decorator="['username', {rules: [{required: true, min: 3, message: '请输入至少3个字符！'}]}]" />
        </a-form-item>
        <a-form-item
          label="邮箱"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input allowClear v-decorator="['email', {rules: [{ required: true, validator: handleEmail }]}]" />
        </a-form-item>
        <a-form-item
          label="密码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input allowClear allotype="password" v-decorator="['password', {rules: [{required: required, min: 5, message: '请输入密码'}]}]" />
        </a-form-item>
        <a-form-item
          label="确认密码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input allowClear type="password" v-decorator="['passwordConfirm', {rules: [{required: required, min: 5, message: '请确认密码'}]}]" />
        </a-form-item>
        <a-form-item
          label="角色"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-tree-select
            style="width: 320px"
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="roles"
            placeholder="请选择角色"
            allowClear
            treeCheckable
            treeDefaultExpandAll
            @change="onChange"
            :showCheckedStrategy="SHOW_PARENT"
            v-decorator="['roles', {initialValue: roleids},{rules: [{required: true, message: '请选择角色'}]}]"
          >
          </a-tree-select>
        </a-form-item>
        <a-form-item
          label="部门"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-tree-select
            style="width: 320px"
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="department.tree"
            placeholder="请选择部门"
            allowClear
            treeDefaultExpandAll
            @change="onDepartmentChange"
            v-decorator="['department_id', {initialValue: department.has},{rules: [{required: true, message: '请选择部门'}]}]"
          >
          </a-tree-select>
        </a-form-item>
        <a-form-item
          label="岗位"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            mode="multiple"
            treeCheckable
            style="width: 100%"
            @change="handleJobsChange"
            placeholder="请选择岗位"
            v-decorator="['jobs', {initialValue: job.has},{rules: [{required: true, message: '请选择岗位'}]}]"
          >
            <a-select-option v-for="i in this.job.list" :key="i.id">{{ i.job_name }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { validEmail } from '@/utils/validate'
import { store, update, read } from '@/api/user'
import { getRoleList } from '@/api/role'
import pick from 'lodash.pick'
import { getAllJobs } from '@/api/jobs'
import { getDepartmentList } from '@/api/departments'

import { TreeSelect } from 'ant-design-vue'
const SHOW_PARENT = TreeSelect.SHOW_PARENT
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
      roleids: [],
      SHOW_PARENT,
      required: true,
      job: {
        list: [],
        has: [],
        ids: []
      },
      department: {
        tree: [],
        has: [],
        id: []
      }
    }
  },
  methods: {
    add () {
      this.visible = true
      this.getRoles()
      this.getJobs()
      this.getDepartments()
    },
    edit (record) {
      this.visible = true
      this.required = false
      this.id = record.id
      this.department.has = 'value_' + record.department_id
      this.getRoles()
      this.getJobs()
      this.getDepartments()
      this.getUser(this.id)
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue(pick(record, ['username', 'email']))
      })
    },
    handleEmail (rule, value, callback) {
      if (!validEmail(value)) {
        callback(new Error('邮箱地址不正确'))
      }
      callback()
    },
    // 获取角色
    getRoles () {
      getRoleList().then(res => {
        this.roles = this.resetRoles(res.data)
      })
    },
    // 获取部门
    getDepartments () {
      getDepartmentList().then(res => {
        this.department.tree = this.resetDepartments(res.data)
      })
    },
    // 获取用户角色
    getUser (id) {
      read(id).then(res => {
        const roles = res.data.roles
        roles.map(item => {
          this.roleids.push(item.id)
        })
        const jobs = res.data.jobs
        jobs.map(item => {
          this.job.has.push(item.id)
        })
      })
    },
    // 获取岗位
    getJobs () {
      getAllJobs().then(res => {
        this.job.list = res.data
      })
    },
    // 重组树结构
    resetRoles (roles) {
      roles.map(item => {
        item.value = item.id
        item.title = item.role_name
        if (item.children) {
          this.resetRoles(item.children)
        }
      })
      return roles
    },
    // 重组部门结构
    resetDepartments (departments) {
      departments.map(item => {
        item.value = 'value_' + item.id
        if (item.children) {
          // item.disabled = true
          this.resetDepartments(item.children)
        }
      })
      return departments
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      if (this.id) {
        validateFields(['username', 'email', 'roles'], (errors, values) => {
          if (!errors) {
            this.confirmLoading = true
            values['roles'] = this.roleids
            values['jobs'] = this.job.ids
            values['department_id'] = this.department.id.split('_')[1]
            update(this.id, values).then((res) => {
              this.refresh(res.message)
            }).catch(err => this.failed(err))
          }
        })
      } else {
        validateFields((errors, values) => {
          if (!errors) {
            values['jobs'] = this.job.ids
            values['department_id'] = this.department.id.split('_')[1]
            this.confirmLoading = true
            store(values).then((res) => {
              this.refresh(res.message)
            }).catch(err => this.failed(err))
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
      this.id = null
      this.visible = false
      this.required = true
      this.confirmLoading = false
      this.form.resetFields()
      this.roleids = []
      this.roles = []
      this.job.has = []
      this.department.has = []
    },
    refresh (message) {
      this.$notification['success']({
        message: message,
        duration: 4
      })
      this.handleCancel()
      this.$parent.$parent.handleOk()
    },
    onChange (value, node, extra) {
      this.roleids = value
    },
    onDepartmentChange (value) {
      console.log(value)
      this.department.id = value
    },
    handleJobsChange (value) {
      this.job.ids = value
    }
  }
}
</script>
