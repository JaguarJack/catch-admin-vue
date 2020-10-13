<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        class="filter-item mr-5"
        v-model="queryParam.start_at"
        type="datetime"
        placeholder="选择开始日期时间">
      </el-date-picker>
      <el-date-picker
        class="filter-item mr-5"
        v-model="queryParam.end_at"
        type="datetime"
        placeholder="选择结束日期时间">
      </el-date-picker>
      <el-button class="filter-item search" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button class="filter-item" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
      <el-button v-if="this.selectedIds.length" size="small" class="filter-item mb-5" type="danger" icon="el-icon-delete" @click="handleMultiDelete">
        批量删除
      </el-button>
    </div>
    <el-table ref="multipleTable" :data="data" tooltip-effect="dark" style="width: 100%" border fit @selection-change="handleSelectMulti">
      <el-table-column type="selection" width="55" />
      <el-table-column label="登陆用户" prop="login_name" />
      <el-table-column prop="login_ip" label="登陆IP" />
      <el-table-column prop="browser" label="客户端" />
      <el-table-column prop="os" label="系统" />
      <el-table-column prop="status" label="登录状态">
        <template slot-scope="item">
          <el-tag v-if="item.row.status === 1" type="success">成功</el-tag>
          <el-tag v-else type="danger">失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="login_at" label="登陆时间">
        <template slot-scope="data">
          {{ formatLoginTime(data.row.login_at) }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination-container"
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
import { parseTime } from '@/utils'

export default {
  mixins: [formOperate],
  data() {
    return {
      url: 'log/login',
      queryParam: {
        start_at: '',
        end_at: ''
      },
      selectedIds: []
    }
  },
  methods: {
    formatLoginTime(time) {
      return parseTime(time)
    }
  }
}
</script>
