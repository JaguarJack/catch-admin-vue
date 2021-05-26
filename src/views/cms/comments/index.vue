<template>
  <catch-table
    :form-create="formCreate"
    v-bind="table"
  />
</template>

<script>
import renderFrom from '@/views/render-table-form'
export default {
  name: 'index',
  mixins: [renderFrom],
  data() {
    return {
      tableFrom: 'table/cms/comments?only=table'
    }
  }
}
</script>

<style scoped>

</style>
