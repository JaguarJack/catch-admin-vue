export default {
  methods: {
    handleExport() {
      if (this.getParent.beforeExport !== undefined) {
          this.getParent.beforeExport()
      }


      let params = {}
      const filterParams = this.getParent.table.filterParams

      Object.keys(filterParams).forEach(function(k){
          if (k !== 'limit' && k !== 'page') {
            params[k] = filterParams[k]
          }
      })

      this.$http.get(this.getParent.table.exportRoute,  this.filterParams).then(response => {
            window.open(response.data.url)
      })
    }
  }
}
