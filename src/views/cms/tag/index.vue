<template>
  <div>
    <Search :search="search" :reset="reset">
      <template v-slot:body>
        <el-form-item label="名称">
          <el-input v-model="query.name" clearable />
        </el-form-item>
      </template>
    </Search>
    <div class="table-default">
      <Operate :show="open" />
      <el-table :data="tableData" class="mt-3" v-loading="loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="created_at" label="创建时间" />
        <el-table-column label="操作">
          <template #default="scope">
            <Update @click="open(scope.row.id)" />
            <Destroy @click="destroy(api, scope.row.id)" />
          </template>
        </el-table-column>
      </el-table>
      <div class="flex justify-between">
        <div class="pt-4">
          <Destroy text="批量删除" @click="multiDel" />
        </div>
        <Paginate />
      </div>
    </div>

    <Dialog v-model="visible" :title="title" destroy-on-close>
      <Create @close="close(reset)" :primary="id" :api="api" />
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
// @ts-nocheck
import { computed, onMounted, ref } from 'vue'
import Create from './create.vue'
import { useGetList } from '@/composables/curd/useGetList'
import { useDestroy } from '@/composables/curd/useDestroy'
import { useOpen } from '@/composables/curd/useOpen'
import Message from '@/support/message'

const api = 'cms/tag'

const { data, query, search, reset, loading } = useGetList(api)
const { destroy, deleted } = useDestroy()
const { open, close, title, visible, id } = useOpen()

const tableData = computed(() => data.value?.data)

onMounted(() => {
  search()
  deleted(reset)
})

// 多选
const multiSelect = ref([])
const handleSelectionChange = posts => {
  multiSelect.value = posts
}

const multiDel = () => {
  let ids = ''
  multiSelect.value.forEach(item => {
    ids += item.id + ','
  })
  if (ids.length === 0) {
    Message.error('请选择删除的标签')
  } else {
    destroy('/cms/tag', ids.substring(0, ids.length - 1))
  }
}
</script>
