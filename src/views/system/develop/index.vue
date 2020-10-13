<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParam.username" placeholder="用户名" clearable class="filter-item form-search-input" />
      <el-input v-model="queryParam.mobile" placeholder="手机号号" clearable class="filter-item form-search-input" />
      <el-select v-model="queryParam.status" clearable placeholder="请选择" class="filter-item" style="margin-right: 5px">
        <el-option value="1" label="待认证" />
        <el-option value="2" label="已认证" />
      </el-select>
      <el-button class="filter-item search" icon="el-icon-search" @click="handleSearch">
        搜索
      </el-button>
      <el-button class="filter-item" icon="el-icon-refresh" @click="handleRefresh">
        重置
      </el-button>
    </div>
    <el-table :data="data" tooltip-effect="dark" style="width: 100%" border fit >
      <el-table-column label="ID" width="50" prop="id" />
      <el-table-column label="用户名" width="120" prop="username" />
      <el-table-column prop="mobile" label="手机号" width="200" />
      <el-table-column prop="id_card" label="身份证" width="200" />
      <el-table-column prop="alipay_account" label="支付宝账户" width="200" />
      <el-table-column prop="status" label="状态" width="200">
        <template slot-scope="develop">
          <el-switch
            v-model="develop.row.hidden"
            active-text="已认证"
            inactive-text="待认证"
            :active-value="1"
            :inactive-value="2"
          />
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" />
      <el-table-column prop="updated_at" label="更新时间" />
      <el-table-column label="操作" width="150">
        <template slot-scope="developer">
          <el-button type="primary" icon="el-icon-edit" @click="handleUpdate(developer.row)" />
          <el-button type="danger" icon="el-icon-delete" @click="handleDelete(developer.row.id)" />
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
  </div>
</template>
<script>
import formOperate from '@/layout/mixin/formOperate'

export default {
  mixins: [formOperate],
  data() {
    return {
      formName: 'words',
      formLabelWidth: '120px',
      // 用户搜索
      queryParam: {
        username: '',
        mobile: '',
        status: ''
      },
      url: 'developer',
    }
  }
}
</script>
