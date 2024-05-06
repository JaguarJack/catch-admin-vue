<!-- eslint-disable vue/no-multiple-template-root -->
<template>
  <form-item v-for="item in formItems" :key="item.name" v-bind="item" />
</template>

<script setup lang="ts">
import type { formItemsType } from '@/components/catchForm/config/commonType'
import FormItem from './FormItem.vue'

defineProps<{
  formItems: formItemsType
}>()
</script>
