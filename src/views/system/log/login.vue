<template>
  <catch-table
    v-if="table"
    :ref="table.ref"
    :headers="table.headers"
    :border="true"
    :search="table.search"
    :table-events="table.events"
    :api-route="table.apiRoute"
  />
</template>

<script>
import status from './component/status'
import loginAt from './component/loginAt'
export default {
  components: {
    status, loginAt
  },
  data() {
    return {
      table: null,
    }
  },
  created() {
    this.$http.get('table/system/loginLog').then(response => {
      this.table = response.data.table;
    })
  }
}
</script>
