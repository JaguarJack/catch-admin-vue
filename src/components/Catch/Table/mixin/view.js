export default {
  methods: {
    handleView(row) {
      if (this.getParent.handleView !== undefined) {
        this.getParent.handleView(row)
      }
    }
  }
}
