<template>
    <div>
        <a-modal
            title="图文消息"
            width="90%"
            :visible="visible"
            :centered="true"
            :confirmLoading="confirmLoading"
            @ok="handleSubmit"
            @cancel="handleCancel"
        >
            <a-row>
                <a-col :span="6" >
                    <a-card hoverable style="width: 300px;margin-top: 5px;" v-for="(item, key) in articles" :key="key">
                        <img slot="cover" v-if="item.cover" :src="item.cover" @click="selectArticle(key)"/>
                        <img slot="cover" v-else src="@/assets/graphic_default.jpeg" @click="selectArticle(key)"/>
                        <template slot="actions" class="ant-card-actions">
                            <a-icon key="delete" type="delete" @click="delArticle(key)"/>
                        </template>
                        <a-card-meta :title="item.title"  @click="selectArticle(key)"/>
                    </a-card>
                    <a-button  type="primary" style="width: 82%;margin-top: 10px" @click="addArticle">
                        <a-icon type="plus" /> 新增文章
                    </a-button>
                </a-col>
                <a-col :span="18">
                    <a-form :form="form">
                    <a-form-item
                        :label-col="labelCol"
                        :wrapper-col="wrapperCol"
                        label="标题"
                    >
                        <a-input allowClear v-model="article.title" />
                    </a-form-item>
                    <a-form-item
                        :label-col="labelCol"
                        :wrapper-col="wrapperCol"
                        label="作者"
                    >
                        <a-input allowClear v-model="article.author"  />
                    </a-form-item>
                    <a-form-item
                        :label-col="labelCol"
                        :wrapper-col="wrapperCol"
                        label="封面"
                    >
                        <a-upload
                            name="image"
                            list-type="picture-card"
                            class="avatar-uploader"
                            :show-upload-list="false"
                            :action="action"
                            :headers="headers"
                            :before-upload="beforeUpload"
                            @change="handleChange"
                        >
                            <img v-if="article.cover" :src="article.cover" alt="avatar" style="width: 100px"/>
                            <div v-else>
                                <a-icon :type="loading ? 'loading' : 'plus'" />
                                <div class="ant-upload-text">上传封面</div>
                            </div>
                        </a-upload>
                    </a-form-item>
                    <a-form-item label="内容">
                        <quill-editor @syncContent="syncContent" ref="quillEditor"/>
                    </a-form-item>
                    </a-form>
                </a-col>
            </a-row>
        </a-modal>
    </div>
</template>

<script>
  import Vue from 'vue'
  import { QuillEditor } from '@/components'
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  export default {
    name: 'create',
    components: {  QuillEditor},
    data() {
      return {
        labelCol: {
          xs: { span: 4 },
          sm: { span: 1 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        visible: false,
        confirmLoading: false,
        loading: false,
        imageUrl: '',
        form: this.$form.createForm(this),
        // 图文数组
        articles: [],
        // 文章
        article: {
          title: '',
          author: '',
          cover: '',
          content: '',
        },
        selectKey: 0,
        action: process.env.VUE_APP_API_BASE_URL + '/upload/image',
        headers: {
          'authorization': 'Bearer ' + Vue.ls.get(ACCESS_TOKEN)
        },
        id: null
      }
    },
    created () {
      this.articles.push(this.article)
    },
    methods: {
        add() {
          this.visible = true
        },
        edit(id) {
          this.visible = true
          this.id = id
          this.$http.get('wechat/official/graphic/' + id).then(res => {
            this.articles = res.data
            this.article = this.articles[0]
            this.$refs.quillEditor.syncContent(this.article.content)
          })
        },
        selectArticle(key) {
          this.articles[this.selectKey] = this.article
          this.article = this.articles[key]
          this.$refs.quillEditor.syncContent(this.article.content)
          this.selectKey = key
        },
        delArticle(k) {
           if (this.articles.length <= 1) {
             this.$message.error('至少保留一篇文章')
           } else {
             this.articles = this.articles.filter(function (item, key) {
               return key !== k
             })
            // 选中其实一个
             const key = this.articles[k] === undefined ? k -1 : k;
             this.article = this.articles[key]
             this.$refs.quillEditor.syncContent(this.article.content)
             this.selectKey = key
           }
        },
        addArticle() {
          if (this.articles.length >= 7) {
            this.$message.error('最多添加七篇文章');
          } else {
            this.articles.push({
                title: '',
                author: '',
                cover: '',
                content: ''
            })
          }
        },
        handleCancel() {
            this.visible = false
            this.id = null
            this.$refs.quillEditor.syncContent('请输入内容')
            this.articles = [{
              title: '',
              author: '',
              cover: '',
              content: '',
            }]
            this.article ={
              title: '',
              author: '',
              cover: '',
              content: '',
            }
            this.selectKey = 0
        },
      handleChange(info) {
        if (info.file.status === 'uploading') {
          this.loading = true;
          return;
        }
        if (info.file.status === 'done') {
          this.article.cover = info.file.response.data
          this.loading = false
        }
      },
      handleSubmit() {
        const len = this.articles.length;
        let status = true
        for (let i=0;i<len;i++) {
            if (this.articles[i].title.length < 1) {
              this.$message.error('第' + (i+1) + '篇文章标题没有填写')
              status = false
              break;
            }
            if (this.articles[i].author.length < 1) {
                this.$message.error('第' + (i+1) + '篇文章作者没有填写')
                status = false
                break;
            }
            if (this.articles[i].cover.length < 1) {
                this.$message.error('第' + (i+1) + '篇文章封面没有上传')
                status = false
                break;
            }
            if (this.articles[i].content.length < 1) {
                this.$message.error('第' + (i+1) + '篇文章内容没有填写')
                status = false
                break;
            }
        }
        if (status) {
          if (this.id === null) {
            this.$http.post('wechat/official/graphic', { articles: this.articles }).then(res => {
              this.toast(res)
            })
          } else {
            this.$http.put('wechat/official/graphic/' + this.id, { articles: this.articles }).then(res => {
              this.toast(res)
              this.handleCancel()
            })
          }
          this.$emit('refresh')
        }

      },
      beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          this.$message.error('You can only upload JPG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
      },
      syncContent(html) {
          this.articles[this.selectKey].content = html
      }
    }
  }
</script>

<style scoped>
    .avatar-uploader > .ant-upload {
        width: 128px;
        height: 128px;
    }
    .ant-upload-select-picture-card i {
        font-size: 32px;
        color: #999;
    }

    .ant-upload-select-picture-card .ant-upload-text {
        margin-top: 8px;
        color: #666;
    }
</style>
