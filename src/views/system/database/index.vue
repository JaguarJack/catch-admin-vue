<template>
  <div>
  <catch-table
    v-if="table"
    :ref="table.ref"
    :headers="table.headers"
    :border="true"
    :search="table.search"
    :table-events="table.events"
    :api-route="table.apiRoute"
  />
  <!--
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParam.tablename" placeholder="表名" clearable class="filter-item form-search-input" />
      <el-select v-model="queryParam.engine" clearable placeholder="请选择引擎" class="filter-item" style="margin-right: 5px">
        <el-option value="MyISAM" label="MyISAM" />
        <el-option value="InnoDB" label="InnoDB" />
      </el-select>
      <el-button class="filter-item search" icon="el-icon-search" @click="handleSearch">
        搜索
      </el-button>
      <el-button class="filter-item" icon="el-icon-refresh" @click="handleRefresh">
        重置
      </el-button>
    </div>
    <el-table :data="data" tooltip-effect="dark" style="width: 100%" border fit>
      <el-table-column label="表名"  prop="name" />
      <el-table-column prop="engine" label="引擎"/>
      <el-table-column prop="collation" label="字符集" />
      <el-table-column prop="rows" label="数据行数" />
      <el-table-column prop="index_length" label="索引大小">
        <template slot-scope="table">
          <el-tag type="success">{{ table.row.index_length }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="comment" label="注释" />
      <el-table-column prop="update_time" label="创建时间" />
      <el-table-column label="操作">
        <template slot-scope="table">
          <el-button type="primary" icon="el-icon-view" @click="viewTable(table.row.name)" />
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
-->
  <!--------------------------------- 查看表结构 ------------------------------------------------------->
  <el-dialog title="表结构" :visible.sync="visable">
      <el-table :data="fields" tooltip-effect="dark" style="width: 100%" border fit>
        <el-table-column label="字段名称" prop="name" />
        <el-table-column prop="type" label="类型" width="150"/>
        <el-table-column prop="notnull" label="NULL" width="150">
          <template slot-scope="field">
            <el-tag type="primary">{{ field.row.notnull === true ? '是' : '否'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="default" label="默认值" width="150"/>
        <el-table-column prop="comment" label="注释" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      table: null,
      visable: false,
      fields: null
    }
  },
  created() {
    this.$http.get('table/system/database').then(response => {
      this.table = response.data.table;
    })
  },
  methods: {
    handleView(row) {
      this.visable = true
      this.$http.get('table/view/' + row.name).then(res => {
        this.fields = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
