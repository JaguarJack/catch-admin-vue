<template>
  <catch-table
    :form-create="formCreate"
    v-bind="table"
  />
</template>

<script>
import renderForm from '@/views/render-table-form'

export default {
  mixins: [renderForm],

  data() {
    return {
      tableFrom: 'table/monitor/crontab'
    }
  }
}
</script>
