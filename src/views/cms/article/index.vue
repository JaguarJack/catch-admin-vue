<template>
  <catch-table
    v-bind="table"
  />
</template>

<script>
import render from '@/views/render-table-form'

export default {
  name: 'index',
  mixins: [render],
  data() {
    return {
      tableFrom: 'table/cms/articles?only=table'
    }
  }
}
</script>

<style scoped>

</style>
