<template>
  <div class="app-container">
    <h2>短信配置</h2>
    <el-divider></el-divider>
    <el-tabs>
      <el-tab-pane label="阿里云">
        <aliyun/>
      </el-tab-pane>
      <el-tab-pane label="腾讯云">
        <tencent/>
      </el-tab-pane>
      <el-tab-pane label="Ucloud">
        <ucloud/>
      </el-tab-pane>
      <el-tab-pane label="Submail">
        <submail/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import aliyun from './components/aliyun'
import tencent from './components/tencent'
import ucloud from './components/ucloud'
import submail from './components/submail'
export default {
  components: {
    aliyun,
    tencent,
    ucloud,
    submail
  }
}
</script>

<style scoped>

</style>
