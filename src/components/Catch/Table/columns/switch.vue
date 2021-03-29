<template>
    <el-switch
      v-model="$attrs.row[field]"
      active-text="启用"
      inactive-text="禁用"
      :active-value="1"
      :inactive-value="2"
      @change="disOrEnable"
    />
</template>

<script>
export default {
  name: 'switch_',
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
    disOrEnable(v) {
      const data = {}
      data[this.field] = v

      this.$http.put(this.table.apiRoute + '/' + this.$attrs.row.id, data)
    }
  }
}
</script>
