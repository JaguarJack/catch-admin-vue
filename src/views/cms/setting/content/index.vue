<template>
  <layout title="内容设定">
    <template v-slot:body>
      <el-form :model="formData" label-width="120px" ref="form" class="pt-5 pr-4 w-full bg-white dark:bg-regal-dark">
        <div class="flex flex-col mx-auto w-2/3">
          <el-form-item label="首页显示" prop="site_homepage_show">
            <el-radio-group v-model="formData.site_homepage_show">
              <el-radio :label="1">最新文章</el-radio>
              <el-radio :label="2">静态页面</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="静态页面" prop="site_static_page" v-if="formData.site_homepage_show === 2">
            <el-select>
              <el-option>示例页面</el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="最多显示" prop="site_most_article_number"> <el-input-number v-model="formData.site_most_article_number" clearable class="mr-2" /> 篇文章 </el-form-item>
          <el-form-item label="评论设置" prop="site_static_page">
            <div class="flex flex-col">
              <el-checkbox v-model="formData.site_comment_need_email" label="评论者必须填入名字和电子邮箱地址" size="large" />
              <el-checkbox v-model="formData.site_comment_need_login" label="用户必须注册并登录才可以发表评论" size="large" />
              <el-checkbox v-model="formData.site_comment_nested" label="启用评论嵌套" size="large" />
              <div class="w-full">
                <el-checkbox v-model="formData.site_comment_limit" size="large" label="分页显示评论" />
                ，每页显示 <el-input-number v-model="formData.site_comment_per_page" controls-position="right" class="mr-2 ml-2" />条
              </div>
              <el-checkbox v-model="formData.site_comment_order_desc" label="启用评论倒序显示" size="large" />
              <el-checkbox v-model="formData.site_comment_check" label="启用评论审核" size="large" />
            </div>
          </el-form-item>

          <el-form-item label="评论头像" prop="site_comment_forbid_keywords">
            <el-radio-group v-model="formData.site_comment_avatar" class="flex flex-col">
              <div class="flex flex-col gap-y-1">
                <div class="flex flex-row"><el-radio label="mm" size="large" style="margin-right: 20px">未知</el-radio><el-image class="w-8 h-8" :src="undefinedAvatar" /></div>
                <div class="flex flex-row">
                  <el-radio label="identicon" size="large" style="margin-right: 20px">几何图案 </el-radio>
                  <el-image class="w-8 h-8" :src="identiconAvatar" />
                </div>
                <div class="flex flex-row">
                  <el-radio label="wavatar" size="large" style="margin-right: 20px">Wavatar </el-radio>
                  <el-image class="w-8 h-8" :src="wavatarAvatar" />
                </div>
                <div class="flex flex-row">
                  <el-radio label="monsterid" size="large" style="margin-right: 20px">小怪物</el-radio>
                  <el-image class="w-8 h-8" :src="monsteridAvatar" />
                </div>
                <div class="flex flex-row">
                  <el-radio label="retro" size="large" style="margin-right: 20px">复古</el-radio>
                  <el-image class="w-8 h-8" :src="retroAvatar" />
                </div>
                <div class="flex flex-row">
                  <el-radio label="robohash" style="margin-right: 20px">机器人</el-radio>
                  <el-image class="w-8 h-8" :src="robohashAvatar" />
                </div>
              </div>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="头像代理服务器" prop="site_comment_forbid_keywords">
            <el-input v-model="formData.site_comment_avatar_proxy" />
            <div class="text-[10px] text-gray-400">目前推荐的代理服务器</div>
          </el-form-item>

          <el-form-item label="评论禁用关键字" prop="site_comment_forbid_keywords">
            <el-input v-model="formData.site_comment_forbid_keywords" type="textarea" />
            <div class="text-[10px] text-gray-400">当评论者的内容与关键字相匹配的时候，则视为垃圾内容，会直接放入回收站，不予显示。每个关键字占一行录入</div>
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

const avatar_proxy = 'https://gravatar.loli.net'

const defaultAvatar = '/avatar/2a2978369685974b4a90c0ef0e84a304'

const undefinedAvatar = avatar_proxy + defaultAvatar + '?d=mm'
const identiconAvatar = avatar_proxy + defaultAvatar + '?d=identicon'
const wavatarAvatar = avatar_proxy + defaultAvatar + '?d=wavatar'
const monsteridAvatar = avatar_proxy + defaultAvatar + '?d=monsterid'
const retroAvatar = avatar_proxy + defaultAvatar + '?d=retro'
const robohashAvatar = avatar_proxy + defaultAvatar + '?d=robohash'

http.get('cms/setting').then(r => {
  formData.value = r.data.data
})
</script>
