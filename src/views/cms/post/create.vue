<template>
  <div class="w-full" v-loading="loading">
    <el-form :model="formData" label-width="100px" ref="form" class="pt-5 pr-4 w-full bg-white dark:bg-regal-dark">
      <div class="flex md:flex-row">
        <div class="w-full">
          <div class="flex flex-row justify-between">
            <div class="w-3/4">
              <el-form-item
                label="标题"
                prop="title"
                :rules="[
                  {
                    required: true,
                    message: '文章标题必须填写'
                  }
                ]"
              >
                <el-input v-model="formData.title" name="title" clearable />
              </el-form-item>
            </div>
            <div class="w-1/4">
              <el-form-item
                label="选择分类"
                prop="category_id"
                :rules="[
                  {
                    required: true,
                    message: '请先选择分类'
                  }
                ]"
              >
                <el-tree-select v-model="formData.category_id" value-key="id" placeholder="选择分类" clearable class="w-full" :data="category" check-strictly :props="{ value: 'id', label: 'name' }" />
              </el-form-item>
            </div>
          </div>
          <el-form-item label="摘录" prop="excerpt" v-if="formData.type === 1">
            <el-input v-model="formData.excerpt" name="excerpt" clearable type="textarea" />
          </el-form-item>

          <el-form-item
            label="内容"
            prop="content"
            :rules="[
              {
                required: true,
                message: '文章内容必须填写'
              }
            ]"
          >
            <editor :height="500" v-model="formData.content" />
            <el-input v-model="formData.content" class="invisible" />
          </el-form-item>
        </div>
        <div class="w-1/3">
          <el-form-item
            class="mt-6"
            label="作者"
            prop="author"
            :rules="[
              {
                required: true,
                message: '请选择作者'
              }
            ]"
          >
            <el-select v-model="formData.author" placeholder="选择作者">
              <el-option v-for="user in users" :key="user.id" :label="user.username" :value="user.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="封面" prop="cover">
            <Upload class="w-28" action="/upload/image" :show-file-list="false" name="image" :onSuccess="uploadSuccess">
              <div class="flex flex-col">
                <img :src="formData.cover" v-if="formData.cover" />
                <div v-else class="text-sm text-indigo-500">选择封面</div>
              </div>
            </Upload>
          </el-form-item>
          <el-form-item label="可见性" prop="status" class="mt-6" v-if="formData.type === 1">
            <el-select v-model="formData.visible" placeholder="选择可见性">
              <el-option label="公开" :value="1" />
              <el-option label="私密" :value="2" />
              <el-option label="密码查看" :value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="查看密码" prop="password" v-if="formData.visible === 3 && formData.type === 1" class="mt-6">
            <el-input v-model="formData.password" name="password" clearable placeholder="输入查看密码" />
          </el-form-item>
          <el-form-item
            label="标签"
            prop="tags"
            class="mt-6"
            v-if="formData.type === 1"
            :rules="[
              {
                required: true,
                message: '至少填写一个标签'
              }
            ]"
          >
            <el-select v-model="formData.tags" multiple filterable allow-create placeholder="输入标签" />
          </el-form-item>
          <el-form-item label="可评论" prop="is_can_comment" class="mt-6">
            <el-radio-group v-model="formData.is_can_comment">
              <el-radio-button :label="1">是</el-radio-button>
              <el-radio-button :label="2">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="类型" prop="type" class="mt-6">
            <el-radio-group v-model="formData.type">
              <el-radio-button :label="1">文章</el-radio-button>
              <el-radio-button :label="2">页面</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="状态" prop="status" class="mt-6">
            <el-radio-group v-model="formData.status">
              <el-radio-button label="1">发布</el-radio-button>
              <el-radio-button label="2">草稿</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="置顶" prop="top" class="mt-6" v-if="formData.type === 1">
            <el-radio-group v-model="formData.top">
              <el-radio-button label="1">分类</el-radio-button>
              <el-radio-button label="2">首页</el-radio-button>
              <el-radio-button label="3">全局</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="排序" prop="order" class="mt-6">
            <el-input-number v-model="formData.order" name="order" clearable :min="1" />
          </el-form-item>

          <div class="bg-white dark:bg-regal-dark">
            <div class="flex justify-center p-3">
              <router-link to="/cms/articles/post">
                <el-button>取消</el-button>
              </router-link>
              <el-button type="primary" @click="submitForm(form)" class="ml-5">保存</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
// @ts-nocheck
import { useCreate } from '@/composables/curd/useCreate'
import { nextTick, onMounted, ref } from 'vue'
import http from '@/support/http'
import router from '@/router'

const primary = router.currentRoute.value.params.id

const api = '/cms/post'

const { formData, form, loading, submitForm, afterCreate, afterUpdate } = useCreate(api, primary)
// 默认可评论
formData.value.is_can_comment = 1
formData.value.order = 1
formData.value.status = 2
formData.value.type = 1

afterCreate.value = () => {
  router.push({ path: '/cms/articles/post' })
}
afterUpdate.value = () => {
  router.push({ path: '/cms/articles/post' })
}

const category = ref()
const getCategory = async () => {
  await http.get('cms/category').then(r => {
    category.value = r.data.data
  })
}

const users = ref()
const getUsers = async () => {
  await http.get('users').then(r => {
    users.value = r.data.data
  })
}

const show = async () => {
  if (primary) {
    loading.value = true
    await http.get('/cms/post/' + primary).then(r => {
      nextTick(() => {
        formData.value = r.data.data
        loading.value = false
      })
    })
  }
}
onMounted(() => {
  getCategory()
  getUsers()
  show()
})

const uploadSuccess = r => {
  formData.value.cover = r.data.path
}
</script>

<style scoped>
:deep(.el-loading-mask) {
  z-index: 10000 !important;
}
</style>
