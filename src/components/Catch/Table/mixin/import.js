export default {
  methods: {
    handleImport() {
      if (this.getParent.beforeImport !== undefined) {
        this.getParent.beforeImport()
      }

      alert('功能未开发')
    }
  }
}
