<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParam.job_name" placeholder="岗位名称" clearable class="filter-item form-search-input" />
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
      <el-button class="filter-item fr" type="primary" icon="el-icon-plus" @click="handleCreate()">
        新增
      </el-button>
    </div>
    <el-button v-if="this.selectedIds.length" size="small" class="filter-item mb-5" type="danger" icon="el-icon-delete" @click="handleMultiDelete">
      批量删除
    </el-button>
    <el-table ref="multipleTable" :data="data" tooltip-effect="dark" style="width: 100%" border fit @selection-change="handleSelectMulti">
      <el-table-column type="selection" width="55" />
      <el-table-column label="岗位名称" prop="job_name" />
      <el-table-column prop="coding" label="编码" />
      <el-table-column prop="status" label="状态">
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
  </div>
</template>
<script>
import formOperate from '@/layout/mixin/formOperate'

export default {
  mixins: [formOperate],
  data() {
    return {
      formName: 'domain',
      formLabelWidth: '120px',
      // 用户搜索
      queryParam: {
        job_name: '',
        status: ''
      },
      url: 'domain',
    }
  }
}
</script>
