<template>
  <el-input-number
    v-model="$attrs.row[field]"
    :controls="false"
    @blur="changeNumber"
    size="mini"
    style="width: 65%"
    :min="1"
    :max="10000"/>
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
    changeNumber(e) {
      const data = {}
      data[this.field] = this.$attrs.row[this.field]
      this.$http.put(this.table.apiRoute + '/' + this.$attrs.row.id, data)
        .then(() => {
           this.table.getList()
        })
    }
  }
}
</script>

<style scoped>

</style>
