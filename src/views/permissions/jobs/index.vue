<template>
  <div>
    <Search :search="search" :reset="reset">
      <template v-slot:body>
        <el-form-item label="岗位名称" prop="job_name">
          <el-input v-model="query.job_name" name="job_name" clearable />
        </el-form-item>
      </template>
    </Search>
    <div class="table-default">
      <Operate :show="open" />
      <el-table :data="tableData" class="mt-3" v-loading="loading">
        <el-table-column prop="job_name" label="岗位名称" />
        <el-table-column prop="coding" label="岗位编码" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <Status v-model="scope.row.status" :id="scope.row.id" :api="api" />
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" />
        <el-table-column prop="description" label="岗位描述" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <Update @click="open(scope.row.id)" />
            <Destroy @click="destroy(api, scope.row.id)" />
          </template>
        </el-table-column>
      </el-table>
      <Paginate />
    </div>

    <Dialog v-model="visible" :title="title" destroy-on-close>
      <Create @close="close(reset)" :primary="id" :api="api" />
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
// @ts-nocheck
import { computed, onMounted } from 'vue'
import Create from './form/create.vue'
import { useGetList } from '@/composables/curd/useGetList'
import { useDestroy } from '@/composables/curd/useDestroy'
import { useOpen } from '@/composables/curd/useOpen'

const api = 'permissions/jobs'

const { data, query, search, reset, loading } = useGetList(api)
const { destroy, deleted } = useDestroy()

const tableData = computed(() => data.value?.data)
const { open, close, title, visible, id } = useOpen()

onMounted(() => {
  search()

  deleted(reset)
})
</script>
