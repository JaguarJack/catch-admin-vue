<template>
  <div class="flex flex-col">
    <div class="bg-white dark:bg-regal-dark">
      <el-divider class="mt-5 pl-2 pr-2"
        ><span class="text-[1.6rem]">{{ title }}</span></el-divider
      >

      <slot name="body" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    require: true,
  },
})
</script>
