<template>
  <el-tooltip class="item" effect="dark" :content="$attrs.row.params" placement="top-start">
    <el-tag type="success">查看</el-tag>
  </el-tooltip>
</template>

<script>
export default {
  name: 'params'
}
</script>
