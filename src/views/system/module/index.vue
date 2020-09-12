<template>
  <div class="app-container">
    <el-table ref="multipleTable" :data="data" tooltip-effect="dark" style="width: 100%" border fit @selection-change="handleSelectMulti">
      <el-table-column label="模块名称" prop="name" />
      <el-table-column prop="alias" label="模块别名" />
      <el-table-column prop="description" label="模块描述" />
      <el-table-column prop="version" label="模块版本" />
      <el-table-column prop="status" label="模块状态">
        <template slot-scope="item">
          <el-switch
            v-model="item.row.enable"
            active-text="启用"
            inactive-text="禁用"
            :active-value="true"
            :inactive-value="false"
            @change="disOrEnable(item.row)"
          />
        </template>
      </el-table-column>
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
      selectedIds: []
    }
  },
  methods: {
    disOrEnable(module) {
      this.$http.put(this.url + '/' + module.alias).then(response => {
        this.handleRefresh()
        this.handleUpdateUserInfo()
      })
    }
  }
}
</script>
