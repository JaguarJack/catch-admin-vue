<template>
  <catch-table
    :ref="table.ref"
    :headers="table.headers"
    :border="true"
    :search="table.search"
    :table-events="table.events"
    :api-route="table.apiRoute"
  />
</template>

<script>
import renderForm from '@/views/render-table-form'
import status from './component/status'
import loginAt from './component/loginAt'
export default {
  components: {
    status, loginAt
  },
  mixins: [renderForm],
  data() {
    return {
      tableFrom: 'table/system/loginLog'
    }
  }
}
</script>
