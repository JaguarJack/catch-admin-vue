<template>
  <div class="flex w-full h-12 px-1 bg-white dark:bg-regal-dark sm:px-3 gap-x-2 menu" ref="container" v-if="tabs.length > 0">
    <ContextMenu>
      <el-tag
        class="mt-1.5 hover:cursor-pointer"
        v-for="(tag, index) in tabs"
        :key="index"
        :closable="!tag.meta.affix"
        :disable-transitions="false"
        :effect="tag.is_active ? 'dark' : 'plain'"
        @click.prevent="navTabStore.selectTab(tag)"
        @close="navTabStore.removeTab(index)"
      >
        {{ tag.meta.title }}
      </el-tag>
    </ContextMenu>
    <!--
    <div :class="`fixed pt-2 left-0 w-5 h-10 bg-white shadow-xl ${leftWidth} cursor-pointer` + (isHasScollbars ? '' : ' hidden')" id="prev" @click="leftScroll()">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16">
        <path fill="none" stroke="black" d="M9.5 4.5L6 8l3.5 3.5" />
      </svg>
    </div>
    <div :class="`fixed right-0 w-5 h-10 pt-2 bg-white shadow-2xl cursor-pointer` + (isHasScollbars ? '' : ' hidden')" id="next" @click="rightScroll()">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16">
        <path fill="none" stroke="black" d="M6 4.5L9.5 8L6 11.5" />
      </svg>
    </div>-->
  </div>
</template>

<script setup lang="ts">
import { useNavTabStore } from '@/stores/modules/tabs'
import ContextMenu from './contextMenu.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useAppStore } from '@/stores/modules/app'

const navTabStore = useNavTabStore()
const tabs = computed(() => navTabStore.getNavTabs)
const appStore = useAppStore()

const isHasScollbars = ref(false)
const hasScrollbars = () => {
  const element = document.querySelector('.menu') // 替换为你想检查的元素的选择器
  // @ts-ignore
  isHasScollbars.value = element.scrollWidth >= element.clientWidth
}

const leftWidth = computed(() => {
  return appStore.isExpand ? 'sm:left-56' : 'sm:left-16'
})

const leftScroll = () => {
  // @ts-ignore
  scrollContainer('left')
}

const rightScroll = () => {
  scrollContainer('right')
}

const scrollContainer = (direction: string) => {
  const scrollAmount = 100

  // @ts-ignore
  const container = document.querySelector('.menu') // 替换为你想检查的元素的选择器
  // @ts-ignore

  const currentScroll = container.scrollLeft
  const newScroll = direction === 'right' ? currentScroll + scrollAmount : currentScroll - scrollAmount
  // @ts-ignore

  container.scrollTo({
    left: newScroll,
    behavior: 'smooth'
  })
}
watch(
  () => [tabs, leftWidth],
  () => {
    hasScrollbars()
  },
  { deep: true }
)
onMounted(() => {
  window.onresize = () => {
    return (() => {
      // 如果切换到小屏幕，并且是菜单是收缩状态，则隐藏子菜单
      hasScrollbars()
    })()
  }
})
</script>

<style scoped>
.menu {
  overflow-x: scroll;
  scrollbar-width: none; /* For Firefox */
  -ms-overflow-style: none; /* For Internet Explorer and Edge */
}

.menu::-webkit-scrollbar {
  display: none; /* For Chrome, Safari, and Opera */
}
</style>
