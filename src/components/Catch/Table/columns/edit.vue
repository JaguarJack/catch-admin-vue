<template>
  <el-input
    v-model="$attrs.row[field]"
    style="width: 90%"
   >
    <el-button slot="append" @click="handleEdit">更新</el-button>
  </el-input>
</template>

<script>
export default {
  name: 'edit',
  props: {
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
    handleEdit(e) {
      const data = {}
      data[this.field] = this.$attrs.row[this.field]
      this.$http.put(this.table.apiRoute + '/' + this.$attrs.row.id, data)
        .then(response => {
          this.$message.success('更新成功')
          this.table.getList()
        })
    }
  }
}
</script>
