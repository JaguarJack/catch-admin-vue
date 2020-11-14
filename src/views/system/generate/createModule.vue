<template>
  <ele-form
    v-model="formData"
    v-bind="formConfig"
    style="width: 90%; margin: auto;"
    :request-fn="handleRequest"
  />
</template>

<script>
export default {
  data() {
    return {
      formData: {},
      formConfig: {
        isShowErrorNotify: false,
        isShowBackBtn: false,
        formDesc: {
          name: {
            type: 'input',
            label: '模块名称',
            required: true
          },
          alias: {
            type: 'input',
            label: '模块目录',
            required: true
          },
          description: {
            type: 'input',
            label: '模块描述',
            required: false
          },
          keywords: {
            type: 'input',
            label: '模块关键字'
          },
          dirs: {
            type: 'checkbox',
            label: '目录安装',
            isOptions: true,
            options: [
              {
                text: 'Controller目录',
                value: 'controller'
              },
              {
                text: 'model目录',
                value: 'model'
              },
              {
                text: 'Database目录',
                value: 'database'
              },
              {
                text: 'Request目录',
                value: 'request'
              }
            ],
            default: [
              'controller',
              'model',
              'database'
            ],
            layout: 24
          }
        },
        order: [
          'name',
          'alias',
          'description',
          'keywords',
          'dirs'
        ]
      }
    }
  },
  methods: {
    handleRequest(data) {
      data.dirs = data.dirs.join()
      this.$http.post('generate/create/module', data).then(response => {
        this.$message.success(response.message)
        this.$emit('close')
      })
    }
  }
}
</script>
<style>
  .el-button--primary {
    float: right;
  }
</style>
