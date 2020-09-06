<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParam.name" placeholder="用户名" clearable class="filter-item form-search-input" />
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
      <el-button class="filter-item fr" type="primary" icon="el-icon-plus" @click="handleCreate()">
        新增
      </el-button>
    </div>
    <el-button v-if="this.selectedIds.length" size="small" class="filter-item mb-5" type="danger" icon="el-icon-delete" @click="handleMultiDelete">
      批量删除
    </el-button>
    <el-table ref="multipleTable" :data="data" tooltip-effect="dark" style="width: 100%" border fit @selection-change="handleSelectMulti">
      <el-table-column type="selection" width="55" />
      <el-table-column label="岗位名称" width="120" prop="job_name" />
      <el-table-column prop="coding" label="编码" width="300" />
      <el-table-column prop="status" label="状态" width="150">
        <template slot-scope="job">
          <el-button v-if="job.row.status === 1" size="small">启用</el-button>
          <el-button v-else size="small" type="danger">禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" />
      <el-table-column label="操作">
        <template slot-scope="job">
          <el-button type="primary" icon="el-icon-edit" @click="handleUpdate(job.row)" />
          <el-button type="danger" icon="el-icon-delete" @click="handleDelete(job.row.id)" />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="paginate.current"
      hide-on-single-page
      :page-sizes="paginate.sizes"
      :page-size="paginate.limit"
      :layout="paginate.layout"
      :total="paginate.total"/>
    <!----------------------------------- 部门 ---------------------------------------------->
    <el-dialog :title="title" :visible.sync="formVisible" @close="handleCancel">
      <el-form :ref="formName" :model="formFieldsData" :rules="rules">
        <el-form-item label="岗位名称" :label-width="formLabelWidth" prop="job_name">
          <el-input v-model="formFieldsData.job_name" placeholder="请输入岗位名称" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="编码" :label-width="formLabelWidth" prop="coding">
          <el-input v-model="formFieldsData.coding" placeholder="请输入编码" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-radio v-model="formFieldsData.status" :label="1" checked>启用</el-radio>
          <el-radio v-model="formFieldsData.status" :label="2">禁用</el-radio>
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth" prop="sort">
          <el-input-number v-model="formFieldsData.sort" :min="1" :max="100000" />
        </el-form-item>
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
  mixins: [formOperate],
  data() {
    return {
      formName: 'jobs',
      formLabelWidth: '120px',
      // 用户搜索
      queryParam: {
        name: '',
        status: ''
      },
      formVisible: false,
      formFieldsData: {
        job_name: '',
        coding: '',
        status: 1,
        sort: 1
      },
      url: 'jobs',
      // 表单验证
      rules: {
        job_name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  }
}
</script>
