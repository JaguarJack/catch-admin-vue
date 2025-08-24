<template>
  <layout title="个人设置">
    <template v-slot:body>
      <el-form :model="formData" label-width="120px" ref="form" class="pt-5 pr-4 w-full bg-white dark:bg-regal-dark">
        <div class="flex flex-col mx-auto w-2/3">
          <el-form-item
            label="昵称"
            prop="personal_nickname"
            :rules="[
              {
                required: true,
                message: '昵称名称必须填写'
              }
            ]"
          >
            <el-input v-model="formData.personal_nickname" clearable placeholder="昵称" />
          </el-form-item>
          <el-form-item label="英文昵称" prop="personal_en_nickname">
            <el-input v-model="formData.personal_en_nickname" clearable placeholder="英文昵称" />
          </el-form-item>
          <el-form-item label="🤳 个人头像" prop="personal_avatar">
            <Upload class="w-28" action="upload/image" :show-file-list="false" name="image" :onSuccess="uploadSuccess">
              <div class="flex flex-col">
                <img :src="formData.personal_avatar" v-if="formData.personal_avatar" />
                <el-button type="primary" v-else>选择头像</el-button>
              </div>
            </Upload>
          </el-form-item>

          <el-form-item
            label="🏠 个人主页"
            prop="personal_homepage"
            :rules="[
              {
                type: 'url',
                message: '个人主页链接不符合规则'
              }
            ]"
          >
            <el-input v-model="formData.person_homepage" clearable placeholder="个人主页" />
          </el-form-item>

          <el-form-item label="📮 邮箱" prop="personal_email">
            <el-input v-model="formData.personal_email" clearable placeholder="邮箱" />
          </el-form-item>

          <el-form-item label="个人简介" prop="personal_description">
            <el-input v-model="formData.personal_description" clearable type="textarea" placeholder="个人简介" />
          </el-form-item>

          <el-form-item label="社交">
            <div class="flex flex-col gap-y-2 w-full">
              <el-input
                v-model="formData.personal_github"
                clearable
                placeholder="GitHub主页"
                :rules="[
                  {
                    type: 'url',
                    message: 'GitHub主页链接不符合规则'
                  }
                ]"
              />
              <el-input
                v-model="formData.personal_twitter"
                clearable
                placeholder="推特主页"
                :rules="[
                  {
                    type: 'url',
                    message: '推特主页链接不符合规则'
                  }
                ]"
              />
              <el-input
                v-model="formData.personal_linkedin"
                clearable
                placeholder="linkedin 主页"
                :rules="[
                  {
                    type: 'url',
                    message: 'linkedin 主页链接不符合规则'
                  }
                ]"
              />
              <el-input
                v-model="formData.personal_weibo"
                clearable
                placeholder="微博主页"
                :rules="[
                  {
                    type: 'url',
                    message: '微博主页链接不符合规则'
                  }
                ]"
              />
              <el-input
                v-model="formData.personal_google"
                clearable
                placeholder="G+主页"
                :rules="[
                  {
                    type: 'url',
                    message: 'G+主页链接不符合规则'
                  }
                ]"
              />
              <el-input
                v-model="formData.personal_reddit"
                clearable
                placeholder="reddit主页"
                :rules="[
                  {
                    type: 'url',
                    message: 'reddit主页链接不符合规则'
                  }
                ]"
              />
            </div>
          </el-form-item>

          <el-form-item label="所在城市" prop="personal_city">
            <el-input v-model="formData.personal_city" clearable placeholder="所在城市" />
          </el-form-item>

          <el-form-item label="状态" prop="personal_status">
            <el-input v-model="formData.personal_status" clearable placeholder="一句话描述当前状态" />
          </el-form-item>
        </div>
        <div class="flex justify-center mb-3 bg-white dark:bg-regal-dark">
          <el-button type="primary" @click="submitForm(form)" class="ml-5 w-[10rem]">保 存</el-button>
        </div>
      </el-form>
    </template>
  </layout>
</template>

<script setup lang="ts">
// @ts-nocheck
import Layout from '../layout.vue'
import { useCreate } from '@/composables/curd/useCreate'
import http from '@/support/http'
const api = '/cms/setting'

const { formData, form, loading, submitForm } = useCreate(api)

http.get('cms/setting', { key: 'personal_*' }).then(r => {
  formData.value = r.data.data
})

const uploadSuccess = r => {
  formData.value.site_logo = r.data.path
}
</script>
