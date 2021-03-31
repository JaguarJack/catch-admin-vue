<template>
  <catch-table
    v-if="table"
    :ref="table.ref"
    :headers="table.headers"
    :border="true"
    :search="table.search"
    :filterParams="table.filterParams"
    :hide-pagination="true"
    :table-events="table.events"
    :formCreate="formCreate"
    :actions="table.actions"
    :api-route="table.apiRoute"
  />
</template>
<script>
export default {
  data() {
    return {
      table: null,
      formCreate: {},
    }
  },
  created() {
    this.$http.get('table/permissions/job').then(response => {
      this.table = response.data.table;
      this.formCreate.rule = response.data.form
    })
  }
}
</script>
