<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="item.name" :name="item.component" v-for="item in tabs" :key="item.id">
        <component :is="components[item.component]"></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabs: [],
      activeName: '',
      components: {
        'upload': () => import('./component/upload'),
        'basic': () => import('./component/basic')
      }
    }
  },
  created() {
    this.$http.get('config/parent').then(response => {
      this.tabs = response.data
      this.activeName = this.tabs[0].component
    })
  }
}
</script>

<style scoped>

</style>
