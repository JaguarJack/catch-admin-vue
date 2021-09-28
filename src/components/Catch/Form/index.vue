<template>
  <div class="app-container" style="margin: 3px 15px;">
    <form-create
      v-model="formCreate.fApi"
      :rule="formCreate.rule"
      :option="form.options"
      :value.sync="formCreate.value"
    />
  </div>
</template>

<script>
export default {
  name: 'index',
  props: {
    createForm: {
      type: String,
      default() {
        return ''
      }
    },
    submitUrl: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      formCreate: {
        fApi: null,
        value: {},
        rule: []
      },
      form: {
        // form create options
        options: {
          global: {
            upload: {
              props: {
                onSuccess: function(res, file) {
                  file.url = res.data
                }
              }
            }
          },
          submitBtn: {
            icon: 'el-icon-s-promotion',
            innerText: '确定',
            click: this.handleFormSubmit,
            col: {
              span: 8,
              push: 24
            }
          },
          resetBtn: {
            innerText: '取消',
            show: true,
            icon: 'el-icon-switch-button',
            click: this.handleCancel,
            col: {
              span: 8,
              push: 24
            }
          }
        }
      }
    }
  },
  created() {
    this.admin.get(this.createForm, { only: 'form' }).then(r => {
      this.formCreate.rule = r.data.form
    })
  },
  methods: {
    handleFormSubmit(formData) {
      formData.validate((valid, fail) => {
        if (valid) {
          if (formData.form.id !== undefined && formData.form.id) {
            this.admin.put(this.submitUrl + '/' + formData.form.id, formData.form).then(response => {
              this.$message.success(response.message)

              if (this.$parent.afterSubmit !== undefined) {
                this.$parent.afterSubmit(formData.form)
              }
            })
          } else {
            this.admin.post(this.submitUrl, formData.form).then(response => {
              this.$message.success(response.message)

              if (this.$parent.afterSubmit !== undefined) {
                this.$parent.afterSubmit(formData.form)
              }
            })
          }
        } else {
          // todo 表单验证未通过
          return false
        }
      })
    },

    handleCancel() {
      if (this.$parent.handleCancel !== undefined) {
        this.$parent.handleCancel()
      } else {
        this.formCreate.fApi.resetFields()
      }
    }
  }
}
</script>

<style scoped>

</style>
