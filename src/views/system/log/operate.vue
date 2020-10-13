<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParam.creator" placeholder="请输入操作人" clearable class="filter-item form-search-input" />
      <el-input v-model="queryParam.module" placeholder="请输入模块" clearable class="filter-item form-search-input" />
      <el-select v-model="queryParam.method" clearable placeholder="请选择请求方式" class="filter-item" style="margin-right: 5px">
        <el-option value="GET" label="GET" />
        <el-option value="POST" label="POST" />
        <el-option value="PUT" label="PUT" />
        <el-option value="DELETE" label="DELETE" />
      </el-select>
      <el-button class="filter-item search" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button class="filter-item" type="warning" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
      <el-button v-if="this.selectedIds.length" size="small" class="filter-item mb-5" type="danger" icon="el-icon-delete" @click="handleMultiDelete">
        批量删除
      </el-button>
    </div>
    <el-table ref="multipleTable" :data="data" tooltip-effect="dark" style="width: 100%" border fit @selection-change="handleSelectMulti">
      <el-table-column type="selection" width="55" />
      <el-table-column label="ID"  prop="id" />
      <el-table-column prop="creator" label="操作人" />
      <el-table-column prop="module" label="操作模块"/>
      <el-table-column prop="operate" label="操作菜单" />
      <el-table-column prop="route" label="菜单" />
      <el-table-column prop="method" label="请求方式" />
      <el-table-column prop="params" label="参数">
        <template slot-scope="data">
          <el-tooltip class="item" effect="dark" :content="data.row.params" placement="top-start">
            <el-tag type="success">查看</el-tag>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="操作时间">
        <template slot-scope="data">
          {{ formatLoginTime(data.row.created_at) }}
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
import { parseTime } from '@/utils'

export default {
  mixins: [formOperate],
  data() {
    return {
      url: 'log/operate',
      selectedIds: [],
      queryParam: {
        creator: '',
        module: '',
        method: ''
      }
    }
  },
  methods: {
    formatLoginTime(time) {
      return parseTime(time)
    }
  }
}
</script>
