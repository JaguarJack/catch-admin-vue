<template>
  <div>
  <catch-table
    v-if="table"
    :ref="table.ref"
    :headers="table.headers"
    :border="true"
    :search="table.search"
    :default-query-params="table.defaultQueryParams"
    :hide-pagination="true"
    :table-events="table.events"
    :formCreate="formCreate"
    :actions="table.actions"
    :api-route="table.apiRoute"
    :row-key="table.tree.row_key"
     default-expand-all
    :tree-props="table.tree.props"
  />
    <el-dialog title="选择菜单图标" :visible.sync="iconViable" width="70%">
      <icons @selectIcon="handleSelectIcon" />
    </el-dialog>
  </div>
</template>

<script>
import icons from './icons/index'
import actions from './actions'
import status from './status'

export default {
  name: 'Index',
  components: {
    icons,
    actions,
    status
  },

  created() {
    this.getTableFrom()
    this.getComponentsSelect()
  },
  data() {
    return {
      table: null,
      formCreate: {},
      components: null,
      iconViable: false,
    }
  },
  methods: {
    getComponentsSelect() {
      this.components = this.admin.loadComponentsSelect()
    },
    getTableFrom() {
      this.$http.get('table/permissions/permission').then(response => {
        this.table = response.data.table;
        this.formCreate.rule = response.data.form

        this.formCreate.rule[1]['control'][0]['rule'][5].props.options= this.getComponents()
        this.formCreate.rule[1]['control'][0]['rule'][3].on = { focus : this.selectIcon }
      })
    },
    beforeSubmit(row) {
      if (row.form.parent_id instanceof Array) {
        row.form.parent_id = row.form.parent_id.length > 0 ? row.form.parent_id.pop() : 0
      }
      if (row.form.component instanceof Array) {
        row.form.component = row.form.component.length > 0 ? row.form.component.pop() : ''
      }
      return row
    },
    renderAfter(form) {
      if (form !== null) {
        this.formCreate.fApi.setValue({
          permission_mark: form.permission_mark.indexOf('@') === -1 ? form.permission_mark : form.permission_mark.split('@')[1],
          permission_name: form.permission_name
        })
      }
    },
    afterHandleResponse() {
      this.admin.updateRouters()
      this.$http.get('table/permissions/permission', {params: { only: 'form'}}).then(response => {
        this.formCreate.rule = response.data.form
        this.formCreate.rule[1]['control'][0]['rule'][5].props.options= this.getComponents()
        this.formCreate.rule[1]['control'][0]['rule'][3].on = { focus : this.selectIcon }
      })
    },
    getComponents() {
      let _components = []
      const components = this.components
      Object.keys(components).forEach(function(k){
        let options = []
        Object.keys(components[k]).forEach(function(k){
          options.push({
            label: k,
            value: k
          })
        })
        _components.push({
          label: k,
          value: k,
          disable: true,
          children: options
        })
      })
      return _components
    },
    selectIcon() {
      this.iconViable = true
    },
    // 选择菜单图标
    handleSelectIcon(item) {
      this.$refs[this.table.ref].getForm.setValue({ icon: item })
      this.iconViable = false
    }
  }
}
</script>
