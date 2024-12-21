<template>
  <div class="w-full sm:w-[90%] mx-auto" v-loading="loading">
    <el-form :model="formData" ref="form" label-width="80px">
      <el-form-item
        :label="$t('generate.code.module.name')"
        prop="module"
        :rules="[
          {
            required: true,
            message: $t('generate.code.module.verify')
          }
        ]"
      >
        <Select v-model="formData.module" clearable :placeholder="$t('generate.code.module.placeholder')" api="modules" class="w-full" filterable />
      </el-form-item>
      <el-form-item
        :label="$t('generate.schema.name')"
        prop="schema_name"
        :rules="[
          {
            required: true,
            message: $t('generate.schema.name_verify')
          }
        ]"
      >
        <Select v-model="formData.schema_name" clearable api="schemas" class="w-full" filterable />
      </el-form-item>
    </el-form>

    <div class="flex justify-end">
      <el-button type="primary" @click="submitForm(form)">{{ $t('system.confirm') }}</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
// @ts-nocheck
import { useCreate } from '@/composables/curd/useCreate'
import { onMounted } from 'vue'

const props = defineProps({
  api: String
})

const { formData, form, loading, submitForm, close } = useCreate(props.api as string)

const emit = defineEmits(['close'])
onMounted(() => {
  close(() => emit('close'))
})
</script>
