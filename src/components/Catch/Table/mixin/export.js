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
        const filterParams = this.getParent.table.filterParams

        Object.keys(filterParams).forEach(function(k) {
          if (k !== 'limit' && k !== 'page') {
            params[k] = filterParams[k]
          }
        })

        this.$http.get(this.getParent.table.exportRoute, this.filterParams).then(response => {
          window.open(response.data.url)
        })
      }
    }
  }
}
