export default {
  data() {
    return {
      table: {
        tree: {},
        dialog: {}
      },
      formCreate: {
        fApi: {},
        rule: []
      },
      tableFrom: ''
    }
  },
  created() {
     this.getTableFrom()
  },
  methods: {
    getTableFrom() {
      this.$http.get(this.tableFrom).then(response => {
        this.table = response.data.table;
        this.formCreate.rule = response.data.form

        // 创建后的一些操作
        if (this.afterMixinsCreated) {
          this.afterMixinsCreated()
        }
      })
    }
  },
  // 这里使用 watch 监听 table 数据变化，重新获取列表数据
  watch: {
    table: function() {
      this.$nextTick(function(){
        // 需要强制更新 table 组件
        if (this.table.forceUpdate) {
          this.$refs[this.table.ref].updateKey++
        }

        this.$refs[this.table.ref].getList()
      })
    }
  }
}
