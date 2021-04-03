<template>
  <catch-table
    v-if="table"
    :ref="table.ref"
    :headers="table.headers"
    :border="true"
    :search="table.search"
    :formCreate="formCreate"
    :table-events="table.events"
    :table-actions="table.actions"
    :api-route="table.apiRoute"
    :dialog-width="table.dialog.width"
  />
</template>
<script>

export default {
  data() {
    return {
      table: null,
      formCreate: {}
    }
  },
  created() {
    this.$http.get('table/system/sensitiveWord').then(response => {
      this.table = response.data.table;
      this.formCreate.rule = response.data.form
    })
  }
}
</script>
