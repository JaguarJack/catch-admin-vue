<template>
    <catch-table
      :ref="table.ref"
      :headers="table.headers"
      :border="true"
      :search="table.search"
      :form-create="formCreate"
      :hide-pagination="true"
      :actions="table.actions"
      :table-actions="table.actions"
      :dialog-width="table.dialog.width"
      :api-route="table.apiRoute"
    />
</template>

<script>
import operate from './compoents/operate'
import renderTable from '@/views/render-table-form'

export default {
  components: {
    operate: operate,
  },
  mixins: [renderTable],
  data() {
    return {
      tableFrom: 'table/cms/model'
    }
  }
}
</script>
