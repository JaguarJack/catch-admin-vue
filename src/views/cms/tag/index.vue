<template>
  <catch-table
    :form-create="formCreate"
    v-bind="table"
  />
</template>

<script>
import renderTable from '@/views/render-table-form'

export default {
  name: 'index',
  mixins: [renderTable],
  data() {
    return {
      tableFrom: 'table/cms/tags'
    }
  }
}
</script>

<style scoped>

</style>
