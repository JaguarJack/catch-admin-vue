<template>
  <div class="app-container">
    <el-button class="filter-item mb-5 fr" icon="el-icon-delete" type="danger" @click="clear" style="margin-left: 10px;">
      清理缓存
    </el-button>
    <el-button class="filter-item search mb-5 fr" icon="el-icon-plus" @click="cache">
      缓存模块
    </el-button>
    <el-table ref="multipleTable" :data="data" tooltip-effect="dark" style="width: 100%" border fit @selection-change="handleSelectMulti">
      <el-table-column type="index" width="50" />
      <el-table-column label="模块名称" prop="name" />
      <el-table-column prop="alias" label="模块别名" />
      <el-table-column prop="description" label="模块描述" />
      <el-table-column prop="version" label="模块版本" />
      <el-table-column prop="status" label="模块状态">
        <template slot-scope="item">
          <el-switch
            v-if="!isDefaultModule(item.row.alias)"
            v-model="item.row.enable"
            active-text="启用"
            inactive-text="禁用"
            :active-value="true"
            :inactive-value="false"
            @change="disOrEnable(item.row)"
          />
          <el-switch
            v-else
            v-model="item.row.enable"
            active-text="启用"
            inactive-text="禁用"
            :active-value="true"
            :inactive-value="false"
            disabled
          />
        </template>
      </el-table-column>
      <el-table-column prop="order" label="排序" sortable />
    </el-table>
  </div>
</template>

<script>
import formOperate from '@/layout/mixin/formOperate'

export default {
  mixins: [formOperate],
  data() {
    return {
      url: 'modules',
      defaultModules: ['permissions', 'system', 'login']
    }
  },
  methods: {
    disOrEnable(module) {
      this.$http.put(this.url + '/' + module.alias).then(response => {
        this.handleRefresh()
        this.handleUpdateUserInfo()
      })
    },
    cache() {
      this.$http.put('cache/modules').then(response => {
        this.$message.success(response.message)
      })
    },
    clear() {
      this.$http.delete('clear/modules').then(response => {
        this.$message.success(response.message)
      })
    },
    isDefaultModule(module) {
      let is = false
      this.defaultModules.forEach(item => {
        if (module === item) {
          is = true
        }
      })
      return is
    }
  }
}
</script>
