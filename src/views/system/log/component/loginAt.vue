<template>
  <div>
    {{ formatLoginTime($attrs.row.login_at) }}
  </div>
</template>

<script>
import { parseTime } from '@/utils'

export default {
  name: 'loginAt',
  methods: {
    formatLoginTime(time) {
      return parseTime(time)
    }
  }
}
</script>

<style scoped>

</style>
