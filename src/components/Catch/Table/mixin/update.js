export default {
  methods: {
    handleUpdate(row) {
      /** if (this.getParent.beforeUpdate !== undefined) {
        const p = this.getParent.beforeUpdate(row)

        if (p instanceof Promise) {
          p.then(() => {
            this.handleShowDialog(row)
          })

          return false
        }
      }*/

      this.handleShowDialog(row)
    }
  }
}
