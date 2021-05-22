<template>
  <catch-form
    ref="form"
    create-form="table/cms/articles"
    submit-url="cms/articles"
  />
</template>

<script>
import catchForm from '@/components/Catch/Form'

export default {
  name: 'detail',
  components: { catchForm },
  mounted() {
    const id = this.$route.params.id
    if (id !== undefined) {
      this.admin.get('cms/articles/' + id).then(r => {
        r.data.category_id = [r.data.category_id]
        r.data.tags = r.data.tags.length > 0 ? r.data.tags.split(',') : ''
        r.data.images = r.data.images.length > 0 ? r.data.images.split(',') : ''
        this.$refs.form.formCreate.fApi.setValue(r.data)
        const editor = this.$refs.form.formCreate.fApi.el('content')
        if (editor !== undefined) {
          editor.setContent(r.data.content)
        }
      })
    }
  },
  methods: {
    afterSubmit() {
      this.admin.closeTagView(this.$route, '/cms/articles')
    },
    handleCancel() {
      this.admin.closeTagView(this.$route, '/cms/articles')
    }
  }
}
</script>

<style scoped>

</style>
