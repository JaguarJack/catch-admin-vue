<template>
  <div class="app-container">
    <h3>域名设置</h3>
    <el-table :data="data" tooltip-effect="dark" style="width: 100%" border fit>
      <el-table-column type="index" width="55" />
      <el-table-column label="域名" prop="name" />
      <el-table-column prop="record_count" label="记录数" sortable />
      <el-table-column label="dns服务器">
        <template slot-scope="domain">
          {{ domain.row.dns_server.join() }}
        </template>
      </el-table-column>
      <el-table-column prop="from" label="运营商" />
      <el-table-column label="付费版本">
        <template slot-scope="domain">
          {{ domain.row.free ? '免费版' : '付费版' }}
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" />
      <el-table-column label="操作">
        <template slot-scope="domain">
          <router-link :to="'/domain/record/' + domain.row.name" style="margin-left: 5px">
            <el-button type="primary">
              解析设置
            </el-button>
          </router-link>
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
      url: 'domain'
    }
  },
  methods: {
    handleView(name) {
      this.$http.get('domain/' + name.replace('.', '-')).then(response => {

      })
    }
  }
}
</script>
