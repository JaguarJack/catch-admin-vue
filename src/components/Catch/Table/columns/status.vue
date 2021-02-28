<template>
  <el-button v-if="$attrs.row.status === 1" size="small">启用 </el-button>

  <el-button v-else size="small" type="danger">禁用</el-button>
</template>

<script>
export default {
  name: 'status',
}
</script>
