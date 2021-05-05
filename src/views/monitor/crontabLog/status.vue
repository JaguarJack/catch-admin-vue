<template>
  <el-tag v-if="$attrs.row.status === 1" class="el-icon-check" effect="dark" type="success"> 成功</el-tag>
  <el-tag v-else type="danger" class="el-icon-close" effect="dark">失败</el-tag>
</template>

<script>
export default {
  name: 'status'
}
</script>
