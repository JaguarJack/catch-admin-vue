<template>
  <el-tag
    v-if="$attrs.row[field].length > 0"
    class="el-icon-download"
    @click="download($attrs.row[field])"
    >
     下载
  </el-tag>
</template>

<script>
export default {
  name: 'download',
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
  },
  methods: {
    download(url) {
      location.href = url
    }
  }
}
</script>

<style scoped>

</style>
