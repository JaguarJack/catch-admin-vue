<template>
  <div v-clipboard:copy="$attrs.row[field]" style="cursor:pointer;" v-clipboard:success="clipboardSuccess">
    {{ $attrs.row[field] }}
  </div>
</template>

<script>
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive

export default {
  name: 'copy',
  directives: {
    clipboard
  },
  props: {
    field: {
      value: String,
      default() {
        return null;
      }
    }
  },
  methods: {
    clipboardSuccess() {
      this.$message.success('🎉 复制成功！')
    }
  }
}
</script>

<style scoped>

</style>
