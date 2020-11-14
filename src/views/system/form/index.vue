<template>
  <div class="app-container">
    <f-render
      :loading="loading"
      height="calc(100vh - 60px)"
      :config="formConfig"
      @save="handleSave"
    />
  </div>
</template>

<script>
import FRender from 'f-render'

export default {
  components: {
    'f-render': FRender
  },
  data() {
    return {
      loading: false,
      formConfig: {}
    }
  },
  mounted() {
    // 模拟异步加载
    this.loading = true
    setTimeout(() => {
      this.loading = false
      this.formConfig = localStorage.getItem('form-config') || ''
    }, 1000)
  },
  methods: {
    handleSave(res) {
      // 这里是保存到 localStorage，你可以保存到服务器
      localStorage.setItem('form-config', res)
      this.$message.success('保存成功啦~')
    }
  }
}
</script>
