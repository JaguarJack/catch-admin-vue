<template>
  <form-create
    v-model="formCreate.fApi"
    :rule="formCreate.rule"
    :option="options"
    :value.sync="formCreate.value"
  />
</template>

<script>

export default {
  name: 'relate',
  props: {
    model_id: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      formCreate: {
        rule: []
      },
      options: {
        submitBtn: {
          icon: 'el-icon-s-promotion',
          innerText: '确定',
          click: this.handleFormSubmit,
          col: {
            span: 12,
            offset: 2,
          }
        },
        resetBtn: {
          innerText: '取消',
          show: true,
          icon: 'el-icon-switch-button',
          click: this.handleClosed,
          col: {
            span: 12,
            offset: 12
          }
        }
      },
    }
  },

  created() {
    this.$http.get('/table/cms/modelUsedFields', { params: { only: 'form', 'model_id': this.model_id } }).then(response => {
      this.formCreate.rule = response.data.form
    })
  },
  methods: {
    handleClosed() {
      this.$emit('closeUsedAt')
    },
    handleFormSubmit(formData) {
      formData.validate((valid, fail) => {
        if(valid){
          if (formData.form.id !== undefined && formData.form.id) {
            let _form = {}
            _form.used_at_list = formData.form.used_at_list.join()
            _form.used_at_search = formData.form.used_at_search.join()
            _form.used_at_detail = formData.form.used_at_detail.join()
            this.$http.put('cms/model' + '/' + formData.form.id, _form).then(response => {
                this.$message.success(response.message)
                this.handleClosed()
            }).catch(e => {
              //
            })
          }
        }else{
          //todo 表单验证未通过
          return false
        }
      })
    },
  }
}

</script>

<style scoped>

</style>
