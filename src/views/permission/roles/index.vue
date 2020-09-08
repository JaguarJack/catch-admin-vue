<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParam.role_name" placeholder="角色名称" clearable class="filter-item form-search-input" />
      <el-button class="filter-item search" icon="el-icon-search" @click="handleSearch">
        搜索
      </el-button>
      <el-button class="filter-item" icon="el-icon-refresh" @click="handleRefresh">
        重置
      </el-button>
      <el-button class="filter-item fr" type="primary" icon="el-icon-plus" @click="getPermissions();handleCreate()">
        新增
      </el-button>
    </div>
    <el-table
      :data="data"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        prop="role_name"
        label="角色名称"
      />
      <el-table-column
        prop="identify"
        label="角色标识"
      />
      <el-table-column
        prop="description"
        label="角色描述"
      />
      <el-table-column prop="created_at" label="创建时间" />
      <el-table-column label="操作">
        <template slot-scope="role">
          <el-button type="primary" icon="el-icon-plus" @click="beforeHandleCreate(role.row)" />
          <el-button type="primary" icon="el-icon-edit" @click="beforeHandleUpdate(role.row)" />
          <el-button type="danger" icon="el-icon-delete" @click="handleDelete(role.row.id)" />
        </template>
      </el-table-column>
    </el-table>
    <!------------------------- 角色 ------------------------------>
    <el-dialog :title="title" :visible.sync="formVisible" @close="handleCancel">
      <el-form :ref="formName" :model="formFieldsData" :rules="rules">
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="role_name">
          <el-input v-model="formFieldsData.role_name" placeholder="请输入角色名称" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="角色标识" :label-width="formLabelWidth" prop="identify">
          <el-input v-model="formFieldsData.identify" placeholder="角色标识，路由权限时使用" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth" prop="description">
          <el-input v-model="formFieldsData.description" type="textarea" />
        </el-form-item>
        <el-form-item label="权限" :label-width="formLabelWidth">
          <el-tree
            ref="permissions"
            :data="permissions"
            :props="permissionProp"
            show-checkbox
            node-key="id"
            :expand-on-click-node="false"
          />
        </el-form-item>
        <el-form-item label="数据权限" :label-width="formLabelWidth" prop="data_range">
          <el-select v-model="formFieldsData.data_range" placeholder="请选择数据权限" @change="selectDataRange">
            <el-option
              v-for="item in dataRange"
              :key="item.id"
              :label="item.text"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="showCustomize" label="自定义权限" :label-width="formLabelWidth">
          <el-cascader
            v-model="formFieldsData.departments"
            :options="departments"
            :props="departmentsProp"
            :show-all-levels="false"
            clearable/>
        </el-form-item>
        <el-input v-model="formFieldsData.parent_id" type="hidden" />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel()">取 消</el-button>
        <el-button type="primary" @click="handlePermissions();handleSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import formOperate from '@/layout/mixin/formOperate'

export default {
  name: 'Index',
  mixins: [formOperate],
  data() {
    return {
      formName: 'roles',
      formLabelWidth: '120px',
      // 刷新路由
      refreshRoute: true,
      formFieldsData: {
        role_name: '',
        identify: '',
        data_range: '',
        parent_id: 0,
        permissions: [],
        departments: []
      },
      permissions: [],
      queryParam: { role_name: '' },
      url: 'roles',
      dataRange: [
        { id: 1, text: '全部数据权限' },
        { id: 2, text: '自定义数据权限' },
        { id: 3, text: '仅本人数据权限' },
        { id: 4, text: '本部门数据权限' },
        { id: 5, text: '部门以及以下数据权限' }
      ],
      // 验证规则
      rules: {
        role_name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        identify: [
          { required: true, message: '请输入角色标识', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ]
      },
      permissionProp: {
        label: 'permission_name'
      },
      // 展示自定义权限
      showCustomize: false,
      departments: [],
      departmentsProp: {
        label: 'department_name',
        value: 'id',
        emitPath: false,
        multiple: true
      }
    }
  },
  methods: {
    handlePermissions() {
      // this.$refs.permissions.setCheckedKeys(this.$refs.permissions.getCheckedKeys().concat(this.$refs.permissions.getHalfCheckedKeys()), true,false);
      this.formFieldsData.permissions = this.$refs.permissions.getCheckedKeys().concat(this.$refs.permissions.getHalfCheckedKeys())
    },
    getPermissions(roleId) {
      const params = {
        role_id: roleId
      }
      this.$http.get('permissions', { params: params }).then(response => {
        this.permissions = response.data
      })
    },
    // 选择权限
    selectDataRange(value) {
      this.showCustomize = value === 2
      // 选择自定义权限
      if (value === 2) {
        this.$http.get('departments').then(response => {
          this.departments = response.data
        })
      } else {
        this.departments = []
      }
    },
    beforeHandleCreate(role) {
      this.getPermissions(role.id)
      this.formFieldsData.parent_id = role.id
      this.handleCreate()
    },
    setRolePermissions(id) {
      this.$http.get('roles/' + id).then((res) => {
        const permissions = res.data.permissions
        permissions.map(permission => {
          const node = this.$refs.permissions.getNode(permission.id)
          if (node.isLeaf) {
            this.$refs.permissions.setChecked(node, true)
          }
        })
        // 自定义数据
        this.showCustomize = res.data.data_range === 2
        if (res.data.data_range === 2) {
          this.$http.get('departments').then(response => {
            this.departments = response.data
          })
          const departments = []
          res.data.departments.map(item => {
            departments.push(item.id)
          })
          this.formFieldsData.departments = departments
        }
      })
    },
    beforeHandleUpdate(role) {
      this.getPermissions()
      this.setRolePermissions(role.id)
      this.handleUpdate(role)
    }
  }
}
</script>
