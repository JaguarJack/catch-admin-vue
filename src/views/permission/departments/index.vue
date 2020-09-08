<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParam.username" placeholder="部门名称" clearable class="filter-item form-search-input" />
      <el-select v-model="queryParam.status" clearable placeholder="请选择" class="filter-item" style="margin-right: 5px">
        <el-option value="1" label="启用" />
        <el-option value="2" label="禁用" />
      </el-select>
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
      <el-table-column
        prop="department_name"
        label="部门名称"
      />
      <el-table-column
        prop="sort"
        label="排序"
        sortable
      />
      <el-table-column
        prop="status"
        label="状态"
        sortable
      >
        <template slot-scope="department">
          <el-button v-if="department.row.status === 1" size="small">启用</el-button>
          <el-button v-else size="small" type="danger">禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" />
      <el-table-column label="操作">
        <template slot-scope="department">
          <el-button type="primary" icon="el-icon-plus" @click="formFieldsData.parent_id=department.row.id;handleCreate()" />
          <el-button type="primary" icon="el-icon-edit" @click="handleUpdate(department.row)" />
          <el-button type="danger" icon="el-icon-delete" @click="handleDelete(department.row.id)" />
        </template>
      </el-table-column>
    </el-table>
    <!------------------------- 部门 ------------------------------>
    <el-dialog :title="title" :visible.sync="formVisible" @close="handleCancel">
      <el-form :ref="formName" :model="formFieldsData" :rules="rules">
        <el-form-item label="部门名称" :label-width="formLabelWidth" prop="department_name">
          <el-input v-model="formFieldsData.department_name" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="部门负责人" :label-width="formLabelWidth">
          <el-input v-model="formFieldsData.principal" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="联系方式" :label-width="formLabelWidth">
          <el-input v-model="formFieldsData.mobile" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="formFieldsData.email" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-radio v-model="formFieldsData.status" :label="1" checked>启用</el-radio>
          <el-radio v-model="formFieldsData.status" :label="2">禁用</el-radio>
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input-number v-model="formFieldsData.sort" :min="1" :max="100000" />
        </el-form-item>
        <el-input v-model="formFieldsData.pid" type="hidden" />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
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
      formName: 'departments',
      formLabelWidth: '120px',
      formFieldsData: {
        department_name: '',
        principal: '',
        mobile: '',
        email: '',
        status: 1,
        sort: 1,
        parent_id: 0
      },
      queryParam: {
        name: '',
        status: ''
      },
      url: 'departments',
      // 验证规则
      rules: {
        department_name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  }
}
</script>
