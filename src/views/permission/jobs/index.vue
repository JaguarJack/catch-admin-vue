<template>
  <catch-table
    :ref="table.ref"
    :headers="table.headers"
    :border="true"
    :search="table.search"
    :filterParams="table.filterParams"
    :hide-pagination="false"
    :table-events="table.events"
    :formCreate="formCreate"
    :actions="table.actions"
    :api-route="table.apiRoute"
  />
</template>

<script>
import renderTable from '@/views/render-table-form'

export default {
  mixins: [renderTable],
  data() {
    return {
      tableFrom: 'table/permissions/job',
    }
  },
}
</script>
