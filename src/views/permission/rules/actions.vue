<template>
  <div>
    <el-popover
      v-for="(action, index) in $attrs.row.actionList"
      :key="index"
      placement="top"
      width="180"
      title="操作"
    >
      <p>权限标识: {{ action.permission_mark }}</p>
      <div style="margin: 0;width: 200px">
        <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(action.id)">删除</el-button>
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleUpdate(action)">编辑</el-button>
      </div>
      <el-tag slot="reference" style="margin-right: 2px;" size="mini">{{ action.permission_name }}</el-tag>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'actions',
  props: {
    value: Object,
    default() {
      return null
    },
    table: {
      value: Object,
      default() {
        return null
      }
    },
    field: {
      value: String,
      default() {
        return null;
      }
    }
  },
  methods: {
    handleDelete(id) {
      this.table.handleDelete(id)
    },

    handleUpdate(action) {
      this.table.getForm.setValue({type: 2})

      this.table.handleUpdate(action)
    }
  }
}
</script>
