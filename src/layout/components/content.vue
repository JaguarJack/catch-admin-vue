<template>
  <div :class="'w-full h-screen flex flex-col transition-spacing duration-300 ease-linear overflow-hidden ' + mlClass">
    <!-- Header -->
    <Header />
    <!-- Tag view -->
    <!--<div class=""></div>-->
    <!-- Container -->
    <div class="overflow-auto p-1 max-w-full h-screen sm:p-3 sm:overflow-x-hidden dark:bg-regal-deep-dark">
      <div class="min-h-[calc(100vh-8rem)]">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive v-if="isKeepalive">
              <component :is="Component" :key="routeKey" />
            </keep-alive>

            <!--  <component :is="Component" :key="routeKey" />-->
          </transition>
        </router-view>
      </div>

      <div class="w-full h-4 leading-10 text-center text-gray-400"><el-link href="https://catchadmin.com/" target="_blank">CatchAdmin 管理系统 </el-link> @copyright 2018 ~ {{ year }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/modules/app'
import router from '@/router'

const appStore = useAppStore()

const mlClass = computed(() => {
  return appStore.isExpand ? 'ml-0 sm:ml-56' : 'ml-0 sm:ml-16'
})
const routeKey = computed(() => router.currentRoute.value.name)
const isKeepalive = computed(() => router.currentRoute.value.meta.keepalive)

const year = computed(() => {
  const date = new Date()

  return date.getFullYear()
})
</script>
