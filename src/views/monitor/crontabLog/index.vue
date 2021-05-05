<template>
  <catch-table
    :form-create="formCreate"
    v-bind="table"
  />
</template>

<script>
import renderForm from '@/views/render-table-form'
import status from './status'
export default {
  mixins: [renderForm],
  components: { status },

  data() {
    return {
      tableFrom: 'table/monitor/crontabLog'
    }
  },
  methods: {
    afterMixinsCreated() {
      this.table.search.forEach( item => {
        if (item.field === 'crontab_id') {
          item.value = this.$route.params.crontab_id
        }
      })
    }
  },
}
</script>
<!--
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParam.name" placeholder="任务名称" clearable class="filter-item form-search-input" />
      <el-select v-model="queryParam.group" clearable placeholder="请选择分组" class="filter-item" style="margin-right: 5px">
        <el-option value="1" label="默认" />
        <el-option value="2" label="系统" />
      </el-select>
      <el-select v-model="queryParam.status" clearable placeholder="请选择执行状态" class="filter-item" style="margin-right: 5px">
        <el-option value="1" label="启用" />
        <el-option value="2" label="失败" />
      </el-select>
      <el-date-picker
        v-model="queryParam.start_at"
        class="filter-item"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        style="margin-right: 5px"
        placeholder="选择开始时间" />
      <el-date-picker
        v-model="queryParam.end_at"
        type="datetime"
        class="filter-item"
        value-format="yyyy-MM-dd HH:mm:ss"
        style="margin-right: 5px"
        placeholder="选择结束时间" />
      <el-button class="filter-item search" icon="el-icon-search" @click="handleSearch">
        搜索
      </el-button>
    </div>
    <el-button v-if="this.selectedIds.length" size="small" class="filter-item mb-5" type="danger" icon="el-icon-delete" @click="handleMultiDelete">
      批量删除
    </el-button>
    <el-table ref="multipleTable" :data="data" tooltip-effect="dark" style="width: 100%" border fit @selection-change="handleSelectMulti">
      <el-table-column type="selection" width="55" />
      <el-table-column label="编号" prop="id" width="80" />
      <el-table-column label="名称" prop="name" />
      <el-table-column prop="group" label="分组">
        <template slot-scope="cron">
          {{ cron.row.group === 1 ? '默认' : '系统' }}
        </template>
      </el-table-column>
      <el-table-column prop="task" label="调用目标类" />
      <el-table-column prop="used_time" label="耗时">
        <template slot-scope="cron">
          {{ cron.row.used_time + '秒' }}
        </template>
      </el-table-column>
      <el-table-column prop="error_message" label="错误日志" />
      <el-table-column prop="status" label="状态">
        <template slot-scope="cron">
          <el-tag v-if="cron.row.status === 1" class="el-icon-check" effect="dark" type="success"> 成功</el-tag>
          <el-tag v-else type="danger" class="el-icon-close" effect="dark">失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" />
      <el-table-column label="操作">
        <template slot-scope="cron">
          <el-button type="danger" icon="el-icon-delete" @click="handleDelete(cron.row.id)" />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination-container"
      background
      :current-page="paginate.current"
      hide-on-single-page
      :page-sizes="paginate.sizes"
      :page-size="paginate.limit"
      :layout="paginate.layout"
      :total="paginate.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import formOperate from '@/layout/mixin/formOperate'

export default {
  mixins: [formOperate],
  data() {
    return {
      // 用户搜索
      queryParam: {
        crontab_id: '',
        name: '',
        group: '',
        status: '',
        start_at: '',
        end_at: ''
      },
      date: '',
      url: 'monitor/crontab/log/list'
    }
  },
  created() {
    if (this.$route.params.crontab_id !== undefined) {
      this.queryParam.crontab_id = this.$route.params.crontab_id
    }
  },
  methods: {
    disOrEnableCron(cron) {
      this.$http.put(this.url + '/' + cron.id).then(response => {
        this.$message.success(response.message)
      })
    },
    selectDate(value) {
      alert(value)
    }
  }
}
</script>
-->
