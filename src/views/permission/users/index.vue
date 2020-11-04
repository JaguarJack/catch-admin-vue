<template>
  <div class="app-container">
    <el-row :gutter="12">
      <el-col :span="6">
        <el-card shadow="never">
          <div slot="header" class="clearfix">
            <span>部门</span>
          </div>
          <div class="block">
            <el-tree
              :data="departments"
              :props="departmentProps"
              node-key="id"
              default-expand-all
              :expand-on-click-node="false"
              @node-click="getDepartmentUsers"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <div class="filter-container">
          <el-input v-model="queryParam.username" placeholder="用户名" clearable class="filter-item form-search-input" />
          <el-input v-model="queryParam.email" placeholder="邮箱" clearable class="filter-item form-search-input" />
          <el-select v-model="queryParam.status" clearable placeholder="请选择" class="filter-item" style="margin-right: 5px">
            <el-option value="1" label="启用" />
            <el-option value="2" label="禁用" />
          </el-select>
          <el-button class="filter-item search" icon="el-icon-search" @click="handleSearch">
            搜索
          </el-button>
          <el-button class="filter-item" icon="el-icon-refresh" @click="handleRefresh">
            重置
          </el-button>
          <el-button class="filter-item fr" type="primary" icon="el-icon-plus" @click="handleCreate">
            新增
          </el-button>
        </div>
        <el-button v-if="this.selectedIds.length" size="small" class="filter-item mb-5" type="danger" icon="el-icon-delete" @click="handleMultiDelete">
          批量删除
        </el-button>
        <el-table
          ref="multipleTable"
          :data="data"
          tooltip-effect="dark"
          style="width: 100%"
          border
          fit
          @selection-change="handleSelectMulti"
        >
          <el-table-column type="selection" width="55" :selectable="selectInit"/>
          <el-table-column label="用户名">
            <template slot-scope="user">{{ user.row.username }}</template>
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱"
          />
          <el-table-column prop="status" label="状态">
            <template slot-scope="user">
              <el-switch
                v-if="user.row.id === 1"
                v-model="user.row.status"
                disabled
                active-text="启用"
                :active-value="1"
              />
              <el-switch
                v-else
                v-model="user.row.status"
                active-text="启用"
                inactive-text="禁用"
                :active-value="1"
                :inactive-value="2"
                @change="disOrEnableUser(user.row)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建时间" />
          <el-table-column label="操作">
            <template slot-scope="user">
              <el-button type="primary" icon="el-icon-edit" v-if="user.row.id === 1" disabled/>
              <el-button type="primary" icon="el-icon-edit" v-else @click="beforeHandleUpdate(user.row)"/>
              <el-button type="danger" icon="el-icon-edit" v-if="user.row.id === 1" disabled/>
              <el-button type="danger" icon="el-icon-delete" v-else @click="handleDelete(user.row.id)"/>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          class="pagination-container"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="paginate.current"
          hide-on-single-page
          :page-sizes="paginate.sizes"
          :page-size="paginate.limit"
          :layout="paginate.layout"
          :total="paginate.total"/>
      </el-col>
    </el-row>
    <!----------------------------------- 用户 ---------------------------------------------->
    <el-dialog :title="title" :visible.sync="formVisible" :destroy-on-close="true" width="40%" @close="handleCancel" >
      <el-form :ref="formName" :model="formFieldsData" :rules="rules">
        <el-row :gutter="12">
          <el-col :span="10">
            <el-form-item label="昵称" :label-width="formLabelWidth" prop="username">
              <el-input v-model="formFieldsData.username" placeholder="请输入用户昵称" autocomplete="off" clearable />
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
              <el-input v-model="formFieldsData.email" placeholder="请输入邮箱" autocomplete="off" clearable />
            </el-form-item>
            <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
              <el-input v-model="formFieldsData.password" placeholder="请输入密码" autocomplete="off" clearable />
            </el-form-item>
            <el-form-item label="角色" :label-width="formLabelWidth" prop="roles">
              <el-tree
                ref="roles"
                :data="treeRoles.data"
                show-checkbox
                node-key="id"
                :default-checked-keys="formFieldsData.roles"
                :props="treeRoles.prop"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" label-width="80px" prop="department_id">
              <el-cascader
                v-model="formFieldsData.department_id"
                :options="treeDepartments.data"
                :props="treeDepartments.prop"
                :show-all-levels="false"
                style="width: 85%"
                clearable/>
            </el-form-item>
            <el-form-item label="岗位" label-width="80px" prop="jobs">
              <el-select multiple v-model="formFieldsData.jobs" placeholder="请选择岗位" style="width: 85%">
                <el-option v-for="item in selectJobs" :key="item.id" :label="item.job_name" :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel()">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import formOperate from '@/layout/mixin/formOperate'

export default {
  mixins: [formOperate],
  data() {
    return {
      formName: 'users',
      // 刷新路由
      refreshRoute: true,
      departmentProps: {
        label: 'department_name'
      },
      formLabelWidth: '120px',
      // 用户搜索
      queryParam: {
        username: '',
        email: '',
        status: '',
        department_id: ''
      },
      formVisible: false,
      formFieldsData: {
        username: '',
        email: '',
        password: '',
        department_id: 0,
        jobs: [],
        roles: []
      },
      url: 'users',
      data: [],
      // 部门
      treeDepartments: {
        data: [],
        default: [],
        prop: {
          label: 'department_name',
          value: 'id',
          emitPath: false,
          checkStrictly: true
        }
      },
      // 岗位
      selectJobs: [],
      // 角色
      treeRoles: {
        default: [],
        data: [],
        prop: {
          label: 'role_name'
        }
      },
      // 表单验证
      rules: {
        username: [
          { required: true, message: '请输入用户', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '邮箱地址格式不正确', trigger: 'blur' }
        ],
        roles: [
          { required: true, message: '请选择角色', trigger: 'blur' }
        ]
      },
      // 部门
      departments: []
    }
  },
  // 初始化数据
  mounted() {
    this.$http.get('departments').then(response => {
      this.departments = response.data
    })
  },
  methods: {
    // 获取部门用户
    getDepartmentUsers(data, node, self) {
      this.queryParam.department_id = data.id
      this.handleSearch()
    },
    // 禁用/启用 用户
    disOrEnableUser(user) {
      this.$http.put('users/switch/status/' + user.id).then(response => {
        this.$message({
          message: response.message,
          type: 'success'
        })
      })
    },
    beforeCreate() {
      this.$http.get('roles').then(response => {
        this.treeRoles.data = response.data
      })
      this.$http.get('departments').then(response => {
        this.treeDepartments.data = response.data
      })
      this.$http.get('jobs').then(response => {
        this.selectJobs = response.data
      })
    },
    beforeHandleUpdate(user) {
      this.beforeCreate()
      this.$http.get(this.url + '/' + user.id).then(response => {
        const user = response.data
        const roleIds = []
        const jobIds = []
        user.roles.map(item => {
          roleIds.push(item.id)
        })
        user.jobs.map(item => {
          jobIds.push(item.id)
        })
        user.roles = roleIds
        user.jobs = jobIds
        user.password = ''
        this.handleUpdate(user)
      })
    },
    handleSelectRoles() {
      this.formFieldsData.roles = this.$refs.roles.getCheckedKeys()
    },
    selectInit(row, index) {
      return row.id !== 1
    },
    submit() {
      this.handleSelectRoles()
      this.handleSubmit()
    }
  }
}
</script>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
