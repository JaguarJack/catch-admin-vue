<template>
  <div v-if="$attrs.row[field].length > 0">
    <el-image
      v-if="isImage($attrs.row[field])"
      style="width: 50px;"
      :src="$attrs.row[field]"
      :preview-src-list="[$attrs.row[field]]">
    </el-image>
    <el-tag v-else class="el-icon-download" @click="download($attrs.row[field])">下载</el-tag>
  </div>
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
  },
  methods: {
    isImage(url) {
      const ext = url.substr(url.lastIndexOf('.') + 1)

      return ['png', 'jpg', 'jpeg', 'gif', 'svg', 'bmp'].indexOf(ext.toLowerCase()) !== -1
    },
    download(url) {
      location.href = url
    }
  }
}
</script>

<style scoped>

</style>
