<template>
  <el-upload
    ref="upload"
    :action="actionApi"
    :show-file-list="false"
    name="image"
    :auto-upload="auto"
    :headers="{ authorization: token, 'Request-from': 'Dashboard' }"
    v-bind="$attrs"
    :on-success="handleSuccess"
  >
    <img v-if="fileModel" :src="fileModel" class="avatar" />
    <div v-else>
      <div class="flex justify-center items-center w-20 h-20 border border-collapse">
        <el-icon><Plus /></el-icon>
      </div>
    </div>
  </el-upload>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref } from 'vue'
import { env, getAuthToken, warpHost } from '@/support/helper'
import { Plus } from '@element-plus/icons-vue'
import { Code } from '@/enum/app'
import Message from '@/support/message'

const props = defineProps({
  action: {
    type: String,
    default: '/upload/image'
  },
  auto: {
    type: Boolean,
    default: true
  },
  modelValue: {
    type: String,
    default: '',
    require: true
  },
  imageClass: {
    type: String,
    default: ''
  }
})

const baseURL = env('VITE_BASE_URL')
const fileModel = defineModel({
  type: String,
  default: ''
})
const actionApi = ref<string>('')

actionApi.value = baseURL + props.action

const token = ref<string>()
token.value = 'Bearer ' + getAuthToken()

const handleSuccess = (response: any) => {
  if (response.code === Code.SUCCESS) {
    fileModel.value = warpHost(response.data.path)
  } else {
    Message.error(response.message)
  }
}
</script>
