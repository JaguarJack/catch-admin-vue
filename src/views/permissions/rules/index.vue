<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParam.permission_name" placeholder="菜单名称" clearable class="filter-item form-search-input" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">
        搜索
      </el-button>
      <el-button class="filter-item" icon="el-icon-refresh" @click="handleRefresh">
        重置
      </el-button>
      <el-button class="filter-item fr" type="primary" icon="el-icon-plus" @click="handleCreate">
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
      <el-table-column prop="permission_name" label="菜单名称" width="180" />
      <el-table-column prop="route" label="路由Path" width="180" />
      <el-table-column prop="permission_mark" label="权限标识" width="180" />
      <el-table-column label="可操作权限" width="260">
        <template slot-scope="permission">
          <el-popover
            v-for="(action, index) in permission.row.actionList"
            :key="index"
            placement="top"
            width="180"
            title="操作"
          >
            <p>权限标识: {{ action.permission_mark }}</p>
            <div style="margin: 0;width: 200px">
              <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(action.id)">删除</el-button>
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleUpdate(beforeHandleUpdate(action))">编辑</el-button>
            </div>
            <el-tag slot="reference" style="margin-right: 2px;" size="mini">{{ action.permission_name }}</el-tag>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="150">
        <template slot-scope="permission">
          <el-switch
            v-model="permission.row.status"
            active-text="启用"
            inactive-text="禁用"
            :active-value="1"
            :inactive-value="2"
            @change="disOrEnablePermission(permission.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="160" />
      <el-table-column label="操作" width="200">
        <template slot-scope="permission">
          <el-button size="small" type="primary" icon="el-icon-plus" @click="beforeHandleCreate(permission.row);handleCreate()" />
          <el-button size="small" type="primary" icon="el-icon-edit" @click="isButton=false;handleUpdate(permission.row)" />
          <el-button size="small" type="danger" icon="el-icon-delete" @click="handleDelete(permission.row.id)" />
        </template>
      </el-table-column>
    </el-table>
    <!------------------------------------------------- 菜单表单 ----------------------- ------------------------------>
    <el-dialog :title="title" :visible.sync="formVisible" @close="handleCancel">
      <el-form :ref="formName" :model="formFieldsData" :rules="rules">
        <el-form-item v-if="showType" label="菜单名称" :label-width="formLabelWidth" prop="type">
          <el-radio-group v-model="formFieldsData.type" prop="type" @change="handleTypeChange">
            <el-radio-button label="1">菜单</el-radio-button>
            <el-radio-button label="2">按钮</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="菜单名称" :label-width="formLabelWidth" prop="permission_name">
              <el-input v-model="formFieldsData.permission_name" placeholder="请输入菜单名称" autocomplete="off" clearable />
            </el-form-item>
            <el-form-item v-show="!isButton" label="模块" :label-width="formLabelWidth" prop="module">
              <el-input v-model="formFieldsData.module" placeholder="请输入模块" autocomplete="off" clearable />
            </el-form-item>
            <el-form-item v-if="!isButton" label="菜单Path" :label-width="formLabelWidth" prop="route">
              <el-input v-model="formFieldsData.route" placeholder="请输入菜单Path" autocomplete="off" clearable />
            </el-form-item>
            <el-form-item v-if="!isButton" label="Redirect" :label-width="formLabelWidth" prop="redirect">
              <el-input v-model="formFieldsData.redirect" placeholder="请输入Redirect" autocomplete="off" clearable />
            </el-form-item>
            <el-form-item v-if="!isButton" label="keepalive" :label-width="formLabelWidth" prop="keepalive">
              <el-radio v-model="formFieldsData.keepalive" :label="1" checked>启用</el-radio>
              <el-radio v-model="formFieldsData.keepalive" :label="2">禁用</el-radio>
            </el-form-item>
            <el-form-item v-if="isButton" label="排序" :label-width="formLabelWidth" prop="sort">
              <el-input-number v-model="formFieldsData.sort" :min="1" :max="100000" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="isButton" label="权限标识" :label-width="formLabelWidth" prop="permission_mark">
              <template><span>{{ permissionPrefix }}@</span></template>
              <el-select v-model="formFieldsData.permission_mark" placeholder="请选择方法">
                <el-option v-for="item in methods" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item v-else label="权限标识" :label-width="formLabelWidth" prop="permission_mark">
              <el-input v-model="formFieldsData.permission_mark" placeholder="请输入权限标识(controller@action)" autocomplete="off" clearable />
            </el-form-item>
            <el-form-item v-if="!isButton" label="菜单 Icon" :label-width="formLabelWidth" prop="icon">
              <el-input v-model="formFieldsData.icon" placeholder="请选择菜单Icon" clearable @focus="selectIcon()" />
            </el-form-item>
            <el-form-item v-if="!isButton" label="组件" :label-width="formLabelWidth" prop="component">
              <el-select v-model="formFieldsData.component" filterable placeholder="请选择组件">
                <el-option v-for="(item, key) in components" :key="key" :value="key" :label="key" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="!isButton" label="排序" :label-width="formLabelWidth" prop="sort">
              <el-input-number v-model="formFieldsData.sort" :min="1" :max="100000" />
            </el-form-item>
            <el-form-item v-if="!isButton" label="hidden" :label-width="formLabelWidth">
              <el-radio v-model="formFieldsData.hidden" :label="1" checked>显示</el-radio>
              <el-radio v-model="formFieldsData.hidden" :label="2">隐藏</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-input v-model="formFieldsData.pid" type="hidden" />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择菜单图标" :visible.sync="iconVisable" width="70%">
      <icons @selectIcon="handleSelectIcon" />
    </el-dialog>
  </div>
