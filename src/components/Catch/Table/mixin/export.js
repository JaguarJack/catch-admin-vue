export default {
  methods: {
    handleExport() {
      // 使用默认的导出方式
      if (this.getParent.table.usedModel !== undefined) {
         this.$http.post('excel/export', {fields: JSON.stringify(this.getExportFields()), model: this.getParent.table.usedModel})
           .then(response => {
           window.open(response.data.url)
         })
      } else {
        if (this.getParent.beforeExport !== undefined) {
          this.getParent.beforeExport()
        }


        let params = {}
        const filterParams = this.getParent.$refs[this.getParent.table.ref].queryParams
        Object.keys(filterParams).forEach(k => {
          if (k !== 'limit' && k !== 'page') {
            params[k] = filterParams[k]
          }
        })

        if (this.getParent.table.exportRoute === undefined) {
          this.$message.error('请设置导出路由')
        } else {
          this.$http.get(this.getParent.table.exportRoute, params).then(response => {
            window.open(response.data.url)
          })
        }
      }
    }
  }
}
