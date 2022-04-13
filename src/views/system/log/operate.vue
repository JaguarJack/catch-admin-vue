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
import params from './component/params'
export default {
  components: {
    params,
  },
  mixins: [renderForm],
  data() {
    return {
      tableFrom: 'table/system/operateLog'
    }
  }
}
</script>
