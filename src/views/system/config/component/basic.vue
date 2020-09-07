<template>
  <div class="app-container">
    <el-form ref="form" :rules="rules" :model="form">
      <el-divider content-position="left"><h3>站点配置</h3></el-divider>
      <el-form-item label="站点名称" :label-width="width" style="width: 600px" prop="site.name">
        <el-input v-model="form.site.name" placeholder="请输入站点名称" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="站点链接" :label-width="width">
        <el-input v-model="form.site.url" placeholder="请输入站点链接" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="站点开始时间" :label-width="width">
        <el-date-picker
          v-model="form.site.start_at"
          type="date"
          placeholder="请选择站点开始时间"
          value-format="yyyy-MM-dd"
          clearable
        />
      </el-form-item>
      <el-form-item label="站点关键字" :label-width="width">
        <el-input v-model="form.site.keywords" placeholder="请输入站点关键字" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="站点描述" :label-width="width">
        <el-input v-model="form.site.description" type="textarea" placeholder="请输入站点描述" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="上传设置" :label-width="width">
        <el-select v-model="form.site.upload" placeholder="请选择上传方式">
          <el-option
            v-for="(item, key) in upload"
            :key="item"
            :label="item"
            :value="key"
          />
        </el-select>
      </el-form-item>

      <el-divider content-position="left"><h3>底部信息</h3></el-divider>
      <el-form-item label="备案号" :label-width="width">
        <el-input v-model="form.footer.record_number" placeholder="请输入备案号" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="版权信息" :label-width="width">
        <el-input v-model="form.footer.copyright" placeholder="请输入版权信息" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="联系方式" :label-width="width">
        <el-input v-model="form.footer.contact" placeholder="请输入联系方式" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="备案链接地址" :label-width="width">
        <el-input v-model="form.footer.record_url" placeholder="请输入备案链接地址" autocomplete="off" clearable />
      </el-form-item>
      <el-divider content-position="left"><h3>其他配置</h3></el-divider>
      <el-form-item label="黑名单IP" :label-width="width">
        <el-input v-model="form.other.blacklist" type="textarea" placeholder="黑名单IP，IP 逗号隔开" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item style="margin: auto">
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Basic',
  data() {
    return {
      width: '180px',
      // 站点信息
      form: {
        site: {
          name: '',
          url: '',
          start_at: '',
          keywords: '',
          description: '',
          upload: ''
        },
        footer: {
          record_number: '',
          copyright: '',
          contact: '',
          record_url: ''
        },
        other: {
          blacklist: ''
        },
        parent: 'basic'
      },
      upload: {
        local: '本地上传',
        oss: '阿里OSS',
        qcloud: '腾讯云上传',
        qiniu: '七牛云上传'
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
    this.$http.get('/config/basic').then(response => {
      const basic = response.data
      Object.keys(basic).forEach(k => {
        Object.keys(basic[k]).forEach(key => {
          this.form[k][key] = basic[k][key]
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
