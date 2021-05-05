<template>
    <el-image
      v-if="$attrs.row[field].length > 0"
      style="width: 50px;"
      :src="$attrs.row[field]"
      :preview-src-list="[$attrs.row[field]]">
    </el-image>
</template>

<script>
export default {
  name: 'preview',
  props: {
    value: Object,
    default() {
      return null
    },
    field: {
      value: String,
      default() {
        return 'url';
      }
    }
  }
}
</script>

<style scoped>

</style>
