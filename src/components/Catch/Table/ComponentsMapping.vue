<template>
  <div>
    <component
      :is="item.name"
      v-for="(item, index) in getCellList"
      :key="index"
      v-model="item.data"
      :row="row"
    />
  </div>
</template>

<script>
export default {
  props: {
    parent: {
      type: Object,
      default () {
        return {}
      }
    },
    row: {
      type: Object,
      default () {
        return {}
      }
    },
    cellList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      getCellList: this.cellList
    }
  },
  created () {
    this.$options.components = this.parent.$options.components
  }
}
</script>
