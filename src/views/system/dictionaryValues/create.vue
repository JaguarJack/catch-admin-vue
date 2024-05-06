<template>
  <el-form :model="formData" label-width="120px" ref="form" v-loading="loading" class="pr-4">
    <el-form-item
      label="字典值名"
      prop="label"
      :rules="[
        {
          required: true,
          message: '字典值名必须填写'
        }
      ]"
    >
      <el-input v-model="formData.label" name="label" clearable />
    </el-form-item>
    <el-form-item
      label="字典键值"
      prop="value"
      :rules="[
        {
          required: true,
          message: '字典键值必须填写'
        }
      ]"
    >
      <el-input-number v-model="formData.value" name="value" clearable :min="1" />
    </el-form-item>
    <el-form-item label="排序" prop="sort">
      <el-input-number v-model="formData.sort" name="sort" :min="1" />
    </el-form-item>
    <el-form-item label="描述" prop="description">
      <el-input v-model="formData.description" name="description" clearable type="textarea" />
    </el-form-item>
    <div class="flex justify-end">
      <el-button type="primary" @click="submitForm(form)">{{ $t('system.confirm') }}</el-button>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
// @ts-nocheck
import { useCreate } from '@/composables/curd/useCreate'
import { useShow } from '@/composables/curd/useShow'
import { onMounted } from 'vue'
import router from '@/router'

const props = defineProps({
  primary: [String, Number],
  api: String
})

const { formData, form, loading, submitForm, close } = useCreate(props.api as string, props.primary)

// 默认值
formData.value.value = 1
formData.value.sort = 1
formData.value.dic_id = router.currentRoute.value.params.id

if (props.primary) {
  useShow(props.api as string, props.primary, formData)
}

const emit = defineEmits(['close'])
onMounted(() => {
  close(() => emit('close'))
})
</script>
