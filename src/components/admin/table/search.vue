<template>
  <div class="w-full min-h-0 pt-5 pl-5 pr-5 bg-white rounded-lg dark:bg-regal-dark">
    <el-form :inline="true">
      <slot name="body" />
      <el-form-item>
        <el-button type="primary" @click="search()">
          <Icon name="magnifying-glass" className="w-4 h-4 mr-1 -ml-1" />
          搜索
        </el-button>
        <el-button @click="reset()">
          <Icon name="arrow-path" className="w-4 h-4 mr-1 -ml-1" />
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  search: {
    type: Function,
    required: true
  },

  reset: {
    type: Function,
    required: true
  }
})
</script>

<style scoped>
:deep(.el-form-item) {
  min-width: 240px;
}
</style>
