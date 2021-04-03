<template>
  <el-tag v-if="$attrs.row.status === 1" type="success">成功</el-tag>
  <el-tag v-else type="danger">失败</el-tag>
</template>

<script>
export default {
  name: 'status',
}
</script>
