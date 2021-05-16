<template>
  <el-input :value="$attrs.row[field]">
    <el-button slot="append" icon="el-icon-link" @click="hrefto($attrs.row[field])"/>
  </el-input>
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
  },
  methods: {
    hrefto(url) {
      window.open(url)
    }
  }
}
</script>

<style scoped>

</style>
