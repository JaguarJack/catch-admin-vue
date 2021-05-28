<template>
  <div class="search-container search-form">
    <el-card v-show="isShowSearch()" shadow="never">
      <form-create
        :rule="search"
        v-model="searchOptions.fApi"
        :option="searchOptions"
        :value.sync="queryParams"
      />
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'search',
  props: {
    search: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      queryParams: {},
      searchOptions: {
        fApi:{},
        form: {
          inline: true,
          labelWidth: 'auto'
        },
        submitBtn: {
          icon: 'el-icon-search',
          innerText: '搜索',
          click: this.handleSearch,
        },
        resetBtn: {
          innerText: '重置',
          show: true,
          icon: 'el-icon-refresh',
          click: this.handleReset,
        }
      }
    }
  },
  methods: {
    isShowSearch() {
      return this.search.filter(function(item){
        return item.type !== 'hidden'
      }).length;
    },
    handleSearch() {
      this.$emit('handleSearch')
    },
    handleReset() {
      this.$emit('handleReset')
    }
  }
}
</script>

<style scoped>

</style>
