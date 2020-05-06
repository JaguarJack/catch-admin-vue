<template>
  <a-modal
    :title="title"
    :width="650"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :gutter="0">
          <a-col :span="14">
            <a-form-item
              label="用户名"
              type="text"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input allowClear v-decorator="['username', {rules: [{required: true, min: 3, message: '请输入至少3个字符！'}]}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="角色"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-tree-select
                style="width: 200px"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                :treeData="roles"
                multiple
                placeholder="请选择角色"
                allowClear
                treeDefaultExpandAll
                @change="onChange"
                v-decorator="['roles', {initialValue: roleids},{rules: [{required: true, message: '请选择角色'}]}]"
              >
              </a-tree-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="0">
          <a-col :span="14">
            <a-form-item
              label="邮箱"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input allowClear v-decorator="['email', {rules: [{ required: true, validator: handleEmail }]}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="部门"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-tree-select
                style="width: 200px"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                :treeData="department.tree"
                placeholder="请选择部门"
                allowClear
                treeDefaultExpandAll
                @select="onDepartmentSelect"
                v-decorator="['department_id', {initialValue: department.has},{rules: [{required: true, message: '请选择部门'}]}]"
              >
              </a-tree-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="0">
          <a-col :span="14">
            <a-form-item
              label="密码"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input allowClear allotype="password" v-decorator="['password', {rules: [{required: password_required, min: 5, message: '请输入密码'}]}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="岗位"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-select
                mode="multiple"
                treeCheckable
                style="width: 200px"
                @change="handleJobsChange"
                placeholder="请选择岗位"
                v-decorator="['jobs', {initialValue: job.has},{rules: [{required: true, message: '请选择岗位'}]}]"
              >
                <a-select-option v-for="i in this.job.list" :key="i.id">{{ i.job_name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
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
import { refreshMenus } from '@/utils/util'

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
      title: '新建用户',
      id: null,
      form: this.$form.createForm(this),
      roles: [],
      defaultRoles: [],
      roleids: [],
      password_required: true,
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
      this.init()
      this.title = '新建用户'
    },
    edit (record) {
      this.password_required = false
      this.title = '编辑用户'
      this.id = record.id
      this.init()
      if (record.department_id) {
        this.department.has = String(record.department_id)
      }
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue(pick(record, ['username', 'email']))
      })
    },
    init () {
      this.visible = true
      this.getRoles()
      this.getJobs()
      this.getDepartments()
      if (this.id) {
        this.getUserRoles(this.id)
      }
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
    getUserRoles (id) {
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
        item.value = String(item.id)
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
            values['department_id'] = this.department.id
            update(this.id, values).then((res) => {
              this.refresh(res)
              refreshMenus()
            })
          }
        })
      } else {
        validateFields((errors, values) => {
          if (!errors) {
            values['jobs'] = this.job.ids
            values['department_id'] = this.department.id
            this.confirmLoading = true
            store(values).then((res) => {
              this.refresh(res)
              refreshMenus()
            })
          }
        })
      }
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
    refresh (res) {
      this.toast(res)
      this.handleCancel()
      this.$parent.$parent.handleOk()
    },
    onChange (value, node, extra) {
      this.roleids = value
    },
    onDepartmentSelect (value, node, extra) {
      if (node.dataRef.parent_id === 0 || node.dataRef.children && node.dataRef.children.length > 0) {
        this.$message.error('不允许选择父节点')
        this.$nextTick(() => {
          this.form.setFieldsValue({ department_id: null })
        })
        return false
      } else {
        this.department.id = value
      }
    },
    handleJobsChange (value) {
      this.job.ids = value
    }
  }
}
</script>
