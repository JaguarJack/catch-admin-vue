<template>
  <el-tag type="danger">
    <el-link
      :underline="false"
      :href="$attrs.row[field]"
      target="_blank"
    >
      <i class="el-icon-link"/> 链接
    </el-link>
  </el-tag>
</template>

<script>

export default {
  name: 'url',
  props: {
    field: {
      value: String,
      default() {
        return '';
      }
    }
  }
}
</script>

<style scoped>

</style>
