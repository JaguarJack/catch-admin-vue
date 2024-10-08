<template>
  <div>
    <Editor :api-key="aipKey" :init="config" v-model="content" v-bind="$attrs" />
  </div>
</template>

<script setup lang="ts">
import '@/public/tinymce/tinymce.min'
import '@/public/tinymce/themes/silver/theme.min'
import '@/public/tinymce/icons/default/icons.min'
import '@/public/tinymce/models/dom/model.min'
// css
import '@/public/tinymce/skins/ui/oxide/skin.min.css'

// plugins
import '@/public/tinymce/plugins/preview/plugin.min'
import '@/public/tinymce/plugins/searchreplace/plugin.min'
import '@/public/tinymce/plugins/autolink/plugin.min'
import '@/public/tinymce/plugins/directionality/plugin.min'
import '@/public/tinymce/plugins/visualblocks/plugin.min'
import '@/public/tinymce/plugins/visualchars/plugin.min'
import '@/public/tinymce/plugins/fullscreen/plugin.min'
import '@/public/tinymce/plugins/image/plugin.min'
import '@/public/tinymce/plugins/link/plugin.min'
import '@/public/tinymce/plugins/media/plugin.min'
import '@/public/tinymce/plugins/template/plugin.min'
import '@/public/tinymce/plugins/code/plugin.min'
import '@/public/tinymce/plugins/codesample/plugin.min'
import '@/public/tinymce/plugins/table/plugin.min'
import '@/public/tinymce/plugins/charmap/plugin.min'
import '@/public/tinymce/plugins/pagebreak/plugin.min'
import '@/public/tinymce/plugins/nonbreaking/plugin.min'
import '@/public/tinymce/plugins/anchor/plugin.min'
import '@/public/tinymce/plugins/insertdatetime/plugin.min'
import '@/public/tinymce/plugins/advlist/plugin.min'
import '@/public/tinymce/plugins/lists/plugin.min'
import '@/public/tinymce/plugins/wordcount/plugin.min'
import '@/public/tinymce/plugins/autosave/plugin.min'
import '@/public/tinymce/plugins/emoticons/plugin.min'

// lang
import '@/public/tinymce/langs/zh-CN'

import Editor from '@tinymce/tinymce-vue'
import { env } from '@/support/helper'
import Http from '@/support/http'
import Message from '@/support/message'
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
    require: true
  },
  width: {
    type: [Number, String],
    required: false,
    default: 'auto'
  },
  height: {
    type: [Number, String],
    required: false,
    default: 'auto'
  },
  language: {
    type: String,
    default: 'zh-Hans'
  },

  placeholder: {
    type: String,
    default: '在这里输入内容'
  },

  plugins: {
    type: String,
    default:
      'preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code ' +
      'codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount autosave emoticons'
  },
  toolbar: {
    type: Array,
    default: [
      'undo redo restoredraft cut copy paste pastetext forecolor backcolor bold italic underline strikethrough link anchor alignleft aligncenter alignright alignjustify outdent indent bullist numlist blockquote subscript superscript removeformat styleselect formatselect fontselect fontsizeselect ' +
        'table upload image axupimgs media emoticons charmap hr pagebreak insertdatetime  ' +
        'selectall visualblocks searchreplace code print preview indent2em fullscreen'
    ]
  }
})

const aipKey: string = 's1ntkmnev0ggx0hhaqnubrdxhv0ly99uyrdbckeaycx7iz6v'
const uploaded = (blobInfo: any, progress: any) =>
  new Promise((resolve, reject) => {
    if (blobInfo.blob().size / 1024 / 1024 > 10) {
      Message.error('上传失败，图片大小请控制在 10M 以内')
    } else {
      const params = new FormData()
      params.append('image', blobInfo.blob())
      Http.post(env('VITE_BASE_URL') + 'upload/image', params)
        .then(res => {
          if (res.data.code === 10000) {
            resolve(res.data.data.path)
          } else {
            Message.error(res.data.message)
          }
        })
        .catch(() => {
          Message.error('Server Error!')
        })
    }
  })
const config = {
  base_url: '@/public/tinymce',
  language: props.language,
  placeholder: props.placeholder,
  width: props.width,
  height: props.height,
  plugins: props.plugins,
  toolbar: props.toolbar,
  branding: false,
  // menubar: false,
  images_upload_handler: uploaded
}

const emits = defineEmits(['update:modelValue'])
const content = ref(props.modelValue)
// 创建的时候
watch(content, value => {
  emits('update:modelValue', value)
})

// 回显监听
watch(
  () => props.modelValue,
  value => {
    content.value = value
  }
)
</script>

<style scoped>
.tinymce-boxz > textarea {
  display: none;
}
</style>
<style>
/* 隐藏apikey没有绑定这个域名的提示 */
.tox-notifications-container .tox-notification--warning {
  display: none !important;
}

.tox {
  z-index: 9999 !important;
}

.tox-promotion {
  display: none !important;
}
</style>
