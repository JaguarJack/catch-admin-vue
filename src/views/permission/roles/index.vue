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
    beforeUpdate(row) {
      const permissions = this.$refs[this.table.ref].getForm.el('_permissions').$refs.tree;
      console.log(permissions)
      row._permissions = row._permissions.filter(permission => {
        const node = permissions.getNode(permission)
        return node.isLeaf
      })
    },
    beforeSubmit(row) {
      if (row.form.parent_id instanceof Array) {
        row.form.parent_id = row.form.parent_id.length > 0 ? row.form.parent_id.pop() : 0
      }

      const permissions = this.$refs[this.table.ref].getForm.el('_permissions').$refs.tree;

      row.form.permissions = permissions.getCheckedKeys().concat(permissions.getHalfCheckedKeys())

      return row
    },
    afterHandleResponse() {
      this.$http.get('table/permissions/role', {params: { only: 'form'}}).then(response => {
        this.formCreate.rule = response.data.form
      })
    }
  }
}
</script>
