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
    :row-key="table.tree.row_key"
    :table-events="table.events"
    :dialog-width="table.dialog.width"
    :api-route="table.apiRoute"
    default-expand-all
    :tree-props="table.tree.props"
  />
</template>

<script>
import renderTable from '@/views/render-table-form'

export default {
  mixins: [renderTable],
  data() {
    return {
      tableFrom: 'table/permissions/role',
    }
  },
  methods: {
    beforeSubmit(row) {
      if (row.form.parent_id instanceof Array) {
        row.form.parent_id = row.form.parent_id.length > 0 ? row.form.parent_id.pop() : 0
      }
      return row
    },
    afterHandleResponse() {
      this.$http.get('table/permissions/role', {params: { only: 'form'}}).then(response => {
        this.formCreate.rule = response.data.form
      })
    },
    forceUpdate() {
      this.updateKey++
    }
  }
}
</script>
