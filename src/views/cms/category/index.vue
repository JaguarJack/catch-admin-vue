<template>
  <catch-table
    :ref="table.ref"
    :headers="table.headers"
    :border="true"
    :search="table.search"
    :hide-pagination="true"
    :form-create="formCreate"
    :actions="table.actions"
    :row-key="table.tree.row_key"
    :dialog-width="table.dialog.width"
    :api-route="table.apiRoute"
    default-expand-all
    :tree-props="table.tree.props"
  />
</template>
<script>
import renderTable from '@/views/render-table-form'

export default {
  mixins:[renderTable],
  data() {
    return {
      tableFrom: 'table/cms/category',
    }
  },

  methods: {
    beforeSubmit(row) {
      if (row.form.parent_id instanceof Array) {
        row.form.parent_id = row.form.parent_id.length > 0 ? row.form.parent_id.pop() : 0
      }
      if (row.form.component instanceof Array) {
        row.form.component = row.form.component.length > 0 ? row.form.component.pop() : ''
      }
      return row
    },
     afterHandleResponse() {
      this.admin.get(this.tableFrom, {params: { only: 'form'}}).then(response => {
        this.formCreate.rule = response.data.form
      })
    },
  }
}
</script>

