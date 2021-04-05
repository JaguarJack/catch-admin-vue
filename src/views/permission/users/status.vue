<template>
  <el-switch
    v-if="$attrs.row.id !== 1"
    v-model="$attrs.row[field]"
    active-text="启用"
    inactive-text="禁用"
    :active-value="1"
    :inactive-value="2"
    @change="disOrEnable"
  />
  <el-switch
    v-else
    v-model="$attrs.row[field]"
    active-text="启用"
    inactive-text="禁用"
    :active-value="1"
    :inactive-value="2"
    disabled
  />
</template>

<script>
export default {
  name: 'status',
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

      this.$http.put('/users/switch/status/' + this.$attrs.row.id, data)
    }
  }
}
</script>
