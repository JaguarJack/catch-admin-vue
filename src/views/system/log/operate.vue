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

import params from './component/params'
export default {
  components: {
    params,
  },
  data() {
    return {
        table: null
    }
  },
  created() {
    this.$http.get('table/system/operateLog').then(response => {
      this.table = response.data.table;
    })
  }
}
</script>
