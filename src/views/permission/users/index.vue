<template>
  <div style="margin: 5px 5px;">
    <el-row :gutter="20">
      <el-col :span="5" style="margin-top: 3px;padding-right: 0;">
      <div slot="header" class="clearfix">
          <span>部门</span>
        </div>
        <div class="block department">
          <el-tree
            :data="departments"
            :props="departmentProps"
            node-key="id"
            default-expand-all
            highlight-current
            :expand-on-click-node="false"
            @node-click="getDepartmentUsers"
          />
        </div>
      </el-col>
      <el-col :span="19">
        <catch-table
          v-if="table"
          :ref="table.ref"
          :headers="table.headers"
          :border="true"
          :search="table.search"
          :filterParams="table.filterParams"
          :formCreate="formCreate"
          :actions="table.actions"
          :table-events="table.events"
          :api-route="table.apiRoute"
          :selectable="selectable"
        />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import renderTable from '@/views/render-table-form'
import status from './component/status'

export default {
  components: {
    status
  },
  mixins: [renderTable],

  data() {
    return {
      tableFrom: 'table/permissions/user',
      // 部门
      departments: [],
      departmentProps: {
        label: 'department_name'
      },
    }
  },
  created() {
    this.$http.get('departments').then(response => {
      this.departments = response.data
    })
  },
  methods: {
    // 获取部门用户
    getDepartmentUsers(data, node, self) {
      this.$refs[this.table.ref].queryParams.department_id = data.id
      this.$refs[this.table.ref].handleSearch()
    },
    selectable(row) {
      return row.id !== 1
    },

    beforeSubmit(row) {
      if (row.form.department_id instanceof Array) {
        row.form.department_id = row.form.department_id.length > 0 ? row.form.department_id.pop() : 0
      }
      return row
    },

    beforeDelete(row) {
      if (row.id === 1) {
        this.$message.error('超级管理员不允许删除')

        return false
      }
    },
    beforeCreate() {
      this.formCreate.fApi.updateValidate('password', [{ required: true, message: '密码必须填写'}], true)
      this.formCreate.fApi.refresh()
    },
    beforeUpdate() {
      this.formCreate.fApi.updateValidate('password', [{ required: false}])
    }
  }
}
</script>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .department .el-tree {
    padding: 10px 10px;
    height: 360px;
  }
  .department .el-tree .el-tree-node__content {
      height: 35px;
  }

  .department .el-tree .el-tree-node__content .el-tree-node__label {
    font-size: 15px;
  }
</style>
