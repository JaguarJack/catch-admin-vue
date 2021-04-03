<template>
  <form-create
    v-model="form.fApi"
    :rule="form.rule"
    :option="form.options"
    :value.sync="form.value"
  />
</template>

<script>
export default {
  data() {
    return {
      form: {
        options: {
          submitBtn: {
            icon: 'el-icon-s-promotion',
            innerText: '确定',
          },
          onSubmit:(formData)=>{
            this.handleRequest()
          },
          resetBtn: {
            innerText: '取消',
            show: true,
            icon: 'el-icon-switch-button',
            click: this.handleClose
          }
        },
        fApi: {},
        rule: [
          {
            field: 'name',
            type: 'input',
            title: '模块名称',
            validate:[
              { required: true, message: '请输入模块名称', trigger: 'blur' },
            ],
          },
          {
            field: 'alias',
            type: 'input',
            title: '模块目录',
            validate:[
              { required: true, message: '请输入模块目录', trigger: 'blur' },
            ],
          },
          {
            field: 'description',
            type: 'input',
            title: '模块描述'
          },
          {
            field: 'keywords',
            type: 'input',
            title: '模块关键字'
          },
          {
            type:'checkbox',
            title:'目录安装',
            field:'dirs',
            value:[ 'controller', 'model', 'database'],
            options:[
              {value: 'controller',label: 'Controller 目录'},
              {value: 'model', label: 'Model 目录'},
              {value: 'database',label: 'Database目录'},
              {value: 'request',label: 'Request目录'},
            ]
          },

        ],
        value: {}
      }
    }
  },
  methods: {
    handleRequest() {
      let data = {}
      data.alias = this.form.fApi.form.alias
      data.name = this.form.fApi.form.name
      data.description = this.form.fApi.form.description
      data.keywords = this.form.fApi.form.keywords
      data.dirs = this.form.fApi.form.dirs.join()
      this.$http.post('generate/create/module', data).then(response => {
        this.$message.success(response.message)
        this.handleClose()
      })
    },
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>
