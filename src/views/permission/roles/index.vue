<template>
  <catch-table
    :form-create="formCreate"
    v-bind="table"
    default-expand-all
  />
</template>

<script>
import renderTable from '@/views/render-table-form'

export default {
  mixins: [renderTable],
  data() {
    return {
      tableFrom: 'table/permissions/role'
    }
  },
  methods: {
    afterMixinsCreated() {
      this.getFormField('parent_id').on = { change: this.selectParentRoles }
    },
    beforeCreate() {
      this.formCreate.fApi.disabled(false, 'parent_id')
    },
    beforeUpdate(row) {
      this.formCreate.fApi.disabled(true, 'parent_id')
      // 重新渲染 页面可能会闪一下
      if (row.parent_id) {
        this.selectParentRoles([row.parent_id])
      }
      const permissions = this.$refs[this.table.ref].getForm.el('_permissions').$refs.tree
      row._permissions = row._permissions.filter(permission => {
        const node = permissions.getNode(permission)
        return node.isLeaf
      })
    },
    selectParentRoles(value) {
      this.$http.get('role/permissions/' + value[value.length - 1]).then(r => {
        this.getFormField('_permissions').props.data = r.data
      })
    },
    getFormField(name) {
      let parent = null

      this.formCreate.rule.forEach(item => {
        if (item.field === name) {
          parent = item
        }
      })

      return parent
    },
    beforeSubmit(row) {
      if (row.form.parent_id instanceof Array) {
        row.form.parent_id = row.form.parent_id.length > 0 ? row.form.parent_id.pop() : 0
      }
      const permissions = this.$refs[this.table.ref].getForm.el('_permissions').$refs.tree
      row.form.permissions = permissions.getCheckedKeys().concat(permissions.getHalfCheckedKeys())
      return row
    },
    afterHandleResponse() {
      this.$http.get('table/permissions/role', { params: { only: 'form' }}).then(response => {
        this.formCreate.rule = response.data.form
      })
    }
  }
}
</script>
