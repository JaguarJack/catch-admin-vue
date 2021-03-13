export default {
  methods: {
    handleDel(row) {
      if (this.getParent.beforeDelete !== undefined) {
        this.getParent.beforeDelete(row)
      }

      this.handleDelete(row.id)
    }
  }
}
