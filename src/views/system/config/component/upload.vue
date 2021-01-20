<template>
  <div class="app-container">
    <el-form ref="form" :model="form">
      <el-divider content-position="left"><h3>阿里 OSS 配置 (<a href="https://help.aliyun.com/product/31815.html" target="_blank">请认真阅读 OSS 相关配置</a>)</h3></el-divider>
      <el-form-item label="prefix" :label-width="width" style="width: 600px">
        <el-input v-model="form.oss.prefix" placeholder="prefix" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="access_key" :label-width="width">
        <el-input v-model="form.oss.access_key" placeholder="access_key" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="secret_key" :label-width="width">
        <el-input v-model="form.oss.secret_key" placeholder="secret_key" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="bucket" :label-width="width">
        <el-input v-model="form.oss.bucket" placeholder="bucket" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="end_point" :label-width="width">
        <el-input v-model="form.oss.end_point" placeholder="end_point" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="is_cname" :label-width="width">
        <el-radio v-model="form.oss.is_cname" :label="1">是</el-radio>
        <el-radio v-model="form.oss.is_cname" :label="2">否</el-radio>
      </el-form-item>

      <el-divider content-position="left"><h3>七牛配置</h3></el-divider>
      <el-form-item label="access_key" :label-width="width">
        <el-input v-model="form.qiniu.access_key" placeholder="access_key" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="secret_key" :label-width="width">
        <el-input v-model="form.qiniu.secret_key" placeholder="secret_key" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="bucket" :label-width="width">
        <el-input v-model="form.qiniu.bucket" placeholder="bucket" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="domain" :label-width="width">
        <el-input v-model="form.qiniu.domain" placeholder="domain" autocomplete="off" clearable />
      </el-form-item>

      <el-divider content-position="left"><h3>腾讯云配置</h3></el-divider>
      <el-form-item label="region" :label-width="width">
        <el-input v-model="form.qcloud.region" placeholder="region" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="app_id" :label-width="width">
        <el-input v-model="form.qcloud.app_id" placeholder="app_id" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="secret_id" :label-width="width">
        <el-input v-model="form.qcloud.secret_id" placeholder="secret_id" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="secret_key" :label-width="width">
        <el-input v-model="form.qcloud.secret_key" placeholder="secret_key" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="bucket" :label-width="width">
        <el-input v-model="form.qcloud.bucket" placeholder="bucket" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="timeout" :label-width="width">
        <el-input v-model="form.qcloud.timeout" placeholder="timeout" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="connect_timeout" :label-width="width">
        <el-input v-model="form.qcloud.connect_timeout" placeholder="connect_timeout" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="cdn" :label-width="width">
        <el-input v-model="form.qcloud.cdn" placeholder="cdn" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="scheme" :label-width="width">
        <el-input v-model="form.qcloud.scheme" placeholder="scheme" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="read_from_cdn" :label-width="width">
        <el-radio v-model="form.qcloud.read_from_cdn" :label="1">是</el-radio>
        <el-radio v-model="form.qcloud.read_from_cdn" :label="2">否</el-radio>
      </el-form-item>
      <el-form-item style="margin: auto">
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'upload',
  data() {
    return {
      width: '180px',
      // 站点信息
      form: {
        // oss 配置
        oss: {
          prefix: '',
          access_key: '',
          secret_key: '',
          bucket: '',
          end_point: '',
          is_cname: 1
        },
        // 腾讯云配置
        qcloud: {
          region: '',
          app_id: '',
          secret_id: '',
          secret_key: '',
          bucket: '',
          timeout: 60,
          connect_timeout: 60,
          cdn: '',
          scheme: '',
          read_from_cdn: 1
        },
        // 七牛配置
        qiniu: {
          access_key: '',
          secret_key: '',
          bucket: '',
          domain: ''
        },
        parent: 'upload'
      },
      // 规则
      rules: {
        'site.name': [
          { required: true, message: '请输入站点名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.$http.get('/config/upload').then(response => {
      const upload = response.data
      Object.keys(upload).forEach(k => {
        Object.keys(upload[k]).forEach(key => {
          if (key === 'is_cname') {
            this.form[k][key] = parseInt(upload[k][key])
          } else if (key === 'read_from_cdn') {
            this.form[k][key] = parseInt(upload[k][key])
          } else {
            this.form[k][key] = upload[k][key]
          }
        })
      })
    })
  },
  methods: {
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$http.post('config', this.form).then(response => {
            this.$message.success(response.message)
          })
        } else {
          console.log(valid)
        }
      })
    }
  }
}
</script>

<style scoped>
  .el-form .el-form-item {
    width: 600px;
  }
</style>
