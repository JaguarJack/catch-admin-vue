export default {
  data() {
    return {
      table: {
        tree: {},
        dialog: {},
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
        // bind catch-table props from table
        if (this.table.bind) {
          this.bindTableProps(response.data.form)
        }
        // 创建后的一些操作
        if (this.afterMixinsCreated) {
          this.afterMixinsCreated()
        }
      })
    },
    // 绑定 table props
    bindTableProps() {
      Object.keys(this.table).forEach((key) => {
        if (key === 'tree') {
          this.table.rowKey = this.table.tree.row_key
          this.table.treeProps = this.table.tree.props

          delete this.table.tree.row_key
          delete this.table.tree.props
        }

        if (key === 'dialog') {
          this.table.dialogWidth = this.table.dialog.width

          delete this.table.dialog
        }

        if (key === 'events') {
          this.table.tableEvents = this.table.events

          delete this.table.events
        }
      })

      delete this.table.bind
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
