export default {
  methods: {
    handleView(row) {
      if (this.getParent.beforeView !== undefined) {
        const p = this.getParent.beforeView(row)

        if (p instanceof Promise) {
          p.then(() => {
            this.handleShowDialog(row)
          })

          return false
        }
      }

      this.handleShowDialog(row)
    }
  }
}
