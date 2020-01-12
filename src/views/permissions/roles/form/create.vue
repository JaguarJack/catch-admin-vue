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
          label="角色名称"
          type="text"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['role_name', {rules: [{required: true, min: 3, message: '请输入至少3个字符！'}]}]" />
        </a-form-item>
        <a-form-item
          label="描述"
          type="textarea"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-textarea v-decorator="['description']" />
        </a-form-item>
        <a-form-item
          label="权限"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-tree
            checkable
            checkStrictly
            :treeData="permissions"
            @check="this.onCheck"
            :checkedKeys="permissionids"
          >
          </a-tree>
        </a-form-item>
        <a-form-item
          label="数据范围"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            style="width: 100%"
            @change="handleChange"
            v-decorator="['data_range', {initialValue: range},{rules: [{required: true, message: '请选择数据范围'}]}]"
          >
            <a-select-option v-for="i in this.dataRange" :key="i.id">{{ i.text }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="数据授权"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="show"
        >
          <a-tree-select
            style="width: 320px"
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="departments"
            placeholder="请选择部门"
            allowClear
            treeCheckable
            treeDefaultExpandAll
            @change="onDepartmentChange"
            :showCheckedStrategy="SHOW_PARENT"
            v-decorator="['departments', {initialValue: department_ids},{rules: [{required: true, message: '请选择部门'}]}]"
          >
          </a-tree-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { store, update, read } from '@/api/role'
import pick from 'lodash.pick'
import { getPermissionList } from '@/api/permission'
import { getDepartmentList } from '@/api/departments'
import { TreeSelect } from 'ant-design-vue'
const SHOW_PARENT = TreeSelect.SHOW_PAREN

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
      title: '新建角色',
      confirmLoading: false,
      id: null,
      parent_id: 0,
      form: this.$form.createForm(this),
      permissions: [],
      permissionids: [],
      show: false,
      dataRange: [
        { id: 0, text: '请选择数据权限' },
        { id: 1, text: '全部数据权限' },
        { id: 2, text: '自定义数据权限' },
        { id: 3, text: '仅本人数据权限' },
        { id: 4, text: '本部门数据权限' },
        { id: 5, text: '部门以及以下数据权限' }
      ],
      range: 0,
      departments: [],
      department_ids: [],
      SHOW_PARENT
    }
  },
  methods: {
    add () {
      this.visible = true
      this.title = '新增角色'
      this.getPermissions()
    },
    edit (record) {
      this.visible = true
      this.title = '编辑角色'
      const { form: { setFieldsValue } } = this
      this.id = record.id
      this.range = record.data_range
      this.getRolePermissions(this.id)
      this.getPermissions(record.parent_id > 0 ? { role_id: record.parent_id } : {})
      this.$nextTick(() => {
        setFieldsValue(pick(record, ['role_name', 'description', 'permissions']))
      })
    },
    addSon (record) {
      this.visible = true
      this.title = '新增子角色 (' + record.role_name + ')'
      this.parent_id = record.id
      this.getPermissions({ role_id: this.parent_id })
    },
    // 获取角色权限
    getRolePermissions (id) {
      read(id).then((res) => {
        const permissions = res.data.permissions
        permissions.map(item => {
          this.permissionids.push(item.id)
        })
      })
    },
    // 获取权限列表
    getPermissions (params) {
      getPermissionList(params).then(res => {
        this.permissions = this.resetPermissions(res.data)
      })
    },
    // 获取部门列表
    getDepartments () {
      getDepartmentList().then(res => {
        this.departments = this.resetDepartments(res.data)
      })
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      if (this.id) {
        validateFields((errors, values) => {
          if (!errors) {
            values['permissions'] = this.permissionids
            update(this.id, values).then((res) => {
              this.refresh(res.message)
            }).catch(err => this.failed(err))
          }
        })
      } else {
        validateFields((errors, values) => {
          if (!errors) {
            values['permissions'] = this.permissionids
            if (this.parent_id > 0) {
              values['parent_id'] = this.parent_id
            }
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
      this.visible = false
      this.id = null
      this.confirmLoading = false
      this.parent_id = 0
      this.permissionids = []
      this.form.resetFields()
    },
    refresh (message) {
      this.$notification['success']({
        message: message,
        duration: 4
      })
      this.handleCancel()
      this.$parent.$parent.handleOk()
    },
    // 重组树结构
    resetPermissions (permissions) {
      permissions.map(item => {
        item.title = item.permission_name
        item.key = item.id
        if (item.children) {
          this.resetPermissions(item.children)
        }
      })
      return permissions
    },
    // 重组部门结构
    resetDepartments (departments) {
      departments.map(item => {
        item.value = item.id
        if (item.children) {
          this.resetDepartments(item.children)
        }
      })
      return departments
    },
    onCheck (checkedKeys, info) {
      const data = info.node.dataRef
      const ids = []
      ids.push(data.id)
      if (data.hasOwnProperty('children')) {
        this.getAllLeaf(data.children, ids)
      }
      if (info.checked) {
        this.permissionids = this.permissionids.concat(ids)
      } else {
        this.permissionids = this.permissionids.filter(function (v) { return ids.indexOf(v) === -1 })
      }
    },
    getAllLeaf (data, ids = []) {
      data.forEach(item => {
        ids.push(item.id)
        if (item.hasOwnProperty('children')) {
          this.getAllLeaf(item.children, ids)
        }
      })
    },
    handleChange (value) {
      if (value === 2) {
        this.getDepartments()
        this.show = true
      } else {
        this.show = false
      }
    },
    onDepartmentChange (value, node, extra) {
      this.roleids = value
    }
  }
}
</script>
