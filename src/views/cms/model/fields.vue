<template>
  <catch-table
    :form-create="formCreate"
    v-bind="table"
  />
</template>

<script>
import renderForm from '@/views/render-table-form'

export default {
  name: 'fields',
  props: {
    model_id: {
      type: Number,
      default() {
        return 0
      }
    },
  },
  mixins: [renderForm],
  data() {
    return {
      tableFrom: '/table/cms/fields',
    }
  },

  methods: {
    afterMixinsCreated() {
      this.table.search.forEach( item => {
        if (item.field === 'model_id') {
          item.value = this.model_id
        }
      })
    },
    // 提交前数据处理 必须返回 FormData
    beforeSubmit(formData) {
      if (formData.form.rules.length > 0) {
         if (formData.form.rules.length === 1) {
           formData.form.rules = formData.form.rules.pop()
         } else {
           formData.form.rules = formData.form.rules.join()
         }
      }

      formData.form.model_id = this.model_id

      return formData
    },
    afterSubmit(formData) {
      if (formData.form.rules.length > 0) {
        formData.form.rules = formData.form.rules.split(',')
      }
    }
  }
}

</script>

<style scoped>

</style>