</template>

<script>
import formOperate from '@/layout/mixin/formOperate'
import icons from './icons/index'
import componentsMap from '@/config/componentsMap'

export default {
  name: 'Index',
  components: {
    icons
  },
  mixins: [formOperate],
  data() {
    return {
      formName: 'rules',
      formLabelWidth: '120px',
      isButton: false,
      iconVisable: false,
      showType: false,
      // 组件
      components: componentsMap,
      // 按钮权限标识 prefix
      permissionPrefix: '',
      // 表单数据
      formFieldsData: {
        permission_name: '',
        permission_mark: '',
        module: '',
        icon: '',
        route: '',
        component: '',
        redirect: '',
        sort: 1,
        keepalive: 1,
        hidden: 1,
        type: 1 // 菜单
      },
      // 默认的搜索参数
      defaultQueryParam: ['actionList'],
      queryParam: { permission_name: '', actionList: 'actionList' },
      url: 'permissions',
      // 控制器方法
      methods: [],
      // 验证规则
      rules: {
        permission_name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        permission_mark: [
          { required: true, message: '请输入权限标识', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        module: [
          { required: true, message: '请输入模块', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        route: [
          { required: true, message: '请输入菜单路由', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ]
      },
      permissionProp: {
        label: 'permission_name'
      }
    }
  },
  methods: {
    selectIcon() {
      this.iconVisable = true
    },
    // 禁用权限
    disOrEnablePermission(permission) {
      this.$http.put('/permissions/show/' + permission.id).then(res => {
        this.$message.success(res.message)
        this.handleSearch()
      })
    },
    // 选择菜单图标
    handleSelectIcon(item) {
      this.formFieldsData.icon = item
      this.iconVisable = false
    },
    // 切换type
    handleTypeChange(value) {
      this.isButton = parseInt(value) === 2
    },
    beforeHandleUpdate(action) {
      this.isButton = true // 按钮
      this.showType = true // 按钮
      this.permissionPrefix = action.permission_mark.indexOf('@') === -1 ? action.permission_mark : action.permission_mark.split('@')[0]
      action.permission_mark = action.permission_mark.split('@')[1]
      return action
    },
    beforeHandleCreate(permission) {
      this.permissionPrefix = permission.permission_mark.indexOf('@') === -1 ? permission.permission_mark : permission.permission_mark.split('@')[0]
      this.isButton = true
      this.formFieldsData.type = 2 // 按钮
      this.showType = true
      this.formFieldsData.parent_id = permission.id
      this.getMethods(permission.id)
    },
    // 获取控制器方法
    getMethods(id) {
      this.$http.get('controller/methods/' + id).then((res) => {
        this.methods = res.data
      })
    }
  }
}
</script>
