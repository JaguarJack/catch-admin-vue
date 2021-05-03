<template>
  <el-select
    v-model="$attrs.row[field]"
    clearable
    placeholder="请选择"
    @change="handleSelect"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'edit',
  props: {
    options: {
       value: Array,
      default() {
         return []
      }
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
    handleSelect(v) {
      const data = {}
      data[this.field] = v
      this.$http.put(this.table.apiRoute + '/' + this.$attrs.row.id, data)
        .then(() => {
          this.$message.success('更新成功')
          this.table.getList()
        })
    }
  }
}
</script>
