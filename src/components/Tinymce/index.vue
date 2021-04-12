<template>
  <div>
    <!--tinymce-script-src="./public/tinymce.min.js"-->

    <editor
       api-key="s1ntkmnev0ggx0hhaqnubrdxhv0ly99uyrdbckeaycx7iz6v"
      :init="tinymceConfig"
      :initial-value="initContent"
      model-events="change keydown blur focus paste"
      v-model="content"
    />
  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'

export default {
  name: 'tinymce',
  components: {
    'editor': Editor
  },
  props: {
    id: {
      type: String,
      default: function() {
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      default() {
        return []
      }
    },
    plugins: {
      type: Array,
      default() {
        return []
      }
    },
    menubar: {
      type: String,
      default: 'file edit insert view format table'
    },
    height: {
      type: [Number, String],
      required: false,
      default: 500
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    },
    initContent: {
      type: String,
      default() {
        return ''
      }
    },
    language: {
      type: String,
      default() {
        return 'zh_CN'
      }
    },
    uploadConf: {
      type: Object,
      default() {
        return null
      }
    },
    placeholder: {
      type: String,
      default() {
        return '请输入内容'
      }
    }
  },
  data() {
    return {
      content: '',
      tinymceId: this.id,
      fullscreen: false,
      tinymceConfig: {},
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.tinymceConfig = {
        selector: `#${this.tinymceId}`,
        language: this.language,
        height: this.height,
        body_class: 'tinymce-container',
        object_resizing: false,
        toolbar: this.toolbar,
        menubar: this.menubar,
        plugins: this.plugins,
        branding: false,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        default_link_target: '_blank',
        link_title: false,
        placeholder: this.placeholder,
        // 图片是否可以粘贴
        paste_data_images: true,
        images_upload_handler: (blobInfo, success, failure) => {
          if(blobInfo.blob().size/1024/1024 > this.uploadConf.size){
            failure('上传失败，图片大小请控制在 '+this.uploadConf.size+'M 以内')
          } else {
            let params = new FormData()
            params.append('image',blobInfo.blob())
            let config={
              headers:{
                'Content-Type': 'multipart/form-data',
                'authorization': this.uploadConf.authorization
              }
            }
            this.$http.post(this.uploadConf.url, params, config).then(res=>{
              if (res.code === 10000) {
                success(res.data)
              } else {
                failure(res.message)
              }
            }).catch(()=>{
              failure('Server Error!')
            })
          }
        },
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        init_instance_callback: editor => {
          if (this.content) {
            editor.setContent(this.content)
          }
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('input', editor.getContent())
          })
        },
      }
    }
  }
}
</script>
