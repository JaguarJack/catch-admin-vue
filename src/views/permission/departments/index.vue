<template>
  <catch-table
    :ref="table.ref"
    :headers="table.headers"
    :border="true"
    :search="table.search"
    :filterParams="table.filterParams"
    :hide-pagination="true"
    :formCreate="formCreate"
    :actions="table.actions"
    :table-actions="['add', 'edit', 'delete']"
    apiRoute="departments"
    row-key="id"
    :dialog-width="'35%'"
    default-expand-all
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
  />
</template>
<script>
import CatchTable from '@/components/Catch/Table'
import config from './config'
import status from '@/components/Catch/Table/columns/status'

export default {
  mixins:[config],
  components: {
    CatchTable: CatchTable,
    status: status,
  }
}
</script>

