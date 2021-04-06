<template>
  <catch-table
    :ref="table.ref"
    :headers="table.headers"
    :border="true"
    :search="table.search"
    :formCreate="formCreate"
    :table-events="table.events"
    :actions="table.actions"
    :api-route="table.apiRoute"
    :dialog-width="table.dialog.width"
  />
</template>
<script>
import renderForm from '@/views/render-table-form'
export default {
  mixins: [renderForm],
  data() {
    return {
      tableFrom: 'table/system/sensitiveWord'
    }
  }
}
</script>
