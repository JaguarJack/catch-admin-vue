<template>
  <catch-table
    :ref="table.ref"
    :headers="table.headers"
    :border="true"
    :search="table.search"
    :filterParams="table.filterParams"
    :formCreate="formCreate"
    :actions="table.actions"
    :table-events="table.events"
    :table-actions="['edit', 'delete']"
    apiRoute="sensitive/word"
  />
</template>
<script>
import CatchTable from '@/components/Catch/Table'
import config from './config'
export default {
  mixins:[config],
  components: {
    CatchTable: CatchTable,
  }
}
</script>
