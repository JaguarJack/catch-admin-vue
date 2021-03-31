export default {
  methods: {
    handleDel(row) {
      if (this.getParent.beforeDelete !== undefined) {
         const r = this.getParent.beforeDelete(row)

         if (r === false) {
            return false
         }
      }

      this.handleDelete(row.id)
    }
  }
}
