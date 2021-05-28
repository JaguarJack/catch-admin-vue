<template>
<catch-table
  :form-create="formCreate"
  v-bind="table"
/>
</template>

<script>
import renderTable from '@/views/render-table-form'

export default {
  mixins: [renderTable],
  data() {
    return {
      tableFrom: 'table/cms/siteLink'
    }
  }
}
</script>

<style scoped>

</style>
