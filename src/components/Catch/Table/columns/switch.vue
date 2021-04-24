<template>
    <el-switch
      v-if="options.length > 0"
      v-model="$attrs.row[field]"
      :active-text="options[0].label"
      :inactive-text="options[1].label"
      :active-value="options[0].value"
      :inactive-value="options[1].value"
      @change="disOrEnable"
    />
  <el-switch
    v-else
    v-model="$attrs.row[field]"
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
    options: {
      value: Array,
      default() {
        return []
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

      this.$http.put(this.table.apiRoute + '/' + this.$attrs.row.id, data).then(() => {
        this.table.getList()
      })

    }
  }
}
</script>
