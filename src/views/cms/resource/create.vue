<template>
  <el-form :model="formData" label-width="120px" ref="form" v-loading="loading" class="pr-4">
    <el-form-item
      label="名称"
      prop="name"
      :rules="[
        {
          required: true,
          message: '名称必须填写'
        }
      ]"
    >
      <el-input v-model="formData.name" name="name" clearable />
    </el-form-item>
    <el-form-item label="类型" prop="type">
      <el-radio-group v-model="formData.type">
        <el-radio-button :label="1">轮播图</el-radio-button>
        <el-radio-button :label="2">友情链接</el-radio-button>
        <el-radio-button :label="3">广告</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      label="内容"
      v-if="formData.type !== 2"
      prop="content"
      :rules="[
        {
          required: true,
          message: '内容必须填写'
        }
      ]"
    >
      <Upload class="w-28" action="/upload/image" :show-file-list="false" name="image" :onSuccess="uploadSuccess">
        <div class="flex flex-col">
          <img :src="formData.content" v-if="formData.content" />
          <el-button type="success" v-else size="small">选择</el-button>
        </div>
      </Upload>
    </el-form-item>
    <el-form-item label="链接" prop="url" :rules="[{ type: 'url', required: false, message: '请填写正确的链接格式' }]" v-if="formData.type !== 2">
      <el-input v-model="formData.url" name="url" clearable />
    </el-form-item>
    <el-form-item label="链接" prop="url" :rules="[{ type: 'url', required: true, message: '请填写正确的链接格式' }]" v-else>
      <el-input v-model="formData.url" name="url" clearable />
    </el-form-item>
    <el-form-item label="描述" prop="description">
      <el-input v-model="formData.description" name="description" clearable type="textarea" />
    </el-form-item>

    <el-form-item label="可见" prop="is_visible">
      <el-radio-group v-model="formData.is_visible">
        <el-radio :label="1">可见</el-radio>
        <el-radio :label="2">隐藏</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="打开方式" prop="is_target">
      <el-radio-group v-model="formData.is_target">
        <el-radio :label="1">本窗口</el-radio>
        <el-radio :label="2">新窗口</el-radio>
      </el-radio-group>
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

const props = defineProps({
  primary: [String, Number],
  api: String
})

const { formData, form, loading, submitForm, close } = useCreate(props.api as string, props.primary)
formData.value.type = 1
formData.value.is_visible = 1
formData.value.is_target = 1
if (props.primary) {
  useShow(props.api as string, props.primary, formData)
}

const emit = defineEmits(['close'])
onMounted(() => {
  close(() => emit('close'))
})

const uploadSuccess = (r: any) => {
  formData.value.content = r.data.path
}
</script>
